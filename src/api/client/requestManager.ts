/**
 * 请求管理器
 * @description 提供请求去重、重试、缓存等高级功能
 */

import type { Method } from 'alova';

/**
 * 请求配置选项
 */
export interface RequestManagerOptions {
  /** 是否启用去重 */
  enableDedupe?: boolean;
  /** 去重时间窗口（毫秒） */
  dedupeWindow?: number;
  /** 是否启用重试 */
  enableRetry?: boolean;
  /** 最大重试次数 */
  maxRetries?: number;
  /** 重试延迟（毫秒） */
  retryDelay?: number;
  /** 是否使用指数退避 */
  useExponentialBackoff?: boolean;
}

/**
 * 请求标识生成器
 */
function generateRequestKey(method: Method): string {
  const config = method.config;
  const url = config.url || '';
  const methodType = config.method || 'GET';
  const params = JSON.stringify(config.params || {});
  const data = JSON.stringify(config.data || {});
  return `${methodType}:${url}:${params}:${data}`;
}

/**
 * 请求管理器
 */
export class RequestManager {
  private pendingRequests = new Map<string, Promise<any>>();
  private options: Required<RequestManagerOptions>;

  constructor(options: RequestManagerOptions = {}) {
    this.options = {
      enableDedupe: true,
      dedupeWindow: 100,
      enableRetry: true,
      maxRetries: 3,
      retryDelay: 1000,
      useExponentialBackoff: true,
      ...options,
    };
  }

  /**
   * 执行请求（带去重和重试）
   * @param method - Alova 方法实例
   * @returns 请求结果
   */
  async execute<T = any>(method: Method): Promise<T> {
    const key = generateRequestKey(method);

    // 去重检查
    if (this.options.enableDedupe && this.pendingRequests.has(key)) {
      console.log(`[RequestManager] 请求去重: ${key}`);
      return this.pendingRequests.get(key) as Promise<T>;
    }

    // 创建请求 Promise，使用 finally 确保无论成功失败都清理
    const requestPromise = this.executeWithRetry<T>(method, key).finally(() => {
      // 请求完成后立即清理 pending
      if (this.options.enableDedupe) {
        this.pendingRequests.delete(key);
      }
    });

    // 存储 pending 请求
    if (this.options.enableDedupe) {
      this.pendingRequests.set(key, requestPromise);
    }

    return requestPromise;
  }

  /**
   * 执行请求（带重试）
   */
  private async executeWithRetry<T>(
    method: Method,
    key: string,
    attempt: number = 0
  ): Promise<T> {
    try {
      const result = await method.send();
      return result;
    } catch (error) {
      // 判断是否可重试
      if (this.shouldRetry(error, attempt)) {
        const delay = this.calculateDelay(attempt);
        console.log(`[RequestManager] 请求重试 (${attempt + 1}/${this.options.maxRetries}): ${key}`);

        await this.sleep(delay);
        return this.executeWithRetry<T>(method, key, attempt + 1);
      }

      // 不重试，抛出错误（pending 清理由 finally 处理）
      throw error;
    }
  }

  /**
   * 判断是否可重试
   */
  private shouldRetry(error: any, attempt: number): boolean {
    if (!this.options.enableRetry) return false;
    if (attempt >= this.options.maxRetries) return false;

    // 网络错误可重试
    if (!error.response) return true;

    // 特定状态码可重试
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
    if (retryableStatusCodes.includes(error.response.status)) return true;

    return false;
  }

  /**
   * 计算重试延迟
   */
  private calculateDelay(attempt: number): number {
    if (this.options.useExponentialBackoff) {
      // 指数退避: delay * 2^attempt + 随机抖动
      const baseDelay = this.options.retryDelay * Math.pow(2, attempt);
      const jitter = Math.random() * 1000;
      return Math.min(baseDelay + jitter, 30000); // 最大 30 秒
    }
    return this.options.retryDelay;
  }

  /**
   * 延迟函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 取消所有 pending 请求
   */
  cancelAll(): void {
    this.pendingRequests.clear();
  }

  /**
   * 获取 pending 请求数量
   */
  getPendingCount(): number {
    return this.pendingRequests.size;
  }
}

/**
 * 全局请求管理器实例
 */
export const requestManager = new RequestManager();

/**
 * 请求缓存管理器
 */
export class RequestCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  /**
   * 获取缓存数据
   */
  get<T>(key: string): T | undefined {
    const cached = this.cache.get(key);
    if (!cached) return undefined;

    // 检查是否过期
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return cached.data as T;
  }

  /**
   * 设置缓存数据
   */
  set(key: string, data: any, ttl: number = 60000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * 清除缓存
   */
  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * 生成缓存 key
   */
  static generateKey(method: Method): string {
    const config = method.config;
    return `${config.method || 'GET'}:${config.url || ''}:${JSON.stringify(config.params || {})}`;
  }
}

/**
 * 全局缓存实例
 */
export const requestCache = new RequestCache();
