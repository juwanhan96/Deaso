import KtxHub from './KtxHub'

export default function Hero() {
  return (
    <section className="py-14 md:pt-16">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] tabular-nums text-muted">
            <span><b className="font-medium text-accent">36.35°N</b> 127.38°E</span>
            <span>한밭 · 大田</span>
          </div>
          <h1 className="display text-[clamp(44px,7.4vw,88px)] leading-[1.05]">
            한가운데서<br />만나는 도시, <em className="not-italic text-accent">대전</em>
          </h1>
          <p className="mt-6 mb-8 max-w-[34em] text-lg text-muted">
            연구소와 대학이 모인 과학도시. 동쪽엔 계족산 황톳길, 남쪽엔 대청호 물길, 그리고 아침마다 빵 냄새가 나는
            원도심까지. 어디서 출발해도 가까운 대전을 소개합니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#places" className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-5 py-3 font-medium text-on-accent no-underline">
              대전 둘러보기 →
            </a>
            <a href="#festivals" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 font-medium no-underline">
              이번 달 축제
            </a>
          </div>
        </div>
        <KtxHub />
      </div>
    </section>
  )
}
