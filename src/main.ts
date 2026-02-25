import { createApp } from 'vue'
import { useAuthFlow } from '@/composables/useAuthFlow'
import { registerPermissionDirectives } from '@/directives/permission'
import { startMockService, USE_MOCK } from '@/mocks'
import { createStore } from '@/stores'
import { useLocaleStore } from '@/stores/global/locale'
import { useThemeStore } from '@/stores/global/theme'
import App from './App.vue'
import { i18n } from './i18n'
import router from './router'
import './assets/css/app.css'
import './assets/css/theme.css'

/**
 * 初始化应用
 * 按顺序初始化：Pinia -> Router -> I18n -> 各 Store
 */
async function initApp() {
  if (USE_MOCK) {
    const mswStarted = await startMockService({ quiet: false })
    if (!mswStarted) {
      console.warn('[App] Failed to start MSW, continuing without mock')
    }
  }

  const app = createApp(App)
  const pinia = createStore()

  app.use(pinia)
  app.use(router)
  app.use(i18n)

  registerPermissionDirectives(app)

  const { initialize: initAuth, isAuthenticated } = useAuthFlow()
  const themeStore = useThemeStore()
  const localeStore = useLocaleStore()

  const authResult = await initAuth()

  themeStore.init()

  if (!authResult.success && isAuthenticated.value) {
    console.warn('Auth initialization failed:', authResult.error)
  }

  const localeSuccess = await localeStore.init()
  if (!localeSuccess) {
    console.warn('Failed to initialize locale, continuing with fallback')
  }

  app.mount('#app')
}

initApp().catch((error) => {
  console.error('Failed to initialize app:', error)
})
