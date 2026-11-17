import type { Tone } from '../data/daejeon'

// Tailwind가 클래스를 찾을 수 있도록 전체 클래스 문자열로 둡니다.
export const toneClass: Record<Tone, string> = {
  sci: 'bg-accent-soft text-accent',
  nat: 'bg-forest-soft text-forest',
  clay: 'bg-clay-soft text-clay',
}
