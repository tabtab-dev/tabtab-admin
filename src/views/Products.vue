<script setup lang="ts">
/**
 * 商品管理页 - 使用 useMutation 重构
 *
 * @description 基于 JSON 配置化的商品管理页面
 */
import { ref, computed, watch } from 'vue'
import { TTable } from '@/components/business/TTable'
import { TForm } from '@/components/business/TForm'
import { TModal } from '@/components/business/TModal'
import type { TableSchema, TTableExpose } from '@/components/business/TTable'
import type { FormSchema } from '@/components/business/TForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/types/models'
import { productsApi } from '@/api'
import { useTableData, useMutation } from '@/composables'
import {
  Plus,
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Layers
} from 'lucide-vue-next'
import { Space, Avatar } from 'antdv-next'
import { PRODUCT_STATUS, STATUS_CONFIG, BUTTON_VARIANT } from '@/constants'

// ==================== 类型定义 ====================
interface ProductFormData {
  id?: string
  name: string
  category: string
  price: number
  stock: number
  description: string
}

interface TableSlotProps {
  record: Product
  text: any
  index: number
}

// ==================== 数据管理 ====================
const {
  data: products,
  loading,
  searchQuery,
  filters,
  currentPage,
  pageSize,
  total,
  statistics,
  fetchData,
  goToPage,
  setPageSize,
  addData,
  updateData,
  removeData,
  batchRemoveData,
} = useTableData<Product>({
  // API 调用函数
  apiCall: async (params) => {
    const res = await productsApi.getProducts(params)
    return res || { list: [], total: 0, page: 1, pageSize: 10 }
  },
  // 构建 API 请求参数
  apiCallParams: (ctx) => ({
    page: ctx.page,
    pageSize: ctx.pageSize,
    search: ctx.searchQuery,
    category: ctx.filters.category,
    status: ctx.filters.status,
  }),
  // 统计数据计算
  statisticsFn: (items) => {
    const total = items.length
    const active = items.filter(p => p.status === PRODUCT_STATUS.ACTIVE).length
    const lowStock = items.filter(p => p.status === PRODUCT_STATUS.LOW_STOCK).length
    const outOfStock = items.filter(p => p.status === PRODUCT_STATUS.OUT_OF_STOCK).length
    const totalSales = items.reduce((sum, p) => sum + (p.sales || 0), 0)
    const totalStock = items.reduce((sum, p) => sum + (p.stock || 0), 0)

    return {
      total,
      active,
      lowStock,
      outOfStock,
      totalSales,
      totalStock,
    }
  }
})

  const { mutate: createProduct, loading: creating } = useMutation({
    mutationFn: (values: Record<string, any>) => {
      const stock = Number(values.stock)
      return productsApi.createProduct({
        name: values.name,
        category: values.category,
        price: Number(values.price),
        stock,
        status: stock === 0 ? PRODUCT_STATUS.OUT_OF_STOCK : stock < 10 ? PRODUCT_STATUS.LOW_STOCK : PRODUCT_STATUS.ACTIVE,
        sales: 0,
        description: values.description
      })
    },
  onSuccess: () => {
    isAddDialogOpen.value = false
    addFormData.value = {
      name: '',
      category: '',
      price: 0,
      stock: 0,
      description: ''
    }
    fetchData()
  }
})

const { mutate: updateProduct, loading: updating } = useMutation({
  mutationFn: ({ id, values }: { id: string; values: Record<string, any> }) =>
    productsApi.updateProduct(id, {
      name: values.name,
      category: values.category,
      price: Number(values.price),
      stock: Number(values.stock),
      description: values.description
    }),
  onSuccess: () => {
    isEditDialogOpen.value = false
    editingProduct.value = null
    fetchData()
  }
})

const { mutate: deleteProduct, loading: deleting } = useMutation({
  mutationFn: (id: string) => productsApi.deleteProduct(id),
  onSuccess: () => fetchData()
})

const { mutate: batchDeleteProducts, loading: batchDeleting } = useMutation({
  mutationFn: (ids: string[]) => productsApi.batchDeleteProducts(ids),
  onSuccess: () => {
    tableRef.value?.clearSelection()
    fetchData()
  }
})

// ==================== 统计数据 ====================
const statisticsCards = computed(() => {
  const stats = statistics.value || {}
  return [
    {
      title: '总商品',
      value: stats.total || 0,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: '在售',
      value: stats.active || 0,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: '库存不足',
      value: stats.lowStock || 0,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: '缺货',
      value: stats.outOfStock || 0,
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    }
  ]
})

// ==================== 搜索表单 ====================
const searchFormData = ref({
  keyword: '',
  category: '',
  status: ''
})

const searchSchema: FormSchema = {
  layout: 'inline',
  fields: [
    {
      name: 'keyword',
      type: 'input',
      label: '',
      placeholder: '搜索商品名称、SKU...',
      className: 'w-[200px]'
    },
    {
      name: 'category',
      type: 'select',
      label: '',
      placeholder: '全部分类',
      options: [
        { label: '全部分类', value: '' },
        { label: '电子产品', value: '电子产品' },
        { label: '配件', value: '配件' },
        { label: '音频设备', value: '音频设备' }
      ],
      className: 'w-[140px]'
    },
    {
      name: 'status',
      type: 'select',
      label: '',
      placeholder: '全部状态',
      options: [
        { label: '全部状态', value: '' },
        { label: STATUS_CONFIG.PRODUCT.ACTIVE.text, value: STATUS_CONFIG.PRODUCT.ACTIVE.value },
        { label: STATUS_CONFIG.PRODUCT.LOW_STOCK.text, value: STATUS_CONFIG.PRODUCT.LOW_STOCK.value },
        { label: STATUS_CONFIG.PRODUCT.OUT_OF_STOCK.text, value: STATUS_CONFIG.PRODUCT.OUT_OF_STOCK.value }
      ],
      className: 'w-[140px]'
    }
  ],
  searchConfig: {
    enabled: true,
    collapsed: false,
    collapseThreshold: 3,
    showCollapseButton: false,
    searchText: '搜索',
    resetText: '重置',
    showReset: true,
    onSearch: (values) => {
      searchQuery.value = values.keyword || ''
      filters.value = {
        category: values.category,
        status: values.status,
      }
    },
    onReset: () => {
      searchQuery.value = ''
      filters.value = {}
    }
  }
}

// ==================== 表格配置 ====================
const tableRef = ref<TTableExpose>()

// 表格 Schema
const tableSchema = computed<TableSchema>(() => ({
  columns: [
    {
      title: '商品信息',
      dataIndex: 'name',
      width: 250,
      slot: 'product'
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 120,
      filters: [
        { text: '电子产品', value: '电子产品' },
        { text: '配件', value: '配件' },
        { text: '音频设备', value: '音频设备' }
      ]
    },
    {
      title: '价格',
      dataIndex: 'price',
      width: 100,
      slot: 'price',
      sorter: true
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 100,
      slot: 'stock',
      sorter: true
    },
    {
      title: '销量',
      dataIndex: 'sales',
      width: 100,
      sorter: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      slot: 'status',
      filters: [
        { text: STATUS_CONFIG.PRODUCT.ACTIVE.text, value: STATUS_CONFIG.PRODUCT.ACTIVE.value },
        { text: STATUS_CONFIG.PRODUCT.LOW_STOCK.text, value: STATUS_CONFIG.PRODUCT.LOW_STOCK.value },
        { text: STATUS_CONFIG.PRODUCT.OUT_OF_STOCK.text, value: STATUS_CONFIG.PRODUCT.OUT_OF_STOCK.value }
      ]
    }
  ],
  pagination: {
    pageSize: 10,
    show: true,
    showSizeChanger: true,
    showQuickJumper: true
  },
  rowSelection: {
    type: 'checkbox',
    show: true
  },
  actions: [
    {
      text: '编辑',
      type: 'primary',
      onClick: (record) => handleEditProduct(record as unknown as Product)
    },
    {
      text: '删除',
      type: 'danger',
      confirm: true,
      confirmText: '确定要删除该商品吗？此操作不可恢复。',
      onClick: (record) => handleDeleteProduct((record as unknown as Product).id)
    }
  ],
  actionWidth: 150,
  actionFixed: 'right'
}))

// 表格数据
const tableData = computed(() => {
  return products.value.map(product => ({
    ...product,
    key: product.id
  }))
})

// ==================== 新增/编辑表单 ====================
const isAddDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const editingProduct = ref<Product | null>(null)

// 新增表单数据
const addFormData = ref<ProductFormData>({
  name: '',
  category: '',
  price: 0,
  stock: 0,
  description: ''
})

// 编辑表单数据
const editFormData = ref<ProductFormData>({
  id: '',
  name: '',
  category: '',
  price: 0,
  stock: 0,
  description: ''
})

// 共享表单 Schema
const productFormSchema: FormSchema = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'name',
      type: 'input',
      label: '商品名称',
      placeholder: '请输入商品名称',
      rules: [
        { required: true, message: '商品名称不能为空' },
        { min: 2, message: '商品名称至少2个字符' }
      ]
    },
    {
      name: 'category',
      type: 'select',
      label: '分类',
      placeholder: '请选择分类',
      options: [
        { label: '电子产品', value: '电子产品' },
        { label: '配件', value: '配件' },
        { label: '音频设备', value: '音频设备' }
      ],
      rules: [{ required: true, message: '请选择分类' }]
    },
    {
      name: 'price',
      type: 'number',
      label: '价格',
      placeholder: '请输入价格',
      rules: [
        { required: true, message: '价格不能为空' },
        { type: 'number', min: 0, message: '价格不能为负数' }
      ]
    },
    {
      name: 'stock',
      type: 'number',
      label: '库存',
      placeholder: '请输入库存数量',
      rules: [
        { required: true, message: '库存不能为空' },
        { type: 'number', min: 0, message: '库存不能为负数' }
      ]
    },
    {
      name: 'description',
      type: 'textarea',
      label: '商品描述',
      placeholder: '请输入商品描述（可选）'
    }
  ]
}

// 新增表单 Schema
const addSchema: FormSchema = {
  ...productFormSchema,
  actions: {
    showSubmit: true,
    showReset: true,
    submitText: '添加商品',
    resetText: '取消',
    align: 'right',
    onReset: () => {
      isAddDialogOpen.value = false
    }
  }
}

// 编辑表单 Schema
const editSchema: FormSchema = {
  ...productFormSchema,
  actions: {
    showSubmit: true,
    showReset: true,
    submitText: '保存修改',
    resetText: '取消',
    align: 'right',
    onReset: () => {
      isEditDialogOpen.value = false
    }
  }
}

// ==================== 事件处理 ====================

function handleEditProduct(product: Product): void {
  editingProduct.value = product
  editFormData.value = {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    stock: product.stock,
    description: product.description || ''
  }
  isEditDialogOpen.value = true
}

function handleAddSubmit(values: Record<string, any>): void {
  createProduct(values)
}

function handleEditSubmit(values: Record<string, any>): void {
  if (editingProduct.value) {
    updateProduct({ id: editingProduct.value.id, values })
  }
}

function handleDeleteProduct(id: string): void {
  deleteProduct(id)
}

const selectedRowKeys = ref<(string | number)[]>([])
const selectedRows = ref<Product[]>([])

function handleSelectChange(keys: (string | number)[], rows: any[]): void {
  selectedRowKeys.value = keys
  selectedRows.value = rows as Product[]
}

function handleBatchDelete(): void {
  if (selectedRowKeys.value.length === 0) {
    alert('请先选择要删除的商品')
    return
  }
  if (confirm(`确定要删除选中的 ${selectedRowKeys.value.length} 个商品吗？`)) {
    batchDeleteProducts(selectedRowKeys.value.map(String))
  }
}

/**
 * 处理表格分页、排序、筛选变化
 */
function handleTableChange(pagination: any): void {
  // 更新当前页码
  if (pagination.current !== undefined) {
    goToPage(pagination.current)
  }
  // 更新每页数量
  if (pagination.pageSize !== undefined) {
    setPageSize(pagination.pageSize)
  }
}

</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">商品管理</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">管理商品库存和价格</p>
      </div>
      <Button class="gap-2" @click="isAddDialogOpen = true">
        <Plus class="h-4 w-4" />
        添加商品
      </Button>
    </div>

    <!-- 新增商品弹窗 -->
    <TModal
      v-model:open="isAddDialogOpen"
      title="添加新商品"
      width="560"
      :footer="null"
    >
      <TForm
        v-model="addFormData"
        :schema="addSchema"
        @submit="handleAddSubmit"
      />
    </TModal>

    <!-- 编辑商品弹窗 -->
    <TModal
      v-model:open="isEditDialogOpen"
      title="编辑商品"
      width="560"
      :footer="null"
    >
      <TForm
        v-if="editingProduct"
        v-model="editFormData"
        :schema="editSchema"
        @submit="handleEditSubmit"
      />
    </TModal>

    <!-- 统计卡片 -->
    <div class="flex flex-wrap gap-3">
      <div
        v-for="stat in statisticsCards"
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

    <!-- 商品表格 -->
    <Card class="border-0 shadow-sm">
      <CardHeader class="pb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <CardTitle class="text-base font-semibold">商品列表</CardTitle>
            <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              共 {{ tableData.length }} 件
            </span>
          </div>
          <div class="flex items-center gap-4 text-sm text-muted-foreground">
            <div class="flex items-center gap-1">
              <TrendingUp class="h-4 w-4" />
              <span>总销量: {{ statistics.value?.totalSales || 0 }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Layers class="h-4 w-4" />
              <span>总库存: {{ statistics.value?.totalStock || 0 }}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent class="pt-0">
        <TTable
          ref="tableRef"
          v-model:data="tableData"
          :schema="tableSchema"
          @select-change="handleSelectChange"
          @change="handleTableChange"
        >
          <!-- 自定义商品列 -->
          <template #product="slotProps">
            <Space>
              <Avatar
                :style="{ backgroundColor: '#f0f0f0', color: '#666' }"
                shape="square"
                :size="40"
              >
                <Package class="h-5 w-5" />
              </Avatar>
              <Space direction="vertical" size="small">
                <span class="font-medium">{{ (slotProps as TableSlotProps).record.name }}</span>
                <span class="text-xs text-muted-foreground font-mono">{{ (slotProps as TableSlotProps).record.sku }}</span>
              </Space>
            </Space>
          </template>

          <!-- 自定义价格列 -->
          <template #price="slotProps">
            <span class="font-medium text-primary">¥{{ Number((slotProps as TableSlotProps).text).toFixed(2) }}</span>
          </template>

          <!-- 自定义库存列 -->
          <template #stock="slotProps">
            <Space>
              <span :class="[
                'font-medium',
                (slotProps as TableSlotProps).record.stock === 0 ? 'text-red-500' :
                (slotProps as TableSlotProps).record.stock < 10 ? 'text-yellow-500' : 'text-green-500'
              ]">
                {{ (slotProps as TableSlotProps).text }}
              </span>
              <TrendingUp
                v-if="(slotProps as TableSlotProps).record.stock < 10"
                class="h-4 w-4 text-red-500"
              />
            </Space>
          </template>

          <!-- 自定义状态列 -->
          <template #status="slotProps">
            <Badge
              :class="{
                'bg-green-500/10 text-green-500 border-green-500/20': (slotProps as TableSlotProps).text === PRODUCT_STATUS.ACTIVE,
                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20': (slotProps as TableSlotProps).text === PRODUCT_STATUS.LOW_STOCK,
                'bg-red-500/10 text-red-500 border-red-500/20': (slotProps as TableSlotProps).text === PRODUCT_STATUS.OUT_OF_STOCK
              }"
              variant="outline"
            >
              {{ STATUS_CONFIG.PRODUCT[(slotProps as TableSlotProps).text as keyof typeof STATUS_CONFIG.PRODUCT]?.text || (slotProps as TableSlotProps).text }}
            </Badge>
          </template>

          <!-- 空状态 -->
          <template #emptyText>
            <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Package class="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p class="text-base font-medium mb-1">暂无商品数据</p>
              <p class="text-sm text-muted-foreground mb-4">开始添加您的第一个商品吧</p>
              <Button size="sm" @click="isAddDialogOpen = true">
                <Plus class="h-4 w-4 mr-1" />
                添加商品
              </Button>
            </div>
          </template>
        </TTable>
      </CardContent>
    </Card>
  </div>
</template>
