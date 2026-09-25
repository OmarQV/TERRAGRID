import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger } from '../lib/animation'

import { ScrollContext, type Navigate } from '../lib/scroll-context'

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const instance = useRef<Lenis | null>(null)
  const navigate = useCallback<Navigate>((target, center = false) => {
    const offset = center && target.offsetHeight < window.innerHeight - 192
      ? -(window.innerHeight - target.offsetHeight) / 2 : -96
    // Numeric targets avoid applying CSS scroll-margin twice inside Lenis.
    const top = window.scrollY + target.getBoundingClientRect().top + offset
    if (instance.current) instance.current.scrollTo(top)
    else window.scrollTo({ top, behavior: 'instant' })
  }, [])

  useEffect(() => {
    const media = gsap.matchMedia()
    // One clock for Lenis and ScrollTrigger; touch keeps native momentum.
    gsap.ticker.lagSmoothing(0)
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true, syncTouch: false, anchors: false })
      instance.current = lenis
      const tick = (time: number) => lenis.raf(time * 1000)
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)
      return () => {
        gsap.ticker.remove(tick)
        lenis.off('scroll', ScrollTrigger.update)
        lenis.destroy()
        instance.current = null
      }
    })

    const anchorTarget = (hash: string) => {
      try { return document.getElementById(decodeURIComponent(hash.slice(1))) } catch { return null }
    }
    const followAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]')
      if (!link || link.target || link.hasAttribute('download')) return
      const url = new URL(link.href)
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return
      const target = anchorTarget(url.hash)
      if (!target) return
      event.preventDefault()
      if (location.hash !== url.hash) history.pushState(null, '', url.hash)
      // Preserve skip-link/keyboard semantics without a second native scroll.
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1')
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
      }
      target.focus({ preventScroll: true })
      navigate(target)
    }
    const restoreAnchor = () => {
      const target = anchorTarget(location.hash)
      if (target) {
        instance.current?.resize()
        const top = window.scrollY + target.getBoundingClientRect().top - 96
        if (instance.current) instance.current.scrollTo(top, { immediate: true })
        else window.scrollTo({ top, behavior: 'instant' })
      }
    }
    let disposed = false
    void document.fonts.ready.then(() => {
      if (disposed) return
      ScrollTrigger.refresh()
      restoreAnchor()
    })
    document.addEventListener('click', followAnchor)
    window.addEventListener('hashchange', restoreAnchor)
    return () => {
      disposed = true
      document.removeEventListener('click', followAnchor)
      window.removeEventListener('hashchange', restoreAnchor)
      media.revert()
    }
  }, [navigate])

  return <ScrollContext.Provider value={navigate}>{children}</ScrollContext.Provider>
}
