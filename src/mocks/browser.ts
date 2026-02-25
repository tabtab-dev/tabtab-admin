/**
 * MSW 浏览器端初始化
 * @description 在浏览器中启动 Service Worker 拦截请求
 */
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

/**
 * 启动 MSW Service Worker
 * @param options - 配置选项
 * @param options.onUnhandledRequest - 处理未捕获请求的方式
 * @param options.quiet - 是否静默启动
 */
export async function startMockService(options?: {
  onUnhandledRequest?: 'bypass' | 'warn' | 'error'
  quiet?: boolean
}) {
  const { onUnhandledRequest = 'bypass', quiet = false } = options || {}

  try {
    await worker.start({
      onUnhandledRequest,
      quiet,
    })

    if (!quiet) {
      console.warn('[MSW] Mock Service Worker started successfully')
    }

    return true
  }
  catch (error) {
    console.error('[MSW] Failed to start Mock Service Worker:', error)
    return false
  }
}
