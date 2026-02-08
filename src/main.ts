import { createApp } from 'vue';
import { createStore } from '@/stores';
import router from './router';
import { useAuthFlow } from '@/composables/useAuthFlow';
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
  const pinia = createStore();

  app.use(pinia);
  app.use(router);
  app.use(i18n);

  // 使用 useAuthFlow 替代直接使用 authStore，统一处理认证流程
  const { initialize: initAuth, isAuthenticated } = useAuthFlow();
  const themeStore = useThemeStore();
  const localeStore = useLocaleStore();

  // 并行初始化认证和主题
  const authResult = await initAuth();
  themeStore.init();

  if (!authResult.success && isAuthenticated.value) {
    console.warn('Auth initialization failed:', authResult.error);
  }

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
