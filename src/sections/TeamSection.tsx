import { useLayoutEffect, useRef } from 'react'
import { TEAM } from '../data/content'
import { gsap } from '../lib/animation'
import BlurText from '../components/BlurText'

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const media = gsap.matchMedia()
    media.add({ motion: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 760px)' }, (context) => {
      if (!context.conditions?.motion) return
      const mobile = Boolean(context.conditions.mobile)
      gsap.fromTo(section.querySelector('.team-ambient'), { y: 90 }, {
        y: -90, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      })

      const cards = gsap.utils.toArray<HTMLElement>('.team-card', section)
      if (mobile) {
        cards.forEach((card) => {
          const trigger = { trigger: card, start: 'top 92%', end: 'top 58%', scrub: 0.55 }
          gsap.fromTo(card, { autoAlpha: 0, y: 54 }, {
            autoAlpha: 1, y: 0, ease: 'none', scrollTrigger: trigger,
          })
          gsap.fromTo(card.querySelector('img'), { scale: 1.12 }, {
            scale: 1, ease: 'none', scrollTrigger: trigger,
          })
        })
      } else {
        gsap.timeline({
          scrollTrigger: { trigger: '.team-grid', start: 'top 88%', end: 'top 42%', scrub: 0.65 },
          defaults: { ease: 'none' },
        })
          .fromTo(cards, { autoAlpha: 0, y: 70, rotationX: 7 }, {
            autoAlpha: 1, y: 0, rotationX: 0, stagger: 0.12, duration: 0.7,
          }, 0)
          .fromTo(cards.map((card) => card.querySelector('img')), { scale: 1.12 }, {
            scale: 1, stagger: 0.12, duration: 0.7,
          }, 0)
      }
    }, section)

    return () => media.revert()
  }, [])

  return (
    <section className="team" id="equipo" ref={sectionRef}>
      <div className="team-ambient" aria-hidden="true" />
      <div className="team-shell section-shell-wide">
        <div className="team-roster" aria-label="Equipo TERRAGRID">
          <BlurText
            text="El equipo de TERRAGRID detrás del sistema"
            animateBy="words"
            direction="bottom"
            delay={95}
            stepDuration={0.32}
            threshold={0.3}
            headingLevel={2}
            className="team-roster-title"
          />
          <div className="team-grid">
            {TEAM.map((member, index) => (
              <article className="team-card" key={member.name}>
                <span className="team-card-index">{String(index + 1).padStart(2, '0')} / 05</span>
                <div className="team-card-photo">
                  <img src={member.photo} alt={`Retrato de ${member.name}`} loading="lazy" decoding="async" />
                </div>
                <div className="team-card-person">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
                <div className="team-card-socials" aria-label={`Redes sociales de ${member.name}`}>
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
        </div>

      </div>
    </section>
  )
}
