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

// Lisse le tracé entre les points GPS avec une spline de Catmull-Rom, pour un
// rendu plus naturel qu'une succession de segments droits entre les étapes.
function smoothPath(points, segments = 14) {
  if (points.length < 3) return points
  const padded = [points[0], ...points, points[points.length - 1]]
  const result = []
  for (let i = 0; i < padded.length - 3; i++) {
    const [p0, p1, p2, p3] = [padded[i], padded[i + 1], padded[i + 2], padded[i + 3]]
    for (let t = 0; t < segments; t++) {
      const tt = t / segments
      const tt2 = tt * tt
      const tt3 = tt2 * tt
      const lat =
        0.5 *
        (2 * p1[0] +
          (p2[0] - p0[0]) * tt +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * tt2 +
          (3 * p1[0] - p0[0] - 3 * p2[0] + p3[0]) * tt3)
      const lng =
        0.5 *
        (2 * p1[1] +
          (p2[1] - p0[1]) * tt +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * tt2 +
          (3 * p1[1] - p0[1] - 3 * p2[1] + p3[1]) * tt3)
      result.push([lat, lng])
    }
  }
  result.push(padded[padded.length - 2])
  return result
}

export default function CircuitMap({ waypoints, circuitName }) {
  if (!waypoints || waypoints.length === 0) return null

  const positions = waypoints.map((w) => [w.lat, w.lng])
  const routePath = smoothPath(positions)
  const bounds = L.latLngBounds(positions)

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [36, 36] }}
      style={{ height: '380px', width: '100%', borderRadius: '14px' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Halo blanc sous le tracé pour le détacher du fond de carte */}
      <Polyline positions={routePath} pathOptions={{ color: '#fff', weight: 7, opacity: 0.65 }} />
      <Polyline
        positions={routePath}
        pathOptions={{ color: '#5B8C1A', weight: 3.5, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }}
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
