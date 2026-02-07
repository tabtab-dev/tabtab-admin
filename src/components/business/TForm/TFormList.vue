<script setup lang="ts">
/**
 * TFormList - 动态表单列表组件
 *
 * @description 支持动态添加/删除的表单列表
 * @example
 *   <TFormList
 *     :field="field"
 *     :form-data="formData"
 *     :list-config="field.listConfig"
 *   />
 */
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-vue-next'
import TFormItem from './TFormItem.vue'
import type { FormField, ListFieldConfig } from './types'

/**
 * i18n
 */
const { t } = useI18n()

/**
 * 组件 Props 定义
 */
interface Props {
  /** 字段配置 */
  field: FormField
  /** 表单数据 */
  formData: Record<string, any>
  /** 列表配置 */
  listConfig: ListFieldConfig
}

const props = defineProps<Props>()

/**
 * 列表项唯一标识计数器
 */
let idCounter = 0

/**
 * 生成唯一标识
 * @returns 唯一标识字符串
 */
function generateId(): string {
  return `list-item-${Date.now()}-${++idCounter}`
}

/**
 * 列表项标识映射
 */
const itemIds = ref<string[]>([])

/**
 * 计算列表数据
 */
const listData = computed<any[]>({
  get: () => props.formData[props.field.name as string] || [],
  set: (val) => {
    props.formData[props.field.name as string] = val
  }
})

/**
 * 获取列表项的 key
 * @param index - 索引
 * @returns 唯一 key
 */
function getItemKey(index: number): string {
  if (!itemIds.value[index]) {
    itemIds.value[index] = generateId()
  }
  return itemIds.value[index]
}

/**
 * 添加列表项
 */
function addItem(): void {
  const newItem: Record<string, any> = { __id: generateId() }
  // 初始化默认值
  props.listConfig.fields.forEach((f) => {
    if (f.defaultValue !== undefined) {
      newItem[f.name as string] = f.defaultValue
    }
  })
  itemIds.value.push(newItem.__id)
  listData.value = [...listData.value, newItem]
}

/**
 * 删除列表项
 * @param index - 索引
 */
function removeItem(index: number): void {
  const newList = [...listData.value]
  newList.splice(index, 1)
  itemIds.value.splice(index, 1)
  listData.value = newList
}

/**
 * 判断是否可添加
 */
const canAdd = computed(() => {
  if (!props.listConfig.showAdd && props.listConfig.showAdd !== undefined) return false
  if (props.listConfig.max && listData.value.length >= props.listConfig.max) return false
  return true
})

/**
 * 判断是否可删除
 */
const canRemove = computed(() => {
  if (!props.listConfig.showRemove && props.listConfig.showRemove !== undefined) return false
  if (props.listConfig.min && listData.value.length <= props.listConfig.min) return false
  return true
})

/**
 * 初始化列表数据
 */
function initListData(): void {
  if (!listData.value || listData.value.length === 0) {
    const min = props.listConfig.min || 1
    const initialList: any[] = []
    const initialIds: string[] = []
    for (let i = 0; i < min; i++) {
      const id = generateId()
      const item: Record<string, any> = { __id: id }
      props.listConfig.fields.forEach((f) => {
        if (f.defaultValue !== undefined) {
          item[f.name as string] = f.defaultValue
        }
      })
      initialList.push(item)
      initialIds.push(id)
    }
    itemIds.value = initialIds
    listData.value = initialList
  }
}

/**
 * 初始化
 */
initListData()
</script>

<template>
  <div class="t-form-list space-y-4">
    <!-- 列表项 -->
    <div
      v-for="(item, index) in listData"
      :key="getItemKey(index)"
      class="t-form-list-item p-4 border border-border rounded-lg bg-muted/50"
    >
      <div class="flex items-start gap-4">
        <!-- 字段列表 -->
        <div class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TFormItem
            v-for="subField in listConfig.fields"
            :key="String(subField.name)"
            :field="{
              ...subField,
              name: [field.name, index, subField.name] as any
            }"
            :form-data="formData"
          />
        </div>

        <!-- 删除按钮 -->
        <Button
          v-if="canRemove"
          type="button"
          variant="ghost"
          size="icon"
          class="shrink-0 text-destructive hover:text-destructive"
          @click="removeItem(index)"
        >
          <Trash2 class="h-4 w-4" />
        </Button>
      </div>
    </div>

    <!-- 添加按钮 -->
    <Button
      v-if="canAdd"
      type="button"
      variant="outline"
      class="w-full"
      @click="addItem"
    >
      <Plus class="h-4 w-4 mr-2" />
      {{ listConfig.addText || t('common.add') }}
    </Button>
  </div>
</template>
