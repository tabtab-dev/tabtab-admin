/**
 * useSearchForm - 搜索表单逻辑 Composable
 *
 * @description 提取搜索表单的折叠、布局、字段过滤等逻辑
 * @example
 *   const {
 *     isCollapsed,
 *     isSearchMode,
 *     searchConfig,
 *     visibleFields,
 *     searchVisibleFields,
 *     hasMoreFields,
 *     shouldShowInline,
 *     toggleCollapse
 *   } = useSearchForm(schema, formData)
 */
import { computed, ref, type Ref, type ComputedRef } from 'vue'
import type { FormSchema, FormField, SearchConfig } from '../types'

/**
 * 搜索表单文本配置
 */
export interface SearchFormLocale {
  /** 搜索按钮文本 */
  searchText: string
  /** 重置按钮文本 */
  resetText: string
  /** 展开按钮文本 */
  expandButtonText: string
  /** 收起按钮文本 */
  collapseButtonText: string
}

/**
 * 搜索表单 Composable 参数
 */
interface UseSearchFormOptions {
  /** 表单 Schema */
  schema: FormSchema
  /** 表单数据 */
  formData: Ref<Record<string, any>> | Record<string, any>
  /** 初始折叠状态 */
  initialCollapsed?: boolean
  /** 国际化文本 - 支持 Ref 或 ComputedRef */
  locale?: Ref<SearchFormLocale> | ComputedRef<SearchFormLocale>
}

/**
 * 搜索表单 Composable 返回值
 */
interface UseSearchFormReturn {
  /** 是否折叠 */
  isCollapsed: Ref<boolean>
  /** 是否为搜索模式 */
  isSearchMode: Ref<boolean>
  /** 搜索配置 */
  searchConfig: Ref<Required<SearchConfig>>
  /** 可见字段列表（已过滤 hidden 和 dependencies） */
  visibleFields: Ref<FormField[]>
  /** 搜索表单显示的字段（考虑折叠） */
  searchVisibleFields: Ref<FormField[]>
  /** 是否有更多字段被折叠 */
  hasMoreFields: Ref<boolean>
  /** 是否使用同行布局 */
  shouldShowInline: Ref<boolean>
  /** 切换折叠状态 */
  toggleCollapse: () => void
  /** 展开 */
  expand: () => void
  /** 收起 */
  collapse: () => void
}

/**
 * 默认搜索配置
 * 使用英文作为默认值（antdv 默认语言）
 */
const defaultSearchConfig: Required<SearchConfig> = {
  enabled: false,
  collapsed: false,
  collapseThreshold: 3,
  showCollapseButton: true,
  collapseButtonText: 'Collapse',
  expandButtonText: 'Expand',
  columns: 3,
  gutter: 16,
  searchText: 'Search',
  resetText: 'Reset',
  showReset: true,
  onSearch: undefined as any,
  onReset: undefined as any
}

/**
 * 搜索表单逻辑
 * @param options - 配置选项
 * @returns 搜索表单状态和方法
 */
export function useSearchForm(options: UseSearchFormOptions): UseSearchFormReturn {
  const { schema, formData, initialCollapsed, locale } = options

  /**
   * 获取表单数据的响应式引用
   */
  const formDataRef = computed(() => {
    return formData instanceof Object && 'value' in formData
      ? formData.value
      : formData
  })

  /**
   * 折叠状态
   */
  const isCollapsed = ref(initialCollapsed ?? schema.searchConfig?.collapsed ?? false)

  /**
   * 是否为搜索模式
   */
  const isSearchMode = computed(() => schema.searchConfig?.enabled === true)

  /**
   * 合并后的搜索配置
   * 优先使用传入的 locale，然后是 schema 配置，最后是默认值
   */
  const searchConfig = computed<Required<SearchConfig>>(() => {
    const localeConfig: Partial<SearchConfig> = locale ? {
      searchText: locale.value.searchText,
      resetText: locale.value.resetText,
      expandButtonText: locale.value.expandButtonText,
      collapseButtonText: locale.value.collapseButtonText,
    } : {}

    return {
      ...defaultSearchConfig,
      ...schema.searchConfig,
      ...localeConfig
    }
  })

  /**
   * 获取字段是否隐藏
   * @param field - 字段配置
   * @returns 是否隐藏
   */
  function getFieldHidden(field: FormField): boolean {
    if (typeof field.hidden === 'function') {
      return field.hidden(formDataRef.value)
    }
    return field.hidden ?? false
  }

  /**
   * 检查字段依赖条件
   * @param field - 字段配置
   * @returns 是否满足依赖条件
   */
  function checkDependency(field: FormField): boolean {
    if (!field.dependencies) return true

    const { field: depField, condition } = field.dependencies
    const depValue = formDataRef.value[depField as string]
    return condition(depValue, formDataRef.value)
  }

  /**
   * 可见字段列表（过滤 hidden 和 dependencies）
   */
  const visibleFields = computed<FormField[]>(() => {
    return schema.fields.filter((field) => {
      // 隐藏字段
      if (getFieldHidden(field)) return false

      // 依赖联动
      if (!checkDependency(field)) return false

      return true
    })
  })

  /**
   * 搜索表单显示的字段（考虑折叠状态）
   */
  const searchVisibleFields = computed<FormField[]>(() => {
    const fields = visibleFields.value

    // 非搜索模式或未折叠，显示所有字段
    if (!isSearchMode.value || !isCollapsed.value) {
      return fields
    }

    // 折叠模式下只显示阈值数量的字段
    return fields.slice(0, searchConfig.value.collapseThreshold)
  })

  /**
   * 是否有更多字段被折叠
   */
  const hasMoreFields = computed(() => {
    return visibleFields.value.length > searchConfig.value.collapseThreshold
  })

  /**
   * 是否使用同行布局
   * @description 当字段数量 <= 阈值 + 1 时，使用同行布局
   */
  const shouldShowInline = computed(() => {
    return visibleFields.value.length <= searchConfig.value.collapseThreshold + 1
  })

  /**
   * 切换折叠状态
   */
  function toggleCollapse(): void {
    isCollapsed.value = !isCollapsed.value
  }

  /**
   * 展开
   */
  function expand(): void {
    isCollapsed.value = false
  }

  /**
   * 收起
   */
  function collapse(): void {
    isCollapsed.value = true
  }

  return {
    isCollapsed,
    isSearchMode,
    searchConfig,
    visibleFields,
    searchVisibleFields,
    hasMoreFields,
    shouldShowInline,
    toggleCollapse,
    expand,
    collapse
  }
}

export default useSearchForm
