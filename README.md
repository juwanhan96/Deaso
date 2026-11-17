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
├─ functions/api/[[route]].ts  # Cloudflare Pages Functions → Hono
├─ public/                 # favicon, robots.txt
├─ mockup/index.html       # 디자인 시안 (배포 대상 아님)
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

## GitHub → Cloudflare Pages 연결

1. GitHub 저장소에 push
2. Cloudflare 대시보드 → Workers & Pages → Create → Pages → Connect to Git
3. 빌드 설정
   - Framework preset: `None` (또는 Vite)
   - Build command: `npm run build`
   - Build output directory: `dist`
4. `functions/` 폴더는 자동으로 Pages Functions로 배포됩니다.

이후 `main` 브랜치에 push하면 자동 배포되고, PR마다 미리보기 URL이 생깁니다.

## 남은 작업

- [ ] 볼거리 카드의 사진 영역을 실제 사진으로 교체
- [ ] 인구, 이동 시간, 축제 일정 등 수치 확인
- [ ] 도메인 확정 후 `index.html`에 `canonical`, `og:url`, `og:image` 추가, `sitemap.xml` 작성
- [ ] 검색 노출이 중요하면 사전 렌더링(SSG) 도입 검토
