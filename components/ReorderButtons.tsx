'use client'

import { ChevronUp, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ReorderButtonsProps {
    itemId: string
    currentOrder: number
    isFirst: boolean
    isLast: boolean
    reorderAction: (items: { id: string; order: number }[]) => Promise<{ success?: boolean; error?: string }>
    allItems: { id: string; order: number }[]
}

export default function ReorderButtons({
    itemId,
    currentOrder,
    isFirst,
    isLast,
    reorderAction,
    allItems,
}: ReorderButtonsProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleMove(direction: 'up' | 'down') {
        setLoading(true)
        const sorted = [...allItems].sort((a, b) => a.order - b.order)
        const currentIndex = sorted.findIndex(item => item.id === itemId)

        if (
            (direction === 'up' && currentIndex === 0) ||
            (direction === 'down' && currentIndex === sorted.length - 1)
        ) {
            setLoading(false)
            return
        }

        const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
        const newItems = sorted.map((item, index) => {
            if (index === currentIndex) return { id: item.id, order: sorted[swapIndex].order }
            if (index === swapIndex) return { id: item.id, order: sorted[currentIndex].order }
            return { id: item.id, order: item.order }
        })

        await reorderAction(newItems)
        router.refresh()
        setLoading(false)
    }

    return (
        <div className="flex flex-col md:flex-row items-center gap-2">
            <button
                onClick={() => handleMove('up')}
                disabled={isFirst || loading}
                className="p-2 bg-background border border-surface rounded-lg text-muted hover:text-accent hover:border-accent/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-md group"
                title="Move up"
            >
                <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button
                onClick={() => handleMove('down')}
                disabled={isLast || loading}
                className="p-2 bg-background border border-surface rounded-lg text-muted hover:text-accent hover:border-accent/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-md group"
                title="Move down"
            >
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
        </div>
    )
}
