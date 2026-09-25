import { ChevronRight, Network, QrCode, ShieldCheck } from 'lucide-react'
import Reveal from '../components/Reveal'
import { SYSTEM_LAYERS } from '../data/content'

export default function SystemSection() {
  return (
    <section className="system section-pad" id="sistema">
      <div className="section-shell">
        <Reveal className="section-heading centered-heading">
          <p className="eyebrow">La capa inteligente</p>
          <h2>La tecnología solo entra cuando responde a una decisión agronómica.</h2>
          <p>Cada sensor, regla o registro debe ayudar a medir, actuar o explicar lo que ocurrió dentro del lote.</p>
        </Reveal>

        <div className="system-map">
          <div className="system-line" aria-hidden="true" />
          {SYSTEM_LAYERS.map((layer, index) => {
            const Icon = layer.icon
            return (
              <Reveal className="system-card glow-border" key={layer.title}>
                <div className="system-card-top">
                  <span>{layer.number}</span>
                  <em>{layer.status}</em>
                </div>
                <div className="system-icon"><Icon size={25} /></div>
                <h3>{layer.title}</h3>
                <p>{layer.copy}</p>
                {index < SYSTEM_LAYERS.length - 1 && <ChevronRight className="system-arrow" size={17} />}
              </Reveal>
            )
          })}
        </div>

        <Reveal className="data-strip">
          <div><Network size={21} /><span>Offline-first</span><small>El control esencial funciona localmente.</small></div>
          <div><QrCode size={21} /><span>Identidad por lote</span><small>Datos, eventos e imágenes en una sola ficha.</small></div>
          <div><ShieldCheck size={21} /><span>Verificable, no oficial</span><small>La constancia tecnológica no sustituye una certificación regulada.</small></div>
        </Reveal>
      </div>
    </section>
  )
}
