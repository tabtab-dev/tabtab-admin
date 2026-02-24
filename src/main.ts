import { createApp } from 'vue';
import { createStore } from '@/stores';
import router from './router';
import { useAuthFlow } from '@/composables/useAuthFlow';
import { useThemeStore } from '@/stores/global/theme';
import { useLocaleStore } from '@/stores/global/locale';
import { i18n } from './i18n';
import { registerPermissionDirectives } from '@/directives/permission';
import { USE_MOCK, startMockService } from '@/mocks';
import './assets/css/app.css';
import './assets/css/theme.css';
import App from './App.vue';

/**
 * 初始化应用
 * 按顺序初始化：Pinia -> Router -> I18n -> 各 Store
 */
async function initApp() {
  console.log('[App] Starting initialization...');
  console.log('[App] USE_MOCK:', USE_MOCK);

  if (USE_MOCK) {
    console.log('[App] Starting MSW Mock Service...');
    const mswStarted = await startMockService({ quiet: false });
    if (!mswStarted) {
      console.warn('[App] Failed to start MSW, continuing without mock');
    }
  }

  const app = createApp(App);
  const pinia = createStore();

  app.use(pinia);
  console.log('[App] Pinia installed');

  app.use(router);
  console.log('[App] Router installed');

  app.use(i18n);
  console.log('[App] i18n installed');

  registerPermissionDirectives(app);
  console.log('[App] Permission directives registered');

  const { initialize: initAuth, isAuthenticated } = useAuthFlow();
  const themeStore = useThemeStore();
  const localeStore = useLocaleStore();

  console.log('[App] Before auth initialization, isAuthenticated:', isAuthenticated.value);

  const authResult = await initAuth();
  console.log('[App] Auth initialization result:', authResult);
  console.log('[App] After auth initialization, isAuthenticated:', isAuthenticated.value);

  themeStore.init();

  if (!authResult.success && isAuthenticated.value) {
    console.warn('Auth initialization failed:', authResult.error);
  }

  const localeSuccess = await localeStore.init();
  if (!localeSuccess) {
    console.warn('Failed to initialize locale, continuing with fallback');
  }

  app.mount('#app');
  console.log('[App] Mounted');
}

initApp().catch((error) => {
  console.error('Failed to initialize app:', error);
});
