import { useState, useEffect } from 'react'
import './InstallPWA.css'

export default function InstallPWA() {
  const [prompt, setPrompt] = useState(null)
  const [visible, setVisible] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Vérifie si l'app est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    const handler = (e) => {
      e.preventDefault()
      setPrompt(e)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setVisible(false)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
      setVisible(false)
    }
    setPrompt(null)
  }

  if (installed || !visible) return null

  return (
    <div className="install-pwa">
      <div className="install-pwa__icon">
        <img src="/logo.png" alt="Treky" />
      </div>
      <div className="install-pwa__text">
        <p className="install-pwa__title">Installer Treky</p>
        <p className="install-pwa__desc">Accès rapide depuis votre écran d'accueil</p>
      </div>
      <div className="install-pwa__actions">
        <button className="install-pwa__btn install-pwa__btn--install" onClick={handleInstall}>
          Installer
        </button>
        <button className="install-pwa__btn install-pwa__btn--dismiss" onClick={() => setVisible(false)}>
          ✕
        </button>
      </div>
    </div>
  )
}
