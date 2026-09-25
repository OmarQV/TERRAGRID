import Reveal from '../components/Reveal'
import { BUSINESS_PHASES } from '../data/content'

export default function BusinessSection() {
  return (
    <section className="business section-pad" id="modelo">
      <div className="section-shell">
        <Reveal className="section-heading centered-heading">
          <p className="eyebrow">Modelo de negocio por etapas</p>
          <h2>Vender el resultado primero. Desplegar la infraestructura después.</h2>
        </Reveal>

        <div className="business-roadmap">
          {BUSINESS_PHASES.map((phase) => (
            <Reveal className={`business-card ${phase.now ? 'is-now glow-border' : ''}`} key={phase.phase}>
              <div className="business-phase">
                <span>{phase.phase}</span>
                {phase.now && <em>Inicio</em>}
              </div>
              <p>{phase.label}</p>
              <h3>{phase.title}</h3>
              <div className="business-line" />
              <p>{phase.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
