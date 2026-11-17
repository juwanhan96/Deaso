import { useCallback, useEffect, useState } from 'react'

export interface User {
  id: string
  name: string
  picture: string
}

type Status = 'loading' | 'signed-in' | 'signed-out'

export const LOGIN_URL = '/api/auth/google'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    fetch('/api/me', { credentials: 'same-origin' })
      .then((res) => (res.ok ? (res.json() as Promise<{ user: User | null }>) : { user: null }))
      .then(({ user }) => {
        setUser(user)
        setStatus(user ? 'signed-in' : 'signed-out')
      })
      .catch(() => setStatus('signed-out'))

    // 로그인 후 돌아온 주소의 ?login=... 표시를 정리
    const url = new URL(window.location.href)
    if (url.searchParams.has('login')) {
      url.searchParams.delete('login')
      window.history.replaceState(null, '', url.pathname + url.search + url.hash)
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {})
    setUser(null)
    setStatus('signed-out')
  }, [])

  return { user, status, logout }
}
