import { LineChart } from 'lucide-react'
import Reveal from '../components/Reveal'
import { VALIDATION_METRICS } from '../data/content'

export default function ValidationSection() {
  return (
    <section className="validation section-pad" id="validacion">
      <div className="section-shell validation-grid">
        <Reveal className="validation-copy">
          <p className="eyebrow">Validar antes de escalar</p>
          <h2>No queremos construir una máquina y esperar que funcione.</h2>
          <p>
            TERRAGRID se encuentra en preincubación y todavía no presenta resultados agronómicos concluyentes. La primera validación comparará el sistema con un método de referencia en condiciones reales de La Paz.
          </p>
          <div className="validation-steps">
            <span><b>01</b> Protocolo agronómico</span>
            <span><b>02</b> Grupo de referencia</span>
            <span><b>03</b> Grupo TERRAGRID</span>
            <span><b>04</b> Seguimiento posrasplante</span>
          </div>
        </Reveal>

        <Reveal className="metrics-console glow-border">
          <div className="console-header">
            <span><LineChart size={17} /> Matriz de evidencia</span>
            <em>Por medir</em>
          </div>
          <div className="metrics-list">
            {VALIDATION_METRICS.map((metric, index) => (
              <div key={metric}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{metric}</p>
                <i />
              </div>
            ))}
          </div>
          <p className="console-note">Los resultados definirán si existe valor técnico y comercial. No se publicarán porcentajes de mejora antes de medirlos.</p>
        </Reveal>
      </div>
    </section>
  )
}
