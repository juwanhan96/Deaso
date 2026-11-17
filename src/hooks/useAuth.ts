import { useCallback, useEffect, useState } from 'react'

export interface User {
  id: string
  name: string
  picture: string
}

type Status = 'loading' | 'signed-in' | 'signed-out'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/me', { credentials: 'same-origin' })
      .then((res) => (res.ok ? (res.json() as Promise<{ user: User | null }>) : { user: null }))
      .then(({ user }) => {
        setUser(user)
        setStatus(user ? 'signed-in' : 'signed-out')
      })
      .catch(() => setStatus('signed-out'))
  }, [])

  // Google 버튼이 넘겨준 ID 토큰을 서버로 보내 검증받고 로그인
  const loginWithCredential = useCallback(async (credential: string) => {
    setError(null)
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    }).catch(() => null)
    const data = (await res?.json().catch(() => null)) as { user?: User; error?: string } | null
    if (res?.ok && data?.user) {
      setUser(data.user)
      setStatus('signed-in')
    } else {
      setError(data?.error ?? '로그인하지 못했습니다. 잠시 후 다시 시도해 주세요.')
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {})
    window.google?.accounts.id.disableAutoSelect()
    setUser(null)
    setStatus('signed-out')
  }, [])

  return { user, status, error, loginWithCredential, logout }
}
