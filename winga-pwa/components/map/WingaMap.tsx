'use client'
import { useEffect, useRef } from 'react'
import type { Map as LeafletMap } from 'leaflet'

export interface MapMarker {
  id:     string
  lat:    number
  lng:    number
  type:   'winga' | 'customer' | 'destination' | 'user'
  label?: string
  badge?: string
  pulse?: boolean
}

interface Props {
  center?:     [number, number]
  zoom?:       number
  markers?:    MapMarker[]
  routeLine?:  [number, number][]
  height?:     string
  className?:  string
  onMapClick?: (lat: number, lng: number) => void
}

export default function WingaMap({
  center    = [-6.7924, 39.2083], // Dar es Salaam
  zoom      = 13,
  markers   = [],
  routeLine = [],
  height    = '400px',
  className = '',
  onMapClick,
}: Props) {
  const mapRef       = useRef<LeafletMap | null>(null)
  const containerId  = useRef(`map-${Math.random().toString(36).slice(2)}`)
  const markersRef   = useRef<any[]>([])
  const routeRef     = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || mapRef.current) return

    // Dynamic import — Leaflet needs window
    import('leaflet').then(L => {
      require('@/lib/map/leaflet-fix')

      const map = L.map(containerId.current, {
        center, zoom,
        zoomControl:    true,
        attributionControl: true,
      })

      // OpenStreetMap tiles — 100% free, no API key
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Optional: CartoDB light tiles (cleaner look)
      // L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map)

      if (onMapClick) {
        map.on('click', (e) => onMapClick(e.latlng.lat, e.latlng.lng))
      }

      mapRef.current = map
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  // Update markers when they change
  useEffect(() => {
    if (!mapRef.current) return

    import('leaflet').then(L => {
      const { wingaIcon, customerIcon, activePulseIcon } = require('@/lib/map/leaflet-fix')

      // Clear old markers
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []

      // Add new markers
      markers.forEach(m => {
        const icon = m.type === 'winga'
          ? (m.pulse ? activePulseIcon : wingaIcon)
          : m.type === 'customer'
          ? customerIcon
          : L.Icon.Default.prototype

        const marker = L.marker([m.lat, m.lng], { icon })
          .addTo(mapRef.current!)

        if (m.label || m.badge) {
          marker.bindPopup(`
            <div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:140px">
              <div style="font-weight:800;font-size:13px;color:#1A1A2E;margin-bottom:3px">
                ${m.label ?? ''}
              </div>
              ${m.badge ? `<span style="font-size:11px;color:#6C63FF;font-weight:600">${m.badge}</span>` : ''}
            </div>
          `, { closeButton: false, className: 'winga-popup' })
        }

        markersRef.current.push(marker)
      })

      // Auto-fit bounds if multiple markers
      if (markers.length > 1) {
        const group = L.featureGroup(markersRef.current)
        mapRef.current!.fitBounds(group.getBounds().pad(0.15))
      }
    })
  }, [markers])

  // Update route polyline
  useEffect(() => {
    if (!mapRef.current) return

    import('leaflet').then(L => {
      routeRef.current?.remove()
      if (routeLine.length < 2) return

      routeRef.current = L.polyline(routeLine, {
        color:  '#6C63FF',
        weight: 4,
        opacity: 0.8,
        dashArray: '8 4',
      }).addTo(mapRef.current!)
    })
  }, [routeLine])

  return (
    <div
      id={containerId.current}
      style={{ height }}
      className={`w-full rounded-3xl overflow-hidden ${className}`}
    />
  )
}
