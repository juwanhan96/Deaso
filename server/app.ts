import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { districts, festivals, ktxRoutes, places } from '../src/data/daejeon'

// /api/* 를 담당하는 Hono 앱.
// 개발: @hono/vite-dev-server 가 이 파일을 직접 실행
// 배포: functions/api/[[route]].ts 가 Cloudflare Pages Functions로 감싸서 실행
const app = new Hono().basePath('/api')

const isWorkers = typeof caches !== 'undefined' && 'default' in caches
if (isWorkers) {
  app.get('*', cache({ cacheName: 'daejeon-api', cacheControl: 'public, max-age=300' }))
}

app.get('/health', (c) => c.json({ ok: true }))

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

export type AppType = typeof app
export default app
