import { ArrowRight, Droplet, Leaf, Network, QrCode, ShieldCheck, Sun } from 'lucide-react'
import fondo from '../assets/tec-fondo.webp'
import Reveal from '../components/Reveal'
import { SYSTEM_LAYERS } from '../data/content'

/** Lecturas de ejemplo sobre la plántula; posición (en % de la escena) en `.system-chip` de sections.css. */
const CHIPS = [
  { icon: Sun, value: '32°C', label: 'Temperatura', className: 'is-temp', floatSeconds: 5 },
  { icon: Droplet, value: '78%', label: 'Humedad', className: 'is-humidity', floatSeconds: 6 },
  { icon: Leaf, value: '0.8 dS/m', label: 'Conductividad', className: 'is-conductivity', floatSeconds: 4.5 },
]

export default function SystemSection() {
  return (
    <section className="system section-pad" id="sistema">
      <div className="system-inner">
        <Reveal className="system-head">
          <p className="eyebrow">La capa inteligente</p>
          <h2>
            <span className="line">La tecnología solo</span>{' '}
            <span className="line">entra cuando responde</span>{' '}
            <span className="line">
              a una <span className="accent">decisión agronómica.</span>
            </span>
          </h2>
          <p>Cada sensor, regla o registro debe ayudar a medir, actuar o explicar lo que ocurrió dentro del lote.</p>
          <a className="system-cta" href="#lineas">
            Conocer la tecnología
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        </Reveal>

        <div className="system-visual" aria-hidden="true">
          <img className="system-visual-img" src={fondo} alt="" width={1536} height={1024} loading="lazy" decoding="async" />
          <div className="system-chips">
            {CHIPS.map(({ icon: Icon, value, label, className, floatSeconds }) => (
              <div className={`system-chip ${className}`} key={label}>
                <div className="system-chip-body motion-safe:animate-float" style={{ animationDuration: `${floatSeconds}s` }}>
                  <Icon size={30} strokeWidth={1.5} />
                  <span>
                    <strong>{value}</strong>
                    <small>{label}</small>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="system-map" role="region" aria-label="Capas de la tecnología TERRAGRID" tabIndex={0}>
          {SYSTEM_LAYERS.map((layer, index) => {
            const Icon = layer.icon
            return (
              <Reveal className="system-item" key={layer.title}>
                <article className="system-card glow-border">
                  <div className="system-media">
                    <div className="system-photo">
                      <img src={layer.image} alt={layer.imageAlt} width={800} height={533} loading="lazy" decoding="async" />
                    </div>
                    <span className="card-index">{layer.number}</span>
                    <span className="system-icon" aria-hidden="true">
                      <Icon size={22} strokeWidth={1.75} />
                    </span>
                  </div>
                  <div className="system-body">
                    <h3>{layer.title}</h3>
                    <p>{layer.copy}</p>
                    <div className="system-foot">
                      <span className="system-tag">{layer.status}</span>
                      <span className="system-go" aria-hidden="true">
                        <ArrowRight size={18} />
                      </span>
                    </div>
                  </div>
                </article>
                {index < SYSTEM_LAYERS.length - 1 && <span className="system-link" aria-hidden="true" />}
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
