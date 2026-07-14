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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-3">
        <button onClick={() => router.back()}
          className="w-10 h-10 bg-input-bg rounded-2xl flex items-center justify-center active:scale-90">
          <ArrowLeft size={20} className="text-text-dark" />
        </button>
        <h1 className="text-base font-bold text-text-dark">Fuatilia Safari</h1>
        <div className="w-10" />
      </div>

      {/* Map */}
      <div className="px-5 mb-4">
        <WingaMap
          center={DAR}
          zoom={14}
          markers={markers}
          height="55vw"
          className="border border-card-border shadow-card"
        />
      </div>

      {/* Status steps */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between">
          {STATUS_STEPS.map((step, i) => {
            const done   = i <= currentStep
            const active = i === currentStep
            return (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg
                    transition-all duration-300
                    ${active ? 'bg-primary shadow-card-md scale-110' :
                      done  ? 'bg-green-500' : 'bg-input-bg'}`}>
                    <span className={active || done ? 'text-white' : 'text-text-muted'}>
                      {step.icon}
                    </span>
                  </div>
                  <p className={`text-[9px] font-bold mt-1 text-center max-w-[56px] leading-tight
                    ${active ? 'text-primary' : done ? 'text-green-600' : 'text-text-muted'}`}>
                    {step.label}
                  </p>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 mb-4 rounded-full transition-all
                    ${i < currentStep ? 'bg-green-500' : 'bg-input-bg'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ETA */}
      <div className="mx-5 mb-4 card p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-soft rounded-2xl flex items-center justify-center">
          <Clock size={20} className="text-primary" />
        </div>
        <div>
          <p className="text-xs text-text-muted font-semibold">Inakuja baada ya</p>
          <p className="text-xl font-extrabold text-primary">{eta}</p>
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs text-text-muted">
          <MapPin size={12} /> <span>Kariakoo</span>
        </div>
      </div>

      {/* Winga card */}
      <div className="mx-5 mb-4 card p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-soft rounded-2xl flex items-center justify-center">
            <span className="text-lg font-extrabold text-primary">{winga.name[0]}</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-text-dark">{winga.name}</p>
            <p className="text-xs text-text-muted">{winga.badge}</p>
          </div>
          <div className="flex gap-2">
            <a href={`tel:${winga.phone}`}
              className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center active:scale-90">
              <Phone size={18} className="text-green-600" />
            </a>
            <button
              onClick={() => router.push(`/messages/${requestId}`)}
              className="w-10 h-10 bg-primary-soft rounded-2xl flex items-center justify-center active:scale-90">
              <MessageCircle size={18} className="text-primary" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigate button */}
      <div className="px-5 pb-8">
        <button
          onClick={() => {
            const pos = markers.find(m => m.type === 'winga')
            if (pos) window.open(`https://www.openstreetmap.org/directions?from=&to=${pos.lat},${pos.lng}`, '_blank')
          }}
          className="w-full h-14 bg-primary text-white font-bold text-base rounded-2xl
                     flex items-center justify-center gap-3 active:scale-95 transition-transform
                     shadow-card-md">
          <Navigation size={20} />
          Mwelekeo kwa Winga
        </button>
      </div>
    </div>
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
