import { useEffect, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import Logo from './Logo'

const LINKS = [
  { label: 'Inicio', href: '#inicio', current: true },
  { label: 'Tecnología', href: '#sistema' },
  { label: 'Beneficios', href: '#problema' },
  { label: 'Cómo funciona', href: '#lineas' },
  { label: 'Equipo', href: '#equipo' },
]

const CONTACT_HREF = 'mailto:terragrid.2026@gmail.com?subject=Contacto%20TERRAGRID'

const ctaClasses =
  'group items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-white ' +
  'transition duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_10px_24px_rgba(22,148,71,0.28)]'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Transparente sobre el hero; al bajar pasa a una barra oscura translúcida (el logotipo es blanco).
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[90] transition-[background-color,box-shadow] duration-300 ${
        scrolled || open ? 'bg-[rgba(8,13,11,0.8)] shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl' : ''
      }`}
    >
      <div className="relative mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <div className="flex h-[76px] items-center justify-between md:h-[88px] lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <Logo className="lg:justify-self-start" />

          <nav aria-label="Navegación principal" className="hidden lg:block">
            <ul className="text-lift flex items-center gap-7 xl:gap-10">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={link.current ? 'page' : undefined}
                    className={`relative inline-block py-2 text-[15px] font-medium transition-colors ${
                      link.current
                        ? 'font-semibold text-primary-bright after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-primary-bright'
                        : 'text-white hover:text-primary-bright'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a href={CONTACT_HREF} className={`${ctaClasses} hidden lg:inline-flex lg:justify-self-end`}>
            Contáctanos
            <ArrowRight
              aria-hidden="true"
              className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className="grid size-11 place-items-center rounded-full border border-white/35 bg-white/15 text-white backdrop-blur lg:hidden"
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>

        {open && (
          <nav
            id="menu-movil"
            aria-label="Navegación móvil"
            className="absolute inset-x-5 top-[72px] rounded-2xl border border-black/5 bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.12)] lg:hidden"
          >
            <ul className="flex flex-col">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={link.current ? 'page' : undefined}
                    className={`block rounded-xl px-4 py-3 text-base font-medium ${
                      link.current ? 'bg-primary-light text-primary-dark' : 'text-ink'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a href={CONTACT_HREF} onClick={() => setOpen(false)} className={`${ctaClasses} mt-2 flex w-full justify-center`}>
              Contáctanos
              <ArrowRight aria-hidden="true" className="size-[18px]" />
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}
