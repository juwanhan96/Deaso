import { facts } from '../data/daejeon'

export default function Facts() {
  return (
    <div className="border-y border-line bg-surface">
      <dl className="wrap m-0 grid grid-cols-2 md:grid-cols-4">
        {facts.map((f, i) => (
          <div
            key={f.label}
            className={[
              'py-5 md:px-5 md:py-6',
              i >= 2 ? 'border-t border-line md:border-t-0' : '',
              i > 0 ? 'md:border-l md:border-line' : 'md:pl-0',
            ].join(' ')}
          >
            <dd className="display m-0 text-4xl leading-tight tabular-nums">
              {f.value}<span className="ml-1 text-sm font-normal tracking-normal text-muted">{f.unit}</span>
            </dd>
            <dt className="mt-1 text-sm text-muted">{f.label}</dt>
          </div>
        ))}
      </dl>
    </div>
  )
}
