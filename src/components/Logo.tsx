type LogoProps = {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <a
      href="#inicio"
      aria-label="TERRAGRID, ir al inicio"
      className={`inline-flex items-center gap-2.5 rounded-lg ${className}`}
    >
      <svg viewBox="0 0 40 40" aria-hidden="true" className="size-9 shrink-0 text-primary">
        <path d="M20 35V20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M20 24C11 24 6.5 18.5 7 9c8.5-.5 13.5 5 13 15Z" fill="currentColor" />
        <path d="M20 19C19.5 10 24 5.5 33 6c.5 9-4 14-13 13Z" fill="currentColor" opacity=".72" />
        <path d="M13 35h14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="text-[1.4rem] font-extrabold leading-none tracking-[-0.02em] text-ink">TERRAGRID</span>
    </a>
  )
}
