import type { Place } from '../data/daejeon'

const paths: Record<Place['icon'], React.ReactNode> = {
  tower: <path d="M30 4 L30 56 M22 56 L38 56 M30 14 L22 30 L38 30 Z M26 40 L34 40" />,
  atom: (
    <>
      <circle cx="30" cy="30" r="6" />
      <ellipse cx="30" cy="30" rx="24" ry="9" />
      <ellipse cx="30" cy="30" rx="24" ry="9" transform="rotate(60 30 30)" />
      <ellipse cx="30" cy="30" rx="24" ry="9" transform="rotate(120 30 30)" />
    </>
  ),
  tree: <path d="M30 6 L14 32 H24 L12 50 H48 L36 32 H46 Z M30 50 V56" />,
  lake: <path d="M4 30 Q12 24 20 30 T36 30 T52 30 M4 40 Q12 34 20 40 T36 40 T52 40 M14 20 L26 8 L38 20" />,
  trail: (
    <>
      <path d="M6 50 Q20 20 30 32 T54 12" />
      <path d="M18 46 l3 -3 M30 38 l3 -3 M42 26 l3 -3" />
    </>
  ),
  spa: <path d="M10 42 H50 M14 42 Q14 52 30 52 Q46 52 46 42 M22 34 Q18 26 22 20 M30 34 Q26 24 30 14 M38 34 Q34 26 38 20" />,
}

export default function PlaceIcon({ icon }: { icon: Place['icon'] }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-auto w-[42%]" aria-hidden="true">
      {paths[icon]}
    </svg>
  )
}
