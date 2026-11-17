import { Hono, type Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { verifyWithJwks } from 'hono/jwt'
import { GOOGLE_CLIENT_ID } from '../src/config'

// 클라이언트 ID만으로 동작하는 연습용 로그인. 비밀번호, 서버 비밀키, DB 모두 사용하지 않습니다.
//
// [Google] Google Identity Services 버튼이 ID 토큰(JWT)을 줌
//   → 서버가 Google 공개키로 서명, 발급자, 클라이언트 ID를 검증
// [Naver]  네이버 로그인(implicit 방식)이 접근 토큰을 줌
//   → 서버가 그 토큰으로 네이버 프로필 API(/v1/nid/me)를 호출해 확인
//
// 확인된 토큰을 httpOnly 쿠키에 "google:<토큰>" / "naver:<토큰>" 형태로 저장하고,
// /api/me 때마다 다시 확인합니다. 두 토큰 모두 약 1시간 뒤 만료되어 재로그인이 필요합니다.

const COOKIE_NAME = 'deaso_session'
const MAX_AGE = 60 * 60 // 1시간 (토큰 유효기간과 비슷하게)

export type Provider = 'google' | 'naver'

export interface SessionUser {
  id: string
  provider: Provider
  name: string
  picture: string
}

// ───────── Google ─────────

type HonoJsonWebKey = NonNullable<Parameters<typeof verifyWithJwks>[1]['keys']>[number]

const GOOGLE_JWKS_URI = 'https://www.googleapis.com/oauth2/v3/certs'
const GOOGLE_ISSUER = /^(https:\/\/)?accounts\.google\.com$/

// Google 공개키를 메모리에 잠시 보관 (요청마다 내려받지 않도록)
let jwksCache: { keys: HonoJsonWebKey[]; expires: number } | null = null

async function getGoogleKeys(force = false): Promise<HonoJsonWebKey[]> {
  if (!force && jwksCache && jwksCache.expires > Date.now()) return jwksCache.keys
  const res = await fetch(GOOGLE_JWKS_URI)
  if (!res.ok) throw new Error(`Google 공개키를 가져오지 못했습니다 (${res.status})`)
  const { keys } = (await res.json()) as { keys: HonoJsonWebKey[] }
  jwksCache = { keys, expires: Date.now() + 60 * 60 * 1000 }
  return keys
}

async function verifyGoogle(token: string): Promise<SessionUser> {
  const options = (keys: HonoJsonWebKey[]) => ({
    keys,
    allowedAlgorithms: ['RS256'] as const,
    verification: { iss: GOOGLE_ISSUER, aud: GOOGLE_CLIENT_ID },
  })
  let payload
  try {
    payload = await verifyWithJwks(token, options(await getGoogleKeys()))
  } catch {
    // Google이 키를 교체했을 수 있으니 한 번만 새로 받아 재시도
    payload = await verifyWithJwks(token, options(await getGoogleKeys(true)))
  }
  return {
    id: `google:${payload.sub}`,
    provider: 'google',
    name: String(payload.name ?? ''),
    picture: String(payload.picture ?? ''),
  }
}

// ───────── Naver ─────────

interface NaverProfileResponse {
  resultcode: string
  message: string
  response?: { id: string; nickname?: string; name?: string; profile_image?: string }
}

async function verifyNaver(token: string): Promise<SessionUser> {
  const res = await fetch('https://openapi.naver.com/v1/nid/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = (await res.json().catch(() => null)) as NaverProfileResponse | null
  if (!res.ok || data?.resultcode !== '00' || !data.response?.id) {
    throw new Error(`네이버 프로필 조회 실패: ${data?.message ?? res.status}`)
  }
  const p = data.response
  return {
    id: `naver:${p.id}`,
    provider: 'naver',
    name: p.nickname || p.name || '네이버 사용자',
    picture: p.profile_image ?? '',
  }
}

// ───────── 공통 ─────────

const verifiers: Record<Provider, (token: string) => Promise<SessionUser>> = {
  google: verifyGoogle,
  naver: verifyNaver,
}

export async function getSessionUser(c: Context): Promise<SessionUser | null> {
  const raw = getCookie(c, COOKIE_NAME)
  if (!raw) return null
  const i = raw.indexOf(':')
  const provider = raw.slice(0, i) as Provider
  const token = raw.slice(i + 1)
  if (!(provider in verifiers) || !token) return null
  try {
    return await verifiers[provider](token)
  } catch {
    return null // 만료되었거나 위조된 토큰
  }
}

const isHttps = (c: Context) => new URL(c.req.url).protocol === 'https:'

const auth = new Hono()

// POST /api/auth/google  { token: "<Google ID 토큰>" }
// POST /api/auth/naver   { token: "<네이버 접근 토큰>" }
auth.post('/:provider{google|naver}', async (c) => {
  const provider = c.req.param('provider') as Provider
  const body = await c.req.json<{ token?: string }>().catch(() => ({ token: undefined }))
  if (!body.token) return c.json({ error: '로그인 정보가 없습니다.' }, 400)

  let user: SessionUser
  try {
    user = await verifiers[provider](body.token)
  } catch {
    const label = provider === 'google' ? 'Google' : '네이버'
    return c.json({ error: `${label} 로그인 정보를 확인하지 못했습니다. 다시 시도해 주세요.` }, 401)
  }

  setCookie(c, COOKIE_NAME, `${provider}:${body.token}`, {
    httpOnly: true,
    secure: isHttps(c),
    sameSite: 'Lax',
    path: '/',
    maxAge: MAX_AGE,
  })
  return c.json({ user })
})

// POST /api/auth/logout
auth.post('/logout', (c) => {
  deleteCookie(c, COOKIE_NAME, { path: '/', secure: isHttps(c) })
  return c.json({ ok: true })
})

export default auth
