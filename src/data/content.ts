import {
  BatteryCharging,
  Blocks,
  Bot,
  CloudSun,
  Cpu,
  Database,
  Handshake,
  Leaf,
  ScanLine,
  Sprout,
  ThermometerSun,
  TimerReset,
  Users,
  Warehouse,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'

export type ProductLine = {
  id: 'seed' | 'grow' | 'seed-bank'
  index: string
  phase: string
  status: string
  name: string
  eyebrow: string
  headline: string
  description: string
  model: string
  poster: string
  icon: LucideIcon
  accent: string
  crops: string
  purpose: string
  features: string[]
  note: string
}

export const PRODUCT_LINES: ProductLine[] = [
  {
    id: 'seed',
    index: '01',
    phase: 'Ahora · MVP',
    status: 'Primera validación',
    name: 'TERRAGRID SEED',
    eyebrow: 'Microgerminación y plantines',
    headline: 'Convertir la etapa más incierta en un proceso medible.',
    description:
      'Incubadora agrícola inteligente para controlar la germinación, la emergencia y el desarrollo inicial del plantín. Registra las condiciones y los eventos de cada lote antes del trasplante.',
    model: '/models/terragrid-seed.glb',
    poster: '/products/terragrid-seed.png',
    icon: Sprout,
    accent: '#9df78f',
    crops: 'Perejil · Lechuga · Tomate',
    purpose: 'Plantines uniformes y trazables',
    features: [
      'Protocolos agronómicos por etapa',
      'Control de temperatura, humedad, luz, riego y ventilación',
      'Registro digital del lote y seguimiento posrasplante',
    ],
    note: 'El perejil será el piloto agronómico principal; la lechuga apoyará la calibración y el tomate se evaluará como plantín para trasplante.',
  },
  {
    id: 'grow',
    index: '02',
    phase: 'Siguiente fase',
    status: 'Roadmap productivo',
    name: 'TERRAGRID GROW',
    eyebrow: 'Crecimiento hidropónico',
    headline: 'Del plantín al ciclo productivo en ambiente controlado.',
    description:
      'Módulo hidropónico compacto orientado a hortalizas de hoja y hierbas. Extenderá el monitoreo hacia pH, conductividad eléctrica, nivel y temperatura de la solución nutritiva.',
    model: '/models/terragrid-grow.glb',
    poster: '/products/terragrid-grow.png',
    icon: Waves,
    accent: '#6ee7c1',
    crops: 'Lechuga · Perejil · Hojas',
    purpose: 'Producción controlada hasta cosecha',
    features: [
      'Recirculación y control de solución nutritiva',
      'Monitoreo de pH, EC, agua y energía',
      'Configuración modular según cultivo y etapa',
    ],
    note: 'GROW se desarrollará después de validar SEED. El tomate convencional continuará saliendo como plantín; no se promete su producción completa en el gabinete compacto.',
  },
  {
    id: 'seed-bank',
    index: '03',
    phase: 'Visión futura',
    status: 'Conservación distribuida',
    name: 'TERRAGRID SEED BANK',
    eyebrow: 'Microbanco inteligente',
    headline: 'Proteger la semilla, comprobar su viabilidad y regenerarla a tiempo.',
    description:
      'Sistema modular que combina conservación controlada, identificación de lotes, pruebas periódicas de germinación y un historial digital de viabilidad.',
    model: '/models/terragrid-seed-bank.glb',
    poster: '/products/terragrid-seed-bank.png',
    icon: Database,
    accent: '#f2d27d',
    crops: 'Semillas locales · Nativas · Comerciales',
    purpose: 'Conservación y pruebas de viabilidad',
    features: [
      'Zona de conservación con humedad y temperatura controladas',
      'Zona independiente para pruebas de germinación',
      'Alertas de revisión, pérdida de viabilidad y regeneración',
    ],
    note: 'SEED BANK no es una caja de almacenamiento: será una red de microbancos capaces de verificar periódicamente si cada lote continúa vivo.',
  },
]

export const PROBLEM_POINTS = [
  {
    icon: TimerReset,
    title: 'Resembrar cuesta tiempo',
    copy: 'Una emergencia irregular puede obligar al productor a repetir el almácigo y retrasar todo el ciclo.',
  },
  {
    icon: CloudSun,
    title: 'El clima amplifica el riesgo',
    copy: 'En La Paz, bajas temperaturas, heladas y variaciones ambientales vuelven más vulnerable la primera etapa.',
  },
  {
    icon: ScanLine,
    title: 'La calidad llega sin historia',
    copy: 'Sin datos comparables del lote es difícil distinguir un plantín vigoroso de uno que solo parece estar listo.',
  },
]

export const SYSTEM_LAYERS = [
  {
    icon: ThermometerSun,
    number: '01',
    title: 'Sensores',
    copy: 'Temperatura, humedad, luz, riego y variables del sustrato traducen el ambiente en datos útiles.',
    status: 'MVP',
  },
  {
    icon: Cpu,
    number: '02',
    title: 'Automatización local',
    copy: 'Reglas por etapa activan iluminación, ventilación y riego sin depender de conectividad permanente.',
    status: 'MVP',
  },
  {
    icon: Bot,
    number: '03',
    title: 'IA agronómica asistida',
    copy: 'El análisis de tendencias, imágenes y alertas apoyará decisiones; no reemplazará el criterio agronómico.',
    status: 'Progresivo',
  },
  {
    icon: Blocks,
    number: '04',
    title: 'Trazabilidad verificable',
    copy: 'Los hitos críticos podrán anclarse en blockchain y cerrar con una constancia digital, no una certificación oficial.',
    status: 'Roadmap',
  },
  {
    icon: BatteryCharging,
    number: '05',
    title: 'Energía modular',
    copy: 'Medición de consumo y arquitectura adaptable a red, respaldo o energía solar según el lugar de uso.',
    status: 'Roadmap',
  },
]

export const VALIDATION_METRICS = [
  'Porcentaje de germinación',
  'Velocidad de emergencia',
  'Uniformidad y descarte',
  'Agua y energía',
  'Costo por plantín aceptado',
  'Supervivencia a 7, 14 y 30 días',
]

export const MARKET_SEGMENTS = [
  {
    icon: Leaf,
    title: 'Productores hortícolas',
    copy: 'Plantines por lote para reducir incertidumbre antes del trasplante.',
  },
  {
    icon: Warehouse,
    title: 'Viveros y asociaciones',
    copy: 'Capacidad programada, protocolos repetibles e historial de producción.',
  },
  {
    icon: Users,
    title: 'Instituciones agrícolas',
    copy: 'Ensayos, formación, investigación aplicada y trazabilidad de lotes.',
  },
  {
    icon: Handshake,
    title: 'Aliados de implementación',
    copy: 'Agrónomos, municipios y organizaciones que puedan habilitar pilotos reales.',
  },
]

export const BUSINESS_PHASES = [
  {
    phase: '01',
    label: 'Ingreso inicial',
    title: 'Venta de plantines',
    copy: 'TERRAGRID produce y entrega plantines por lote. El cliente compra el resultado, no el hardware.',
    now: true,
  },
  {
    phase: '02',
    label: 'Capacidad como servicio',
    title: 'Incubación por reserva',
    copy: 'El cliente reserva bandejas, especies y ventanas de producción dentro de una instalación TERRAGRID.',
  },
  {
    phase: '03',
    label: 'Despliegue futuro',
    title: 'Alquiler en sitio',
    copy: 'La incubadora se instala en las dependencias del cliente con soporte, monitoreo y mantenimiento.',
  },
]

export const TEAM = [
  {
    photo: '/equipo/omar.png',
    name: 'Omar Quispe Vargas',
    role: 'Cofundador · Estrategia y producto',
    socials: [
      { label: 'LinkedIn', href: 'https://linkedin.com/in/omar-quispe-vargas-7b5601204', icon: FaLinkedinIn },
      { label: 'X', href: 'https://x.com/OmarQV2025', icon: FaXTwitter },
      { label: 'Facebook', href: 'https://www.facebook.com/omar.quispe.568/', icon: FaFacebookF },
      { label: 'Instagram', href: 'https://www.instagram.com/omar_aic_/', icon: FaInstagram },
    ],
  },
  {
    photo: '/equipo/carol.jpeg',
    name: 'Carol Katerine Canqui Uturunco',
    role: 'Datos, IA y validación',
    socials: [
      { label: 'LinkedIn', href: 'https://linkedin.com/in/carol-canqui', icon: FaLinkedinIn },
      { label: 'Instagram', href: 'https://www.instagram.com/carolcanqui/', icon: FaInstagram },
      { label: 'Facebook', href: 'https://www.facebook.com/katerine.canqui.uturunco', icon: FaFacebookF },
    ],
  },
  {
    photo: '/equipo/helen.jpeg',
    name: 'Helen Noemi Flores Apaza',
    role: 'Agronomía y protocolos',
    socials: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/flores-apaza-helen-noemi-2b078b429', icon: FaLinkedinIn },
      { label: 'Facebook', href: 'https://www.facebook.com/noemi.flores.3558', icon: FaFacebookF },
      { label: 'Instagram', href: 'https://www.instagram.com/noemiflores18/', icon: FaInstagram },
    ],
  },
  {
    photo: '/equipo/jhamil.jpg',
    name: 'Jhamil Calixto Mamani Quea',
    role: 'UI/UX e identidad visual',
    socials: [
      { label: 'LinkedIn', href: 'https://linkedin.com/in/jhamilcali', icon: FaLinkedinIn },
      { label: 'X', href: 'https://x.com/JHAMILCALIXTO', icon: FaXTwitter },
      { label: 'Instagram', href: 'https://instagram.com/jhamilquea', icon: FaInstagram },
      { label: 'Facebook', href: 'https://www.facebook.com/jhamil.mamani.7330', icon: FaFacebookF },
    ],
  },
  {
    photo: '/equipo/saul.png',
    name: 'Saúl Mijael Choquehuanca Huanca',
    role: 'Backend y blockchain',
    socials: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/saul-choquehuanca/?locale=es', icon: FaLinkedinIn },
      { label: 'Facebook', href: 'https://www.facebook.com/saulchoque123/', icon: FaFacebookF },
      { label: 'Instagram', href: 'https://www.instagram.com/baulchop/', icon: FaInstagram },
    ],
  },
]
