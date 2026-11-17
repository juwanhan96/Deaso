import { dishes } from '../data/daejeon'
import SectionHead from './SectionHead'

export default function Food() {
  return (
    <section id="food" className="scroll-mt-16 bg-clay-soft py-13 md:py-18">
      <div className="wrap">
        <SectionHead
          eyebrow="먹거리"
          title="대전에 왔다면 이 세 가지"
          description="원도심 골목과 대전역 주변에 오래된 가게가 모여 있습니다."
        />
        <div className="grid border-t-2 border-clay md:grid-cols-3">
          {dishes.map((d, i) => (
            <div
              key={d.name}
              className={[
                'flex flex-col gap-2 py-5 md:pt-6 md:pb-2',
                i > 0 ? 'border-t border-clay/35 md:border-t-0 md:border-l md:pl-6' : '',
                'md:pr-6',
              ].join(' ')}
            >
              <span className="text-xs tracking-[0.08em] text-clay">{d.kind}</span>
              <h3 className="display m-0 text-[28px]">{d.name}</h3>
              <p className="m-0 text-muted">{d.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
