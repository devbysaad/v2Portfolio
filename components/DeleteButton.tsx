'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, X } from 'lucide-react'

interface DeleteButtonProps {
    itemId: string
    itemName: string
    deleteAction: (id: string) => Promise<{ success?: boolean; error?: string }>
}

export default function DeleteButton({ itemId, itemName, deleteAction }: DeleteButtonProps) {
    const router = useRouter()
    const [confirming, setConfirming] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        setLoading(true)
        await deleteAction(itemId)
        router.refresh()
        setLoading(false)
    }

    if (confirming) {
        return (
            <div className="flex items-center gap-2 animate-fade-in">
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                >
                    {loading ? '...' : 'Confirm'}
                </button>
                <button
                    onClick={() => setConfirming(false)}
                    className="p-1.5 bg-background border border-surface rounded-lg text-muted hover:text-foreground transition-all"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            className="p-3 bg-background border-2 border-surface rounded-xl text-muted hover:text-red-500 hover:border-red-500/30 transition-all shadow-lg"
            title={`Delete ${itemName}`}
        >
            <Trash2 className="w-5 h-5" />
        </button>
    )
}
