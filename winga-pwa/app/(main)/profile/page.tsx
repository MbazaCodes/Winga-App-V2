'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Edit2, Check, LogOut, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { signOut } from '@/lib/supabase/auth'
import PageHeader from '@/components/shared/PageHeader'

const CITIES = ['Dar es Salaam','Mwanza','Arusha','Dodoma','Mbeya','Tanga','Zanzibar','Morogoro','Iringa','Tabora']
const SPECIALTIES = ['Vyakula','Mavazi','Dawa','Simu/Elec','Samani','Ujenzi','Uzuri','Shule','Nyumba/Ardhi','Magari','MC/DJ']

type BadgeType = 'starter' | 'mid' | 'verified'
const BADGE_INFO: Record<BadgeType, { label:string; color:string; req:string }> = {
  starter:  { label:'⭐ Starter',   color:'bg-gray-100 text-gray-700',   req:'0–9 safari, alama yoyote' },
  mid:      { label:'🔵 Mid',       color:'bg-blue-50 text-blue-700',    req:'10+ safari, alama 60%+' },
  verified: { label:'✅ Verified',  color:'bg-primary-soft text-primary', req:'30+ safari, alama 80%+' },
}

export default function WingaProfilePage() {
  const router = useRouter()
  const { user, setUser, clearAuth } = useAuthStore()

  const [editName, setEditName]       = useState(false)
  const [name, setName]               = useState(user?.name ?? '')
  const [showInfo, setShowInfo]       = useState(false)
  const [tin, setTin]                 = useState('')
  const [editTin, setEditTin]         = useState(false)
  const [bio, setBio]                 = useState('')
  const [city, setCity]               = useState('Dar es Salaam')
  const [area, setArea]               = useState('')
  const [specialty, setSpecialty]     = useState<string[]>([])
  const [social, setSocial]           = useState({ instagram:'', facebook:'', tiktok:'', twitter:'', whatsapp:'' })

  const badge: BadgeType = 'starter'
  const trips = 1
  const rating = 100
  const completion = Math.min(100, 25
    + (name ? 15 : 0)
    + (bio ? 15 : 0)
    + (area ? 10 : 0)
    + (specialty.length ? 15 : 0)
    + (tin ? 10 : 0)
    + (social.whatsapp ? 10 : 0))

  const handleLogout = async () => {
    await signOut()
    clearAuth()
    router.replace('/login')
  }

  const saveName = () => {
    if (!name.trim() || !user) return
    setUser({ ...user, name: name.trim() })
    setEditName(false)
    toast.success('Jina limehifadhiwa!')
  }

  const toggleSpecialty = (s: string) =>
    setSpecialty(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  return (
    <div className="bg-white">
      <PageHeader title="Wasifu Wangu" />

      {/* Completion bar */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-text-muted">Ukamilifu wa Wasifu</p>
          <p className={`text-xs font-extrabold ${completion >= 75 ? 'text-green-600' : 'text-warning'}`}>
            {completion}%
          </p>
        </div>
        <div className="h-2 bg-input-bg rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500
            ${completion >= 75 ? 'bg-green-500' : completion >= 50 ? 'bg-warning' : 'bg-danger'}`}
            style={{ width:`${completion}%` }} />
        </div>
        {completion < 75 && (
          <p className="text-[10px] text-danger mt-1 font-semibold">
            ⚠️ Ukamilifu 75%+ unahitajika ili uonekane kwa wateja
          </p>
        )}
      </div>

      {/* Avatar + name */}
      <div className="flex flex-col items-center px-5 mb-5">
        <div className="relative mb-3">
          <div className="w-24 h-24 bg-primary-soft rounded-3xl flex items-center justify-center">
            <span className="text-4xl font-extrabold text-primary">{(name || 'W')[0].toUpperCase()}</span>
          </div>
          <button className="absolute -bottom-2 -right-2 w-9 h-9 bg-primary rounded-xl
                             flex items-center justify-center shadow-card-md active:scale-90">
            <Camera size={16} color="white" />
          </button>
        </div>

        {editName ? (
          <div className="flex items-center gap-2">
            <input value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              autoFocus className="border-b-2 border-primary outline-none text-lg font-bold
                                   text-text-dark text-center bg-transparent" />
            <button onClick={saveName} className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Check size={14} color="white" />
            </button>
          </div>
        ) : (
          <button onClick={() => setEditName(true)} className="flex items-center gap-2 active:scale-95">
            <span className="text-xl font-extrabold text-text-dark">{name || 'Jina lako'}</span>
            <Edit2 size={14} className="text-text-muted" />
          </button>
        )}

        {/* Winga ID */}
        <p className="text-xs font-mono font-bold text-text-muted mt-1">
          {user?.winga_id ?? 'WNGA-----'}
        </p>

        {/* Badge */}
        <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${BADGE_INFO[badge].color}`}>
          {BADGE_INFO[badge].label}
        </div>
      </div>

      {/* Stats */}
      <div className="mx-5 mb-4 card p-4">
        <div className="grid grid-cols-3 divide-x divide-card-border">
          {[
            { label:'Safari', value: trips.toString() },
            { label:'Alama %', value:`${rating}%` },
            { label:'Badge', value: badge === 'verified' ? '✅' : badge === 'mid' ? '🔵' : '⭐' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center px-3">
              <span className="text-xl font-extrabold text-text-dark">{s.value}</span>
              <span className="text-[10px] text-text-muted mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score progress */}
      <div className="mx-5 mb-4 card p-4">
        <p className="text-xs font-bold text-text-muted mb-2">Alama za Wateja</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 bg-input-bg rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width:`${rating}%` }} />
          </div>
          <span className="text-sm font-extrabold text-primary">{rating}%</span>
        </div>
        <p className="text-xs text-text-muted mt-2">
          {rating >= 80 ? '🏆 Unastahili badge ya Verified!' : rating >= 60 ? '🔵 Unastahili badge ya Mid!' : '⭐ Endelea kuboresha!'}
        </p>
      </div>

      {/* Profile info — collapsible */}
      <div className="mx-5 mb-4 card overflow-hidden">
        <button onClick={() => setShowInfo(v => !v)}
          className="w-full flex items-center justify-between p-4">
          <span className="text-sm font-bold text-text-dark">✏️ Maelezo ya Kazi</span>
          {showInfo ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
        </button>
        {showInfo && (
          <div className="px-4 pb-4 space-y-4 border-t border-card-border pt-4">
            {/* City */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Mji</label>
              <select value={city} onChange={e => setCity(e.target.value)} className="input-field">
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {/* Area */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Eneo</label>
              <input value={area} onChange={e => setArea(e.target.value)}
                placeholder="Mfano: Kariakoo, Mwenge..." className="input-field" />
            </div>
            {/* Bio */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                placeholder="Jielezeee — uzoefu wako, unafanya nini vizuri..."
                className="w-full bg-input-bg rounded-2xl p-4 text-sm text-text-dark
                           placeholder:text-text-muted outline-none border-2 border-transparent
                           focus:border-primary resize-none" />
            </div>
            {/* Specialties */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Utaalamu ({specialty.length} ulichochagua)
              </label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map(s => (
                  <button key={s} onClick={() => toggleSpecialty(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
                      ${specialty.includes(s) ? 'bg-primary text-white' : 'bg-input-bg text-text-mid'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {/* TIN */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                TIN ya TRA (Hiari)
              </label>
              <div className="flex gap-2">
                <input value={tin} onChange={e => setTin(e.target.value)}
                  placeholder="123-456-789" disabled={!editTin}
                  className={`input-field flex-1 ${!editTin ? 'opacity-60' : ''}`} />
                <button onClick={() => { setEditTin(v => !v); if (editTin) toast.success('TIN imehifadhiwa!') }}
                  className="px-4 bg-input-bg rounded-2xl text-xs font-bold text-primary active:scale-90">
                  {editTin ? 'Hifadhi' : 'Hariri'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Social media */}
      <div className="mx-5 mb-4 card overflow-hidden">
        <div className="p-4 border-b border-card-border">
          <p className="text-sm font-bold text-text-dark">📱 Mitandao ya Kijamii</p>
        </div>
        <div className="p-4 space-y-3">
          {[
            { key:'whatsapp',  label:'WhatsApp',   prefix:'+255' },
            { key:'instagram', label:'Instagram',  prefix:'@' },
            { key:'facebook',  label:'Facebook',   prefix:'fb.com/' },
            { key:'tiktok',    label:'TikTok',     prefix:'@' },
            { key:'twitter',   label:'Twitter/X',  prefix:'@' },
          ].map(({ key, label, prefix }) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-xs font-bold text-text-muted w-20 shrink-0">{label}</span>
              <div className="flex-1 flex items-center bg-input-bg rounded-xl overflow-hidden">
                <span className="pl-3 text-xs text-text-muted shrink-0">{prefix}</span>
                <input
                  value={social[key as keyof typeof social]}
                  onChange={e => setSocial(s => ({ ...s, [key]: e.target.value }))}
                  placeholder="..."
                  className="flex-1 h-10 bg-transparent outline-none px-2 text-sm text-text-dark" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-5 pb-10">
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 text-sm font-bold
                     text-danger active:scale-95 transition-transform">
          <LogOut size={16} /> Toka
        </button>
        <p className="text-center text-[10px] text-text-muted mt-1">Winga App v1.0.0</p>
      </div>
    </div>
  )
}
