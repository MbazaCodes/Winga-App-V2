<<<<<<< HEAD
'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Navigation2, Phone, CheckCircle, ShoppingBag } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useLocation } from '@/hooks/useLocation'
import { useAuthStore } from '@/store/authStore'
import type { MapMarker } from '@/components/map/WingaMap'

const WingaMap = dynamic(() => import('@/components/map/WingaMap'), {
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

function NavigateContent() {
  const router    = useRouter()
  const params    = useSearchParams()
  const requestId = params.get('id') ?? ''
  const { user }  = useAuthStore()

  const { position, getPosition, loading: gpsLoading } = useLocation(true)

  const [status,   setStatus]   = useState<'accepted'|'shopping'|'completed'>('accepted')
  const [markers,  setMarkers]  = useState<MapMarker[]>([])
  const [customer] = useState({ name: 'Sarah Kimani', phone: '0712345678', lat: DAR[0] - 0.012, lng: DAR[1] + 0.015 })
  const broadcastRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Broadcast Winga position every 5 seconds
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

  // Update map markers
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
    // TODO: call /api/requests PATCH
    setStatus(next)
    if (next === 'completed') {
      setTimeout(() => router.replace('/home'), 1500)
    }
  }

=======
﻿export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import NavigateClient from './NavigateClient'

export default function NavigatePage() {
>>>>>>> 8c10249 (fix: update web routing and TypeScript path aliases)
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-text-muted">Inapakia ukurasa...</p>
      </div>
    }>
      <NavigateClient />
    </Suspense>
  )
}

function NavigateFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-text-muted">Inapakia...</p>
      </div>
    </div>
  )
}

export default function NavigatePage() {
  return (
    <Suspense fallback={<NavigateFallback />}>
      <NavigateContent />
    </Suspense>
  )
}
