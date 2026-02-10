import { ref } from 'vue';

/**
 * 全屏状态
 */
const isFullscreen = ref(false);

/**
 * 当前全屏的元素
 */
const fullscreenElement = ref<HTMLElement | null>(null);

/**
 * 事件监听是否已初始化
 */
let isInitialized = false;

/**
 * 更新全屏状态
 */
const updateFullscreenState = () => {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );

  // 更新当前全屏元素
  fullscreenElement.value =
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement;
};

/**
 * 监听全屏变化事件
 */
const handleFullscreenChange = () => {
  updateFullscreenState();
};

/**
 * 初始化全屏事件监听
 */
const initFullscreenListener = () => {
  if (isInitialized || typeof document === 'undefined') return;

  // 初始化状态
  updateFullscreenState();

  // 监听全屏变化事件
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);

  isInitialized = true;
};

/**
 * 全屏 Composable
 * @description 封装原生 Fullscreen API，提供响应式的全屏状态管理
 * @param target - 要全屏显示的目标元素，默认为 document.documentElement
 * @returns 全屏控制方法和状态
 */
export function useFullscreen(target?: HTMLElement | null) {
  // 确保事件监听已初始化
  initFullscreenListener();

  /**
   * 获取目标元素
   */
  const getTarget = (): HTMLElement => {
    return target || document.documentElement;
  };

  /**
   * 进入全屏
   */
  const enter = async (): Promise<void> => {
    const el = getTarget();

    if (!el) {
      console.warn('[useFullscreen] Target element not found');
      return;
    }

    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if ((el as any).webkitRequestFullscreen) {
        await (el as any).webkitRequestFullscreen();
      } else if ((el as any).mozRequestFullScreen) {
        await (el as any).mozRequestFullScreen();
      } else if ((el as any).msRequestFullscreen) {
        await (el as any).msRequestFullscreen();
      } else {
        console.warn('[useFullscreen] Fullscreen API is not supported');
      }
    } catch (error) {
      console.error('[useFullscreen] Failed to enter fullscreen:', error);
    }
  };

  /**
   * 退出全屏
   */
  const exit = async (): Promise<void> => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.error('[useFullscreen] Failed to exit fullscreen:', error);
    }
  };

  /**
   * 切换全屏状态
   */
  const toggle = async (): Promise<void> => {
    if (isFullscreen.value) {
      await exit();
    } else {
      await enter();
    }
  };

  /**
   * 检查浏览器是否支持全屏 API
   */
  const isSupported = (): boolean => {
    const el = getTarget();
    return !!(
      el &&
      (el.requestFullscreen ||
        (el as any).webkitRequestFullscreen ||
        (el as any).mozRequestFullScreen ||
        (el as any).msRequestFullscreen)
    );
  };

  return {
    isFullscreen,
    fullscreenElement,
    enter,
    exit,
    toggle,
    isSupported,
  };
}

/**
 * 全局全屏状态
 * @description 用于在组件之间共享全屏状态
 */
export { isFullscreen, fullscreenElement };

/**
 * 全屏 Composable 返回类型
 */
export type UseFullscreenReturn = ReturnType<typeof useFullscreen>;
