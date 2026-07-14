<<<<<<< HEAD
'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Navigation, Phone, MessageCircle, Clock, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useAuthStore } from '@/store/authStore'
import type { MapMarker } from '@/components/map/WingaMap'

// Dynamic import — Leaflet cannot run SSR
const WingaMap = dynamic(() => import('@/components/map/WingaMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[55vh] bg-input-bg rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-text-muted font-semibold">Inapakia ramani...</p>
      </div>
    </div>
  ),
})

const STATUS_STEPS = [
  { key:'searching',  label:'Inatafuta Winga',     icon:'🔍', color:'text-warning' },
  { key:'accepted',   label:'Winga Amekubali',     icon:'✅', color:'text-blue-600' },
  { key:'shopping',   label:'Winga Ananunua',      icon:'🛒', color:'text-primary' },
  { key:'completed',  label:'Imekamilika!',         icon:'🎉', color:'text-green-600' },
]

function TrackContent() {
  const router       = useRouter()
  const params       = useSearchParams()
  const requestId    = params.get('id') ?? ''
  const { user }     = useAuthStore()

  const [status,   setStatus]   = useState('accepted')
  const [markers,  setMarkers]  = useState<MapMarker[]>([])
  const [eta,      setEta]      = useState('12 dakika')
  const [winga,    setWinga]    = useState({ name: 'Amina Hassan', badge: '✅ Verified', phone: '0712345678' })
  const [customerPos, setCustomerPos] = useState<[number,number] | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Dar es Salaam center
  const DAR = [-6.7924, 39.2083] as [number, number]

  useEffect(() => {
    // Get customer's real location
    navigator.geolocation?.getCurrentPosition(pos => {
      setCustomerPos([pos.coords.latitude, pos.coords.longitude])
    })

    // Poll Winga location every 5 seconds
    const poll = async () => {
      if (!requestId) return
      // Demo: simulate Winga moving
      const offset = (Date.now() % 10000) / 10000000
      setMarkers([
        {
          id:    'winga',
          lat:   DAR[0] + offset,
          lng:   DAR[1] + offset * 0.5,
          type:  'winga',
          label: winga.name,
          badge: winga.badge,
          pulse: true,
        },
        {
          id:   'customer',
          lat:  DAR[0] - 0.003,
          lng:  DAR[1] + 0.008,
          type: 'customer',
          label: 'Wewe',
        },
      ])
    }

    poll()
    intervalRef.current = setInterval(poll, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [requestId])

  const currentStep = STATUS_STEPS.findIndex(s => s.key === status)

=======
export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import TrackClient from './TrackClient'

export default function TrackPage() {
>>>>>>> 8c10249 (fix: update web routing and TypeScript path aliases)
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-text-muted">Inapakia ukurasa...</p>
      </div>
    }>
      <TrackClient />
    </Suspense>
  )
}

function TrackFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-text-muted font-semibold">Inapakia...</p>
      </div>
    </div>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={<TrackFallback />}>
      <TrackContent />
    </Suspense>
  )
}
