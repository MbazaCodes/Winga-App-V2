'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

export interface GeoPosition {
  lat: number
  lng: number
  accuracy?: number
  heading?: number | null
  speed?: number | null
  timestamp: number
}

export function useLocation(watchMode = false) {
  const [position, setPosition]   = useState<GeoPosition | null>(null)
  const [error,    setError]       = useState<string | null>(null)
  const [loading,  setLoading]     = useState(false)
  const watchIdRef                 = useRef<number | null>(null)

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Kifaa chako hakisaidii GPS')
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setPosition({
          lat:       pos.coords.latitude,
          lng:       pos.coords.longitude,
          accuracy:  pos.coords.accuracy,
          heading:   pos.coords.heading,
          speed:     pos.coords.speed,
          timestamp: pos.timestamp,
        })
        setLoading(false)
        setError(null)
      },
      err => {
        const msgs: Record<number, string> = {
          1: 'Ruhusa ya eneo ilikataliwa. Ruhusu kwenye mipangilio.',
          2: 'Eneo haliwezi kupatikana. Angalia GPS yako.',
          3: 'Ombi la eneo limeisha muda. Jaribu tena.',
        }
        setError(msgs[err.code] ?? 'Hitilafu ya GPS')
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    )
  }, [])

  useEffect(() => {
    if (!watchMode) return
    if (!navigator.geolocation) return

    watchIdRef.current = navigator.geolocation.watchPosition(
      pos => setPosition({
        lat:       pos.coords.latitude,
        lng:       pos.coords.longitude,
        accuracy:  pos.coords.accuracy,
        heading:   pos.coords.heading,
        speed:     pos.coords.speed,
        timestamp: pos.timestamp,
      }),
      err => setError(err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 2000 }
    )

    return () => {
      if (watchIdRef.current !== null)
        navigator.geolocation.clearWatch(watchIdRef.current)
    }
  }, [watchMode])

  return { position, error, loading, getPosition }
}
