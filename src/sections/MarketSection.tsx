import { BarChart3 } from 'lucide-react'
import Reveal from '../components/Reveal'
import { MARKET_SEGMENTS } from '../data/content'

export default function MarketSection() {
  return (
    <section className="market section-pad" id="mercado">
      <div className="section-shell">
        <Reveal className="section-heading split-heading">
          <div>
            <p className="eyebrow">Mercado inicial · Departamento de La Paz</p>
            <h2>El usuario necesita confiabilidad. El comprador necesita resultados.</h2>
          </div>
          <p>La primera oferta no vende una máquina: entrega plantines y evidencia de cada lote. El hardware aparece después, cuando el proceso haya sido validado.</p>
        </Reveal>

        <div className="market-grid">
          {MARKET_SEGMENTS.map((segment) => {
            const Icon = segment.icon
            return (
              <Reveal className="market-card" key={segment.title}>
                <Icon size={24} />
                <h3>{segment.title}</h3>
                <p>{segment.copy}</p>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="market-disclaimer">
          <BarChart3 size={20} />
          <p><strong>Lo que falta validar:</strong> pérdidas reales en germinación, costo actual por plantín aceptado, frecuencia de compra, tamaño de lote y disposición de pago.</p>
        </Reveal>
      </div>
    </section>
  )
}
