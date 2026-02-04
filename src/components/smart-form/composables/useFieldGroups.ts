import { computed, type Ref } from 'vue'
import type { GenericObject } from 'vee-validate'
import type { FormFieldConfig, FormFieldGroup } from '../types'

/**
 * 字段分组结果
 */
export interface FieldGroupResult<T extends GenericObject = GenericObject> {
  /** 分组信息 */
  group?: FormFieldGroup<T>
  /** 分组中的字段 */
  fields: FormFieldConfig<T>[]
}

/**
 * 使用字段分组
 * @param fields - 字段配置数组
 * @param groups - 分组配置数组
 * @returns 分组后的字段列表
 */
export function useFieldGroups<T extends GenericObject>(
  fields: Ref<FormFieldConfig<T>[]>,
  groups: Ref<FormFieldGroup<T>[] | undefined>
) {
  const groupedFields = computed<FieldGroupResult<T>[]>(() => {
    if (!groups.value || groups.value.length === 0) {
      return [{ fields: fields.value }]
    }

    const result: FieldGroupResult<T>[] = []
    const groupedFieldNames = new Set<string>()

    // 处理已分组的字段
    groups.value.forEach((group) => {
      const groupFields = fields.value.filter((f) =>
        group.fields.includes(f.name)
      )
      if (groupFields.length > 0) {
        result.push({ group, fields: groupFields })
        groupFields.forEach((f) => groupedFieldNames.add(String(f.name)))
      }
    })

    // 处理未分组的字段
    const ungroupedFields = fields.value.filter(
      (f) => !groupedFieldNames.has(String(f.name))
    )
    if (ungroupedFields.length > 0) {
      result.unshift({ fields: ungroupedFields })
    }

    return result
  })

  /**
   * 检查字段是否属于某个分组
   */
  const getFieldGroup = (fieldName: string): FormFieldGroup<T> | undefined => {
    return groups.value?.find((g) => g.fields.includes(fieldName))
  }

  return {
    groupedFields,
    getFieldGroup,
  }
}
