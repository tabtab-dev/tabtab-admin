/**
 * API 入口文件
 * @description 统一导出所有 API 模块
 */

// 导出请求对象和配置
export { request, alovaInstance, type RequestConfig } from './request';
export { requestMock, alovaMockInstance } from './request.mock';
export { type ApiResponse } from './alova';

// 导出 API 模块（正式接口）
export {
  authApi,
  type LoginParams,
  type LoginResponse,
  type ChangePasswordParams,
} from './modules/auth';
export {
  usersApi,
  type CreateUserParams,
  type UpdateUserParams,
  type GetUsersParams,
} from './modules/users';
export {
  menuApi,
  menuApiMock,
} from './modules/menu';

// 导出 API 模块（Mock 接口）
export { authApiMock } from './modules/auth';
export { usersApiMock } from './modules/users';
