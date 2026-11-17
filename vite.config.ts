import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import devServer from '@hono/vite-dev-server'
import cloudflareAdapter from '@hono/vite-dev-server/cloudflare'

// 개발 중에는 /api/* 요청만 Hono 앱(server/app.ts)이 처리하고,
// 나머지는 Vite가 React 앱을 서빙합니다.
// cloudflareAdapter가 wrangler.toml [vars]와 .dev.vars를 읽어 c.env로 넘겨줍니다.
// 배포 시에는 functions/api/[[route]].ts 가 같은 Hono 앱을 Cloudflare Pages Functions로 실행합니다.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    devServer({
      entry: 'server/app.ts',
      adapter: cloudflareAdapter,
      exclude: [/^(?!\/api(\/|$)).*/],
    }),
  ],
})
