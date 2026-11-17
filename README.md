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
├─ server/auth.ts          # Google 로그인 (ID 토큰 검증, 쿠키 세션, DB 없음)
├─ src/config.ts           # Google 클라이언트 ID 등 공개 설정
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
| `POST /api/auth/google` | Google ID 토큰(`{ credential }`) 검증 후 로그인 |
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

Google Identity Services("Google로 로그인" 버튼) 방식입니다. 클라이언트 비밀번호, 리디렉션 URI, 서버 비밀키, DB가 필요 없습니다.

- 버튼이 Google ID 토큰을 받아 `POST /api/auth/google`로 보내면, 서버가 Google 공개키로 서명과 클라이언트 ID를 검증한 뒤 토큰을 httpOnly 쿠키(`deaso_session`)에 저장합니다.
- ID 토큰 유효기간(약 1시간)이 지나면 다시 로그인해야 합니다. (연습용 단순화)
- 클라이언트 ID는 `src/config.ts`에 있습니다.

Google Cloud Console → 사용자 인증 정보 → OAuth 클라이언트 ID → **승인된 JavaScript 원본**에 다음을 추가해야 합니다.

- `https://deaso.pages.dev`
- `http://localhost`, `http://localhost:5173` (로컬 개발용)

## 남은 작업

- [ ] 볼거리 카드의 사진 영역을 실제 사진으로 교체
- [ ] 인구, 이동 시간, 축제 일정 등 수치 확인
- [ ] 찜하기 · 후기 · 댓글 (D1 등 저장소 필요, 사용자 키는 세션의 `id`)
- [ ] 개인정보처리방침 페이지
- [ ] 검색 노출이 중요하면 사전 렌더링(SSG) 도입 검토
