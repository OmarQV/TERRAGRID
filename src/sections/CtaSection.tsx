import { Check, Mail } from 'lucide-react'
import Reveal from '../components/Reveal'

export default function CtaSection() {
  return (
    <section className="cta section-pad">
      <div className="section-shell">
        <Reveal className="cta-card glow-border">
          <div className="cta-signal"><span /><span /><span /><span /><span /></div>
          <p className="eyebrow">Buscamos el primer entorno de validación</p>
          <h2>Convirtamos un lote real en evidencia.</h2>
          <p>Si produces plantines, gestionas un vivero, investigas cultivos o puedes facilitar un piloto en La Paz, queremos conversar.</p>
          <div className="cta-actions">
            <a className="button button-primary" href="mailto:terragrid.2026@gmail.com?subject=Validemos%20un%20lote%20con%20TERRAGRID">
              <Mail size={17} /> terragrid.2026@gmail.com
            </a>
            <a className="button button-secondary" href="#inicio">Volver al inicio</a>
          </div>
          <div className="cta-principles">
            <span><Check size={14} /> Datos antes que promesas</span>
            <span><Check size={14} /> Agronomía antes que automatización</span>
            <span><Check size={14} /> La Paz como primer territorio</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
