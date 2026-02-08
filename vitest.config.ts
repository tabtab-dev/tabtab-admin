import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

export default defineConfig({
  plugins: [vue()],
  test: {
    // 使用 jsdom 作为 DOM 环境
    environment: 'jsdom',
    // 全局导入（类似于 Jest 的 setupFiles）
    globals: true,
    // 测试文件匹配模式
    include: ['src/**/*.{test,spec}.{js,ts}'],
    // 测试环境设置文件
    setupFiles: ['./src/test/setup.ts'],
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/**/*.d.ts',
        'src/**/index.ts',
        'src/main.ts',
        'src/App.vue',
        'mock/',
        '**/*.config.{js,ts}',
        'src/test/',
      ],
    },
    // 模拟全局变量
    env: {
      VITE_USE_MOCK: 'true',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
