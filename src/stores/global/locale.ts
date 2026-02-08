import { defineStore, acceptHMRUpdate } from 'pinia';
import {
  i18n,
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
     * 通用异步操作包装器
     */
    const withLoading = async <T>(
      operation: () => Promise<T>,
      errorMessage: string
    ): Promise<T | null> => {
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
    };

    /**
     * 设置语言
     */
    const changeLocale = async (locale: SupportedLocale): Promise<boolean> => {
      if (locale === currentLocale.value) {
        return true;
      }

      const result = await withLoading(async () => {
        const success = await setI18nLocale(locale);
        if (success) {
          currentLocale.value = locale;
          updateDocumentTitle();
          preloadLocaleMessages(locale === 'zh-CN' ? 'en-US' : 'zh-CN');
        }
        return success;
      }, '切换语言失败');

      return result ?? false;
    };

    /**
     * 切换语言
     */
    const toggleLocale = async (): Promise<SupportedLocale | null> => {
      return await withLoading(async () => {
        const newLocale = await toggleI18nLocale();
        if (newLocale) {
          currentLocale.value = newLocale;
          updateDocumentTitle();
        }
        return newLocale;
      }, '切换语言失败');
    };

    /**
     * 初始化语言设置
     */
    const init = async (): Promise<boolean> => {
      const result = await withLoading(async () => {
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
    };

    const clearError = () => {
      error.value = null;
    };

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
      beforeRestore: (context) => {
        try {
          const stored = localStorage.getItem(STORAGE_KEYS.LOCALE);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed?.currentLocale) {
              context.store.currentLocale = parsed.currentLocale;
            }
          }
        } catch {
          // 忽略解析错误
        }
      },
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLocaleStore, import.meta.hot));
}
