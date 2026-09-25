import logo from '../assets/logo-terragrid.webp'

type LogoProps = {
  className?: string
  /** Si es false, el enlace queda oculto (y fuera del orden de tabulación). */
  visible?: boolean
}

/** Logotipo TERRAGRID (letras blancas): pensado para fondos oscuros o desenfocados. */
export default function Logo({ className = '', visible = true }: LogoProps) {
  return (
    <a
      href="#inicio"
      aria-label="TERRAGRID, ir al inicio"
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
      className={`inline-flex items-center rounded-lg transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      } ${className}`}
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
