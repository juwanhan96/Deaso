import { Hono, type Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'
import { googleAuth } from '@hono/oauth-providers/google'
import type { Env } from './env'

// 로그인 상태는 서버에 저장하지 않고, 서명된 JWT를 httpOnly 쿠키에만 담습니다.
// 나중에 찜하기/후기/댓글을 붙일 때는 SessionUser.id 를 D1 같은 저장소의 키로 쓰면 됩니다.

const COOKIE_NAME = 'deaso_session'
const SESSION_TTL = 60 * 60 * 24 * 7 // 7일

export interface SessionUser {
  id: string
  name: string
  picture: string
}

export async function getSessionUser(c: Context<Env>): Promise<SessionUser | null> {
  const token = getCookie(c, COOKIE_NAME)
  if (!token || !c.env.SESSION_SECRET) return null
  try {
    const payload = await verify(token, c.env.SESSION_SECRET, 'HS256')
    return {
      id: String(payload.sub),
      name: String(payload.name ?? ''),
      picture: String(payload.picture ?? ''),
    }
  } catch {
    return null // 만료되었거나 위조된 토큰
  }
}

const isHttps = (c: Context) => new URL(c.req.url).protocol === 'https:'

const auth = new Hono<Env>()

// GET /api/auth/google
// 처음 접속하면 Google 로그인 화면으로 보내고, Google이 같은 주소로 돌려보내면(code 포함) 로그인을 마칩니다.
auth.get(
  '/google',
  async (c, next) => {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET } = c.env
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !SESSION_SECRET) {
      return c.text('로그인 설정이 끝나지 않았습니다. GOOGLE_CLIENT_SECRET, SESSION_SECRET 환경 변수를 확인하세요.', 500)
    }
    if (c.req.query('error')) return c.redirect('/?login=cancelled')

    return googleAuth({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      scope: ['openid', 'profile'],
      prompt: 'select_account',
    })(c, next)
  },
  async (c) => {
    const user = c.get('user-google')
    if (!user?.id) return c.redirect('/?login=failed')

    const now = Math.floor(Date.now() / 1000)
    const token = await sign(
      { sub: user.id, name: user.name ?? '', picture: user.picture ?? '', iat: now, exp: now + SESSION_TTL },
      c.env.SESSION_SECRET,
      'HS256',
    )
    setCookie(c, COOKIE_NAME, token, {
      httpOnly: true,
      secure: isHttps(c),
      sameSite: 'Lax',
      path: '/',
      maxAge: SESSION_TTL,
    })
    return c.redirect('/')
  },
)

// POST /api/auth/logout
auth.post('/logout', (c) => {
  deleteCookie(c, COOKIE_NAME, { path: '/', secure: isHttps(c) })
  return c.json({ ok: true })
})

export default auth
