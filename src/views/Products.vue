<script setup lang="ts">
/**
 * 商品管理页 - 使用 TTable + TForm 重构
 *
 * @description 基于 JSON 配置化的商品管理页面
 */
import { ref, computed } from 'vue'
import { TTable } from '@/components/data/TTable'
import { TForm } from '@/components/data/TForm'
import { TModal } from '@/components/data/TModal'
import type { TableSchema, TTableExpose } from '@/components/data/TTable'
import type { FormSchema } from '@/components/data/TForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useProductsStore, type Product } from '@/stores/business/products'
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

// ==================== Store ====================
const productsStore = useProductsStore()

// ==================== 统计数据 ====================
const statistics = computed(() => {
  const stats = productsStore.statistics
  return [
    {
      title: '总商品',
      value: stats.total,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: '在售',
      value: stats.active,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: '库存不足',
      value: stats.lowStock,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: '缺货',
      value: stats.outOfStock,
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
        { label: '在售', value: 'active' },
        { label: '库存不足', value: 'low-stock' },
        { label: '缺货', value: 'out-of-stock' }
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
      productsStore.searchQuery = values.keyword || ''
      productsStore.categoryFilter = values.category || ''
      productsStore.statusFilter = values.status || ''
    },
    onReset: () => {
      productsStore.searchQuery = ''
      productsStore.categoryFilter = ''
      productsStore.statusFilter = ''
    }
  }
}

// ==================== 表格配置 ====================
const tableRef = ref<TTableExpose>()

// 状态配置
const statusConfig: Record<string, { color: string; text: string }> = {
  active: { color: 'success', text: '在售' },
  'low-stock': { color: 'warning', text: '库存不足' },
  'out-of-stock': { color: 'error', text: '缺货' }
}

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
        { text: '在售', value: 'active' },
        { text: '库存不足', value: 'low-stock' },
        { text: '缺货', value: 'out-of-stock' }
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
  return productsStore.filteredProducts.map(product => ({
    ...product,
    key: product.id
  }))
})

// ==================== 新增/编辑表单 ====================
const isAddDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const editingProduct = ref<Product | null>(null)



// 新增表单数据
const addFormData = ref({
  name: '',
  category: '',
  price: 0,
  stock: 0,
  description: ''
})

// 编辑表单数据
const editFormData = ref({
  id: '',
  name: '',
  category: '',
  price: 0,
  stock: 0,
  description: ''
})

// 新增表单 Schema
const addSchema: FormSchema = {
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
  ],
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
  ],
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

/**
 * 处理新增商品提交
 */
function handleAddSubmit(values: Record<string, any>): void {
  productsStore.addProduct({
    name: values.name,
    category: values.category,
    price: Number(values.price),
    stock: Number(values.stock),
    status: Number(values.stock) === 0 ? 'out-of-stock' : Number(values.stock) < 10 ? 'low-stock' : 'active',
    sales: 0,
    description: values.description
  })
  isAddDialogOpen.value = false
  addFormData.value = {
    name: '',
    category: '',
    price: 0,
    stock: 0,
    description: ''
  }
}

/**
 * 处理编辑商品
 */
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

/**
 * 处理编辑提交
 */
function handleEditSubmit(values: Record<string, any>): void {
  if (editingProduct.value) {
    productsStore.updateProduct(editingProduct.value.id, {
      name: values.name,
      category: values.category,
      price: Number(values.price),
      stock: Number(values.stock),
      description: values.description
    })
    // 更新库存会自动更新状态
    productsStore.updateStock(editingProduct.value.id, Number(values.stock))
    isEditDialogOpen.value = false
    editingProduct.value = null
  }
}

/**
 * 处理删除商品
 */
function handleDeleteProduct(id: string): void {
  productsStore.deleteProduct(id)
}

/**
 * 处理表格变化
 */
function handleTableChange(
  pagination: { current: number; pageSize: number; total: number },
  filters: Record<string, (string | number | boolean)[] | null>,
  sorter: any
): void {
  console.log('表格变化:', { pagination, filters, sorter })
}

/**
 * 处理行选择变化
 */
const selectedRowKeys = ref<(string | number)[]>([])
const selectedRows = ref<Product[]>([])

function handleSelectChange(keys: (string | number)[], rows: any[]): void {
  selectedRowKeys.value = keys
  selectedRows.value = rows as Product[]
}

/**
 * 批量删除
 */
function handleBatchDelete(): void {
  if (selectedRowKeys.value.length === 0) {
    alert('请先选择要删除的商品')
    return
  }
  if (confirm(`确定要删除选中的 ${selectedRowKeys.value.length} 个商品吗？`)) {
    productsStore.batchDeleteProducts(selectedRowKeys.value.map(String))
    tableRef.value?.clearSelection()
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
      ref="addModalRef"
      v-model:open="isAddDialogOpen"
      title="添加新商品"
      width="560"
      :footer="null"
    >
      <TForm
        ref="formRef"
        v-model="addFormData"
        :schema="addSchema"
        @submit="handleAddSubmit"
      />
    </TModal>

    <!-- 编辑商品弹窗 -->
    <TModal
      ref="editModalRef"
      v-model:open="isEditDialogOpen"
      title="编辑商品"
      width="560"
      :footer="null"
    >
      <TForm
        v-if="editingProduct"
        ref="formRef"
        v-model="editFormData"
        :schema="editSchema"
        @submit="handleEditSubmit"
      />
    </TModal>

    <!-- 统计卡片 -->
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
              <span>总销量: {{ productsStore.statistics.totalSales }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Layers class="h-4 w-4" />
              <span>总库存: {{ productsStore.statistics.totalStock }}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent class="pt-0">
        <TTable
          ref="tableRef"
          v-model:data="tableData"
          :schema="tableSchema"
          @change="handleTableChange"
          @select-change="handleSelectChange"
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
                <span class="font-medium">{{ (slotProps as any).record.name }}</span>
                <span class="text-xs text-muted-foreground font-mono">{{ (slotProps as any).record.sku }}</span>
              </Space>
            </Space>
          </template>

          <!-- 自定义价格列 -->
          <template #price="slotProps">
            <span class="font-medium text-primary">¥{{ Number((slotProps as any).text).toFixed(2) }}</span>
          </template>

          <!-- 自定义库存列 -->
          <template #stock="slotProps">
            <Space>
              <span :class="[
                'font-medium',
                (slotProps as any).record.stock === 0 ? 'text-red-500' :
                (slotProps as any).record.stock < 10 ? 'text-yellow-500' : 'text-green-500'
              ]">
                {{ (slotProps as any).text }}
              </span>
              <TrendingUp
                v-if="(slotProps as any).record.stock < 10"
                class="h-4 w-4 text-red-500"
              />
            </Space>
          </template>

          <!-- 自定义状态列 -->
          <template #status="slotProps">
            <Badge
              :class="{
                'bg-green-500/10 text-green-500 border-green-500/20': (slotProps as any).text === 'active',
                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20': (slotProps as any).text === 'low-stock',
                'bg-red-500/10 text-red-500 border-red-500/20': (slotProps as any).text === 'out-of-stock'
              }"
              variant="outline"
            >
              {{ statusConfig[(slotProps as any).text]?.text || (slotProps as any).text }}
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
