/**
 * Mock 配置
 * 统一管理 Mock 数据的开关和配置
 */

/**
 * 是否使用 Mock 数据
 * 通过环境变量 VITE_USE_MOCK 控制
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Mock 基础 URL
 */
export const MOCK_BASE_URL = '/mock-api';

/**
 * Mock 延迟时间（毫秒）
 * 用于模拟网络请求延迟
 */
export const MOCK_DELAY = 300;
