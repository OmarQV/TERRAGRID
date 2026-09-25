import { ArrowDown } from 'lucide-react'

export default function SiteFooter() {
  return (
    <footer>
      <a className="brand" href="#inicio"><span className="brand-mark"><img src="/brand/terragrid-mark.svg" alt="" /></span><span>TERRAGRID</span></a>
      <p>Incubación agrícola inteligente · La Paz, Bolivia · 2026</p>
      <a href="#inicio" aria-label="Volver arriba"><ArrowDown size={18} style={{ transform: 'rotate(180deg)' }} /></a>
    </footer>
  )
}
