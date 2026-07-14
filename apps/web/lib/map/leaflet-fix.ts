// Fix Leaflet marker icon paths in Next.js
import L from 'leaflet'

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom Winga marker (green dot)
export const wingaIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:36px;height:36px;
    background:linear-gradient(135deg,#0A8F4D,#2DA968);
    border:3px solid white;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    box-shadow:0 4px 12px rgba(10,143,77,0.4);
  "></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
})

// Customer marker (gold)
export const customerIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:30px;height:30px;
    background:#FDBA12;
    border:3px solid white;
    border-radius:50%;
    box-shadow:0 4px 12px rgba(253,186,18,0.4);
    display:flex;align-items:center;justify-content:center;
    font-size:14px;
  ">👤</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
})

// Pulse animation for active Winga
export const activePulseIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:44px;height:44px">
    <div style="
      position:absolute;inset:0;
      background:rgba(10,143,77,0.25);
      border-radius:50%;
      animation:pulse 1.8s ease infinite;
    "></div>
    <div style="
      position:absolute;inset:6px;
      background:linear-gradient(135deg,#0A8F4D,#2DA968);
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 4px 14px rgba(10,143,77,0.5);
    "></div>
    <style>@keyframes pulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.5);opacity:0}}</style>
  </div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -22],
})
