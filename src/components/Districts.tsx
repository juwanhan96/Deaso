import { useState } from 'react'
import { districts as initialDistricts, type District } from '../data/daejeon'
import { useApi } from '../hooks/useApi'
import SectionHead from './SectionHead'

export default function Districts() {
  const districts = useApi<District[]>('/districts', initialDistricts)
  const [selectedId, setSelectedId] = useState(initialDistricts[0].id)
  const current = districts.find((d) => d.id === selectedId) ?? districts[0]

  return (
    <section id="districts" className="scroll-mt-16 pb-13 md:pb-18">
      <div className="wrap">
        <SectionHead eyebrow="5개 구" title="동네별로 보는 대전" description="구를 선택하면 대표 장소가 바뀝니다." />
        <div className="grid items-start gap-8 lg:grid-cols-[280px_1fr]">
          <div role="tablist" aria-label="자치구" className="flex min-w-0 gap-1.5 overflow-x-auto lg:flex-col">
            {districts.map((d) => {
              const selected = d.id === current.id
              return (
                <button
                  key={d.id}
                  role="tab"
                  id={`tab-${d.id}`}
                  aria-selected={selected}
                  aria-controls="district-panel"
                  onClick={() => setSelectedId(d.id)}
                  className={[
                    'flex shrink-0 cursor-pointer items-center justify-between gap-4 rounded-[10px] border px-4 py-3.5 text-left font-medium',
                    selected ? 'border-line bg-surface text-accent' : 'border-transparent hover:bg-surface',
                  ].join(' ')}
                >
                  {d.name}
                  <span className="text-xs font-normal text-muted">{d.keyword}</span>
                </button>
              )
            })}
          </div>
          <div
            id="district-panel"
            role="tabpanel"
            aria-labelledby={`tab-${current.id}`}
            className="min-w-0 rounded-2xl border border-line bg-surface p-7"
          >
            <h3 className="display m-0 text-[32px]">{current.name}</h3>
            <p className="mt-1.5 mb-5 text-muted">{current.description}</p>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {current.spots.map((s) => (
                <li key={s} className="rounded-full border border-line px-3 py-1.5 text-sm">{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
