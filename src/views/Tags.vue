<script setup lang="ts">
/**
 * 标签管理页
 */
import { ref, computed } from 'vue'
import { TTable } from '@/components/data/TTable'
import { TForm } from '@/components/data/TForm'
import { TModal } from '@/components/data/TModal'
import type { TableSchema } from '@/components/data/TTable'
import type { FormSchema } from '@/components/data/TForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useCategoriesStore, type Tag as TagType } from '@/stores/business/categories'
import {
  Plus,
  Tag,
  Package
} from 'lucide-vue-next'

const categoriesStore = useCategoriesStore()

// 统计标签
const statistics = computed(() => {
  const stats = categoriesStore.tagStatistics
  return [
    { title: '标签总数', value: stats.total, icon: Tag, color: 'text-blue-500' },
    { title: '关联商品', value: stats.totalProducts, icon: Package, color: 'text-green-500' }
  ]
})

// 搜索表单
const searchFormData = ref({
  keyword: ''
})

const searchSchema: FormSchema = {
  layout: 'inline',
  fields: [
    {
      name: 'keyword',
      type: 'input',
      label: '',
      placeholder: '搜索标签名称...',
      className: 'w-[240px]'
    }
  ],
  searchConfig: {
    enabled: true,
    collapsed: false,
    showCollapseButton: false,
    searchText: '搜索',
    resetText: '重置',
    showReset: true,
    onSearch: (values) => {
      categoriesStore.searchQuery = values.keyword || ''
    },
    onReset: () => {
      categoriesStore.searchQuery = ''
    }
  }
}

// 表格配置

const tableSchema = computed<TableSchema>(() => ({
  columns: [
    {
      title: '标签名称',
      dataIndex: 'name',
      width: 180,
      slot: 'name'
    },
    {
      title: '颜色',
      dataIndex: 'color',
      width: 120,
      slot: 'color'
    },
    {
      title: '关联商品',
      dataIndex: 'productCount',
      width: 120,
      sorter: true
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 150
    }
  ],
  pagination: {
    pageSize: 10,
    show: true,
    showSizeChanger: true
  },
  rowSelection: {
    type: 'checkbox',
    show: true
  },
  actions: [
    {
      text: '编辑',
      type: 'primary',
      onClick: (record) => handleEdit(record as unknown as TagType)
    },
    {
      text: '删除',
      type: 'danger',
      confirm: true,
      confirmText: '确定要删除该标签吗？',
      onClick: (record) => handleDelete((record as unknown as TagType).id)
    }
  ],
  actionWidth: 150,
  actionFixed: 'right'
}))

const tableData = computed(() => {
  return categoriesStore.filteredTags.map(t => ({ ...t, key: t.id }))
})

// 新增/编辑
const isAddOpen = ref(false)
const isEditOpen = ref(false)
const editingItem = ref<TagType | null>(null)

const addFormData = ref({
  name: '',
  color: '#1890ff'
})

const editFormData = ref({
  id: '',
  name: '',
  color: '#1890ff'
})

const addSchema: FormSchema = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'name',
      type: 'input',
      label: '标签名称',
      placeholder: '请输入标签名称',
      rules: [{ required: true, message: '标签名称不能为空' }]
    },
    {
      name: 'color',
      type: 'input',
      label: '标签颜色',
      placeholder: '请输入颜色值，如 #1890ff'
    }
  ],
  actions: {
    showSubmit: true,
    showReset: true,
    submitText: '添加标签',
    resetText: '取消',
    align: 'right',
    onReset: () => { isAddOpen.value = false }
  }
}

const editSchema: FormSchema = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'name',
      type: 'input',
      label: '标签名称',
      placeholder: '请输入标签名称',
      rules: [{ required: true, message: '标签名称不能为空' }]
    },
    {
      name: 'color',
      type: 'input',
      label: '标签颜色',
      placeholder: '请输入颜色值'
    }
  ],
  actions: {
    showSubmit: true,
    showReset: true,
    submitText: '保存修改',
    resetText: '取消',
    align: 'right',
    onReset: () => { isEditOpen.value = false }
  }
}

// 事件处理
function handleAddSubmit(values: Record<string, any>) {
  categoriesStore.addTag({
    name: values.name,
    color: values.color,
    productCount: 0
  })
  isAddOpen.value = false
  addFormData.value = { name: '', color: '#1890ff' }
}

function handleEdit(item: TagType) {
  editingItem.value = item
  editFormData.value = {
    id: item.id,
    name: item.name,
    color: item.color
  }
  isEditOpen.value = true
}

function handleEditSubmit(values: Record<string, any>) {
  if (editingItem.value) {
    categoriesStore.updateTag(editingItem.value.id, {
      name: values.name,
      color: values.color
    })
    isEditOpen.value = false
    editingItem.value = null
  }
}

function handleDelete(id: string) {
  categoriesStore.deleteTag(id)
}

const selectedRowKeys = ref<(string | number)[]>([])
function handleSelectChange(keys: (string | number)[]) {
  selectedRowKeys.value = keys
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">标签管理</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">管理商品标签和标记</p>
      </div>
      <Button class="gap-2" @click="isAddOpen = true">
        <Plus class="h-4 w-4" />
        添加标签
      </Button>
    </div>

    <!-- 新增弹窗 -->
    <TModal v-model:open="isAddOpen" title="添加标签" width="480" :footer="null">
      <TForm v-model="addFormData" :schema="addSchema" @submit="handleAddSubmit" />
    </TModal>

    <!-- 编辑弹窗 -->
    <TModal v-model:open="isEditOpen" title="编辑标签" width="480" :footer="null">
      <TForm v-if="editingItem" v-model="editFormData" :schema="editSchema" @submit="handleEditSubmit" />
    </TModal>

    <!-- 统计标签 -->
    <div class="flex flex-wrap gap-3">
      <div
        v-for="stat in statistics"
        :key="stat.title"
        class="flex items-center gap-3 px-4 py-2.5 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
      >
        <component :is="stat.icon" :class="['h-4 w-4', stat.color]" />
        <div class="flex items-baseline gap-2">
          <span class="text-lg font-semibold">{{ stat.value }}</span>
          <span class="text-xs text-muted-foreground">{{ stat.title }}</span>
        </div>
      </div>
    </div>

    <!-- 搜索表单 -->
    <div class="bg-muted/30 rounded-lg p-4">
      <div class="flex flex-col lg:flex-row lg:items-center gap-4">
        <div class="flex-1">
          <TForm v-model="searchFormData" :schema="searchSchema" />
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <Card class="border-0 shadow-sm">
      <CardHeader class="pb-4">
        <div class="flex items-center gap-3">
          <CardTitle class="text-base font-semibold">标签列表</CardTitle>
          <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            共 {{ tableData.length }} 个
          </span>
        </div>
      </CardHeader>
      <CardContent class="pt-0">
        <TTable
          ref="tableRef"
          v-model:data="tableData"
          :schema="tableSchema"
          @select-change="handleSelectChange"
        >
          <!-- 名称列 -->
          <template #name="slotProps">
            <div class="flex items-center gap-2">
              <Tag class="h-4 w-4" :style="{ color: (slotProps as any).record.color }" />
              <span class="font-medium">{{ (slotProps as any).text }}</span>
            </div>
          </template>

          <!-- 颜色列 -->
          <template #color="slotProps">
            <div class="flex items-center gap-2">
              <div 
                class="w-6 h-6 rounded border"
                :style="{ backgroundColor: (slotProps as any).text }"
              />
              <span class="text-xs text-muted-foreground">{{ (slotProps as any).text }}</span>
            </div>
          </template>

          <!-- 空状态 -->
          <template #emptyText>
            <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Tag class="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p class="text-base font-medium mb-1">暂无标签数据</p>
              <p class="text-sm text-muted-foreground mb-4">开始添加您的第一个标签吧</p>
              <Button size="sm" @click="isAddOpen = true">
                <Plus class="h-4 w-4 mr-1" />
                添加标签
              </Button>
            </div>
          </template>
        </TTable>
      </CardContent>
    </Card>
  </div>
</template>
