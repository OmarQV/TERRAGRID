import SmoothScroll from './components/SmoothScroll'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import BusinessSection from './sections/BusinessSection'
import CtaSection from './sections/CtaSection'
import MarketSection from './sections/MarketSection'
import ProblemSection from './sections/ProblemSection'
import ProductStory from './sections/ProductStory'
import SiteFooter from './sections/SiteFooter'
import SystemSection from './sections/SystemSection'
import TeamSection from './sections/TeamSection'
import ValidationSection from './sections/ValidationSection'

export default function App() {
  return (
    <SmoothScroll>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-semibold focus:text-ink focus:shadow-lg"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido">
        <Hero />
        <ProblemSection />
        <ProductStory />
        <SystemSection />
        <ValidationSection />
        <MarketSection />
        <BusinessSection />
        <TeamSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </SmoothScroll>
  )
}
