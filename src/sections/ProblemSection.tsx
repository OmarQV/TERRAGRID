import { Sparkles } from 'lucide-react'
import Reveal from '../components/Reveal'
import { PROBLEM_POINTS } from '../data/content'

export default function ProblemSection() {
  return (
    <section className="problem section-pad" id="problema">
      <div className="section-shell">
        <Reveal className="section-heading split-heading">
          <div>
            <p className="eyebrow">El problema comienza antes de ver la cosecha</p>
            <h2>Una germinación irregular compromete decisiones, tiempo y recursos.</h2>
          </div>
          <p>
            El productor suele asumir el riesgo desde el almácigo sin un historial comparable del proceso. TERRAGRID enfoca su primera validación exactamente en esa brecha.
          </p>
        </Reveal>

        <div className="problem-grid">
          {PROBLEM_POINTS.map((point, index) => {
            const Icon = point.icon
            return (
              <Reveal className="problem-card glow-border" key={point.title}>
                <span className="card-index">0{index + 1}</span>
                <Icon size={27} />
                <h3>{point.title}</h3>
                <p>{point.copy}</p>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="problem-statement">
          <Sparkles size={19} />
          <p><strong>La hipótesis:</strong> si se controlan y documentan las condiciones críticas de germinación, será posible entregar plantines más uniformes y tomar mejores decisiones antes de trasladarlos al campo.</p>
          <span>Por validar con evidencia</span>
        </Reveal>
      </div>
    </section>
  )
}
