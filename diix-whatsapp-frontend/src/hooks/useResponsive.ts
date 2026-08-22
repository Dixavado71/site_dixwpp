import { useState, useEffect } from 'react'

export interface Breakpoints {
  xs: number;   // 320px - iPhone SE
  sm: number;   // 640px - Mobile grande
  md: number;   // 768px - Tablet pequeno
  lg: number;   // 1024px - Tablet grande/Desktop pequeno
  xl: number;   // 1280px - Desktop
  '2xl': number; // 1536px - Desktop grande
}

const DEFAULT_BREAKPOINTS: Breakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface UseResponsiveReturn {
  width: number;
  height: number;
  isMobile: boolean;      // < 640px
  isTablet: boolean;      // 640px - 1024px
  isDesktop: boolean;     // >= 1024px
  isSmallMobile: boolean; // < 390px (iPhone SE)
  currentBreakpoint: ScreenSize;
  breakpoints: Breakpoints;
}

/**
 * Hook personalizado para gerenciar estado responsivo da aplicação
 * 
 * @example
 * ```tsx
 * const { isMobile, isTablet, isDesktop, currentBreakpoint } = useResponsive()
 * 
 * return (
 *   <div>
 *     {isMobile && <MobileNav />}
 *     {isDesktop && <DesktopNav />}
 *   </div>
 * )
 * ```
 */
export function useResponsive(breakpoints: Partial<Breakpoints> = {}): UseResponsiveReturn {
  const mergedBreakpoints: Breakpoints = {
    ...DEFAULT_BREAKPOINTS,
    ...breakpoints,
  }

  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Set initial dimensions
    handleResize()

    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { width, height } = dimensions

  // Determine current breakpoint
  let currentBreakpoint: ScreenSize = 'xs'
  if (width >= mergedBreakpoints['2xl']) currentBreakpoint = '2xl'
  else if (width >= mergedBreakpoints.xl) currentBreakpoint = 'xl'
  else if (width >= mergedBreakpoints.lg) currentBreakpoint = 'lg'
  else if (width >= mergedBreakpoints.md) currentBreakpoint = 'md'
  else if (width >= mergedBreakpoints.sm) currentBreakpoint = 'sm'
  else currentBreakpoint = 'xs'

  const isSmallMobile = width < 390 // iPhone SE width
  const isMobile = width < mergedBreakpoints.md // < 768px
  const isTablet = width >= mergedBreakpoints.md && width < mergedBreakpoints.lg // 768px - 1024px
  const isDesktop = width >= mergedBreakpoints.lg // >= 1024px

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isSmallMobile,
    currentBreakpoint,
    breakpoints: mergedBreakpoints,
  }
}

/**
 * Hook específico para detectar se está em dispositivo touch
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const isTouchDevice = 
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore - MSPointerEvent for IE
      navigator.msMaxTouchPoints > 0

    setIsTouch(isTouchDevice)
  }, [])

  return isTouch
}

/**
 * Hook para gerenciar estado de sidebar responsiva
 */
export function useResponsiveSidebar() {
  const { isDesktop } = useResponsive()
  const [isOpen, setIsOpen] = useState(isDesktop)

  useEffect(() => {
    // Auto-open sidebar on desktop, close on mobile
    setIsOpen(isDesktop)
  }, [isDesktop])

  const toggle = () => setIsOpen(prev => !prev)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return { isOpen, toggle, open, close, isDesktop }
}

export default useResponsive
