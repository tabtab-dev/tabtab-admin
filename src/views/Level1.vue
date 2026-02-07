<script setup lang="ts">
/**
 * 一级分类页
 */
import { ref, computed, onMounted } from 'vue'
import { TTable } from '@/components/business/TTable'
import { TForm } from '@/components/business/TForm'
import { TModal } from '@/components/business/TModal'
import type { TableSchema } from '@/components/business/TTable'
import type { FormSchema } from '@/components/business/TForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Category } from '@/types/models'
import { categoriesApi } from '@/api'
import { useTableData } from '@/composables'
import {
  Plus,
  FolderTree,
  CheckCircle,
  XCircle,
  Package
} from 'lucide-vue-next'

const {
  data: categories,
  loading,
  searchQuery,
  filters,
  filteredData,
  paginatedData,
  total,
  statistics,
  fetchData,
} = useTableData<Category>({
  apiCall: () => categoriesApi.getCategories(),
  filterFn: (items, query, filterValues) => {
    let result = items.filter(c => c.level === 1)

    if (query) {
      const lowerQuery = query.toLowerCase()
      result = result.filter(
        category =>
          category.name.toLowerCase().includes(lowerQuery) ||
          category.code.toLowerCase().includes(lowerQuery)
      )
    }

    if (filterValues.status) {
      result = result.filter(category => category.status === filterValues.status)
    }

    return result
  },
  statisticsFn: (items) => {
    const level1Categories = items.filter(c => c.level === 1)
    const total = level1Categories.length
    const active = level1Categories.filter(c => c.status === 'active').length
    const inactive = level1Categories.filter(c => c.status === 'inactive').length
    const totalProducts = level1Categories.reduce((sum, c) => sum + c.productCount, 0)

    return {
      total,
      active,
      inactive,
      totalProducts,
    }
  },
})

// 统计标签
const statisticsCards = computed(() => {
  const stats = statistics.value || {}
  return [
    { title: '一级分类', value: stats.total || 0, icon: FolderTree, color: 'text-blue-500' },
    { title: '已启用', value: stats.active || 0, icon: CheckCircle, color: 'text-green-500' },
    { title: '已禁用', value: stats.inactive || 0, icon: XCircle, color: 'text-red-500' },
    { title: '关联商品', value: stats.totalProducts || 0, icon: Package, color: 'text-purple-500' }
  ]
})

// 搜索表单
const searchFormData = ref({
  keyword: '',
  status: ''
})

const searchSchema: FormSchema = {
  layout: 'inline',
  fields: [
    {
      name: 'keyword',
      type: 'input',
      label: '',
      placeholder: '搜索分类名称...',
      className: 'w-[200px]'
    },
    {
      name: 'status',
      type: 'select',
      label: '',
      placeholder: '全部状态',
      options: [
        { label: '全部状态', value: '' },
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ],
      className: 'w-[140px]'
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
      searchQuery.value = values.keyword || ''
      filters.value = {
        status: values.status,
      }
    },
    onReset: () => {
      searchQuery.value = ''
      filters.value = {}
    }
  }
}

// 表格配置

const tableSchema = computed<TableSchema>(() => ({
  columns: [
    {
      title: '分类名称',
      dataIndex: 'name',
      width: 180,
      slot: 'name'
    },
    {
      title: '分类编码',
      dataIndex: 'code',
      width: 150
    },
    {
      title: '商品数量',
      dataIndex: 'productCount',
      width: 100,
      sorter: true
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      sorter: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      slot: 'status'
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
      onClick: (record) => handleEdit(record as unknown as Category)
    },
    {
      text: '删除',
      type: 'danger',
      confirm: true,
      confirmText: '确定要删除该分类吗？',
      onClick: (record) => handleDelete((record as unknown as Category).id)
    }
  ],
  actionWidth: 150,
  actionFixed: 'right'
}))

const tableData = computed(() => {
  return paginatedData.value.map(c => ({ ...c, key: c.id }))
})

// 新增/编辑
const isAddOpen = ref(false)
const isEditOpen = ref(false)
const editingItem = ref<Category | null>(null)

const addFormData = ref({
  name: '',
  code: '',
  sort: 0,
  status: 'active' as 'active' | 'inactive',
  description: ''
})

const editFormData = ref({
  id: '',
  name: '',
  code: '',
  sort: 0,
  status: 'active' as 'active' | 'inactive',
  description: ''
})

const addSchema: FormSchema = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'name',
      type: 'input',
      label: '分类名称',
      placeholder: '请输入分类名称',
      rules: [{ required: true, message: '分类名称不能为空' }]
    },
    {
      name: 'code',
      type: 'input',
      label: '分类编码',
      placeholder: '请输入分类编码',
      rules: [{ required: true, message: '分类编码不能为空' }]
    },
    {
      name: 'sort',
      type: 'number',
      label: '排序',
      placeholder: '请输入排序号'
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    },
    {
      name: 'description',
      type: 'textarea',
      label: '描述',
      placeholder: '请输入描述（可选）'
    }
  ],
  actions: {
    showSubmit: true,
    showReset: true,
    submitText: '添加分类',
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
      label: '分类名称',
      placeholder: '请输入分类名称',
      rules: [{ required: true, message: '分类名称不能为空' }]
    },
    {
      name: 'code',
      type: 'input',
      label: '分类编码',
      placeholder: '请输入分类编码',
      rules: [{ required: true, message: '分类编码不能为空' }]
    },
    {
      name: 'sort',
      type: 'number',
      label: '排序',
      placeholder: '请输入排序号'
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    },
    {
      name: 'description',
      type: 'textarea',
      label: '描述',
      placeholder: '请输入描述（可选）'
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
async function handleAddSubmit(values: Record<string, any>) {
  await categoriesApi.createCategory({
    name: values.name,
    code: values.code,
    level: 1,
    sort: Number(values.sort) || 0,
    status: values.status,
    productCount: 0,
    description: values.description
  })
  isAddOpen.value = false
  addFormData.value = { name: '', code: '', sort: 0, status: 'active', description: '' }
  await fetchData()
}

function handleEdit(item: Category) {
  editingItem.value = item
  editFormData.value = {
    id: item.id,
    name: item.name,
    code: item.code,
    sort: item.sort,
    status: item.status,
    description: item.description || ''
  }
  isEditOpen.value = true
}

function handleEditSubmit(values: Record<string, any>) {
  if (editingItem.value) {
    categoriesApi.updateCategory(editingItem.value.id, {
      name: values.name,
      code: values.code,
      sort: Number(values.sort),
      status: values.status,
      description: values.description
    })
    isEditOpen.value = false
    editingItem.value = null
    fetchData()
  }
}

async function handleDelete(id: string) {
  await categoriesApi.deleteCategory(id)
  await fetchData()
}

const selectedRowKeys = ref<(string | number)[]>([])
function handleSelectChange(keys: (string | number)[]) {
  selectedRowKeys.value = keys
}

async function handleBatchDelete() {
  if (selectedRowKeys.value.length === 0) {
    alert('请先选择要删除的分类')
    return
  }
  if (confirm(`确定要删除选中的 ${selectedRowKeys.value.length} 个分类吗？`)) {
    await categoriesApi.batchDeleteCategories(selectedRowKeys.value.map(String))
    await fetchData()
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">一级分类</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">管理商品一级分类</p>
      </div>
      <Button class="gap-2" @click="isAddOpen = true">
        <Plus class="h-4 w-4" />
        添加一级分类
      </Button>
    </div>

    <!-- 新增弹窗 -->
    <TModal v-model:open="isAddOpen" title="添加一级分类" width="560" :footer="null">
      <TForm v-model="addFormData" :schema="addSchema" @submit="handleAddSubmit" />
    </TModal>

    <!-- 编辑弹窗 -->
    <TModal v-model:open="isEditOpen" title="编辑一级分类" width="560" :footer="null">
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
        <div v-if="selectedRowKeys.length > 0" class="flex items-center gap-2 lg:border-l lg:pl-4">
          <span class="text-sm text-muted-foreground">已选 {{ selectedRowKeys.length }} 项</span>
          <Button
            variant="outline"
            size="sm"
            class="h-8 text-xs text-destructive hover:text-destructive"
            @click="handleBatchDelete"
          >
            批量删除
          </Button>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <Card class="border-0 shadow-sm">
      <CardHeader class="pb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <CardTitle class="text-base font-semibold">一级分类列表</CardTitle>
            <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              共 {{ tableData.length }} 个
            </span>
          </div>
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
              <FolderTree class="h-4 w-4 text-blue-500" />
              <span class="font-medium">{{ (slotProps as any).text }}</span>
            </div>
          </template>

          <!-- 状态列 -->
          <template #status="slotProps">
            <Badge
              :class="{
                'bg-green-500/10 text-green-500 border-green-500/20': (slotProps as any).text === 'active',
                'bg-gray-500/10 text-gray-500 border-gray-500/20': (slotProps as any).text === 'inactive'
              }"
              variant="outline"
            >
              {{ (slotProps as any).text === 'active' ? '启用' : '禁用' }}
            </Badge>
          </template>

          <!-- 空状态 -->
          <template #emptyText>
            <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FolderTree class="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p class="text-base font-medium mb-1">暂无一级分类</p>
              <p class="text-sm text-muted-foreground mb-4">开始添加您的第一个一级分类吧</p>
              <Button size="sm" @click="isAddOpen = true">
                <Plus class="h-4 w-4 mr-1" />
                添加分类
              </Button>
            </div>
          </template>
        </TTable>
      </CardContent>
    </Card>
  </div>
</template>
