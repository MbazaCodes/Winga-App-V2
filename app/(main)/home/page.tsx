'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Bell, MapPin, Search, X, Star, Wifi } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getGreeting } from '@/lib/utils/greeting'
import SkeletonCard from '@/components/shared/SkeletonCard'
import EmptyState from '@/components/shared/EmptyState'

const CATEGORIES = [
  { id:'groceries',   label:'Vyakula',      emoji:'🛒' },
  { id:'electronics', label:'Simu/Elec.',   emoji:'📱' },
  { id:'clothes',     label:'Mavazi',       emoji:'👗' },
  { id:'medicine',    label:'Dawa',         emoji:'💊' },
  { id:'furniture',   label:'Samani',       emoji:'🛋️' },
  { id:'hardware',    label:'Ujenzi',       emoji:'🔧' },
  { id:'beauty',      label:'Uzuri',        emoji:'💄' },
  { id:'school',      label:'Shule',        emoji:'📚' },
  { id:'wholesale',   label:'Jumla',        emoji:'📦' },
  { id:'market',      label:'Sokoni',       emoji:'🏪' },
  { id:'house',       label:'Nyumba/Ardhi', emoji:'🏠' },
  { id:'cars',        label:'Magari',       emoji:'🚗' },
  { id:'mc',          label:'MC Sherehe',   emoji:'🎤' },
  { id:'dj',          label:'Music/DJ',     emoji:'🎧' },
  { id:'other',       label:'Nyingine',     emoji:'✨' },
]

// Mock Wingas for structure
const MOCK_WINGAS = [
  { id:'1', name:'Amina Hassan',   area:'Kariakoo', badge:'verified', rating:4.9, trips:128, is_online:true },
  { id:'2', name:'John Mwangi',    area:'Mwenge',   badge:'mid',      rating:4.7, trips:54,  is_online:true },
  { id:'3', name:'Fatuma Said',    area:'Tandika',  badge:'starter',  rating:4.5, trips:12,  is_online:false },
]

const BADGE_LABELS: Record<string, string> = {
  verified:'✅ Verified', mid:'🔵 Mid', starter:'⭐ Starter'
}

export default function HomePage() {
  const { user } = useAuthStore()
  const [search, setSearch] = useState('')

  const greeting = getGreeting()
  const name = user?.name ?? 'Mteja'

  const filtered = MOCK_WINGAS.filter(w =>
    !search || w.name.toLowerCase().includes(search.toLowerCase()) || w.area.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-xs font-semibold text-text-muted">{greeting} 👋</p>
            <h1 className="text-xl font-extrabold text-text-dark">Karibu, {name.split(' ')[0]}!</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/requests"
              className="w-10 h-10 bg-input-bg rounded-2xl flex items-center justify-center relative">
              <Bell size={18} className="text-text-dark" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
            </Link>
            <Link href="/profile"
              className="w-10 h-10 bg-primary-soft rounded-2xl flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{name[0]?.toUpperCase()}</span>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
          <MapPin size={12} /> <span>Tanzania</span>
        </div>
      </div>

      {/* Hero banner */}
      <div className="mx-5 mb-5">
        <Link href="/book">
          <div className="bg-primary rounded-3xl p-5 flex items-center justify-between min-h-[110px]
                          active:scale-95 transition-transform shadow-card-md">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-white/80">5 Mtandaoni Sasa</span>
              </div>
              <h2 className="text-white font-extrabold text-lg leading-tight">
                Omba Winga<br />wa Karibu Nawe
              </h2>
              <span className="text-xs font-bold text-gold mt-2 block">Bonyeza hapa →</span>
            </div>
            <div className="text-6xl opacity-90">🛍️</div>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="px-5 mb-5">
        <div className="flex items-center bg-input-bg rounded-2xl px-4 gap-3
                        border-2 border-transparent focus-within:border-primary transition-all">
          <Search size={18} className="text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Tafuta Winga kwa jina au eneo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 h-12 bg-transparent outline-none text-sm text-text-dark placeholder:text-text-muted"
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X size={16} className="text-text-muted" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      {!search && (
        <div className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-text-dark">Aina za Ununuzi</h2>
            <Link href="/book" className="text-xs font-bold text-primary">Ona Zote</Link>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {CATEGORIES.slice(0, 12).map(cat => (
              <Link key={cat.id} href={`/book?category=${cat.id}`}>
                <div className="flex flex-col items-center gap-1 p-3 bg-input-bg rounded-2xl
                                active:scale-90 transition-transform">
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-[10px] font-semibold text-text-mid text-center leading-tight">
                    {cat.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Wingas list */}
      <div className="px-5 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-text-dark">
            {search ? `Matokeo: "${search}"` : 'Wingas Wanapatikana'}
          </h2>
          <span className="text-xs text-text-muted">{filtered.length} wanapatikana</span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="🔍" title="Hakuna matokeo"
            subtitle="Jaribu kutafuta kwa jina tofauti" />
        ) : (
          <div className="space-y-3">
            {filtered.map(w => (
              <div key={w.id} className="card p-4 flex items-center gap-3 active:scale-95 transition-transform">
                <div className="relative">
                  <div className="w-14 h-14 bg-primary-soft rounded-2xl flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">{w.name[0]}</span>
                  </div>
                  {w.is_online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full
                                    border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-dark text-sm">{w.name}</span>
                    <span className="text-xs text-text-muted">{BADGE_LABELS[w.badge]}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <MapPin size={10} /> {w.area}
                    </span>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Star size={10} className="text-gold fill-gold" /> {w.rating}
                    </span>
                  </div>
                </div>
                <Link href="/book"
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl
                             active:scale-90 transition-transform shrink-0">
                  Omba
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
