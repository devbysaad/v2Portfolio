'use client'

import { useFormStatus } from 'react-dom'
import { Upload, Loader2 } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="px-10 py-5 bg-accent text-background rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20 disabled:opacity-50 disabled:scale-100 flex items-center gap-3"
        >
            {pending && <Loader2 className="w-5 h-5 animate-spin" />}
            {pending ? 'Uploading...' : label}
        </button>
    )
}

interface ProjectFormFieldsProps {
    defaultValues?: {
        title?: string
        order?: number
        description?: string
        longDesc?: string | null
        techStack?: string[]
        imageUrl?: string | null
        githubUrl?: string | null
        liveUrl?: string | null
        featured?: boolean
    }
    submitLabel: string
    formAction: (formData: FormData) => void
    cancelHref: string
}

export default function ProjectFormFields({ defaultValues, submitLabel, formAction, cancelHref }: ProjectFormFieldsProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.imageUrl || null)
    const [fileName, setFileName] = useState<string | null>(null)

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
            const url = URL.createObjectURL(file)
            setImagePreview(url)
        }
    }

    return (
        <form action={formAction} className="bg-surface rounded-[3rem] border-2 border-surface p-12 space-y-10 shadow-2xl animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-4">Project Title</label>
                    <input
                        name="title"
                        type="text"
                        required
                        defaultValue={defaultValues?.title || ''}
                        placeholder="e.g. Portfolio CMS"
                        className="w-full px-6 py-4 bg-background border-2 border-surface rounded-2xl text-foreground placeholder-muted/30 focus:outline-none focus:border-accent/50 transition-all font-medium"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-4">Order</label>
                    <input
                        name="order"
                        type="number"
                        defaultValue={defaultValues?.order ?? 0}
                        className="w-full px-6 py-4 bg-background border-2 border-surface rounded-2xl text-foreground placeholder-muted/30 focus:outline-none focus:border-accent/50 transition-all font-medium"
                    />
                </div>

                <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-4">Short Description</label>
                    <input
                        name="description"
                        type="text"
                        required
                        defaultValue={defaultValues?.description || ''}
                        placeholder="A brief overview of what this project is..."
                        className="w-full px-6 py-4 bg-background border-2 border-surface rounded-2xl text-foreground placeholder-muted/30 focus:outline-none focus:border-accent/50 transition-all font-medium"
                    />
                </div>

                <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-4">Long Description (Optional)</label>
                    <textarea
                        name="longDesc"
                        rows={6}
                        defaultValue={defaultValues?.longDesc || ''}
                        placeholder="Detailed explanation, challenges faced, solutions implemented..."
                        className="w-full px-6 py-4 bg-background border-2 border-surface rounded-2xl text-foreground placeholder-muted/30 focus:outline-none focus:border-accent/50 transition-all font-medium resize-none shadow-inner"
                    ></textarea>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-4">Tech Stack (comma separated)</label>
                    <input
                        name="techStack"
                        type="text"
                        required
                        defaultValue={defaultValues?.techStack?.join(', ') || ''}
                        placeholder="React, Next.js, TypeScript, Tailwind"
                        className="w-full px-6 py-4 bg-background border-2 border-surface rounded-2xl text-foreground placeholder-muted/30 focus:outline-none focus:border-accent/50 transition-all font-medium"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-4">Project Image</label>
                    <div className="flex flex-col gap-4">
                        {imagePreview && (
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-surface bg-background group/preview">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                {fileName && (
                                    <div className="absolute inset-x-0 bottom-0 bg-accent p-3 text-background text-[10px] font-black uppercase tracking-widest text-center">
                                        📎 {fileName}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="relative group">
                            <input
                                name="imageFile"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            <div className="w-full px-6 py-4 bg-background border-2 border-dashed border-surface rounded-2xl flex items-center justify-center gap-3 transition-all group-hover:border-accent/50 group-hover:bg-accent/5">
                                <Upload className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
                                <span className="font-bold text-sm text-muted group-hover:text-accent transition-colors">
                                    {fileName ? 'Change image' : 'Upload from device'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-4">Github URL (Optional)</label>
                    <input
                        name="githubUrl"
                        type="url"
                        defaultValue={defaultValues?.githubUrl || ''}
                        placeholder="https://github.com/..."
                        className="w-full px-6 py-4 bg-background border-2 border-surface rounded-2xl text-foreground placeholder-muted/30 focus:outline-none focus:border-accent/50 transition-all font-medium"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-4">Live Demo URL (Optional)</label>
                    <input
                        name="liveUrl"
                        type="url"
                        defaultValue={defaultValues?.liveUrl || ''}
                        placeholder="https://..."
                        className="w-full px-6 py-4 bg-background border-2 border-surface rounded-2xl text-foreground placeholder-muted/30 focus:outline-none focus:border-accent/50 transition-all font-medium"
                    />
                </div>

                <div className="flex items-center gap-4 p-6 bg-background rounded-2xl border-2 border-surface group-hover:border-accent/30 transition-all">
                    <input
                        id="featured"
                        name="featured"
                        type="checkbox"
                        defaultChecked={defaultValues?.featured || false}
                        className="w-6 h-6 bg-surface border-2 border-surface rounded text-accent focus:ring-accent/20 focus:ring-offset-background"
                    />
                    <label htmlFor="featured" className="font-bold text-sm text-muted uppercase tracking-widest select-none">Mark as Featured Project</label>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-surface">
                <Link
                    href={cancelHref}
                    className="px-8 py-5 border-2 border-surface rounded-2xl font-black text-sm uppercase tracking-widest text-muted hover:bg-background transition-all text-center"
                >
                    Cancel
                </Link>
                <SubmitButton label={submitLabel} />
            </div>
        </form>
    )
}
