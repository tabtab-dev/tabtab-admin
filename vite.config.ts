import path from "node:path";
import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { AntdvNextResolver } from "@antdv-next/auto-import-resolver";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { visualizer } from "rollup-plugin-visualizer";
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

  /**
   * 是否生成构建分析报告
   */
  const isAnalyze = env.ANALYZE === "true";

  return {
    plugins: [
      vue(),
      tailwindcss(),
      Components({
        // 自动扫描组件目录
        dirs: [
          'src/components/ui',      // UI 组件自动扫描
          'src/components/business', // 业务组件自动扫描
          'src/components/layout',   // 布局组件自动扫描
        ],
        deep: true, // 深度扫描子目录
        directoryAsNamespace: true, // 使用目录作为命名空间
        resolvers: [
          AntdvNextResolver(),
          // 自动导入图标组件，前缀为 Icon
          IconsResolver({
            prefix: 'Icon',
            enabledCollections: ['lucide'],
          }),
        ],
        // 生成类型声明文件
        dts: 'src/components.d.ts',
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
      // 构建分析插件
      isAnalyze && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'dist/stats.html',
      }),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    // 构建优化
    build: {
      // 代码分割配置
      rollupOptions: {
        output: {
          // 手动分块
          manualChunks: {
            // Vue 核心库
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            // UI 组件库
            'ui-vendor': ['reka-ui', '@tanstack/vue-table'],
            // 工具库
            'utils-vendor': ['@vueuse/core', 'dayjs', 'zod'],
            // 图表库（如果使用了）
            // 'charts-vendor': ['echarts'],
          },
          // 入口文件分块
          entryFileNames: 'js/[name]-[hash].js',
          // 代码分块
          chunkFileNames: 'js/[name]-[hash].js',
          // 资源文件
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name || '';
            if (info.endsWith('.css')) {
              return 'css/[name]-[hash][extname]';
            }
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(info)) {
              return 'img/[name]-[hash][extname]';
            }
            if (/\.(woff2?|eot|ttf|otf)$/.test(info)) {
              return 'fonts/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      // 压缩配置
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
          // 移除死代码
          dead_code: true,
          // 移除 console
          pure_funcs: mode === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
        },
        format: {
          // 移除注释
          comments: mode === 'production',
        },
      },
      // 启用 CSS 代码分割
      cssCodeSplit: true,
      // 启用 source map（生产环境关闭）
      sourcemap: mode !== 'production',
      // 设置 chunk 大小警告阈值
      chunkSizeWarningLimit: 1000,
    },

    // 优化依赖预构建
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'reka-ui',
        '@vueuse/core',
        'dayjs',
        'zod',
        'lucide-vue-next',
      ],
      // 排除某些依赖
      exclude: [],
    },

    // 开发服务器配置
    server: {
      // 启用 HMR
      hmr: true,
      // 优化依赖预构建
      preTransformRequests: true,
    },

    // 预览服务器配置
    preview: {
      port: 4173,
      host: true,
    },
  };
});
