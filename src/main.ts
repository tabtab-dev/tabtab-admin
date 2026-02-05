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

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);

const authStore = useAuthStore();
const themeStore = useThemeStore();
const localeStore = useLocaleStore();

authStore.initialize().then(() => {
  themeStore.init();
  localeStore.init();

  app.mount('#app');
});
