import path from "node:path";
import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { AntdvNextResolver } from "@antdv-next/auto-import-resolver";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
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
        resolvers: [
          AntdvNextResolver(),
          // 自动导入图标组件，前缀为 Icon
          IconsResolver({
            prefix: 'Icon',
            enabledCollections: ['lucide'],
          }),
        ],
      }),
      // 图标插件配置
      Icons({
        autoInstall: true,
      }),
      // 自动导入配置
      AutoImport({
        imports: [
          // 自动导入 Vue 相关函数
          "vue",
          "vue-router",
          "vue-i18n",
          // 自动导入 @vueuse/core
          "@vueuse/core",
        ],
        // 自动生成类型声明文件
        dts: "src/auto-imports.d.ts",
        // 启用 ESLint 支持
        eslintrc: {
          enabled: true,
          filepath: "./.eslintrc-auto-import.json",
        },
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
