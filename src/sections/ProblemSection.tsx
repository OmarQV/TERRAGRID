import { ArrowRight } from 'lucide-react'
import Reveal from '../components/Reveal'
import { PROBLEM_POINTS } from '../data/content'

export default function ProblemSection() {
  return (
    <section className="problem section-pad" id="problema">
      <div className="section-shell">
        <Reveal className="section-heading split-heading">
          <div>
            <p className="eyebrow">El problema comienza antes de ver la cosecha</p>
            <h2>
              Una germinación
              <br />
              irregular compromete
              <span>
                decisiones,
                <br />
                tiempo y recursos.
              </span>
            </h2>
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
                <div className="problem-media">
                  <div className="problem-photo">
                    <img src={point.image} alt={point.imageAlt} width={1000} height={540} loading="lazy" decoding="async" />
                  </div>
                  <span className="card-index">0{index + 1}</span>
                  <span className="problem-icon" aria-hidden="true">
                    <Icon size={24} />
                  </span>
                </div>
                <div className="problem-body">
                  <h3>{point.title}</h3>
                  <p>{point.copy}</p>
                  <div className="problem-foot" aria-hidden="true">
                    <span className="problem-tag">{point.tag}</span>
                    <span className="problem-arrow">
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

      </div>
    </section>
  )
}
