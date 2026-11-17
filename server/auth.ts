import { Hono, type Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { verifyWithJwks } from 'hono/jwt'
import { GOOGLE_CLIENT_ID } from '../src/config'

type HonoJsonWebKey = NonNullable<Parameters<typeof verifyWithJwks>[1]['keys']>[number]

// Google Identity Services(“Google로 로그인” 버튼) 방식.
// - 브라우저가 Google에서 ID 토큰(JWT)을 받아 POST /api/auth/google 로 보냄
// - 서버는 Google 공개키로 서명과 aud(클라이언트 ID)를 검증한 뒤, 그 토큰을 httpOnly 쿠키에 그대로 저장
// - 클라이언트 비밀번호, 리디렉션 URI, 세션 비밀키, DB 모두 필요 없음
// - 대신 Google ID 토큰 유효기간(약 1시간)이 지나면 다시 로그인해야 함 (연습용 단순화)

const COOKIE_NAME = 'deaso_session'
const GOOGLE_JWKS_URI = 'https://www.googleapis.com/oauth2/v3/certs'
const GOOGLE_ISSUER = /^(https:\/\/)?accounts\.google\.com$/

export interface SessionUser {
  id: string
  name: string
  picture: string
}

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

async function verifyGoogleToken(token: string) {
  const options = (keys: HonoJsonWebKey[]) => ({
    keys,
    allowedAlgorithms: ['RS256'] as const,
    verification: { iss: GOOGLE_ISSUER, aud: GOOGLE_CLIENT_ID },
  })
  try {
    return await verifyWithJwks(token, options(await getGoogleKeys()))
  } catch {
    // Google이 키를 교체했을 수 있으니 한 번만 새로 받아 재시도
    return await verifyWithJwks(token, options(await getGoogleKeys(true)))
  }
}

function toUser(payload: Record<string, unknown>): SessionUser {
  return {
    id: String(payload.sub),
    name: String(payload.name ?? ''),
    picture: String(payload.picture ?? ''),
  }
}

export async function getSessionUser(c: Context): Promise<SessionUser | null> {
  const token = getCookie(c, COOKIE_NAME)
  if (!token) return null
  try {
    return toUser(await verifyGoogleToken(token))
  } catch {
    return null // 만료되었거나 위조된 토큰
  }
}

const isHttps = (c: Context) => new URL(c.req.url).protocol === 'https:'

const auth = new Hono()

// POST /api/auth/google  { credential: "<Google ID 토큰>" }
auth.post('/google', async (c) => {
  const body = await c.req.json<{ credential?: string }>().catch(() => ({ credential: undefined }))
  if (!body.credential) return c.json({ error: '로그인 정보가 없습니다.' }, 400)

  let payload
  try {
    payload = await verifyGoogleToken(body.credential)
  } catch {
    return c.json({ error: 'Google 로그인 정보를 확인하지 못했습니다. 다시 시도해 주세요.' }, 401)
  }

  const secondsLeft = Number(payload.exp) - Math.floor(Date.now() / 1000)
  setCookie(c, COOKIE_NAME, body.credential, {
    httpOnly: true,
    secure: isHttps(c),
    sameSite: 'Lax',
    path: '/',
    maxAge: Math.max(secondsLeft, 0),
  })
  return c.json({ user: toUser(payload) })
})

// POST /api/auth/logout
auth.post('/logout', (c) => {
  deleteCookie(c, COOKIE_NAME, { path: '/', secure: isHttps(c) })
  return c.json({ ok: true })
})

export default auth
