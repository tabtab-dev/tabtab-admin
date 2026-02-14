import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { AntdvNextResolver } from "@antdv-next/auto-import-resolver";
import { viteMockServe } from "vite-plugin-mock";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      vue(),
      tailwindcss(),
      Components({
        dirs: ["src/components/ui", "src/components/business", "src/components/layout"],
        resolvers: [AntdvNextResolver()],
        dts: "src/components.d.ts",
      }),
      AutoImport({
        imports: ["vue", "vue-router", "vue-i18n", "@vueuse/core"],
        dts: "src/auto-imports.d.ts",
      }),
      viteMockServe({
        mockPath: 'mock',
        enable: true,
      }),
    ],

    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
  };
});
