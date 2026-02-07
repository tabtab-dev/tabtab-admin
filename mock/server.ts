/**
 * Mock 服务器配置
 * @description 使用 Vite 插件方式提供 Mock 数据，按模块组织路由
 */
import type { ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { menuRoutes } from './routes/menu';
import { productsRoutes } from './routes/products';
import { ordersRoutes } from './routes/orders';
import { categoriesRoutes } from './routes/categories';

/**
 * 合并所有模块路由
 */
const allRoutes: Record<string, (req: IncomingMessage & { body?: any }, res: ServerResponse) => void> = {
  ...authRoutes,
  ...userRoutes,
  ...menuRoutes,
  ...productsRoutes,
  ...ordersRoutes,
  ...categoriesRoutes,
};

/**
 * 查找路由处理器
 * @param method - HTTP 方法
 * @param url - 请求 URL（Vite 中间件会去掉 /mock-api 前缀）
 * @returns 路由处理器或 undefined
 */
function findRouteHandler(method: string, url: string) {
  // 移除查询参数
  const pathname = url.split('?')[0];

  // Vite 中间件已经去掉了 /mock-api 前缀
  // 所以实际收到的 url 是 /auth/login 而不是 /mock-api/auth/login
  // 需要在 pathname 前加上 /mock-api 来匹配路由配置
  const fullPath = `/mock-api${pathname}`;

  // 1. 精确匹配
  const exactKey = `${method} ${fullPath}`;
  if (allRoutes[exactKey]) {
    return allRoutes[exactKey];
  }

  // 2. 动态路由匹配（如 /orders/:id）
  for (const [key, handler] of Object.entries(allRoutes)) {
    const [routeMethod, routePath] = key.split(' ');
    if (routeMethod !== method) continue;

    // 将路由配置中的 :param 转换为正则表达式
    const routePattern = routePath.replace(/:([^/]+)/g, '([^/]+)');
    const regex = new RegExp(`^${routePattern}$`);

    if (regex.test(fullPath)) {
      return handler;
    }
  }

  // 3. 前缀匹配（用于以 / 结尾的路由）
  for (const [key, handler] of Object.entries(allRoutes)) {
    const [routeMethod, routePath] = key.split(' ');
    if (routeMethod !== method) continue;

    // 如果路由以 / 结尾，进行前缀匹配
    if (routePath.endsWith('/')) {
      if (fullPath.startsWith(routePath)) {
        return handler;
      }
    }
  }

  return undefined;
}

/**
 * Vite Mock 插件
 */
export function mockPlugin() {
  return {
    name: 'vite-plugin-mock',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/mock-api', (req, res, next) => {
        // 设置 CORS 头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Content-Type', 'application/json');

        // 处理预检请求
        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        // 解析请求体
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            if (body) {
              (req as any).body = JSON.parse(body);
            }
          } catch {
            (req as any).body = {};
          }

          // 查找并执行对应的路由处理函数
          const handler = findRouteHandler(req.method || 'GET', req.url || '/');

          if (handler) {
            handler(req as any, res);
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({
              code: 404,
              data: null,
              message: '接口不存在',
            }));
          }
        });
      });
    },
  };
}
