import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { districts, festivals, ktxRoutes, places } from '../src/data/daejeon'
import auth, { getSessionUser } from './auth'
import type { Env } from './env'

// /api/* 를 담당하는 Hono 앱.
// 개발: @hono/vite-dev-server 가 이 파일을 직접 실행
// 배포: functions/api/[[route]].ts 가 Cloudflare Pages Functions로 감싸서 실행
const app = new Hono<Env>().basePath('/api')

// 공개 데이터 API만 캐시합니다. (로그인 관련 응답은 사람마다 달라서 캐시하면 안 됨)
const isWorkers = typeof caches !== 'undefined' && 'default' in caches
if (isWorkers) {
  const dataCache = cache({ cacheName: 'daejeon-api', cacheControl: 'public, max-age=300' })
  for (const path of ['/places', '/places/*', '/festivals', '/districts', '/districts/*', '/routes']) {
    app.get(path, dataCache)
  }
}

app.get('/health', (c) => c.json({ ok: true }))

// 로그인
app.route('/auth', auth)

app.get('/me', async (c) => {
  c.header('Cache-Control', 'no-store')
  return c.json({ user: await getSessionUser(c) })
})

// 콘텐츠 데이터
app.get('/places', (c) => c.json(places))

app.get('/places/:id', (c) => {
  const place = places.find((p) => p.id === c.req.param('id'))
  return place ? c.json(place) : c.json({ error: '해당 장소를 찾을 수 없습니다.' }, 404)
})

app.get('/festivals', (c) => {
  const month = Number(c.req.query('month'))
  const list = Number.isInteger(month) && month >= 1 && month <= 12
    ? festivals.filter((f) => f.month === month)
    : festivals
  return c.json(list)
})

app.get('/districts', (c) => c.json(districts))

app.get('/districts/:id', (c) => {
  const district = districts.find((d) => d.id === c.req.param('id'))
  return district ? c.json(district) : c.json({ error: '해당 구를 찾을 수 없습니다.' }, 404)
})

app.get('/routes', (c) => c.json(ktxRoutes))

app.notFound((c) => c.json({ error: '없는 API 경로입니다.' }, 404))

app.onError((err, c) => {
  console.error(err)
  // Google 로그인 도중 실패(토큰 교환 실패, state 불일치 등)는 첫 화면으로 돌려보냅니다.
  if (c.req.path.startsWith('/api/auth/')) return c.redirect('/?login=failed')
  return c.json({ error: '서버 오류가 발생했습니다.' }, 500)
})

export type AppType = typeof app
export default app
