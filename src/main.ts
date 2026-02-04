import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import { useAuthStore } from './stores/auth';
import { useThemeStore } from './stores/theme';
import './assets/css/app.css';
import './assets/css/theme.css';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const authStore = useAuthStore();
const themeStore = useThemeStore();

authStore.initialize();
themeStore.init();

app.mount('#app');
