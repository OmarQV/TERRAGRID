import type { ProductReading } from '../data/content'

type Props = {
  readings: ProductReading[]
  accent: string
  className?: string
}

/** Panel de cristal con lecturas de ejemplo junto al equipo (ilustrativas: el producto es un modelo conceptual). */
export default function SensorPanel({ readings, accent, className = '' }: Props) {
  return (
    <div className={`pstage-panel ${className}`} style={{ '--product-accent': accent } as React.CSSProperties}>
      <ul>
        {readings.map(({ icon: Icon, value, label }) => (
          <li key={label}>
            <Icon aria-hidden="true" size={22} strokeWidth={1.5} />
            <span>
              <strong>{value}</strong>
              <small>{label}</small>
            </span>
          </li>
        ))}
      </ul>
      <p>Lecturas ilustrativas</p>
    </div>
  )
}
