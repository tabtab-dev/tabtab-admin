import { computed } from 'vue';

/**
 * 移动端检测设备组合式函数
 * @description 提供移动端设备检测、屏幕方向检测、触摸设备检测等功能
 * @returns 移动端检测相关状态和方法
 */
export function useMobileDetect() {
  /**
   * 窗口尺寸
   */
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  /**
   * 是否移动端（小于 768px）
   */
  const isMobile = computed(() => windowWidth.value < 768);

  /**
   * 是否平板（768px - 1024px）
   */
  const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024);

  /**
   * 是否桌面端（大于等于 1024px）
   */
  const isDesktop = computed(() => windowWidth.value >= 1024);

  /**
   * 是否大屏桌面（大于等于 1280px）
   */
  const isLargeDesktop = computed(() => windowWidth.value >= 1280);

  /**
   * 是否触摸设备
   */
  const isTouchDevice = computed(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });

  /**
   * 屏幕方向
   */
  const orientation = computed(() => {
    if (windowWidth.value > windowHeight.value) return 'landscape';
    return 'portrait';
  });

  /**
   * 是否横屏
   */
  const isLandscape = computed(() => orientation.value === 'landscape');

  /**
   * 是否竖屏
   */
  const isPortrait = computed(() => orientation.value === 'portrait');

  /**
   * 断点检测
   */
  const breakpoints = {
    sm: computed(() => windowWidth.value >= 640),
    md: computed(() => windowWidth.value >= 768),
    lg: computed(() => windowWidth.value >= 1024),
    xl: computed(() => windowWidth.value >= 1280),
    '2xl': computed(() => windowWidth.value >= 1536),
  };

  return {
    // 设备类型
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,

    // 触摸设备
    isTouchDevice,

    // 屏幕方向
    orientation,
    isLandscape,
    isPortrait,

    // 断点
    breakpoints,

    // 窗口尺寸
    windowWidth,
    windowHeight,
  };
}

export default useMobileDetect;
