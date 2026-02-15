import { computed, ref, onMounted, onUnmounted } from 'vue'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface Breakpoints {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

export interface ResponsiveConfig {
  breakpoints?: Breakpoints
  debounce?: number
}

const defaultBreakpoints: Breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export function useResponsive(config: ResponsiveConfig = {}) {
  const breakpoints = config.breakpoints || defaultBreakpoints
  const debounceMs = config.debounce ?? 100

  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const windowHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 768)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function updateDimensions() {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
  }

  function handleResize() {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(updateDimensions, debounceMs)
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      updateDimensions()
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize)
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  })

  const currentBreakpoint = computed<Breakpoint>(() => {
    const width = windowWidth.value
    if (width < breakpoints.sm) return 'xs'
    if (width < breakpoints.md) return 'sm'
    if (width < breakpoints.lg) return 'md'
    if (width < breakpoints.xl) return 'lg'
    if (width < breakpoints['2xl']) return 'xl'
    return '2xl'
  })

  const isXs = computed(() => currentBreakpoint.value === 'xs')
  const isSm = computed(() => currentBreakpoint.value === 'sm')
  const isMd = computed(() => currentBreakpoint.value === 'md')
  const isLg = computed(() => currentBreakpoint.value === 'lg')
  const isXl = computed(() => currentBreakpoint.value === 'xl')
  const is2xl = computed(() => currentBreakpoint.value === '2xl')

  const isMobile = computed(() => windowWidth.value < breakpoints.md)
  const isTablet = computed(() => windowWidth.value >= breakpoints.md && windowWidth.value < breakpoints.lg)
  const isDesktop = computed(() => windowWidth.value >= breakpoints.lg)

  const greaterOrEqual = (bp: Breakpoint): boolean => {
    const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
    const currentIndex = order.indexOf(currentBreakpoint.value)
    const targetIndex = order.indexOf(bp)
    return currentIndex >= targetIndex
  }

  const smallerThan = (bp: Breakpoint): boolean => {
    const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
    const currentIndex = order.indexOf(currentBreakpoint.value)
    const targetIndex = order.indexOf(bp)
    return currentIndex < targetIndex
  }

  const orientation = computed<'portrait' | 'landscape'>(() => {
    return windowWidth.value > windowHeight.value ? 'landscape' : 'portrait'
  })

  const isPortrait = computed(() => orientation.value === 'portrait')
  const isLandscape = computed(() => orientation.value === 'landscape')

  const isTouchDevice = computed(() => {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  })

  return {
    windowWidth,
    windowHeight,
    currentBreakpoint,
    breakpoints: {
      xs: isXs,
      sm: isSm,
      md: isMd,
      lg: isLg,
      xl: isXl,
      '2xl': is2xl,
    },
    isMobile,
    isTablet,
    isDesktop,
    greaterOrEqual,
    smallerThan,
    orientation,
    isPortrait,
    isLandscape,
    isTouchDevice,
  }
}

export function useResponsiveValue<T>(
  values: Partial<Record<Breakpoint, T>> | { default: T; [key in Breakpoint]?: T }
): import('vue').ComputedRef<T> {
  const { currentBreakpoint } = useResponsive()

  return computed(() => {
    const order: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs']
    const currentValue = currentBreakpoint.value
    const currentIndex = order.indexOf(currentValue)

    for (let i = currentIndex; i < order.length; i++) {
      const bp = order[i]
      if (bp in values && values[bp] !== undefined) {
        return values[bp] as T
      }
    }

    if ('default' in values) {
      return values.default
    }

    throw new Error('No matching breakpoint value found and no default provided')
  })
}

export function useResponsiveProp<T>(
  prop: import('vue').ComputedRef<T | Partial<Record<Breakpoint, T>>>,
  defaultValue: T
): import('vue').ComputedRef<T> {
  const { currentBreakpoint } = useResponsive()

  return computed(() => {
    const value = prop.value

    if (value === undefined || value === null) {
      return defaultValue
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      return value as T
    }

    const breakpointValue = value as Partial<Record<Breakpoint, T>>
    const order: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs']
    const currentValue = currentBreakpoint.value
    const currentIndex = order.indexOf(currentValue)

    for (let i = currentIndex; i < order.length; i++) {
      const bp = order[i]
      if (bp in breakpointValue && breakpointValue[bp] !== undefined) {
        return breakpointValue[bp] as T
      }
    }

    return defaultValue
  })
}

export default useResponsive
