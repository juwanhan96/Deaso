import { LOGIN_URL, useAuth } from '../hooks/useAuth'

function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" width="16" height="16" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  )
}

export default function AuthButton() {
  const { user, status, logout } = useAuth()

  // 로그인 여부 확인 중에는 자리만 잡아 둡니다 (레이아웃 흔들림 방지)
  if (status === 'loading') return <div className="h-9 w-28" aria-hidden="true" />

  if (!user) {
    return (
      <a
        href={LOGIN_URL}
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-medium text-ink no-underline hover:border-muted"
      >
        <GoogleMark />
        Google로 로그인
      </a>
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
