# Deaso · 대전 소개 사이트

React + Vite + Hono + Tailwind CSS, Cloudflare Pages 배포.

## 구조

```
├─ index.html              # SEO 메타, Open Graph, JSON-LD
├─ src/                    # React 앱
│  ├─ components/          # Header, Hero, KtxHub, Facts, Places, Food, Festivals, Districts, Footer
│  ├─ data/daejeon.ts      # 콘텐츠 데이터 (React와 API가 함께 사용)
│  ├─ hooks/useApi.ts      # 번들 데이터로 먼저 렌더 → /api 응답으로 교체
│  └─ index.css            # Tailwind v4 + 색 토큰(라이트/다크) + Pretendard
├─ server/app.ts           # Hono 앱 (/api/*)
├─ server/auth.ts          # Google 로그인 (쿠키 세션, DB 없음)
├─ functions/api/[[route]].ts  # Cloudflare Pages Functions → Hono
├─ public/                 # favicon, robots.txt
└─ wrangler.toml
```

## 명령어

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버. React와 `/api/*`(Hono)가 같은 포트에서 동작 |
| `npm run build` | 타입 검사 후 `dist/` 빌드 |
| `npm run preview` | 빌드 후 Cloudflare 런타임(wrangler)으로 로컬 실행 |
| `npm run deploy` | wrangler로 Cloudflare Pages에 직접 배포 |

## API

| 경로 | 설명 |
| --- | --- |
| `GET /api/health` | 상태 확인 |
| `GET /api/places`, `/api/places/:id` | 볼거리 |
| `GET /api/festivals?month=5` | 축제 (month 생략 시 전체) |
| `GET /api/districts`, `/api/districts/:id` | 5개 구 |
| `GET /api/routes` | KTX 소요 시간 |
| `GET /api/auth/google` | Google 로그인 시작 및 콜백 |
| `POST /api/auth/logout` | 로그아웃 |
| `GET /api/me` | 현재 로그인 사용자 (`{ user: null }` 이면 비로그인) |

## GitHub → Cloudflare Pages 연결

1. GitHub 저장소에 push
2. Cloudflare 대시보드 → Workers & Pages → Create → Pages → Connect to Git
3. 빌드 설정
   - Framework preset: `None` (또는 Vite)
   - Build command: `npm run build`
   - Build output directory: `dist`
4. `functions/` 폴더는 자동으로 Pages Functions로 배포됩니다.

이후 `main` 브랜치에 push하면 자동 배포되고, PR마다 미리보기 URL이 생깁니다.

## Google 로그인 설정

로그인 상태는 서명된 JWT 쿠키(`deaso_session`, 7일)에만 저장하며 사용자 정보를 DB에 저장하지 않습니다.

1. Google Cloud Console → API 및 서비스 → 사용자 인증 정보 → OAuth 클라이언트 ID(웹 애플리케이션)
2. **승인된 리디렉션 URI**에 추가
   - `https://deaso.pages.dev/api/auth/google`
   - `http://localhost:5173/api/auth/google` (로컬 개발용)
3. 환경 변수
   - `GOOGLE_CLIENT_ID`: `wrangler.toml`의 `[vars]`에 있음
   - `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET`: 비밀 값
     - 로컬: `.dev.vars.example`을 `.dev.vars`로 복사해 채우기
     - 배포: Cloudflare 대시보드 → Pages 프로젝트 → Settings → Variables and Secrets → **Secret**으로 추가 후 재배포

## 남은 작업

- [ ] 볼거리 카드의 사진 영역을 실제 사진으로 교체
- [ ] 인구, 이동 시간, 축제 일정 등 수치 확인
- [ ] 찜하기 · 후기 · 댓글 (D1 등 저장소 필요, 사용자 키는 세션의 `id`)
- [ ] 개인정보처리방침 페이지
- [ ] 검색 노출이 중요하면 사전 렌더링(SSG) 도입 검토
