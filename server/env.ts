// Cloudflare 환경 변수 타입
// - GOOGLE_CLIENT_ID: wrangler.toml [vars] (공개 값)
// - GOOGLE_CLIENT_SECRET, SESSION_SECRET: 비밀 값. 로컬은 .dev.vars, 배포는 Cloudflare 대시보드 Secret
export type Env = {
  Bindings: {
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    SESSION_SECRET: string
  }
}
