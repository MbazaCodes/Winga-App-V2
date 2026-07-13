'use client'
import { useEffect, useRef } from 'react'

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
  center    = [-6.7924, 39.2083],
  zoom      = 13,
  markers   = [],
  routeLine = [],
  height    = '400px',
  className = '',
  onMapClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<any>(null)
  const markersRef   = useRef<any[]>([])
  const routeRef     = useRef<any>(null)

  // Init map ONCE
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    import('leaflet').then(async (L) => {
      // Fix icon paths
      const leafletAny = L as any
      delete leafletAny.Icon.Default.prototype._getIconUrl
      leafletAny.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      // Guard: if container already has a map instance, remove it
      const container = containerRef.current as any
      if (container._leaflet_id) {
        container._leaflet_id = null
      }

      const map = L.map(containerRef.current!, { center, zoom, zoomControl: true })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      if (onMapClick) {
        map.on('click', (e: any) => onMapClick(e.latlng.lat, e.latlng.lng))
      }

      mapRef.current = map
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, []) // empty deps — only run once

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return
    import('leaflet').then((L) => {
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []

      const wingaHtml = (pulse: boolean) => pulse
        ? `<div style="position:relative;width:44px;height:44px">
            <div style="position:absolute;inset:0;background:rgba(108,99,255,.25);border-radius:50%;animation:wPulse 1.8s ease infinite"></div>
            <div style="position:absolute;inset:6px;background:linear-gradient(135deg,#6C63FF,#8B85FF);border:3px solid white;border-radius:50%;box-shadow:0 4px 14px rgba(108,99,255,.5)"></div>
            <style>@keyframes wPulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.5);opacity:0}}</style>
           </div>`
        : `<div style="width:36px;height:36px;background:linear-gradient(135deg,#6C63FF,#8B85FF);border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(108,99,255,.4)"></div>`

      const customerHtml = `<div style="width:30px;height:30px;background:#FDBA12;border:3px solid white;border-radius:50%;box-shadow:0 4px 12px rgba(253,186,18,.4);display:flex;align-items:center;justify-content:center;font-size:14px">👤</div>`

      markers.forEach(m => {
        const icon = (L as any).divIcon({
          className: '',
          html: m.type === 'winga' ? wingaHtml(!!m.pulse) : customerHtml,
          iconSize:   m.type === 'winga' ? (m.pulse ? [44,44] : [36,36]) : [30,30],
          iconAnchor: m.type === 'winga' ? (m.pulse ? [22,22] : [18,36]) : [15,15],
          popupAnchor:[0,-30],
        })

        const marker = (L as any).marker([m.lat, m.lng], { icon }).addTo(mapRef.current)

        if (m.label) {
          marker.bindPopup(`
            <div style="font-family:system-ui;min-width:120px">
              <div style="font-weight:800;font-size:13px;color:#1A1A2E">${m.label}</div>
              ${m.badge ? `<div style="font-size:11px;color:#6C63FF;font-weight:600;margin-top:2px">${m.badge}</div>` : ''}
            </div>
          `, { closeButton: false })
        }

        markersRef.current.push(marker)
      })

      if (markers.length > 1) {
        const group = (L as any).featureGroup(markersRef.current)
        mapRef.current.fitBounds(group.getBounds().pad(0.2))
      }
    })
  }, [markers])

  // Update route
  useEffect(() => {
    if (!mapRef.current) return
    import('leaflet').then((L) => {
      routeRef.current?.remove()
      if (routeLine.length < 2) return
      routeRef.current = (L as any).polyline(routeLine, {
        color: '#6C63FF', weight: 4, opacity: .8, dashArray: '8 4',
      }).addTo(mapRef.current)
    })
  }, [routeLine])

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={`w-full rounded-3xl overflow-hidden ${className}`}
    />
  )
}
