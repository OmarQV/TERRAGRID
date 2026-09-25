import { createContext, useContext } from 'react'

export type Navigate = (target: HTMLElement, center?: boolean) => void
export const ScrollContext = createContext<Navigate>((target) => target.scrollIntoView())
export const useSmoothScroll = () => useContext(ScrollContext)
