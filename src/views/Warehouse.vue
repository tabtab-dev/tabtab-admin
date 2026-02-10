<script setup lang="ts">
/**
 * 仓库管理页 - 使用 useMutation 重构
 */
import { TTable } from '@/components/business/TTable'
import { TForm } from '@/components/business/TForm'
import { TModal } from '@/components/business/TModal'
import type { TableSchema } from '@/components/business/TTable'
import type { FormSchema } from '@/components/business/TForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Warehouse } from '@/types/models'
import { inventoryApi } from '@/api'
import { useTableData, useMutation } from '@/composables'
import {
  Plus,
  Building,
  MapPin,
  User,
  CheckCircle,
  Package,
  TrendingUp
} from 'lucide-vue-next'
import { WAREHOUSE_STATUS } from '@/constants'

interface TableSlotProps {
  record: Warehouse
  text: any
  index: number
}

const {
  data: warehouses,
  loading,
  searchQuery,
  filters,
  filteredData,
  paginatedData,
  total,
  statistics,
  fetchData,
} = useTableData<Warehouse>({
  apiCall: () => inventoryApi.getWarehouses(),
  filterFn: (items, query, filterValues) => {
    let result = items

    if (query) {
      const lowerQuery = query.toLowerCase()
      result = result.filter(
        warehouse =>
          warehouse.name.toLowerCase().includes(lowerQuery) ||
          warehouse.code.toLowerCase().includes(lowerQuery)
      )
    }

    if (filterValues.status) {
      result = result.filter(warehouse => warehouse.status === filterValues.status)
    }

    return result
  },
  statisticsFn: (items) => {
    const total = items.length
    const active = items.filter(w => w.status === WAREHOUSE_STATUS.ACTIVE).length
    const totalCapacity = items.reduce((sum, w) => sum + w.capacity, 0)
    const usedCapacity = items.reduce((sum, w) => sum + w.usedCapacity, 0)
    const utilizationRate = totalCapacity > 0 ? Math.round((usedCapacity / totalCapacity) * 100) : 0

    return {
      total,
      active,
      totalCapacity,
      usedCapacity,
      utilizationRate,
    }
  },
})

// 统计标签
const statisticsCards = computed(() => {
  const stats = statistics.value || {}
  return [
    { title: '仓库总数', value: stats.total || 0, icon: Building, color: 'text-blue-500' },
    { title: '运营中', value: stats.active || 0, icon: CheckCircle, color: 'text-green-500' },
    { title: '总容量', value: (stats.totalCapacity || 0).toLocaleString(), icon: Package, color: 'text-purple-500' },
    { title: '使用率', value: (stats.utilizationRate || 0) + '%', icon: TrendingUp, color: 'text-orange-500' }
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
      placeholder: '搜索仓库名称、编码...',
      className: 'w-[240px]'
    },
    {
      name: 'status',
      type: 'select',
      label: '',
      placeholder: '全部状态',
      options: [
        { label: '全部状态', value: '' },
        { label: '运营中', value: WAREHOUSE_STATUS.ACTIVE },
        { label: '已停用', value: WAREHOUSE_STATUS.INACTIVE }
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
      title: '仓库信息',
      dataIndex: 'name',
      width: 200,
      slot: 'name'
    },
    {
      title: '仓库编码',
      dataIndex: 'code',
      width: 120
    },
    {
      title: '位置',
      dataIndex: 'location',
      width: 180,
      slot: 'location'
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      width: 120,
      slot: 'manager'
    },
    {
      title: '容量使用',
      dataIndex: 'capacity',
      width: 150,
      slot: 'capacity'
    },
    {
      title: '商品数量',
      dataIndex: 'productCount',
      width: 100,
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
      onClick: (record) => handleEdit(record as unknown as Warehouse)
    },
    {
      text: '删除',
      type: 'danger',
      confirm: true,
      confirmText: '确定要删除该仓库吗？',
      onClick: (record) => handleDelete((record as unknown as Warehouse).id)
    }
  ],
  actionWidth: 150,
  actionFixed: 'right'
}))

const tableData = computed(() => {
  return paginatedData.value.map(w => ({ ...w, key: w.id }))
})

// 新增/编辑
const isAddOpen = ref(false)
const isEditOpen = ref(false)
const editingItem = ref<Warehouse | null>(null)

const addFormData = ref({
  name: '',
  code: '',
  location: '',
  manager: '',
  phone: '',
  capacity: 1000,
  status: 'active' as 'active' | 'inactive'
})

const editFormData = ref({
  id: '',
  name: '',
  code: '',
  location: '',
  manager: '',
  phone: '',
  capacity: 1000,
  status: 'active' as 'active' | 'inactive'
})

const addSchema: FormSchema = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'name',
      type: 'input',
      label: '仓库名称',
      placeholder: '请输入仓库名称',
      rules: [{ required: true, message: '仓库名称不能为空' }]
    },
    {
      name: 'code',
      type: 'input',
      label: '仓库编码',
      placeholder: '请输入仓库编码',
      rules: [{ required: true, message: '仓库编码不能为空' }]
    },
    {
      name: 'location',
      type: 'input',
      label: '仓库位置',
      placeholder: '请输入详细地址',
      rules: [{ required: true, message: '仓库位置不能为空' }]
    },
    {
      name: 'manager',
      type: 'input',
      label: '负责人',
      placeholder: '请输入负责人姓名',
      rules: [{ required: true, message: '负责人不能为空' }]
    },
    {
      name: 'phone',
      type: 'input',
      label: '联系电话',
      placeholder: '请输入联系电话'
    },
    {
      name: 'capacity',
      type: 'number',
      label: '仓库容量',
      placeholder: '请输入容量',
      rules: [{ required: true, message: '仓库容量不能为空' }]
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '运营中', value: 'active' },
        { label: '已停用', value: 'inactive' }
      ]
    }
  ],
  actions: {
    showSubmit: true,
    showReset: true,
    submitText: '添加仓库',
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
      label: '仓库名称',
      placeholder: '请输入仓库名称',
      rules: [{ required: true, message: '仓库名称不能为空' }]
    },
    {
      name: 'location',
      type: 'input',
      label: '仓库位置',
      placeholder: '请输入详细地址'
    },
    {
      name: 'manager',
      type: 'input',
      label: '负责人',
      placeholder: '请输入负责人姓名'
    },
    {
      name: 'phone',
      type: 'input',
      label: '联系电话',
      placeholder: '请输入联系电话'
    },
    {
      name: 'capacity',
      type: 'number',
      label: '仓库容量',
      placeholder: '请输入容量'
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '运营中', value: 'active' },
        { label: '已停用', value: 'inactive' }
      ]
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

const { mutate: createWarehouse } = useMutation({
  mutationFn: (values: Record<string, any>) => inventoryApi.createWarehouse({
    name: values.name,
    code: values.code,
    location: values.location,
    manager: values.manager,
    phone: values.phone,
    capacity: Number(values.capacity),
    status: values.status,
    productCount: 0,
    usedCapacity: 0,
  }),
  onSuccess: () => {
    isAddOpen.value = false
    addFormData.value = { name: '', code: '', location: '', manager: '', phone: '', capacity: 1000, status: 'active' }
    fetchData()
  }
})

const { mutate: updateWarehouse, loading: updating } = useMutation({
  mutationFn: ({ id, values }: { id: string; values: Record<string, any> }) =>
    inventoryApi.updateWarehouse(id, {
      name: values.name,
      location: values.location,
      manager: values.manager,
      phone: values.phone,
      capacity: Number(values.capacity),
      status: values.status
    }),
  onSuccess: () => {
    isEditOpen.value = false
    editingItem.value = null
    fetchData()
  }
})

const { mutate: deleteWarehouse } = useMutation({
  mutationFn: (id: string) => inventoryApi.deleteWarehouse(id),
  onSuccess: () => fetchData()
})

// 事件处理
function handleEdit(item: Warehouse) {
  editingItem.value = item
  editFormData.value = {
    id: item.id,
    name: item.name,
    code: item.code,
    location: item.location,
    manager: item.manager,
    phone: item.phone,
    capacity: item.capacity,
    status: item.status
  }
  isEditOpen.value = true
}

function handleAddSubmit(values: Record<string, any>): void {
  createWarehouse(values)
}

function handleEditSubmit(values: Record<string, any>): void {
  if (editingItem.value) {
    updateWarehouse({ id: editingItem.value.id, values })
  }
}

function handleDelete(id: string): void {
  deleteWarehouse(id)
}

const selectedRowKeys = ref<(string | number)[]>([])
function handleSelectChange(keys: (string | number)[]) {
  selectedRowKeys.value = keys
}

</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">仓库管理</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">管理仓库信息和容量</p>
      </div>
      <Button class="gap-2" @click="isAddOpen = true">
        <Plus class="h-4 w-4" />
        添加仓库
      </Button>
    </div>

    <TModal v-model:open="isAddOpen" title="添加仓库" width="560" :footer="null">
      <TForm v-model="addFormData" :schema="addSchema" @submit="handleAddSubmit" />
    </TModal>

    <TModal v-model:open="isEditOpen" title="编辑仓库" width="560" :footer="null">
      <TForm v-if="editingItem" v-model="editFormData" :schema="editSchema" @submit="handleEditSubmit" />
    </TModal>

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

    <div class="bg-muted/40 border border-border/50 rounded-xl px-3 py-3">
      <div class="flex flex-col lg:flex-row lg:items-center gap-4">
        <div class="flex-1">
          <TForm v-model="searchFormData" :schema="searchSchema" />
        </div>
      </div>
    </div>

    <Card class="bg-muted/40 border border-border/50 rounded-xl">
      <CardHeader class="pb-4">
        <div class="flex items-center gap-3">
          <CardTitle class="text-base font-semibold">仓库列表</CardTitle>
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
          <template #name="slotProps">
            <div class="flex items-center gap-2">
              <Building class="h-4 w-4 text-blue-500" />
              <span class="font-medium">{{ (slotProps as TableSlotProps).text }}</span>
            </div>
          </template>

          <template #location="slotProps">
            <div class="flex items-center gap-1 text-sm">
              <MapPin class="h-3 w-3 text-muted-foreground" />
              <span>{{ (slotProps as TableSlotProps).text }}</span>
            </div>
          </template>

          <template #manager="slotProps">
            <div class="flex items-center gap-1 text-sm">
              <User class="h-3 w-3 text-muted-foreground" />
              <span>{{ (slotProps as TableSlotProps).text }}</span>
            </div>
          </template>

          <template #capacity="slotProps">
            <div class="space-y-1">
              <div class="flex justify-between text-xs">
                <span>{{ (slotProps as TableSlotProps).record.usedCapacity }} / {{ (slotProps as TableSlotProps).text }}</span>
                <span>{{ Math.round(((slotProps as TableSlotProps).record.usedCapacity / (slotProps as TableSlotProps).text) * 100) }}%</span>
              </div>
              <div class="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary rounded-full"
                  :style="{ width: `${Math.min(((slotProps as TableSlotProps).record.usedCapacity / (slotProps as TableSlotProps).text) * 100, 100)}%` }"
                />
              </div>
            </div>
          </template>

          <template #status="slotProps">
            <Badge
              :class="{
                'bg-green-500/10 text-green-500 border-green-500/20': (slotProps as TableSlotProps).text === WAREHOUSE_STATUS.ACTIVE,
                'bg-gray-500/10 text-gray-500 border-gray-500/20': (slotProps as TableSlotProps).text === WAREHOUSE_STATUS.INACTIVE
              }"
              variant="outline"
            >
              {{ (slotProps as TableSlotProps).text === WAREHOUSE_STATUS.ACTIVE ? '运营中' : '已停用' }}
            </Badge>
          </template>

          <template #emptyText>
            <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Building class="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p class="text-base font-medium mb-1">暂无仓库数据</p>
              <p class="text-sm text-muted-foreground mb-4">开始添加您的第一个仓库吧</p>
              <Button size="sm" @click="isAddOpen = true">
                <Plus class="h-4 w-4 mr-1" />
                添加仓库
              </Button>
            </div>
          </template>
        </TTable>
      </CardContent>
    </Card>
  </div>
</template>
