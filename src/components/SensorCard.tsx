import type { LucideIcon } from 'lucide-react'

type SensorCardProps = {
  icon: LucideIcon
  label: string
  value: string
  /** Muestra la etiqueta encima del valor (p. ej. «Riego / 0.8 L/h»). */
  labelFirst?: boolean
  /** Clases de posición; solo aplican desde tablet, donde la tarjeta flota sobre la máquina. */
  className?: string
  /** Retraso de entrada en ms (aparición escalonada). */
  delay?: number
  /** Duración del vaivén vertical en segundos. */
  floatSeconds?: number
}

/**
 * Tarjeta IoT flotante. Sus medidas están en `em` para que escale junto con la
 * máquina (el contenedor padre define el tamaño de fuente con unidades cqw).
 */
export default function SensorCard({
  icon: Icon,
  label,
  value,
  labelFirst = false,
  className = '',
  delay = 0,
  floatSeconds = 5,
}: SensorCardProps) {
  return (
    <div
      className={`motion-safe:animate-fade-in md:absolute md:-translate-x-1/2 md:-translate-y-1/2 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="motion-safe:animate-float" style={{ animationDuration: `${floatSeconds}s` }}>
        <div className="flex flex-col items-center gap-[0.4em] rounded-[18px] border border-white/70 bg-white/80 px-[0.6em] py-[0.8em] text-center shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-[16px] md:flex-row md:gap-[0.75em] md:px-[1em] md:py-[0.75em] md:text-left">
          <span className="grid size-[2.4em] shrink-0 place-items-center rounded-full bg-primary-light text-primary">
            <Icon aria-hidden="true" className="size-[1.2em]" strokeWidth={2} />
          </span>
          <span className={`flex whitespace-nowrap leading-tight ${labelFirst ? 'flex-col-reverse' : 'flex-col'}`}>
            <strong className="text-[1.45em] font-extrabold tracking-tight text-ink">{value}</strong>
            <span className="text-[0.85em] font-medium text-body">{label}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
