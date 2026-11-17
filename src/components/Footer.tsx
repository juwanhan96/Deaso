export default function Footer() {
  return (
    <footer className="border-t border-line py-10 text-sm text-muted">
      <div className="wrap flex flex-wrap justify-between gap-4">
        <span>© {new Date().getFullYear()} 대전 소개</span>
        <span>콘텐츠의 수치와 일정은 참고용입니다.</span>
      </div>
    </footer>
  )
}
