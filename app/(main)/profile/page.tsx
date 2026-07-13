'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, ChevronRight, LogOut, Edit2, Check, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { signOut } from '@/lib/supabase/auth'

const MENU = [
  { icon:'🧭', label:'Safari Zangu',  href:'/requests' },
  { icon:'💸', label:'Matumizi',       href:'/earnings' },
  { icon:'💬', label:'Ujumbe',         href:'/messages' },
  { icon:'👥', label:'Alika Rafiki',   href:'/referral' },
  { icon:'🔔', label:'Arifa',          href:'/notifications' },
]

export default function ProfilePage() {
  const router = useRouter()
  const { user, setUser, clearAuth } = useAuthStore()
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(user?.name ?? '')

  const handleSaveName = () => {
    if (!name.trim() || !user) return
    setUser({ ...user, name: name.trim() })
    setEditingName(false)
    toast.success('Jina limehifadhiwa!')
  }

  const handleLogout = async () => {
    await signOut()
    clearAuth()
    router.replace('/login')
  }

  const displayName = user?.name ?? 'Mteja'
  const phone = user?.phone ? `+255 ${user.phone}` : '—'

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-input-bg active:scale-90 transition-transform"></button>
        <h1 className="text-xl font-extrabold text-text-dark">Wasifu Wangu</h1>
      </div>
      </div>

      {/* Avatar + name */}
      <div className="flex flex-col items-center px-5 mb-6">
        <div className="relative mb-4">
          <div className="w-24 h-24 bg-primary-soft rounded-3xl flex items-center justify-center">
            <span className="text-4xl font-extrabold text-primary">{displayName[0]?.toUpperCase()}</span>
          </div>
          <button className="absolute -bottom-2 -right-2 w-9 h-9 bg-primary rounded-xl
                             flex items-center justify-center shadow-card-md active:scale-90">
            <Camera size={16} color="white" />
          </button>
        </div>

        {/* Editable name */}
        {editingName ? (
          <div className="flex items-center gap-2">
            <input value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveName()}
              autoFocus
              className="border-b-2 border-primary outline-none text-lg font-bold text-text-dark
                         text-center bg-transparent" />
            <button onClick={handleSaveName}
              className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Check size={14} color="white" />
            </button>
          </div>
        ) : (
          <button onClick={() => setEditingName(true)}
            className="flex items-center gap-2 active:scale-95">
            <span className="text-xl font-extrabold text-text-dark">{displayName}</span>
            <Edit2 size={14} className="text-text-muted" />
          </button>
        )}

        <span className="text-sm text-text-muted mt-1">{phone}</span>
        <div className="mt-2 px-3 py-1 bg-gold/10 rounded-full">
          <span className="text-xs font-bold text-yellow-700">👤 Mteja</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-5 mb-5 card p-4">
        <div className="grid grid-cols-3 divide-x divide-card-border">
          {[
            { label:'Safari Zote', value:'2' },
            { label:'Zilizokamilika', value:'1' },
            { label:'Pochi (TZS)', value:'0' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center px-3">
              <span className="text-xl font-extrabold text-text-dark">{s.value}</span>
              <span className="text-[10px] text-text-muted text-center leading-tight mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 mb-5">
        <div className="card divide-y divide-card-border">
          {MENU.map(item => (
            <button key={item.href}
              onClick={() => router.push(item.href)}
              className="w-full flex items-center justify-between px-4 py-4 active:bg-input-bg
                         transition-colors first:rounded-t-3xl last:rounded-b-3xl">
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-semibold text-text-dark">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-text-muted" />
            </button>
          ))}
        </div>
      </div>

      {/* Become Winga CTA */}
      <div className="mx-5 mb-5 bg-gradient-to-r from-gold/20 to-yellow-50 rounded-3xl p-4
                      flex items-center justify-between border border-gold/20">
        <div>
          <p className="text-sm font-extrabold text-yellow-800">Jiunge kama Winga! 🚀</p>
          <p className="text-xs text-yellow-700 mt-0.5">Pata pesa ukisaidia wengine kununua</p>
        </div>
        <button className="px-4 py-2 bg-gold text-white text-xs font-bold rounded-xl
                           active:scale-90 transition-transform">
          Jisajili
        </button>
      </div>

      {/* Logout */}
      <div className="px-5 pb-10">
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 text-sm font-bold
                     text-danger active:scale-95 transition-transform">
          <LogOut size={16} />
          Toka
        </button>
        <p className="text-center text-[10px] text-text-muted mt-2">Winga App v1.0.0</p>
      </div>
    </div>
  )
}
