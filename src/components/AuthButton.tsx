import { useEffect, useRef, useState } from 'react'
import { GOOGLE_CLIENT_ID } from '../config'
import { useAuth } from '../hooks/useAuth'

const GSI_SRC = 'https://accounts.google.com/gsi/client'

// Google Identity Services 스크립트를 한 번만 불러옵니다.
let gsiPromise: Promise<void> | null = null
function loadGsi() {
  if (window.google?.accounts?.id) return Promise.resolve()
  gsiPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = GSI_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => {
      gsiPromise = null
      reject(new Error('Google 로그인 스크립트를 불러오지 못했습니다.'))
    }
    document.head.appendChild(s)
  })
  return gsiPromise
}

function prefersDark() {
  const t = document.documentElement.dataset.theme
  if (t) return t === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export default function AuthButton() {
  const { user, status, error, loginWithCredential, logout } = useAuth()
  const buttonRef = useRef<HTMLDivElement>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  // 로그아웃 상태일 때 Google 공식 버튼을 그립니다.
  useEffect(() => {
    if (status !== 'signed-out') return
    let cancelled = false
    loadGsi()
      .then(() => {
        if (cancelled || !buttonRef.current || !window.google) return
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: ({ credential }) => loginWithCredential(credential),
          cancel_on_tap_outside: true,
        })
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: prefersDark() ? 'filled_black' : 'outline',
          size: 'medium',
          text: 'signin_with',
          shape: 'pill',
          logo_alignment: 'left',
          locale: 'ko',
        })
      })
      .catch((e: Error) => !cancelled && setLoadError(e.message))
    return () => {
      cancelled = true
    }
  }, [status, loginWithCredential])

  // 로그인 여부 확인 중에는 자리만 잡아 둡니다 (레이아웃 흔들림 방지)
  if (status === 'loading') return <div className="h-9 w-36" aria-hidden="true" />

  if (!user) {
    const message = error ?? loadError
    return (
      <div className="relative flex items-center">
        <div ref={buttonRef} className="min-h-8" />
        {message && (
          <p role="alert" className="absolute top-full right-0 mt-2 w-max max-w-[16rem] rounded-lg border border-line bg-surface px-3 py-2 text-xs text-clay shadow-sm">
            {message}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2.5">
      {user.picture ? (
        <img
          src={user.picture}
          alt=""
          width={32}
          height={32}
          referrerPolicy="no-referrer"
          className="size-8 rounded-full border border-line"
        />
      ) : (
        <span className="grid size-8 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent">
          {user.name.slice(0, 1)}
        </span>
      )}
      <span className="hidden max-w-[10em] truncate text-sm font-medium sm:inline">{user.name}님</span>
      <button
        type="button"
        onClick={logout}
        className="cursor-pointer whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-sm text-muted hover:border-muted hover:text-ink"
      >
        로그아웃
      </button>
    </div>
  )
}
