import { festivals as initialFestivals, type Festival } from '../data/daejeon'
import { useApi } from '../hooks/useApi'
import SectionHead from './SectionHead'
import { toneClass } from './tone'

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

export default function Festivals() {
  const festivals = useApi<Festival[]>('/festivals', initialFestivals)
  const thisMonth = new Date().getMonth() + 1

  return (
    <section id="festivals" className="scroll-mt-16 py-13 md:py-18">
      <div className="wrap">
        <SectionHead
          eyebrow="축제"
          title="열두 달 대전 일정"
          description="월별 대표 축제를 한눈에 봅니다. 실제 날짜는 매년 바뀝니다."
        />
        <div className="overflow-x-auto">
          <ol className="m-0 grid min-w-[760px] list-none grid-cols-12 overflow-hidden rounded-xl border border-line bg-surface p-0">
            {MONTHS.map((m) => (
              <li
                key={m}
                className={`flex min-h-33 min-w-0 flex-col gap-2 px-1.5 pt-2.5 pb-3 ${m > 1 ? 'border-l border-line' : ''}`}
                aria-current={m === thisMonth ? 'date' : undefined}
              >
                <span className={`text-xs tabular-nums ${m === thisMonth ? 'font-bold text-accent' : 'text-muted'}`}>{m}월</span>
                {festivals
                  .filter((f) => f.month === m)
                  .map((f) => (
                    <span key={f.name} className={`rounded-md px-2 py-1.5 text-[13px] leading-snug font-medium ${toneClass[f.tone]}`}>
                      {f.name}
                    </span>
                  ))}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
