const links = [
  { href: '#places', label: '볼거리' },
  { href: '#food', label: '먹거리' },
  { href: '#festivals', label: '축제' },
  { href: '#districts', label: '5개 구' },
]

export default function Header() {
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-10 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="wrap flex items-center justify-between gap-4 py-3.5">
        <a href="#top" className="display flex items-baseline gap-2 text-2xl no-underline">
          대전 <small className="text-[11px] font-normal tracking-[0.08em] text-muted">DAEJEON</small>
        </a>
        <nav aria-label="주요 메뉴" className="hidden md:block">
          <ul className="m-0 flex list-none gap-6 p-0 text-[15px]">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-muted no-underline hover:text-ink">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#access" className="whitespace-nowrap rounded-full bg-ink px-3.5 py-2 text-sm font-medium text-bg no-underline">
          오시는 길
        </a>
      </div>
    </header>
  )
}
