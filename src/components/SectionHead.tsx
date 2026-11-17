interface Props {
  eyebrow: string
  title: string
  description: string
}

export default function SectionHead({ eyebrow, title, description }: Props) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="display text-[clamp(28px,4vw,40px)] leading-tight">{title}</h2>
      </div>
      <p className="m-0 max-w-[46ch] text-muted">{description}</p>
    </div>
  )
}
