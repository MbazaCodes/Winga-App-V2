'use client'
import { Bell, Search } from 'lucide-react'

interface Props { title: string }

export default function Topbar({ title }: Props) {
  return (
    <header className="h-16 bg-white border-b border-card-border flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-lg font-extrabold text-text-dark">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-input-bg rounded-xl px-3 h-9">
          <Search size={15} className="text-text-muted" />
          <input placeholder="Tafuta..." className="bg-transparent outline-none text-sm text-text-dark placeholder:text-text-muted w-40" />
        </div>
        <button className="w-9 h-9 bg-input-bg rounded-xl flex items-center justify-center relative">
          <Bell size={17} className="text-text-dark" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>
        <div className="w-9 h-9 bg-primary-soft rounded-xl flex items-center justify-center">
          <span className="text-xs font-bold text-primary">A</span>
        </div>
      </div>
    </header>
  )
}
