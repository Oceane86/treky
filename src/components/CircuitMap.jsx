import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet marker icons (Vite asset issue)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function numberedIcon(n, isFirst, isLast) {
  const bg = isFirst ? '#5B8C1A' : isLast ? '#C2462E' : '#00271A'
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${bg};
      color:#fff;
      width:28px;height:28px;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:11px;font-weight:700;
      border:2px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
      font-family:sans-serif;
    ">${n}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  })
}

export default function CircuitMap({ waypoints, circuitName }) {
  if (!waypoints || waypoints.length === 0) return null

  const positions = waypoints.map((w) => [w.lat, w.lng])
  const centerLat = waypoints.reduce((s, w) => s + w.lat, 0) / waypoints.length
  const centerLng = waypoints.reduce((s, w) => s + w.lng, 0) / waypoints.length

  // Auto-zoom based on bounding box
  const latSpread = Math.max(...waypoints.map((w) => w.lat)) - Math.min(...waypoints.map((w) => w.lat))
  const zoom = latSpread > 5 ? 5 : latSpread > 2 ? 7 : latSpread > 0.5 ? 9 : 11

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={zoom}
      style={{ height: '380px', width: '100%', borderRadius: '14px' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Polyline
        positions={positions}
        pathOptions={{ color: '#5B8C1A', weight: 3, opacity: 0.85, dashArray: '8 4' }}
      />

      {waypoints.map((w, i) => (
        <Marker
          key={i}
          position={[w.lat, w.lng]}
          icon={numberedIcon(i + 1, i === 0, i === waypoints.length - 1)}
        >
          <Popup>
            <div style={{ minWidth: '140px' }}>
              <strong style={{ color: '#00271A', fontSize: '0.82rem' }}>
                Étape {i + 1}
              </strong>
              <br />
              <span style={{ fontSize: '0.78rem', color: '#555' }}>{w.title}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
