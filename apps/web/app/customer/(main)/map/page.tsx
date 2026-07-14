'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, List, Crosshair } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useLocation } from '@/hooks/useLocation'
import type { MapMarker } from '@/components/map/WingaMap'

const WingaMap = dynamic(() => import('@/components/map/WingaMap'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-input-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-text-muted font-semibold">Inapakia ramani ya Tanzania...</p>
      </div>
    </div>
  ),
})

// Mock Wingas with real Dar es Salaam coordinates
const MOCK_WINGAS = [
  { id:'w1', name:'Amina Hassan',  badge:'✅ Verified', lat:-6.8121, lng:39.2894, online:true },
  { id:'w2', name:'John Mwangi',   badge:'🔵 Mid',      lat:-6.7721, lng:39.2294, online:true },
  { id:'w3', name:'Fatuma Said',   badge:'⭐ Starter',  lat:-6.8321, lng:39.2594, online:false },
  { id:'w4', name:'Ali Hassan',    badge:'✅ Verified', lat:-6.7921, lng:39.2094, online:true },
  { id:'w5', name:'Grace Nyale',   badge:'🔵 Mid',      lat:-6.8021, lng:39.2494, online:true },
]

export default function MapPage() {
  const router = useRouter()
  const { position, getPosition, loading } = useLocation()
  const [markers,  setMarkers]  = useState<MapMarker[]>([])
  const [selected, setSelected] = useState<typeof MOCK_WINGAS[0] | null>(null)
  const [center,   setCenter]   = useState<[number,number]>([-6.7924, 39.2083])

  useEffect(() => {
    getPosition()
  }, [])

  useEffect(() => {
    const wingaMarkers: MapMarker[] = MOCK_WINGAS
      .filter(w => w.online)
      .map(w => ({
        id:    w.id,
        lat:   w.lat,
        lng:   w.lng,
        type:  'winga' as const,
        label: w.name,
        badge: w.badge,
        pulse: true,
      }))

    if (position) {
      setCenter([position.lat, position.lng])
      wingaMarkers.push({
        id:   'me',
        lat:  position.lat,
        lng:  position.lng,
        type: 'customer',
        label: 'Wewe (Eneo lako)',
      })
    }

    setMarkers(wingaMarkers)
  }, [position])

  return (
    <div className="fixed inset-0 bg-white">
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1000] px-5 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}
            className="w-10 h-10 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center
                       shadow-card active:scale-90">
            <ArrowLeft size={20} className="text-text-dark" />
          </button>
          <div className="flex-1 bg-white/90 backdrop-blur rounded-2xl px-4 py-2.5 shadow-card">
            <p className="text-xs font-bold text-text-dark">
              🟢 {MOCK_WINGAS.filter(w=>w.online).length} Wingas Mtandaoni — Karibu Nawe
            </p>
          </div>
          <button onClick={() => router.push('/home')}
            className="w-10 h-10 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center
                       shadow-card active:scale-90">
            <List size={20} className="text-text-dark" />
          </button>
        </div>
      </div>

      {/* Full-screen map */}
      <WingaMap
        center={center}
        zoom={14}
        markers={markers}
        height="100vh"
        className="rounded-none"
        onMapClick={(lat, lng) => console.log('Map clicked:', lat, lng)}
      />

      {/* My location button */}
      <button
        onClick={getPosition}
        disabled={loading}
        className="absolute bottom-32 right-5 z-[1000] w-12 h-12 bg-white shadow-card-md
                   rounded-2xl flex items-center justify-center active:scale-90 transition-transform">
        <Crosshair size={22} className={loading ? 'text-primary animate-pulse' : 'text-text-dark'} />
      </button>

      {/* Winga count badge */}
      <div className="absolute bottom-8 left-5 right-5 z-[1000]">
        <button
          onClick={() => router.push('/book')}
          className="w-full h-14 bg-primary text-white font-bold text-base rounded-2xl
                     flex items-center justify-center gap-3 shadow-card-lg active:scale-95 transition-transform">
          🛒 Omba Winga wa Karibu Nawe
        </button>
      </div>
    </div>
  )
}
