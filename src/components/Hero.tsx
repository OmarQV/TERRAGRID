import { ArrowRight, Droplets, Sprout, Thermometer } from 'lucide-react'
import heroAndes from '../assets/hero-andes.webp'
import machine from '../assets/terragrid-machine.webp'
import SensorCard from './SensorCard'
import StatsPanel from './StatsPanel'

/** Posiciones en % del contenedor de la máquina (centro de cada tarjeta). */
const SENSORS = [
  {
    icon: Thermometer,
    label: 'Temperatura',
    value: '24.1 °C',
    position: 'md:left-[42%] md:top-[0%]',
    delay: 700,
    floatSeconds: 5,
  },
  {
    icon: Droplets,
    label: 'Humedad',
    value: '78%',
    position: 'md:left-[-1%] md:top-[28.5%]',
    delay: 850,
    floatSeconds: 6,
  },
  {
    icon: Sprout,
    label: 'Riego',
    value: '0.8 L/h',
    labelFirst: true,
    position: 'md:left-[100%] md:top-[54%]',
    delay: 1000,
    floatSeconds: 4.5,
  },
]

/** Líneas finas que unen cada tarjeta con el componente de la máquina que mide (en % del contenedor). */
const CONNECTORS = [
  { from: [42, 0], to: [42, 19.4] },
  { from: [-1, 28.5], to: [20.7, 28.5] },
  { from: [100, 54], to: [71.5, 36.4] },
]

const buttonBase =
  'inline-flex h-14 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold xl:px-8 ' +
  'transition duration-200 hover:-translate-y-0.5'

export default function Hero() {
  return (
    <section id="inicio" className="hero relative isolate flex flex-col overflow-hidden bg-surface pt-[76px] md:pt-[88px]">
      <img
        src={heroAndes}
        alt=""
        width={2400}
        height={1830}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 size-full object-cover object-[center_40%]"
      />
      <div aria-hidden="true" className="hero-veil absolute inset-0 -z-10" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 items-center px-5 py-8 md:px-10 md:py-6">
        <div className="max-w-[37.5rem] md:max-w-[min(37.5rem,calc(46vw-3.5rem))]">
          <p
            className="inline-flex items-center gap-2.5 rounded-full border border-black/[0.08] bg-white/70 px-4 py-2 text-sm font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-sm motion-safe:animate-fade-in"
          >
            <span aria-hidden="true" className="size-2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(22,148,71,0.16)]" />
            Preincubación · La Paz, Bolivia
          </p>

          <h1
            className="mt-6 text-[clamp(2.5rem,12.5vw,3.25rem)] font-extrabold leading-[0.98] tracking-[-0.035em] motion-safe:animate-fade-up md:mt-7 md:text-[min(clamp(2.5rem,1.2rem+3.2vw,4.5rem),7.5vh)]"
            style={{ animationDelay: '120ms' }}
          >
            <span className="block text-ink">Agricultura</span>
            <span className="block text-ink">inteligente</span>
            <span className="block text-primary">para un futuro</span>
            <span className="block text-primary">real.</span>
          </h1>

          <p
            className="mt-6 max-w-[590px] text-pretty text-[clamp(1rem,0.55rem+0.62vw,1.25rem)] leading-[1.55] text-body motion-safe:animate-fade-up md:mt-8"
            style={{ animationDelay: '280ms' }}
          >
            TERRAGRID automatiza y documenta la microgerminación de cultivos para generar evidencia útil y decisiones
            más precisas en el campo.
          </p>

          <div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-3 md:mt-10 xl:gap-4 motion-safe:animate-fade-up"
            style={{ animationDelay: '440ms' }}
          >
            <a
              href="#lineas"
              className={`${buttonBase} group bg-primary text-white hover:bg-primary-dark hover:shadow-[0_12px_28px_rgba(22,148,71,0.28)]`}
            >
              Explorar el sistema
              <ArrowRight
                aria-hidden="true"
                className="size-5 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="#validacion"
              className={`${buttonBase} border border-[rgba(20,100,60,0.4)] bg-white/25 text-ink backdrop-blur-sm hover:bg-white/70`}
            >
              Ver el proyecto
            </a>
          </div>
        </div>
      </div>

      {/* Cámara TERRAGRID: en tablet/desktop se ancla a la derecha del hero; en móvil fluye tras los botones. */}
      <div className="hero-machine relative z-10 [container-type:inline-size] max-md:mx-auto max-md:mt-2 max-md:w-[92%] md:absolute">
        <div className="relative motion-safe:animate-rise-in" style={{ animationDelay: '300ms' }}>
          {/* Sombra de contacto: sigue la diagonal de la base (perspectiva 3/4) */}
          <div
            aria-hidden="true"
            className="absolute bottom-[1%] left-[2%] right-[0%] h-[8%] rotate-[6deg] rounded-[50%] bg-ink/40 blur-[22px]"
          />
          <img
            src={machine}
            alt="Cámara inteligente de microgerminación TERRAGRID SEED con dos niveles de bandejas, iluminación LED, sensores y pantalla táctil"
            width={1157}
            height={1058}
            decoding="async"
            className="relative block h-auto w-full"
          />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-[12px] sm:text-[13px] md:absolute md:inset-0 md:mt-0 md:block md:text-[length:clamp(11px,1.9cqw,17px)]">
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden size-full overflow-visible lg:block"
          >
            {CONNECTORS.map(({ from, to }) => (
              <path
                key={`${from}-${to}`}
                d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`}
                fill="none"
                stroke="var(--color-primary)"
                strokeOpacity="0.6"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
          {CONNECTORS.map(({ to }) => (
            <span
              key={`dot-${to}`}
              aria-hidden="true"
              className="absolute hidden size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-[5px] ring-primary/20 lg:block"
              style={{ left: `${to[0]}%`, top: `${to[1]}%` }}
            />
          ))}

          {SENSORS.map(({ position, ...sensor }) => (
            <SensorCard key={sensor.label} className={position} {...sensor} />
          ))}
        </div>
      </div>

      <div className="relative z-20 mx-auto w-full max-w-[1440px] px-5 pb-6 pt-6 md:px-10 md:pt-0">
        <StatsPanel
          className="mx-auto lg:max-w-[1180px] motion-safe:animate-fade-up"
        />
      </div>
    </section>
  )
}
