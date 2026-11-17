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
├─ server/auth.ts          # Google · 네이버 로그인 (토큰 검증, 쿠키 세션, DB 없음)
├─ src/config.ts           # Google · 네이버 클라이언트 ID (공개 값)
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
| `POST /api/auth/google` | Google ID 토큰(`{ token }`) 검증 후 로그인 |
| `POST /api/auth/naver` | 네이버 접근 토큰(`{ token }`)으로 프로필 확인 후 로그인 |
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

## 로그인 (Google · 네이버)

클라이언트 ID만 사용합니다. 클라이언트 비밀번호, 서버 비밀키, DB가 필요 없습니다. (연습용)

- 로그인 성공 시 토큰을 httpOnly 쿠키 `deaso_session`에 `google:<토큰>` 또는 `naver:<토큰>` 형태로 저장하고, `/api/me` 때마다 다시 확인합니다.
- 두 토큰 모두 약 1시간 뒤 만료되어 다시 로그인해야 합니다.
- 클라이언트 ID는 `src/config.ts`에 있습니다.

### Google

"Google로 로그인" 버튼(Google Identity Services)이 ID 토큰을 주면, 서버가 Google 공개키로 서명과 클라이언트 ID를 검증합니다.

Google Cloud Console → OAuth 클라이언트 ID → **승인된 JavaScript 원본**

- `https://deaso.pages.dev`
- `http://localhost`, `http://localhost:5173` (로컬 개발용)

### 네이버

네이버 로그인 화면으로 이동 → 로그인 후 사이트 첫 화면(`/`)으로 `#access_token=...`과 함께 돌아옴 → 서버가 그 토큰으로 네이버 프로필 API(`/v1/nid/me`)를 호출해 확인합니다.

네이버 개발자센터 → 내 애플리케이션 → API 설정 → 네이버 로그인 → **Callback URL**

- `https://deaso.pages.dev/`
- `http://localhost:5173/` (로컬 개발용)

## 남은 작업

- [ ] 볼거리 카드의 사진 영역을 실제 사진으로 교체
- [ ] 인구, 이동 시간, 축제 일정 등 수치 확인
- [ ] 찜하기 · 후기 · 댓글 (D1 등 저장소 필요, 사용자 키는 세션의 `id`)
- [ ] 개인정보처리방침 페이지
- [ ] 네이버 로그인 "검수 요청" (승인 전에는 개발자센터에 등록한 테스터 계정만 로그인 가능)
- [ ] 검색 노출이 중요하면 사전 렌더링(SSG) 도입 검토
