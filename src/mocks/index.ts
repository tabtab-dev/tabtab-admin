/**
 * MSW Mock 模块入口
 * @description 统一导出 MSW 相关配置和函数
 */
export { worker, startMockService } from './browser';
export { handlers } from './handlers';
export { USE_MOCK, MOCK_BASE_URL, MOCK_DELAY } from './config';
