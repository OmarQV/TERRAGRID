import { Clock, Database, FileText, Sprout, type LucideIcon } from 'lucide-react'

type Stat = {
  icon: LucideIcon
  value: string
  label: string
}

const STATS: Stat[] = [
  { icon: Sprout, value: '3', label: 'Cultivos piloto' },
  { icon: Database, value: '1', label: 'Sistema piloto' },
  { icon: Clock, value: '7–14–30', label: 'Días de seguimiento' },
  { icon: FileText, value: 'Evidencia', label: 'para decisiones' },
]

export default function StatsPanel({ className = '' }: { className?: string }) {
  return (
    <section
      aria-label="Plan piloto en cifras"
      className={`w-full rounded-[22px] border border-white/60 bg-white/[0.92] shadow-[0_20px_60px_rgba(0,0,0,0.10)] backdrop-blur-[20px] ${className}`}
    >
      <ul className="grid grid-cols-2 lg:h-[clamp(96px,11.2vh,120px)] lg:grid-cols-4">
        {STATS.map(({ icon: Icon, value, label }, index) => (
          <li
            key={label}
            className={`flex items-center gap-2.5 px-3.5 py-5 sm:gap-4 sm:px-7 lg:justify-center lg:gap-3 lg:px-4 lg:py-0 xl:gap-4 xl:px-6 ${
              index % 2 === 1 ? 'border-l border-ink/10' : ''
            } ${index > 1 ? 'border-t border-ink/10 lg:border-t-0' : ''} ${index > 0 ? 'lg:border-l lg:border-ink/10' : ''}`}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-light text-primary sm:size-12">
              <Icon aria-hidden="true" className="size-[22px] sm:size-6" strokeWidth={1.9} />
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <strong className="text-lg font-extrabold tracking-tight text-ink sm:text-2xl lg:text-[1.65rem]">{value}</strong>
              <span className="mt-0.5 text-[13px] font-medium text-body sm:text-sm">{label}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
