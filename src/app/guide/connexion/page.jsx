'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import '../../../pages/Auth.css'
import '../../../pages/GuideAuth.css'

export default function GuideConnexionPage() {
  const router = useRouter()
  const auth = useAuth()
  const [step, setStep] = useState('creds') // creds | sms | done
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function handleCreds(e) {
    e.preventDefault()
    if (!auth.guideLoginRequest(email, password)) {
      setError('Identifiants incorrects. Compte démo : rakoto.guide@treky.mg / guide2026')
      return
    }
    setError('')
    setStep('sms')
  }

  function handleCode(e) {
    e.preventDefault()
    if (!auth.guideLoginVerify(code)) {
      setError('Code incorrect. Code démo : 123456')
      return
    }
    setStep('done')
    setTimeout(() => router.push('/guide/tableau-de-bord'), 1200)
  }

  if (step === 'done') {
    return (
      <div className="auth auth--success">
        <div className="auth__success-box">
          <div className="auth__success-icon">✓</div>
          <h2>Connexion vérifiée !</h2>
          <p>Redirection vers votre espace guide…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="guide-auth">
      <div className="guide-auth__panel">
        <Link href="/" className="guide-auth__brand">
          <img src="/logo.png" alt="Treky" />
          <span>Treky <small>Espace guides</small></span>
        </Link>

        {step === 'creds' && (
          <form className="guide-auth__form" onSubmit={handleCreds} noValidate>
            <h1>Connexion guide</h1>
            <p className="guide-auth__hint">Réservé aux guides certifiés Treky. Voyageur ? <Link href="/connexion">Connectez-vous ici</Link>.</p>
            <div className="auth__field">
              <input
                type="email"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth__input"
                required
              />
            </div>
            <div className="auth__field">
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth__input"
                required
              />
            </div>
            {error && <p className="auth__error">{error}</p>}
            <button type="submit" className="auth__submit">Continuer</button>
            <p className="guide-auth__demo">Démo : rakoto.guide@treky.mg / guide2026</p>
          </form>
        )}

        {step === 'sms' && (
          <form className="guide-auth__form" onSubmit={handleCode} noValidate>
            <h1>Vérification SMS</h1>
            <p className="guide-auth__hint">Un code a été envoyé par SMS au numéro associé à votre compte guide.</p>
            <div className="auth__field">
              <input
                type="text"
                placeholder="Code à 6 chiffres"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="auth__input"
                maxLength={6}
                required
              />
            </div>
            {error && <p className="auth__error">{error}</p>}
            <button type="submit" className="auth__submit">Vérifier et se connecter</button>
            <p className="guide-auth__demo">Code démo : 123456</p>
          </form>
        )}
      </div>
    </div>
  )
}
