<script setup lang="ts">
/**
 * 订单管理页 - 使用 TTable + TForm 重构
 *
 * @description 基于 JSON 配置化的订单管理页面
 */
import { ref, computed } from 'vue'
import { TTable } from '@/components/data/TTable'
import { TForm } from '@/components/data/TForm'
import { TModal } from '@/components/data/TModal'
import type { TableSchema, TTableExpose } from '@/components/data/TTable'
import type { FormSchema } from '@/components/data/TForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useOrdersStore, type Order } from '@/stores/orders'
import {
  Plus,
  ShoppingCart,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  DollarSign
} from 'lucide-vue-next'
import { Tag, Space } from 'antdv-next'

// ==================== Store ====================
const ordersStore = useOrdersStore()

// ==================== 统计数据 ====================
const statistics = computed(() => {
  const stats = ordersStore.statistics
  return [
    {
      title: '总订单',
      value: stats.total,
      icon: ShoppingCart,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: '待处理',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: '处理中',
      value: stats.processing,
      icon: Package,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: '已完成',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    }
  ]
})

// ==================== 搜索表单 ====================
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
      placeholder: '搜索订单号、客户...',
      className: 'w-[240px]'
    },
    {
      name: 'status',
      type: 'select',
      label: '',
      placeholder: '全部状态',
      options: [
        { label: '全部状态', value: '' },
        { label: '待处理', value: 'pending' },
        { label: '处理中', value: 'processing' },
        { label: '已完成', value: 'completed' },
        { label: '已取消', value: 'cancelled' }
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
      ordersStore.searchQuery = values.keyword || ''
      ordersStore.statusFilter = values.status || ''
    },
    onReset: () => {
      ordersStore.searchQuery = ''
      ordersStore.statusFilter = ''
    }
  }
}

// ==================== 表格配置 ====================
const tableRef = ref<TTableExpose>()

// 状态配置
const statusConfig: Record<string, { color: string; text: string; icon: any }> = {
  pending: { color: 'warning', text: '待处理', icon: Clock },
  processing: { color: 'processing', text: '处理中', icon: Package },
  completed: { color: 'success', text: '已完成', icon: CheckCircle },
  cancelled: { color: 'error', text: '已取消', icon: XCircle }
}

// 表格 Schema
const tableSchema = computed<TableSchema>(() => ({
  columns: [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 150,
      slot: 'orderNo'
    },
    {
      title: '客户信息',
      dataIndex: 'customer',
      width: 180,
      slot: 'customer'
    },
    {
      title: '商品数量',
      dataIndex: 'items',
      width: 100,
      align: 'center'
    },
    {
      title: '订单金额',
      dataIndex: 'total',
      width: 120,
      slot: 'total',
      sorter: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      slot: 'status',
      filters: [
        { text: '待处理', value: 'pending' },
        { text: '处理中', value: 'processing' },
        { text: '已完成', value: 'completed' },
        { text: '已取消', value: 'cancelled' }
      ]
    },
    {
      title: '下单日期',
      dataIndex: 'date',
      width: 120,
      sorter: true
    },
    {
      title: '收货地址',
      dataIndex: 'address',
      width: 200,
      ellipsis: true
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
      text: '查看',
      type: 'primary',
      onClick: (record) => handleViewOrder(record as unknown as Order)
    },
    {
      text: '删除',
      type: 'danger',
      confirm: true,
      confirmText: '确定要删除该订单吗？此操作不可恢复。',
      onClick: (record) => handleDeleteOrder((record as unknown as Order).id)
    }
  ],
  actionWidth: 150,
  actionFixed: 'right'
}))

// 表格数据
const tableData = computed(() => {
  return ordersStore.filteredOrders.map(order => ({
    ...order,
    key: order.id
  }))
})

// ==================== 新增/查看表单 ====================
const isAddDialogOpen = ref(false)
const isViewDialogOpen = ref(false)
const viewingOrder = ref<Order | null>(null)



// 新增表单数据
const addFormData = ref({
  customer: '',
  email: '',
  phone: '',
  address: '',
  total: 0,
  items: 1,
  status: 'pending' as Order['status'],
  note: ''
})

// 新增表单 Schema
const addSchema: FormSchema = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'customer',
      type: 'input',
      label: '客户姓名',
      placeholder: '请输入客户姓名',
      rules: [{ required: true, message: '客户姓名不能为空' }]
    },
    {
      name: 'email',
      type: 'input',
      label: '邮箱',
      placeholder: '请输入邮箱',
      rules: [
        { required: true, message: '邮箱不能为空' },
        { type: 'email', message: '邮箱格式不正确' }
      ]
    },
    {
      name: 'phone',
      type: 'input',
      label: '电话',
      placeholder: '请输入电话',
      rules: [{ required: true, message: '电话不能为空' }]
    },
    {
      name: 'address',
      type: 'input',
      label: '收货地址',
      placeholder: '请输入收货地址',
      rules: [{ required: true, message: '收货地址不能为空' }]
    },
    {
      name: 'total',
      type: 'number',
      label: '订单金额',
      placeholder: '请输入订单金额',
      rules: [{ required: true, message: '订单金额不能为空' }]
    },
    {
      name: 'items',
      type: 'number',
      label: '商品数量',
      placeholder: '请输入商品数量',
      rules: [{ required: true, message: '商品数量不能为空' }]
    },
    {
      name: 'status',
      type: 'select',
      label: '订单状态',
      placeholder: '请选择状态',
      options: [
        { label: '待处理', value: 'pending' },
        { label: '处理中', value: 'processing' },
        { label: '已完成', value: 'completed' },
        { label: '已取消', value: 'cancelled' }
      ],
      rules: [{ required: true, message: '请选择订单状态' }]
    },
    {
      name: 'note',
      type: 'textarea',
      label: '备注',
      placeholder: '请输入备注（可选）'
    }
  ],
  actions: {
    showSubmit: true,
    showReset: true,
    submitText: '创建订单',
    resetText: '取消',
    align: 'right',
    onReset: () => {
      isAddDialogOpen.value = false
    }
  }
}

// ==================== 事件处理 ====================

/**
 * 处理新增订单提交
 */
function handleAddSubmit(values: Record<string, any>): void {
  ordersStore.addOrder({
    customer: values.customer,
    email: values.email,
    phone: values.phone,
    address: values.address,
    total: Number(values.total),
    items: Number(values.items),
    status: values.status,
    note: values.note
  })
  isAddDialogOpen.value = false
  addFormData.value = {
    customer: '',
    email: '',
    phone: '',
    address: '',
    total: 0,
    items: 1,
    status: 'pending',
    note: ''
  }
}

/**
 * 处理查看订单
 */
function handleViewOrder(order: Order): void {
  viewingOrder.value = order
  isViewDialogOpen.value = true
}

/**
 * 处理删除订单
 */
function handleDeleteOrder(id: string): void {
  ordersStore.deleteOrder(id)
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
const selectedRows = ref<Order[]>([])

function handleSelectChange(keys: (string | number)[], rows: any[]): void {
  selectedRowKeys.value = keys
  selectedRows.value = rows as Order[]
}

/**
 * 批量删除
 */
function handleBatchDelete(): void {
  if (selectedRowKeys.value.length === 0) {
    alert('请先选择要删除的订单')
    return
  }
  if (confirm(`确定要删除选中的 ${selectedRowKeys.value.length} 个订单吗？`)) {
    ordersStore.batchDeleteOrders(selectedRowKeys.value.map(String))
    tableRef.value?.clearSelection()
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">订单管理</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">查看和管理所有订单</p>
      </div>
      <Button class="gap-2" @click="isAddDialogOpen = true">
        <Plus class="h-4 w-4" />
        创建订单
      </Button>
    </div>

    <!-- 新增订单弹窗 -->
    <TModal
      ref="addModalRef"
      v-model:open="isAddDialogOpen"
      title="创建新订单"
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

    <!-- 订单表格 -->
    <Card class="border-0 shadow-sm">
      <CardHeader class="pb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <CardTitle class="text-base font-semibold">订单列表</CardTitle>
            <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              共 {{ tableData.length }} 单
            </span>
          </div>
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign class="h-4 w-4" />
            <span>总金额: ¥{{ ordersStore.statistics.totalAmount.toFixed(2) }}</span>
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
          <!-- 自定义订单号列 -->
          <template #orderNo="slotProps">
            <span class="font-mono font-medium">{{ (slotProps as any).text }}</span>
          </template>

          <!-- 自定义客户列 -->
          <template #customer="slotProps">
            <Space direction="vertical" size="small">
              <span class="font-medium">{{ (slotProps as any).record.customer }}</span>
              <span class="text-xs text-muted-foreground">{{ (slotProps as any).record.phone }}</span>
            </Space>
          </template>

          <!-- 自定义金额列 -->
          <template #total="slotProps">
            <span class="font-medium text-primary">¥{{ Number((slotProps as any).text).toFixed(2) }}</span>
          </template>

          <!-- 自定义状态列 -->
          <template #status="slotProps">
            <Tag :color="statusConfig[(slotProps as any).text]?.color || 'default'">
              <Space>
                <component :is="statusConfig[(slotProps as any).text]?.icon" class="h-3 w-3" />
                {{ statusConfig[(slotProps as any).text]?.text || (slotProps as any).text }}
              </Space>
            </Tag>
          </template>

          <!-- 空状态 -->
          <template #emptyText>
            <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingCart class="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p class="text-base font-medium mb-1">暂无订单数据</p>
              <p class="text-sm text-muted-foreground mb-4">开始创建您的第一个订单吧</p>
              <Button size="sm" @click="isAddDialogOpen = true">
                <Plus class="h-4 w-4 mr-1" />
                创建订单
              </Button>
            </div>
          </template>
        </TTable>
      </CardContent>
    </Card>

    <!-- 查看订单弹窗 -->
    <TModal
      ref="viewModalRef"
      v-model:open="isViewDialogOpen"
      title="订单详情"
      width="560"
      :footer="null"
    >
      <div v-if="viewingOrder" class="space-y-6">
        <!-- 订单基本信息 -->
        <div class="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <p class="text-sm text-muted-foreground">订单号</p>
            <p class="font-mono font-medium">{{ viewingOrder.orderNo }}</p>
          </div>
          <Tag :color="statusConfig[viewingOrder.status]?.color || 'default'">
            <Space>
              <component :is="statusConfig[viewingOrder.status]?.icon" class="h-3 w-3" />
              {{ statusConfig[viewingOrder.status]?.text || viewingOrder.status }}
            </Space>
          </Tag>
        </div>

        <!-- 客户信息 -->
        <div class="space-y-3">
          <h4 class="font-medium">客户信息</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-muted-foreground">姓名</p>
              <p>{{ viewingOrder.customer }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">电话</p>
              <p>{{ viewingOrder.phone }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-muted-foreground">邮箱</p>
              <p>{{ viewingOrder.email }}</p>
            </div>
          </div>
        </div>

        <!-- 订单信息 -->
        <div class="space-y-3">
          <h4 class="font-medium">订单信息</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-muted-foreground">商品数量</p>
              <p>{{ viewingOrder.items }} 件</p>
            </div>
            <div>
              <p class="text-muted-foreground">订单金额</p>
              <p class="font-medium text-primary">¥{{ viewingOrder.total.toFixed(2) }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">下单日期</p>
              <p>{{ viewingOrder.date }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-muted-foreground">收货地址</p>
              <p>{{ viewingOrder.address }}</p>
            </div>
          </div>
        </div>

        <!-- 备注 -->
        <div v-if="viewingOrder.note" class="space-y-3">
          <h4 class="font-medium">备注</h4>
          <p class="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
            {{ viewingOrder.note }}
          </p>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" @click="isViewDialogOpen = false">
            关闭
          </Button>
        </div>
      </div>
    </TModal>
  </div>
</template>
