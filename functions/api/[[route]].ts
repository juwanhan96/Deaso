import { handle } from 'hono/cloudflare-pages'
import app from '../../server/app'

// Cloudflare Pages Functions: /api/* 요청을 Hono 앱으로 넘깁니다.
export const onRequest = handle(app)
