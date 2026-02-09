import { defineStore, acceptHMRUpdate } from 'pinia';
import {
  setLocale as setI18nLocale,
  getCurrentLocale,
  toggleLocale as toggleI18nLocale,
  updateDocumentTitle,
  initI18n,
  type SupportedLocale
} from '@/i18n';
import { localeNames, supportedLocales, preloadLocaleMessages } from '@/i18n/locales';
import { STORAGE_KEYS } from '@/constants/common';

export const useLocaleStore = defineStore(
  'locale',
  () => {
    const currentLocale = ref<SupportedLocale>(getCurrentLocale());
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const currentLocaleName = computed(() => localeNames[currentLocale.value]);

    const availableLocales = computed(() =>
      supportedLocales.map(locale => ({
        value: locale,
        label: localeNames[locale],
      }))
    );

    const isZhCN = computed(() => currentLocale.value === 'zh-CN');
    const isEnUS = computed(() => currentLocale.value === 'en-US');

    /**
     * 执行异步操作并处理状态
     */
    async function executeAsync<T>(
      operation: () => Promise<T>,
      errorMessage: string
    ): Promise<T | null> {
      isLoading.value = true;
      error.value = null;

      try {
        return await operation();
      } catch (err) {
        error.value = err instanceof Error ? err.message : errorMessage;
        console.error(errorMessage, err);
        return null;
      } finally {
        isLoading.value = false;
      }
    }

    /**
     * 更新语言后的通用处理
     */
    function afterLocaleChange(locale: SupportedLocale): void {
      currentLocale.value = locale;
      updateDocumentTitle();
      preloadLocaleMessages(locale === 'zh-CN' ? 'en-US' : 'zh-CN');
    }

    /**
     * 设置语言
     */
    async function changeLocale(locale: SupportedLocale): Promise<boolean> {
      if (locale === currentLocale.value) return true;

      const result = await executeAsync(async () => {
        const success = await setI18nLocale(locale);
        if (success) afterLocaleChange(locale);
        return success;
      }, '切换语言失败');

      return result ?? false;
    }

    /**
     * 切换语言
     */
    async function toggleLocale(): Promise<SupportedLocale | null> {
      return await executeAsync(async () => {
        const newLocale = await toggleI18nLocale();
        if (newLocale) afterLocaleChange(newLocale);
        return newLocale;
      }, '切换语言失败');
    }

    /**
     * 初始化语言设置
     */
    async function init(): Promise<boolean> {
      const result = await executeAsync(async () => {
        const success = await initI18n();
        if (success) {
          currentLocale.value = getCurrentLocale();
          document.documentElement.setAttribute('lang', currentLocale.value);
          updateDocumentTitle();
          preloadLocaleMessages(currentLocale.value === 'zh-CN' ? 'en-US' : 'zh-CN');
        }
        return success;
      }, '初始化语言设置失败');

      return result ?? false;
    }

    function clearError() {
      error.value = null;
    }

    return {
      currentLocale,
      isLoading,
      error,
      currentLocaleName,
      availableLocales,
      isZhCN,
      isEnUS,
      changeLocale,
      toggleLocale,
      init,
      clearError,
    };
  },
  {
    persist: {
      key: STORAGE_KEYS.LOCALE,
      pick: ['currentLocale'],
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLocaleStore, import.meta.hot));
}
