import logo from '../assets/logo-terragrid.webp'

type LogoProps = {
  className?: string
}

/** Logotipo TERRAGRID (letras blancas): pensado para fondos oscuros o desenfocados. */
export default function Logo({ className = '' }: LogoProps) {
  return (
    <a
      href="#inicio"
      aria-label="TERRAGRID, ir al inicio"
      className={`inline-flex items-center rounded-lg ${className}`}
    >
      <img
        src={logo}
        alt=""
        width={1188}
        height={278}
        className="h-12 w-auto drop-shadow-[0_2px_10px_rgba(6,20,12,0.45)] md:h-14"
      />
    </a>
  )
}
