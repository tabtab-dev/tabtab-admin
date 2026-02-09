import { createApp } from 'vue';
import { createStore } from '@/stores';
import router from './router';
import { useAuthFlow } from '@/composables/useAuthFlow';
import { useThemeStore } from '@/stores/global/theme';
import { useLocaleStore } from '@/stores/global/locale';
import { i18n } from './i18n';
import { registerPermissionDirectives } from '@/directives/permission';
import './assets/css/app.css';
import './assets/css/theme.css';
import App from './App.vue';

/**
 * 初始化应用
 * 按顺序初始化：Pinia -> Router -> I18n -> 各 Store
 */
async function initApp() {
  console.log('[App] Starting initialization...');

  const app = createApp(App);
  const pinia = createStore();

  app.use(pinia);
  console.log('[App] Pinia installed');

  app.use(router);
  console.log('[App] Router installed');

  app.use(i18n);
  console.log('[App] i18n installed');

  // 注册权限指令
  registerPermissionDirectives(app);
  console.log('[App] Permission directives registered');

  // 使用 useAuthFlow 替代直接使用 authStore，统一处理认证流程
  const { initialize: initAuth, isAuthenticated } = useAuthFlow();
  const themeStore = useThemeStore();
  const localeStore = useLocaleStore();

  console.log('[App] Before auth initialization, isAuthenticated:', isAuthenticated.value);

  // 并行初始化认证和主题
  const authResult = await initAuth();
  console.log('[App] Auth initialization result:', authResult);
  console.log('[App] After auth initialization, isAuthenticated:', isAuthenticated.value);

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
  console.log('[App] Mounted');
}

// 启动应用
initApp().catch((error) => {
  console.error('Failed to initialize app:', error);
});
