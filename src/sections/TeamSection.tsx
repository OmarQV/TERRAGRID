import Reveal from '../components/Reveal'
import { TEAM } from '../data/content'

export default function TeamSection() {
  return (
    <section className="team section-pad" id="equipo">
      <div className="section-shell">
        <Reveal className="section-heading split-heading">
          <div>
            <p className="eyebrow">Equipo interdisciplinario</p>
            <h2>Agronomía define el proceso. Tecnología lo vuelve medible.</h2>
          </div>
          <p>TERRAGRID reúne capacidades de producto, datos, software, diseño, seguridad, blockchain y agronomía dentro de una misma hoja de ruta.</p>
        </Reveal>

        <div className="team-grid">
          {TEAM.map((member) => (
            <Reveal className="team-card" key={member.name}>
              <div className="team-photo-wrap">
                <img src={member.photo} alt={`Retrato de ${member.name}`} />
              </div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <span>{member.role}</span>
                <div className="team-socials" aria-label={`Redes sociales de ${member.name}`}>
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
                        <SocialIcon size={16} aria-hidden="true" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
