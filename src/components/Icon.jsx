// Set d'icônes ligne, cohérent avec la DA Treky (remplace les emojis utilisés
// comme icônes fonctionnelles : pins, durée, groupe, notes, météo, thématiques...).
// Style : trait 2px, coins arrondis, viewBox 24x24, hérite de la couleur du texte.

const PATHS = {
  pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="2.6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" /></>,
  users: <><path d="M16 20v-1.6a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" /><circle cx="9" cy="8" r="3.4" /><path d="M22 20v-1.6a4 4 0 0 0-3-3.87" /><path d="M15.5 4.2a4 4 0 0 1 0 7.6" /></>,
  user: <><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20v-1a6 6 0 0 1 6-6h3a6 6 0 0 1 6 6v1" /></>,
  star: <path d="M12 3.2 14.7 9l6.3.5-4.8 4.2L17.6 20 12 16.7 6.4 20l1.4-6.3-4.8-4.2L9.3 9z" fill="currentColor" stroke="none" />,
  starOutline: <path d="M12 3.2 14.7 9l6.3.5-4.8 4.2L17.6 20 12 16.7 6.4 20l1.4-6.3-4.8-4.2L9.3 9z" />,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" /></>,
  sun: <><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.4M12 19v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.5 12h2.4M19 12h2.4M4.9 19l1.7-1.7M17.4 6.6l1.7-1.7" /></>,
  cloud: <path d="M6.5 18.5a4.3 4.3 0 0 1-.6-8.55 5.5 5.5 0 0 1 10.7-1.8 4.3 4.3 0 0 1-.6 10.35z" />,
  cloudRain: <><path d="M6.5 15.5a4.3 4.3 0 0 1-.6-8.55 5.5 5.5 0 0 1 10.7-1.8 4.3 4.3 0 0 1-.6 10.35z" /><path d="M9 19.5 8 22M13 19.5l-1 2.5M17 19.5l-1 2.5" /></>,
  mail: <><rect x="2.5" y="4.5" width="19" height="15" rx="2.2" /><path d="m3.5 6 8.5 6.5L20.5 6" /></>,
  phone: <path d="M21 16.4v2.7a2 2 0 0 1-2.2 2c-3.3-.36-6.5-1.5-9.2-3.4a17.7 17.7 0 0 1-5.5-5.5C2.2 9.5 1 6.3.7 3a2 2 0 0 1 2-2.2h2.7a2 2 0 0 1 2 1.7c.13 1 .37 2 .7 3a2 2 0 0 1-.45 2.1L6.4 9a14.5 14.5 0 0 0 5.5 5.5l1.4-1.25a2 2 0 0 1 2.1-.45c1 .33 2 .57 3 .7a2 2 0 0 1 1.6 2.05z" />,
  boot: <path d="M6 3h5v6.2c0 1 .4 2 1.2 2.7l3.6 3.4c.8.7 1.2 1.7 1.2 2.7V21H4v-4.5c0-1 .35-1.9 1-2.6L6 12.7z" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2.2" /><path d="M8 3v4M16 3v4M3 10h18" /></>,
  strength: <><path d="M4 9v6M2.2 10.5v3" /><path d="M20 9v6M21.8 10.5v3" /><path d="M6.5 12h11" strokeWidth="3.4" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="m8 12.3 2.6 2.6L16.2 9" /></>,
  droplet: <path d="M12 2.5s6.5 7.2 6.5 12A6.5 6.5 0 0 1 5.5 14.5c0-4.8 6.5-12 6.5-12z" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5" /><circle cx="12" cy="7.8" r="0.9" fill="currentColor" stroke="none" /></>,
  heart: <path d="M12 20.5s-7.6-4.6-10-9.3C.4 7.8 2 4.2 5.6 3.4c2.1-.45 4.2.5 5.4 2.3a1.1 1.1 0 0 0 2 0c1.2-1.8 3.3-2.75 5.4-2.3 3.6.8 5.2 4.4 3.6 7.8-2.4 4.7-10 9.3-10 9.3z" fill="currentColor" stroke="none" />,
  heartOutline: <path d="M12 20.5s-7.6-4.6-10-9.3C.4 7.8 2 4.2 5.6 3.4c2.1-.45 4.2.5 5.4 2.3a1.1 1.1 0 0 0 2 0c1.2-1.8 3.3-2.75 5.4-2.3 3.6.8 5.2 4.4 3.6 7.8-2.4 4.7-10 9.3-10 9.3z" />,
  lock: <><rect x="4.5" y="11" width="15" height="10" rx="2" /><path d="M7.5 11V7.5a4.5 4.5 0 0 1 9 0V11" /></>,
  mountain: <><path d="m3 20 6.5-11L13 15l2-3 6 8z" /><circle cx="8.5" cy="6.5" r="1.7" /></>,
  gem: <><path d="M4 8.5 8 3h8l4 5.5L12 21z" /><path d="M4 8.5h16M8 3l1.5 5.5L12 21M16 3l-1.5 5.5L12 21" /></>,
  lizard: <path d="M4 15c1-3 3-5 5-5 1.3 0 2 .7 3 .7s1.4-1.4 2.7-1.4c2.6 0 5.3 2.7 5.3 6 0 2-1.3 3-2.7 3-1 0-1.5-.7-2.5-.7-.8 0-1.2.7-2.3.7-2.7 0-5-1.3-6-3-.7.5-1.5 1-2.5 1" />,
  masks: <><circle cx="8" cy="9.5" r="5.5" /><path d="M6 9c.5.8 1.3 1.3 2 1.3s1.5-.5 2-1.3M6 8h.01M10 8h.01" /><circle cx="16.5" cy="14" r="5.5" /><path d="M14.5 14.3c.3-.9.9-1.5 2-1.5s1.7.6 2 1.5M14.8 13.2h.01M18.2 13.2h.01" /></>,
  landmark: <><path d="M3 21h18M4 21V10.5M20 21V10.5M6.5 21v-6M10.5 21v-6M13.5 21v-6M17.5 21v-6" /><path d="m2.5 10.5 9.5-6 9.5 6z" /></>,
  leaf: <path d="M5 20C3 12 8 4 20 4c0 12-8 17-16 17-1.5 0-2-.6-2-1.5C2 18.3 3.2 17 5 16" />,
  waves: <><path d="M2 8c1.5-1.5 3-1.5 4.5 0S9 9.5 10.5 8 13.5 6.5 15 8s3 1.5 4.5 0" /><path d="M2 14c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" /><path d="M2 20c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15 9-4.2 2.8L9 15l4.2-2.8z" fill="currentColor" stroke="none" /></>,
  bookmark: <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.2L5 21V4.5a1 1 0 0 1 1-1z" />,
  camera: <><path d="M4 8.5a1.5 1.5 0 0 1 1.5-1.5h2l1.3-2h6.4l1.3 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5z" /><circle cx="12" cy="13" r="3.4" /></>,
  sparkles: <path d="M11 2.5 12.3 7l4.5 1.3-4.5 1.3L11 14l-1.3-4.4L5.2 8.3l4.5-1.3zM18.5 14l.8 2.7 2.7.8-2.7.8-.8 2.7-.8-2.7-2.7-.8 2.7-.8z" />,
  route: <><circle cx="5.5" cy="5.5" r="2.2" /><circle cx="18.5" cy="18.5" r="2.2" /><path d="M7.5 6h6a3.5 3.5 0 0 1 3.5 3.5v0A3.5 3.5 0 0 1 13.5 13h-3A3.5 3.5 0 0 0 7 16.5v0" /></>,
  wifiOff: <><path d="M2 8.5a16 16 0 0 1 5-3M22 8.5a16 16 0 0 0-5.5-3.3M5 12.5a11 11 0 0 1 3.5-2M19 12.5a11 11 0 0 0-3-2M8.5 16.3a5.5 5.5 0 0 1 3.5-1.3c1 0 2 .3 2.8.8" /><circle cx="12" cy="19.3" r="1" fill="currentColor" stroke="none" /><path d="M2 2l20 20" /></>,
  tag: <><path d="M11.5 3H6a3 3 0 0 0-3 3v5.5a2 2 0 0 0 .6 1.4l8.3 8.3a2 2 0 0 0 2.8 0l6.2-6.2a2 2 0 0 0 0-2.8l-8.3-8.3a2 2 0 0 0-1.1-.9z" /><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" /></>,
  gift: <><rect x="3" y="8.5" width="18" height="4" rx="0.6" /><path d="M5 12.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7.5M12 8.5V21" /><path d="M12 8.5C10 8.5 8 7.3 8 5.5A2.5 2.5 0 0 1 12 3.7 2.5 2.5 0 0 1 16 5.5c0 1.8-2 3-4 3z" /></>,
  share: <><circle cx="18" cy="5" r="2.6" /><circle cx="6" cy="12" r="2.6" /><circle cx="18" cy="19" r="2.6" /><path d="m8.3 10.7 7.4-4.4M8.3 13.3l7.4 4.4" /></>,
  compare: <><rect x="3" y="4" width="8" height="8" rx="1.4" /><rect x="13" y="12" width="8" height="8" rx="1.4" /><path d="M11 8h5a2 2 0 0 1 2 2v2M13 16H8a2 2 0 0 1-2-2v-2" /></>,
  tent: <><path d="M12 4 3 20h18z" /><path d="M12 4v16M8.5 20 12 12l3.5 8" /></>,
  building: <><rect x="4" y="3" width="16" height="18" rx="1.2" /><path d="M9 21v-4h6v4M8 7h1.2M8 11h1.2M8 15h1.2M14.8 7H16M14.8 11H16M14.8 15H16" /></>,
  map: <><path d="m9 4-6 2.2v13.8l6-2.2 6 2.2 6-2.2V4l-6 2.2z" /><path d="M9 4v13.8M15 6.2V20" /></>,
  close: <path d="M5 5l14 14M19 5 5 19" />,
  chat: <><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v8A2.5 2.5 0 0 1 18.5 16H10l-4.5 4v-4H5.5A2.5 2.5 0 0 1 3 13.5z" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  card: <><rect x="2.5" y="5" width="19" height="14" rx="2.2" /><path d="M2.5 9.5h19M6 15h4" /></>,
  journal: <><path d="M6.5 3.5h11a1 1 0 0 1 1 1v16l-3-2-3 2-3-2-3 2v-16a1 1 0 0 1 1-1z" /><path d="M9 8h6M9 11.5h6" /></>,
}

export default function Icon({ name, size = 16, className, strokeWidth = 2, style }) {
  const content = PATHS[name]
  if (!content) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      {content}
    </svg>
  )
}
