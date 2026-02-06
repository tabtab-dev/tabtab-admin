import path from "node:path";
import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { AntdvNextResolver } from "@antdv-next/auto-import-resolver";
import Components from "unplugin-vue-components/vite";
import { mockPlugin } from "./mock/server";

/**
 * Vite 配置
 * @see https://vite.dev/config/
 */
export default defineConfig(({ mode }: ConfigEnv) => {
  /**
   * 加载环境变量
   * @param mode - 当前模式 (development/production)
   * @param envDir - 环境变量文件所在目录
   * @param prefixes - 环境变量前缀，'' 表示加载所有变量
   */
  const env = loadEnv(mode, process.cwd(), "");

  /**
   * 是否启用 Mock 服务
   * 仅在开发环境且 VITE_USE_MOCK=true 时启用
   */
  const isMockEnabled = mode === "development" && env.VITE_USE_MOCK === "true";

  return {
    plugins: [
      vue(),
      tailwindcss(),
      Components({
        resolvers: [AntdvNextResolver()],
      }),
      // 条件加载 Mock 插件
      isMockEnabled && mockPlugin(),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
