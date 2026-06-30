'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import '../../pages/Auth.css'

function SocialModal({ provider, onClose, onSuccess }) {
  const [step, setStep] = useState('loading')

  useState(() => {
    const t = setTimeout(() => setStep('confirm'), 1200)
    return () => clearTimeout(t)
  }, [])

  const handleConfirm = () => {
    setStep('done')
    setTimeout(() => onSuccess(provider), 900)
  }

  const fakeEmail = provider === 'google' ? 'utilisateur@gmail.com' : 'utilisateur@facebook.com'
  const fakeName = 'Jean Randria'

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        {step === 'loading' && (
          <div className="auth-modal__loading">
            <div className="auth-modal__spinner" />
            <p>Connexion à {provider === 'google' ? 'Google' : 'Facebook'}…</p>
          </div>
        )}

        {step === 'confirm' && (
          <>
            <div className={`auth-modal__provider-logo auth-modal__provider-logo--${provider}`}>
              {provider === 'google' ? (
                <svg width="28" height="28" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              )}
            </div>
            <h3 className="auth-modal__title">
              Se connecter avec {provider === 'google' ? 'Google' : 'Facebook'}
            </h3>
            <div className="auth-modal__account">
              <div className="auth-modal__account-avatar">{fakeName.charAt(0)}</div>
              <div>
                <p className="auth-modal__account-name">{fakeName}</p>
                <p className="auth-modal__account-email">{fakeEmail}</p>
              </div>
            </div>
            <p className="auth-modal__info">Treky souhaite accéder à votre nom et adresse e-mail.</p>
            <div className="auth-modal__actions">
              <button className="auth-modal__btn auth-modal__btn--cancel" onClick={onClose}>Annuler</button>
              <button className={`auth-modal__btn auth-modal__btn--confirm auth-modal__btn--${provider}`} onClick={handleConfirm}>Autoriser</button>
            </div>
          </>
        )}

        {step === 'done' && (
          <div className="auth-modal__success">
            <div className="auth-modal__check">✓</div>
            <p>Connexion réussie !</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ConnexionClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('return') || '/'
  const auth = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [socialModal, setSocialModal] = useState(null)
  const [success, setSuccess] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Adresse e-mail invalide.'
    if (form.password.length < 6) e.password = 'Mot de passe trop court.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const ok = auth.login(form.email, form.password)
    if (!ok) {
      setErrors({ password: 'Identifiants incorrects. Compte démo : oceane@treky.mg / treky2026' })
      return
    }
    setSuccess(true)
    setTimeout(() => router.push(returnTo), 1500)
  }

  const handleSocialSuccess = (provider) => {
    setSocialModal(null)
    const userData = provider === 'google'
      ? { name: 'Jean Randria', email: 'utilisateur@gmail.com', avatar: null }
      : { name: 'Jean Randria', email: 'utilisateur@facebook.com', avatar: null }
    auth.loginSocial(userData)
    setSuccess(true)
    setTimeout(() => router.push(returnTo), 1500)
  }

  if (success) {
    return (
      <div className="auth auth--success">
        <div className="auth__success-box">
          <div className="auth__success-icon">✓</div>
          <h2>Connexion réussie !</h2>
          <p>Bienvenue sur Treky. Redirection en cours…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth">
      {socialModal && (
        <SocialModal
          provider={socialModal}
          onClose={() => setSocialModal(null)}
          onSuccess={handleSocialSuccess}
        />
      )}

      <div className="auth__panel auth__panel--image">
        <img src="/images/auth-bg.jpg" alt="Madagascar" className="auth__bg" />
        <div className="auth__panel-overlay" />
        <Link href="/" className="auth__brand">
          <img src="/logo.png" alt="Treky" className="auth__brand-logo" />
          <span className="auth__brand-name">Treky</span>
        </Link>
      </div>

      <div className="auth__panel auth__panel--form">
        <span className="auth__dot auth__dot--1" />
        <span className="auth__dot auth__dot--2" />
        <span className="auth__dot auth__dot--3" />
        <span className="auth__dot auth__dot--4" />
        <span className="auth__dot auth__dot--5" />

        <div className="auth__content">
          <img src="/logo.png" alt="Treky" className="auth__logo" />
          <h1 className="auth__title">Se connecter</h1>

          <div className="auth__socials">
            <button className="auth__social-btn auth__social-btn--google" onClick={() => setSocialModal('google')}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button className="auth__social-btn auth__social-btn--facebook" onClick={() => setSocialModal('facebook')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          <div className="auth__divider-line"><span>ou continuer par e-mail</span></div>

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            <div className="auth__field">
              <input
                type="email"
                placeholder="Adresse e-mail"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className={`auth__input ${errors.email ? 'auth__input--error' : ''}`}
              />
              {errors.email && <p className="auth__error">{errors.email}</p>}
            </div>

            <div className="auth__field auth__field--password">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Mot de passe"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                className={`auth__input ${errors.password ? 'auth__input--error' : ''}`}
              />
              <button type="button" className="auth__eye" onClick={() => setShowPass(!showPass)}>
                {showPass
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
              {errors.password && <p className="auth__error">{errors.password}</p>}
            </div>

            <div className="auth__forgot">
              <a href="#" className="auth__forgot-link">Mot de passe oublié ?</a>
            </div>

            <button type="submit" className="auth__submit">Se connecter</button>
          </form>

          <p className="auth__switch">
            Pas encore inscrit ?{' '}
            <Link href="/inscription" className="auth__switch-link">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
