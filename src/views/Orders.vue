<script setup lang="ts">
/**
 * 订单管理页 - 使用 useMutation 重构
 *
 * @description 基于 JSON 配置化的订单管理页面
 */
import { TTable, TForm, TModal, TDataCard, TPageHeader, TBatchActions, TStatusBadge, TEmptyState } from '@/components/business'
import type { TableSchema, TTableExpose } from '@/components/business'
import type { FormSchema } from '@/components/business'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { Order } from '@/types/models'
import { ordersApi } from '@/api'
import { useTableData, useMutation } from '@/composables'
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
import { ORDER_STATUS, STATUS_CONFIG } from '@/constants'

// ==================== 类型定义 ====================
interface TableSlotProps {
  record: Order
  text: any
  index: number
}

// ==================== 数据管理 ====================
const {
  data: orders,
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
} = useTableData<Order>({
  // API 调用函数
  apiCall: async (params) => {
    const res = await ordersApi.getOrders(params)
    return res || { list: [], total: 0, page: 1, pageSize: 10 }
  },
  // 构建 API 请求参数
  apiCallParams: (ctx) => ({
    page: ctx.page,
    pageSize: ctx.pageSize,
    search: ctx.searchQuery,
    status: ctx.filters.status,
  }),
  // 统计数据计算
  statisticsFn: (items) => {
    const total = items.length
    const pending = items.filter(o => o.status === ORDER_STATUS.PENDING).length
    const processing = items.filter(o => o.status === ORDER_STATUS.PROCESSING).length
    const completed = items.filter(o => o.status === ORDER_STATUS.COMPLETED).length
    const cancelled = items.filter(o => o.status === ORDER_STATUS.CANCELLED).length
    const totalAmount = items.reduce((sum, o) => sum + (o.total || 0), 0)

    return {
      total,
      pending,
      processing,
      completed,
      cancelled,
      totalAmount,
    }
  },
})

const { mutate: createOrder } = useMutation({
  mutationFn: (values: Record<string, any>) => ordersApi.createOrder({
    customer: values.customer,
    email: values.email,
    phone: values.phone,
    address: values.address,
    total: Number(values.total),
    items: Number(values.items),
    status: values.status,
    note: values.note
  }),
  onSuccess: () => {
    isAddDialogOpen.value = false
    addFormData.value = {
      customer: '',
      email: '',
      phone: '',
      address: '',
      total: 0,
      items: 1,
      status: ORDER_STATUS.PENDING,
      note: ''
    }
    fetchData()
  }
})

const { mutate: deleteOrder, loading: deleting } = useMutation({
  mutationFn: (id: string) => ordersApi.deleteOrder(id),
  onSuccess: () => fetchData()
})

const { mutate: batchDeleteOrders } = useMutation({
  mutationFn: (ids: string[]) => ordersApi.batchDeleteOrders(ids),
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
      title: '总订单',
      value: stats.total || 0,
      icon: ShoppingCart,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: '待处理',
      value: stats.pending || 0,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: '处理中',
      value: stats.processing || 0,
      icon: Package,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: '已完成',
      value: stats.completed || 0,
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
        { label: STATUS_CONFIG.ORDER.PENDING.text, value: STATUS_CONFIG.ORDER.PENDING.value },
        { label: STATUS_CONFIG.ORDER.PROCESSING.text, value: STATUS_CONFIG.ORDER.PROCESSING.value },
        { label: STATUS_CONFIG.ORDER.COMPLETED.text, value: STATUS_CONFIG.ORDER.COMPLETED.value },
        { label: STATUS_CONFIG.ORDER.CANCELLED.text, value: STATUS_CONFIG.ORDER.CANCELLED.value }
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
        { text: STATUS_CONFIG.ORDER.PENDING.text, value: STATUS_CONFIG.ORDER.PENDING.value },
        { text: STATUS_CONFIG.ORDER.PROCESSING.text, value: STATUS_CONFIG.ORDER.PROCESSING.value },
        { text: STATUS_CONFIG.ORDER.COMPLETED.text, value: STATUS_CONFIG.ORDER.COMPLETED.value },
        { text: STATUS_CONFIG.ORDER.CANCELLED.text, value: STATUS_CONFIG.ORDER.CANCELLED.value }
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

// 表格数据 - 后端分页直接使用 orders
const tableData = computed(() => {
  return orders.value.map(order => ({
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
  status: ORDER_STATUS.PENDING,
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
        { label: STATUS_CONFIG.ORDER.PENDING.text, value: STATUS_CONFIG.ORDER.PENDING.value },
        { label: STATUS_CONFIG.ORDER.PROCESSING.text, value: STATUS_CONFIG.ORDER.PROCESSING.value },
        { label: STATUS_CONFIG.ORDER.COMPLETED.text, value: STATUS_CONFIG.ORDER.COMPLETED.value },
        { label: STATUS_CONFIG.ORDER.CANCELLED.text, value: STATUS_CONFIG.ORDER.CANCELLED.value }
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

function handleViewOrder(order: Order): void {
  viewingOrder.value = order
  isViewDialogOpen.value = true
}

function handleAddSubmit(values: Record<string, any>): void {
  createOrder(values)
}

function handleDeleteOrder(id: string): void {
  deleteOrder(id)
}

const selectedRowKeys = ref<(string | number)[]>([])
const selectedRows = ref<Order[]>([])

function handleSelectChange(keys: (string | number)[], rows: any[]): void {
  selectedRowKeys.value = keys
  selectedRows.value = rows as Order[]
}

function handleBatchDelete(): void {
  if (selectedRowKeys.value.length === 0) {
    alert('请先选择要删除的订单')
    return
  }
  if (confirm(`确定要删除选中的 ${selectedRowKeys.value.length} 个订单吗？`)) {
    batchDeleteOrders(selectedRowKeys.value.map(String))
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
      title="订单管理"
      subtitle="查看和管理所有订单"
      :actions="[
        { text: '创建订单', type: 'primary', iconName: 'Plus', onClick: () => isAddDialogOpen = true }
      ]"
    />

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
    <div class="bg-muted/30 rounded-lg p-4">
      <div class="flex flex-col lg:flex-row lg:items-center gap-4">
        <div class="flex-1">
          <TForm v-model="searchFormData" :schema="searchSchema" />
        </div>
        <TBatchActions
          :count="selectedRowKeys.length"
          item-name="订单"
          :actions="[
            {
              text: '批量删除',
              type: 'danger',
              confirm: true,
              confirmText: '确定要删除选中的订单吗？此操作不可恢复。',
              onClick: handleBatchDelete
            }
          ]"
          @clear="tableRef?.clearSelection()"
        />
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
            <span>总金额: ¥{{ (statistics.value?.totalAmount || 0).toFixed(2) }}</span>
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
          <!-- 自定义订单号列 -->
          <template #orderNo="slotProps">
            <span class="font-mono font-medium">{{ (slotProps as TableSlotProps).text }}</span>
          </template>

          <!-- 自定义客户列 -->
          <template #customer="slotProps">
            <Space direction="vertical" size="small">
              <span class="font-medium">{{ (slotProps as TableSlotProps).record.customer }}</span>
              <span class="text-xs text-muted-foreground">{{ (slotProps as TableSlotProps).record.phone }}</span>
            </Space>
          </template>

          <!-- 自定义金额列 -->
          <template #total="slotProps">
            <span class="font-medium text-primary">¥{{ Number((slotProps as TableSlotProps).text).toFixed(2) }}</span>
          </template>

          <!-- 自定义状态列 -->
          <template #status="slotProps">
            <TStatusBadge
              :status="(slotProps as TableSlotProps).text"
              :status-map="{
                [ORDER_STATUS.PENDING]: { text: '待处理', color: 'pending' },
                [ORDER_STATUS.PROCESSING]: { text: '处理中', color: 'processing' },
                [ORDER_STATUS.COMPLETED]: { text: '已完成', color: 'success' },
                [ORDER_STATUS.CANCELLED]: { text: '已取消', color: 'error' }
              }"
            />
          </template>

          <!-- 空状态 -->
          <template #emptyText>
            <TEmptyState
              type="data"
              title="暂无订单数据"
              description="开始创建您的第一个订单吧"
              :action="{ text: '创建订单', type: 'primary', iconName: 'Plus', onClick: () => isAddDialogOpen = true }"
            />
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
          <Tag :color="(viewingOrder.status === ORDER_STATUS.PENDING ? 'warning' : viewingOrder.status === ORDER_STATUS.PROCESSING ? 'processing' : viewingOrder.status === ORDER_STATUS.COMPLETED ? 'success' : 'error')">
            <Space>
              <component :is="(viewingOrder.status === ORDER_STATUS.PENDING ? Clock : viewingOrder.status === ORDER_STATUS.PROCESSING ? Package : viewingOrder.status === ORDER_STATUS.COMPLETED ? CheckCircle : XCircle)" class="h-3 w-3" />
              {{ STATUS_CONFIG.ORDER[viewingOrder.status as keyof typeof STATUS_CONFIG.ORDER]?.text || viewingOrder.status }}
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
