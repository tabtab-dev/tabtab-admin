/**
 * Mock 响应工具函数
 * @description 创建标准化的 Mock 响应数据
 */

/**
 * API 响应数据结构
 */
export interface MockResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

/**
 * 创建标准响应
 * @param data - 响应数据
 * @param code - 状态码，默认 200
 * @param message - 消息，默认 'success'
 * @returns 标准响应对象
 */
export function createResponse<T>(data: T, code = 200, message = 'success'): MockResponse<T> {
  return {
    code,
    data,
    message,
  };
}

/**
 * 创建成功响应
 * @param data - 响应数据
 * @param message - 成功消息
 * @returns 成功响应对象
 */
export function createSuccessResponse<T>(data: T, message = '操作成功'): MockResponse<T> {
  return createResponse(data, 200, message);
}

/**
 * 创建错误响应
 * @param message - 错误消息
 * @param code - 错误码，默认 400
 * @returns 错误响应对象
 */
export function createErrorResponse(message: string, code = 400): MockResponse<null> {
  return createResponse(null, code, message);
}

/**
 * 创建未授权响应
 * @param message - 错误消息，默认 '未授权'
 * @returns 未授权响应对象
 */
export function createUnauthorizedResponse(message = '未授权'): MockResponse<null> {
  return createErrorResponse(message, 401);
}

/**
 * 创建未找到响应
 * @param message - 错误消息，默认 '资源不存在'
 * @returns 未找到响应对象
 */
export function createNotFoundResponse(message = '资源不存在'): MockResponse<null> {
  return createErrorResponse(message, 404);
}

/**
 * 创建分页响应
 * @param data - 分页数据
 * @param total - 总记录数
 * @param page - 当前页码
 * @param pageSize - 每页数量
 * @returns 分页响应对象
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): MockResponse<{ list: T[]; total: number; page: number; pageSize: number }> {
  return {
    code: 200,
    data: {
      list: data,
      total,
      page,
      pageSize,
    },
    message: 'success',
  };
}

/**
 * 成功响应别名
 * @deprecated 使用 createSuccessResponse 代替
 */
export const successResponse = createSuccessResponse;

/**
 * 创建分页响应
 * @param data - 分页数据
 * @param total - 总记录数
 * @param page - 当前页码
 * @param pageSize - 每页数量
 * @returns 分页响应对象
 */
export const createPaginationResponse = paginatedResponse;

/**
 * 创建 JSON 格式的标准响应
 * @param data - 响应数据
 * @param code - 状态码，默认 200
 * @param message - 消息，默认 'success'
 * @returns JSON 字符串
 */
export function createJSONResponse<T>(data: T, code = 200, message = 'success'): string {
  return JSON.stringify(createResponse(data, code, message));
}

/**
 * 创建 JSON 格式的成功响应
 * @param data - 响应数据
 * @param message - 成功消息
 * @returns JSON 字符串
 */
export function createJSONSuccessResponse<T>(data: T, message = '操作成功'): string {
  return JSON.stringify(createSuccessResponse(data, message));
}

/**
 * 创建 JSON 格式的错误响应
 * @param message - 错误消息
 * @param code - 错误码，默认 400
 * @returns JSON 字符串
 */
export function createJSONErrorResponse(message: string, code = 400): string {
  return JSON.stringify(createErrorResponse(message, code));
}

/**
 * 创建 JSON 格式的分页响应
 * @param data - 分页数据
 * @param total - 总记录数
 * @param page - 当前页码
 * @param pageSize - 每页数量
 * @returns JSON 字符串
 */
export function createJSONPaginationResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): string {
  return JSON.stringify(paginatedResponse(data, total, page, pageSize));
}
