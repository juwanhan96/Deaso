import { useCallback, useEffect, useState } from 'react'
import { NAVER_CLIENT_ID } from '../config'

export type Provider = 'google' | 'naver'

export interface User {
  id: string
  provider: Provider
  name: string
  picture: string
}

type Status = 'loading' | 'signed-in' | 'signed-out'

const NAVER_STATE_KEY = 'deaso_naver_state'

/** 네이버 로그인 화면으로 이동. 로그인 후 사이트 첫 화면(/)으로 접근 토큰과 함께 돌아옵니다. */
export function startNaverLogin() {
  const state = crypto.randomUUID()
  try {
    sessionStorage.setItem(NAVER_STATE_KEY, state)
  } catch {
    /* 저장소를 못 쓰는 환경이면 state 검증을 건너뜀 */
  }
  const params = new URLSearchParams({
    response_type: 'token',
    client_id: NAVER_CLIENT_ID,
    redirect_uri: `${window.location.origin}/`,
    state,
  })
  window.location.href = `https://nid.naver.com/oauth2.0/authorize?${params}`
}

/** 네이버에서 돌아온 주소(#access_token=...&state=...)를 읽고 주소창에서 지웁니다. */
function takeNaverResult(): { token: string } | { error: string } | null {
  const hash = new URLSearchParams(window.location.hash.slice(1))
  const query = new URLSearchParams(window.location.search)
  const token = hash.get('access_token')
  const error = hash.get('error') ?? query.get('error')
  if (!token && !error) return null

  window.history.replaceState(null, '', window.location.pathname)

  let expected: string | null = null
  try {
    expected = sessionStorage.getItem(NAVER_STATE_KEY)
    sessionStorage.removeItem(NAVER_STATE_KEY)
  } catch {
    /* 무시 */
  }
  const state = hash.get('state') ?? query.get('state')

  if (error) return { error: error === 'access_denied' ? '네이버 로그인을 취소했습니다.' : '네이버 로그인에 실패했습니다.' }
  if (expected && state !== expected) return { error: '로그인 요청이 올바르지 않습니다. 다시 시도해 주세요.' }
  return { token: token! }
}

async function postLogin(provider: Provider, token: string) {
  const res = await fetch(`/api/auth/${provider}`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  }).catch(() => null)
  const data = (await res?.json().catch(() => null)) as { user?: User; error?: string } | null
  if (res?.ok && data?.user) return { user: data.user }
  return { error: data?.error ?? '로그인하지 못했습니다. 잠시 후 다시 시도해 주세요.' }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)

  const applyResult = useCallback((result: { user?: User; error?: string }) => {
    if (result.user) {
      setUser(result.user)
      setStatus('signed-in')
      setError(null)
    } else {
      setStatus('signed-out')
      setError(result.error ?? null)
    }
  }, [])

  useEffect(() => {
    const naver = takeNaverResult()
    if (naver && 'token' in naver) {
      postLogin('naver', naver.token).then(applyResult)
      return
    }
    if (naver && 'error' in naver) setError(naver.error)

    fetch('/api/me', { credentials: 'same-origin' })
      .then((res) => (res.ok ? (res.json() as Promise<{ user: User | null }>) : { user: null }))
      .then(({ user }) => {
        setUser(user)
        setStatus(user ? 'signed-in' : 'signed-out')
      })
      .catch(() => setStatus('signed-out'))
  }, [applyResult])

  // Google 버튼이 넘겨준 ID 토큰으로 로그인
  const loginWithGoogle = useCallback(
    async (credential: string) => applyResult(await postLogin('google', credential)),
    [applyResult],
  )

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {})
    window.google?.accounts.id.disableAutoSelect()
    setUser(null)
    setStatus('signed-out')
  }, [])

  return { user, status, error, loginWithGoogle, logout }
}
