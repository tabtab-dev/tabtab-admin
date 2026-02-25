import path from 'node:path'
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      tailwindcss(),
      Components({
        dirs: ['src/components/ui', 'src/components/business', 'src/components/layout'],
        resolvers: [AntdvNextResolver()],
        dts: 'src/components.d.ts',
      }),
      AutoImport({
        imports: ['vue', 'vue-router', 'vue-i18n', '@vueuse/core'],
        dts: 'src/auto-imports.d.ts',
      }),
    ],

    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
  }
})
