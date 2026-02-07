import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';
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

/**
 * 语言 Store
 * 管理应用的语言状态，与 vue-i18n 集成
 * 支持异步语言包加载
 */
export const useLocaleStore = defineStore(
  'locale',
  () => {
    /**
     * 当前语言
     */
    const currentLocale = ref<SupportedLocale>(getCurrentLocale());

    /**
     * 是否正在加载语言包
     */
    const isLoading = ref(false);

    /**
     * 加载错误信息
     */
    const error = ref<string | null>(null);

    /**
     * 当前语言显示名称
     */
    const currentLocaleName = computed(() => localeNames[currentLocale.value]);

    /**
     * 支持的语言列表
     */
    const availableLocales = computed(() =>
      supportedLocales.map(locale => ({
        value: locale,
        label: localeNames[locale],
      }))
    );

    /**
     * 是否为中文
     */
    const isZhCN = computed(() => currentLocale.value === 'zh-CN');

    /**
     * 是否为英文
     */
    const isEnUS = computed(() => currentLocale.value === 'en-US');

    /**
     * 设置语言
     * @param locale 目标语言
     * @returns 是否设置成功
     */
    const changeLocale = async (locale: SupportedLocale): Promise<boolean> => {
      if (locale === currentLocale.value) {
        return true;
      }

      isLoading.value = true;
      error.value = null;

      try {
        const success = await setI18nLocale(locale);

        if (success) {
          currentLocale.value = locale;
          updateDocumentTitle();

          // 预加载另一种语言（空闲时）
          const otherLocale: SupportedLocale = locale === 'zh-CN' ? 'en-US' : 'zh-CN';
          preloadLocaleMessages(otherLocale);

          return true;
        } else {
          error.value = '切换语言失败';
          return false;
        }
      } catch (err) {
        error.value = err instanceof Error ? err.message : '切换语言失败';
        console.error('Failed to change locale:', err);
        return false;
      } finally {
        isLoading.value = false;
      }
    };

    /**
     * 切换语言（中英文切换）
     * @returns 切换后的语言代码，失败返回 null
     */
    const toggleLocale = async (): Promise<SupportedLocale | null> => {
      isLoading.value = true;
      error.value = null;

      try {
        const newLocale = await toggleI18nLocale();

        if (newLocale) {
          currentLocale.value = newLocale;
          updateDocumentTitle();
          return newLocale;
        } else {
          error.value = '切换语言失败';
          return null;
        }
      } catch (err) {
        error.value = err instanceof Error ? err.message : '切换语言失败';
        console.error('Failed to toggle locale:', err);
        return null;
      } finally {
        isLoading.value = false;
      }
    };

    /**
     * 初始化语言设置
     * 用于应用启动时同步 store 和 i18n 状态
     * @returns 是否初始化成功
     */
    const init = async (): Promise<boolean> => {
      isLoading.value = true;
      error.value = null;

      try {
        const success = await initI18n();

        if (success) {
          currentLocale.value = getCurrentLocale();
          // 更新 HTML lang 属性
          document.documentElement.setAttribute('lang', currentLocale.value);
          // 初始化文档标题
          updateDocumentTitle();

          // 预加载另一种语言
          const otherLocale: SupportedLocale = currentLocale.value === 'zh-CN' ? 'en-US' : 'zh-CN';
          preloadLocaleMessages(otherLocale);

          return true;
        } else {
          error.value = '初始化语言设置失败';
          return false;
        }
      } catch (err) {
        error.value = err instanceof Error ? err.message : '初始化语言设置失败';
        console.error('Failed to initialize locale:', err);
        return false;
      } finally {
        isLoading.value = false;
      }
    };

    /**
     * 清除错误状态
     */
    const clearError = () => {
      error.value = null;
    };

    return {
      // State
      currentLocale,
      isLoading,
      error,
      // Getters
      currentLocaleName,
      availableLocales,
      isZhCN,
      isEnUS,
      // Actions
      changeLocale,
      toggleLocale,
      init,
      clearError,
    };
  },
  {
    persist: {
      key: 'app-locale',
      paths: ['currentLocale'],
      // 使用自定义序列化，确保与 i18n 的 localStorage 同步
      beforeRestore: (context) => {
        // 从 i18n 的存储中读取语言设置
        try {
          const stored = localStorage.getItem('app-locale');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.currentLocale) {
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

// 热更新支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLocaleStore, import.meta.hot));
}
