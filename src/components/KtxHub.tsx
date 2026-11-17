import { ktxRoutes, type KtxRoute } from '../data/daejeon'
import { useApi } from '../hooks/useApi'

const MAX_MINUTES = 165

function formatMinutes(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `약 ${m}분`
  return m === 0 ? `약 ${h}시간` : `약 ${h}시간 ${m}분`
}

export default function KtxHub() {
  const routes = useApi<KtxRoute[]>('/routes', ktxRoutes)

  return (
    <aside id="access" aria-label="KTX 이동 시간" className="min-w-0 scroll-mt-24 rounded-[20px] border border-line bg-surface p-6">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <strong className="text-[15px]">KTX로 대전까지</strong>
        <span className="eyebrow">대전역 기준</span>
      </div>

      <svg viewBox="0 0 320 180" role="img" aria-label="서울, 오송, 동대구, 부산에서 대전으로 이어지는 노선도" className="block h-auto w-full">
        <g stroke="var(--line)" strokeWidth="2" fill="none">
          <path d="M160 90 L60 24" /><path d="M160 90 L120 48" /><path d="M160 90 L250 120" /><path d="M160 90 L290 160" />
        </g>
        <g stroke="var(--accent)" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="2 7">
          <path d="M160 90 L60 24" /><path d="M160 90 L250 120" /><path d="M160 90 L290 160" />
        </g>
        <circle cx="160" cy="90" r="22" fill="var(--accent-soft)" />
        <circle cx="160" cy="90" r="9" fill="var(--accent)" />
        <g fill="var(--surface)" stroke="var(--ink)" strokeWidth="2">
          <circle cx="60" cy="24" r="5" /><circle cx="120" cy="48" r="4" /><circle cx="250" cy="120" r="5" /><circle cx="290" cy="160" r="5" />
        </g>
        <g fontSize="12" fill="var(--ink)">
          <text x="70" y="20">서울</text>
          <text x="128" y="44" fill="var(--muted)">오송</text>
          <text x="186" y="94" fontWeight="700">대전</text>
          <text x="200" y="138">동대구</text>
          <text x="240" y="174">부산</text>
        </g>
      </svg>

      <ul className="mt-4 grid list-none gap-2.5 p-0">
        {routes.map((r) => (
          <li key={r.from} className="grid grid-cols-[64px_1fr_auto] items-center gap-3 text-sm">
            <span>{r.from}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-accent-soft">
              <i className="block h-full rounded-full bg-accent" style={{ width: `${(r.minutes / MAX_MINUTES) * 100}%` }} />
            </span>
            <span className="tabular-nums">{formatMinutes(r.minutes)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3.5 mb-0 text-xs text-muted">대략적인 소요 시간입니다. 열차와 시간대에 따라 다릅니다.</p>
    </aside>
  )
}
