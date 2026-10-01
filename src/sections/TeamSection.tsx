import { useLayoutEffect, useRef } from 'react'
import { ArrowDownRight } from 'lucide-react'
import { TEAM } from '../data/content'
import { gsap, SplitText } from '../lib/animation'

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const title = section.querySelector<HTMLElement>('.team-headline')!
      const split = SplitText.create(title, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'team-headline-line',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 110,
            autoAlpha: 0,
            duration: 1.05,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: title, start: 'top 88%', once: true },
          })
        },
      })

      gsap.fromTo(section.querySelectorAll('.team-overline, .team-header-copy'),
        { autoAlpha: 0, y: 30, filter: 'blur(6px)' },
        {
          autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.16, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%', once: true },
        })

      gsap.fromTo(section.querySelector('.team-ambient'), { y: 90 }, {
        y: -90, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      })

      gsap.utils.toArray<HTMLElement>('.team-visual', section).forEach((visual, index) => {
        const frame = visual.querySelector<HTMLElement>('.team-visual-frame')!
        const photo = visual.querySelector<HTMLElement>('img')!
        const caption = visual.querySelector<HTMLElement>('figcaption')!

        gsap.fromTo(frame, { clipPath: 'inset(0 0 100% 0)' }, {
          clipPath: 'inset(0 0 0% 0)', ease: 'none',
          scrollTrigger: { trigger: visual, start: 'top 92%', end: 'top 42%', scrub: 0.7 },
        })
        gsap.fromTo(photo, { yPercent: -5, scale: 1.14 }, {
          yPercent: index === 0 ? 5 : 8, scale: 1.03, ease: 'none',
          scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: 0.65 },
        })
        gsap.fromTo(caption, { autoAlpha: 0, y: 16 }, {
          autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out',
          scrollTrigger: { trigger: caption, start: 'top 94%', once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('.team-row', section).forEach((row) => {
        const trigger = { trigger: row, start: 'top 94%', end: 'top 67%', scrub: 0.55 }
        gsap.fromTo(row, { autoAlpha: 0, y: 54, clipPath: 'inset(0 0 20% 0)' }, {
          autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', ease: 'none', scrollTrigger: trigger,
        })
        gsap.fromTo(row.querySelector('img'), { scale: 1.16 }, {
          scale: 1, ease: 'none', scrollTrigger: trigger,
        })
      })

      gsap.fromTo(section.querySelector('.team-outro'), { autoAlpha: 0, y: 26 }, {
        autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.team-outro', start: 'top 92%', once: true },
      })

      return () => split.revert()
    }, section)

    return () => media.revert()
  }, [])

  return (
    <section className="team" id="equipo" ref={sectionRef}>
      <div className="team-ambient" aria-hidden="true" />
      <div className="team-shell section-shell-wide">
        <header className="team-header">
          <div className="team-overline">
            <span>Terragrid / Personas</span>
            <span>05 capacidades · Una hoja de ruta</span>
          </div>
          <div className="team-header-layout">
            <div>
              <p className="team-eyebrow">Equipo interdisciplinario</p>
              <h2 className="team-headline">Agronomía define el proceso.<br /><em>Tecnología lo vuelve medible.</em></h2>
            </div>
            <p className="team-header-copy">TERRAGRID reúne capacidades de producto, datos, software, diseño, seguridad, blockchain y agronomía dentro de una misma hoja de ruta.</p>
          </div>
        </header>

        <div className="team-visuals" aria-label="Agronomía y tecnología en TERRAGRID">
          <figure className="team-visual team-visual-agronomy">
            <div className="team-visual-frame">
              <img src="/img/team-agronomy.jpg" alt="Manos revisando plantines jóvenes en bandejas de vivero" width={1672} height={941} loading="lazy" decoding="async" />
            </div>
            <figcaption><span>01 / Agronomía</span><span>El proceso empieza en cada plantín</span></figcaption>
          </figure>
          <figure className="team-visual team-visual-technology">
            <div className="team-visual-frame">
              <img src="/img/team-technology.jpg" alt="Plantines bajo luces de cultivo junto a un sensor ambiental" width={1672} height={941} loading="lazy" decoding="async" />
            </div>
            <figcaption><span>02 / Tecnología</span><span>Medición integrada al cultivo</span></figcaption>
          </figure>
        </div>

        <div className="team-roster" aria-label="Equipo TERRAGRID">
          <div className="team-roster-heading" aria-hidden="true">
            <span>Las personas detrás del sistema</span>
            <span>01 — 05</span>
          </div>
          {TEAM.map((member, index) => (
            <article className="team-row" key={member.name}>
              <span className="team-row-index">{String(index + 1).padStart(2, '0')}</span>
              <div className="team-row-photo">
                <img src={member.photo} alt={`Retrato de ${member.name}`} loading="lazy" decoding="async" />
              </div>
              <div className="team-row-person">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
              <div className="team-row-socials" aria-label={`Redes sociales de ${member.name}`}>
                {member.socials.map((social) => {
                  const SocialIcon = social.icon
                  return (
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} en ${social.label}`}
                      title={social.label}
                      key={social.label}
                    >
                      <SocialIcon size={17} aria-hidden="true" />
                    </a>
                  )
                })}
              </div>
            </article>
          ))}
        </div>

        <div className="team-outro">
          <span>El siguiente paso sucede en campo.</span>
          <a href="#contacto">Hablemos de un piloto <ArrowDownRight size={22} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  )
}
