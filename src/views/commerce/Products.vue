<script setup lang="ts">
/**
 * 商品管理页 - 使用 useMutation 重构
 *
 * @description 基于 JSON 配置化的商品管理页面
 */
import { TTable, TForm, TModal, TDataCard, TPageHeader, TBatchActions, TStatusBadge, TEmptyState } from '@/components/business'
import type { TableSchema, TTableExpose } from '@/components/business'
import type { FormSchema } from '@/components/business'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Product } from '@/types'
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

const { mutate: deleteProduct } = useMutation({
  mutationFn: (id: string) => productsApi.deleteProduct(id),
  onSuccess: () => fetchData()
})

const { mutate: batchDeleteProducts } = useMutation({
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

function handleClearSelection(): void {
  selectedRowKeys.value = []
  selectedRows.value = []
  tableRef.value?.clearSelection()
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
    <TPageHeader
      title="商品管理"
      subtitle="管理商品库存和价格"
      :actions="[
        { text: '添加商品', type: 'primary', iconName: 'Plus', onClick: () => isAddDialogOpen = true }
      ]"
    />

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
      <TDataCard
        v-for="stat in statisticsCards"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :icon="stat.icon"
        :color="stat.color"
        size="sm"
      />
    </div>

    <!-- 搜索表单 -->
    <div class="bg-muted/40 border border-border/50 rounded-xl px-3 py-3">
      <TForm v-model="searchFormData" :schema="searchSchema" />
    </div>

    <!-- 商品表格 -->
    <Card class="bg-muted/40 border border-border/50 rounded-xl">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <CardTitle class="text-base font-semibold">商品列表</CardTitle>
            <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              共 {{ tableData.length }} 件
            </span>
          </div>
          <div class="flex items-center gap-4">
            <TBatchActions
              :count="selectedRowKeys.length"
              item-name="商品"
              class-name="border-0 bg-transparent shadow-none px-0 py-0"
              :actions="[
                {
                  text: '批量删除',
                  type: 'danger',
                  confirm: true,
                  confirmText: '确定要删除选中的商品吗？此操作不可恢复。',
                  onClick: handleBatchDelete
                }
              ]"
              @clear="handleClearSelection"
            />
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
            <TStatusBadge
              :status="(slotProps as TableSlotProps).text"
              :status-map="{
                [PRODUCT_STATUS.ACTIVE]: { text: '在售', color: 'success' },
                [PRODUCT_STATUS.LOW_STOCK]: { text: '库存不足', color: 'warning' },
                [PRODUCT_STATUS.OUT_OF_STOCK]: { text: '缺货', color: 'error' }
              }"
            />
          </template>

          <!-- 空状态 -->
          <template #emptyText>
            <TEmptyState
              type="data"
              title="暂无商品数据"
              description="开始添加您的第一个商品吧"
              :action="{ text: '添加商品', type: 'primary', iconName: 'Plus', onClick: () => isAddDialogOpen = true }"
            />
          </template>
        </TTable>
      </CardContent>
    </Card>
  </div>
</template>
