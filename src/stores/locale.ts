import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';
import { 
  i18n, 
  setLocale, 
  getCurrentLocale, 
  toggleLocale as toggleI18nLocale,
  updateDocumentTitle,
  type SupportedLocale 
} from '@/i18n';
import { localeNames, supportedLocales } from '@/i18n/locales';

/**
 * 语言 Store
 * 管理应用的语言状态，与 vue-i18n 集成
 */
export const useLocaleStore = defineStore('locale', () => {
  /**
   * 当前语言
   */
  const currentLocale = ref<SupportedLocale>(getCurrentLocale());

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
   */
  const changeLocale = (locale: SupportedLocale) => {
    if (locale !== currentLocale.value) {
      setLocale(locale);
      currentLocale.value = locale;
      // 更新文档标题
      updateDocumentTitle();
    }
  };

  /**
   * 切换语言（中英文切换）
   */
  const toggleLocale = () => {
    const newLocale = toggleI18nLocale();
    currentLocale.value = newLocale;
    // 更新文档标题
    updateDocumentTitle();
    return newLocale;
  };

  /**
   * 初始化语言设置
   * 用于应用启动时同步 store 和 i18n 状态
   */
  const init = () => {
    currentLocale.value = getCurrentLocale();
    // 更新 HTML lang 属性
    document.documentElement.setAttribute('lang', currentLocale.value);
    // 初始化文档标题
    updateDocumentTitle();
  };

  return {
    // State
    currentLocale,
    // Getters
    currentLocaleName,
    availableLocales,
    isZhCN,
    isEnUS,
    // Actions
    changeLocale,
    toggleLocale,
    init,
  };
});

// 热更新支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLocaleStore, import.meta.hot));
}
