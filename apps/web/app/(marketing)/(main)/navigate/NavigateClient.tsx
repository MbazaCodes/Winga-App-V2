'use client'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Navigation2, Phone, CheckCircle, ShoppingBag } from 'lucide-react'
import nextDynamic from 'next/dynamic'
import { useLocation } from '@/hooks/useLocation'
import { useAuthStore } from '@/store/authStore'
import type { MapMarker } from '@/components/map/WingaMap'

const WingaMap = nextDynamic(() => import('@/components/map/WingaMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[50vh] bg-input-bg rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-text-muted">Inapakia ramani...</p>
      </div>
    </div>
  ),
})

const DAR: [number, number] = [-6.7924, 39.2083]

export default function NavigateClient() {
  const router    = useRouter()
  const params    = useSearchParams()
  const requestId = params?.get('id') ?? ''
  const { user }  = useAuthStore()

  const { position, getPosition } = useLocation(true)

  const [status,   setStatus]   = useState<'accepted'|'shopping'|'completed'>('accepted')
  const [markers,  setMarkers]  = useState<MapMarker[]>([])
  const [customer] = useState({ name: 'Sarah Kimani', phone: '0712345678', lat: DAR[0] - 0.012, lng: DAR[1] + 0.015 })
  const broadcastRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    getPosition()

    const broadcast = async () => {
      if (!position || !user) return
      try {
        await fetch('/api/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.id}`,
          },
          body: JSON.stringify({
            lat: position.lat, lng: position.lng,
            heading: position.heading,
            speed:   position.speed,
            requestId,
          }),
        })
      } catch {}
    }

    broadcastRef.current = setInterval(broadcast, 5000)
    return () => { if (broadcastRef.current) clearInterval(broadcastRef.current) }
  }, [position, user, requestId])

  useEffect(() => {
    const newMarkers: MapMarker[] = [
      {
        id:    'customer',
        lat:   customer.lat,
        lng:   customer.lng,
        type:  'customer',
        label: customer.name,
      },
    ]

    if (position) {
      newMarkers.push({
        id:    'me',
        lat:   position.lat,
        lng:   position.lng,
        type:  'winga',
        label: 'Wewe (Winga)',
        pulse: true,
      })
    }

    setMarkers(newMarkers)
  }, [position, customer])

  const routeLine: [number, number][] = position
    ? [[position.lat, position.lng], [customer.lat, customer.lng]]
    : []

  const advance = async (next: typeof status) => {
    setStatus(next)
    if (next === 'completed') {
      setTimeout(() => router.replace('/home'), 1500)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center justify-between px-5 pt-12 pb-3">
        <button onClick={() => router.back()}
          className="w-10 h-10 bg-input-bg rounded-2xl flex items-center justify-center active:scale-90">
          <ArrowLeft size={20} className="text-text-dark" />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-bold text-text-dark">Nenda kwa Mteja</h1>
          <p className="text-xs text-text-muted">{customer.name}</p>
        </div>
        <div className={`w-2.5 h-2.5 rounded-full ${position ? 'bg-green-500' : 'bg-gray-300'} mr-2`} />
      </div>

      <div className="px-5 mb-4">
        <WingaMap
          center={position ? [position.lat, position.lng] : DAR}
          zoom={14}
          markers={markers}
          routeLine={routeLine}
          height="50vw"
          className="border border-card-border shadow-card"
        />
      </div>

      {position && (
        <div className="mx-5 mb-3 px-4 py-2.5 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-xs font-semibold text-green-700">
            GPS inafanya kazi — mteja anaona mahali ulipo
          </p>
        </div>
      )}

      <div className="mx-5 mb-4 card p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gold/20 rounded-2xl flex items-center justify-center">
            <span className="text-xl font-extrabold text-yellow-700">{customer.name[0]}</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-text-dark">{customer.name}</p>
            <p className="text-xs text-text-muted">{customer.phone}</p>
          </div>
          <a href={`tel:${customer.phone}`}
            className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center active:scale-90">
            <Phone size={18} className="text-green-600" />
          </a>
        </div>
      </div>

      <div className="px-5 pb-8 space-y-3 mt-auto">
        <a
          href={`https://www.openstreetmap.org/directions?to=${customer.lat},${customer.lng}`}
          target="_blank"
          rel="noreferrer"
          className="w-full h-12 bg-input-bg text-text-dark font-bold text-sm rounded-2xl
                     flex items-center justify-center gap-3 active:scale-95 transition-transform">
          <Navigation2 size={18} className="text-primary" />
          Fungua Mwelekeo (OpenStreetMap)
        </a>

        {status === 'accepted' && (
          <button onClick={() => advance('shopping')}
            className="w-full h-14 bg-primary text-white font-bold text-base rounded-2xl
                       flex items-center justify-center gap-3 shadow-card-md active:scale-95 transition-transform">
            <ShoppingBag size={20} />
            Ninaenda Kununua 🛒
          </button>
        )}

        {status === 'shopping' && (
          <button onClick={() => advance('completed')}
            className="w-full h-14 bg-green-500 text-white font-bold text-base rounded-2xl
                       flex items-center justify-center gap-3 shadow-card-md active:scale-95 transition-transform">
            <CheckCircle size={20} />
            Imekamilika ✅
          </button>
        )}

        {status === 'completed' && (
          <div className="w-full h-14 bg-green-100 text-green-700 font-bold text-base rounded-2xl
                          flex items-center justify-center gap-3">
            🎉 Safari Imekamilika! Asante!
          </div>
        )}
      </div>
    </div>
  )
}
