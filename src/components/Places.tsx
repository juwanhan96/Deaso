import { places } from '../data/daejeon'
import PlaceIcon from './PlaceIcon'
import SectionHead from './SectionHead'
import { toneClass } from './tone'

export default function Places() {
  return (
    <section id="places" className="scroll-mt-16 py-13 md:py-18">
      <div className="wrap">
        <SectionHead
          eyebrow="볼거리"
          title="과학, 숲, 물길을 하루에"
          description="도심에서 30분 안팎이면 닿는 대표 명소들입니다."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((p) => (
            <article
              key={p.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:-translate-y-0.5 hover:border-muted"
            >
              {/* TODO: 실제 사진으로 교체 (<img loading="lazy" alt="...">) */}
              <div className={`relative grid aspect-[16/10] max-w-full place-items-center ${toneClass[p.tone]}`}>
                <PlaceIcon icon={p.icon} />
              </div>
              <div className="flex flex-1 flex-col gap-1.5 px-5 pt-4.5 pb-5">
                <span className={`self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClass[p.tone]}`}>{p.tag}</span>
                <h3 className="m-0 text-[19px] font-bold">{p.name}</h3>
                <p className="m-0 text-[15px] text-muted">{p.description}</p>
                <span className="mt-auto pt-2.5 text-xs text-muted">{p.location}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
