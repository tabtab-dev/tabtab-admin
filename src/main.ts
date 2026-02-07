import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import { useAuthStore } from '@/stores/global/auth';
import { useThemeStore } from '@/stores/global/theme';
import { useLocaleStore } from '@/stores/global/locale';
import { i18n } from './i18n';
import './assets/css/app.css';
import './assets/css/theme.css';
import App from './App.vue';

/**
 * 初始化应用
 * 按顺序初始化：Pinia -> Router -> I18n -> 各 Store
 */
async function initApp() {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);
  app.use(router);
  app.use(i18n);

  const authStore = useAuthStore();
  const themeStore = useThemeStore();
  const localeStore = useLocaleStore();

  // 并行初始化认证和主题
  await authStore.initialize();
  themeStore.init();

  // 初始化语言（异步加载语言包）
  const localeSuccess = await localeStore.init();
  if (!localeSuccess) {
    console.warn('Failed to initialize locale, continuing with fallback');
  }

  app.mount('#app');
}

// 启动应用
initApp().catch((error) => {
  console.error('Failed to initialize app:', error);
});
