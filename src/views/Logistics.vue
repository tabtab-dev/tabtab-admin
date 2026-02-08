<script setup lang="ts">
/**
 * 物流管理页
 */
import { TTable } from '@/components/business/TTable'
import { TForm } from '@/components/business/TForm'
import { TModal } from '@/components/business/TModal'
import type { TableSchema } from '@/components/business/TTable'
import type { FormSchema } from '@/components/business/TForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Truck,
  Package,
  CheckCircle,
  Star
} from 'lucide-vue-next'
import { WAREHOUSE_STATUS } from '@/constants'

interface TableSlotProps {
  record: LogisticsCompany
  text: any
  index: number
}

// 物流公司数据
interface LogisticsCompany {
  id: string
  name: string
  code: string
  contact: string
  phone: string
  address: string
  status: WAREHOUSE_STATUS.ACTIVE | WAREHOUSE_STATUS.INACTIVE
  rating: number
  deliveryCount: number
  createdAt: string
}

const logisticsCompanies = ref<LogisticsCompany[]>([
  {
    id: '1',
    name: '顺丰速运',
    code: 'SF',
    contact: '王经理',
    phone: '400-811-1111',
    address: '深圳市福田区',
    status: 'active',
    rating: 4.8,
    deliveryCount: 1256,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: '中通快递',
    code: 'ZTO',
    contact: '李经理',
    phone: '95311',
    address: '上海市青浦区',
    status: 'active',
    rating: 4.5,
    deliveryCount: 892,
    createdAt: '2024-01-05'
  },
  {
    id: '3',
    name: '圆通速递',
    code: 'YTO',
    contact: '张经理',
    phone: '95554',
    address: '上海市青浦区',
    status: 'active',
    rating: 4.3,
    deliveryCount: 567,
    createdAt: '2024-01-10'
  },
  {
    id: '4',
    name: '韵达快递',
    code: 'YD',
    contact: '陈经理',
    phone: '95546',
    address: '上海市青浦区',
    status: 'inactive',
    rating: 4.2,
    deliveryCount: 234,
    createdAt: '2024-01-15'
  }
])

// 统计标签
const statistics = computed(() => {
  const total = logisticsCompanies.value.length
  const active = logisticsCompanies.value.filter(c => c.status === 'active').length
  const totalDeliveries = logisticsCompanies.value.reduce((sum, c) => sum + c.deliveryCount, 0)
  const avgRating = total > 0 ? (logisticsCompanies.value.reduce((sum, c) => sum + c.rating, 0) / total).toFixed(1) : '0.0'
  
  return [
    { title: '物流公司', value: total, icon: Truck, color: 'text-blue-500' },
    { title: '合作中', value: active, icon: CheckCircle, color: 'text-green-500' },
    { title: '配送订单', value: totalDeliveries.toLocaleString(), icon: Package, color: 'text-purple-500' },
    { title: '平均评分', value: avgRating, icon: Star, color: 'text-yellow-500' }
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
      placeholder: '搜索公司名称、编码...',
      className: 'w-[240px]'
    },
    {
      name: 'status',
      type: 'select',
      label: '',
      placeholder: '全部状态',
      options: [
        { label: '全部状态', value: '' },
        { label: '合作中', value: WAREHOUSE_STATUS.ACTIVE },
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
    showReset: true
  }
}

// 过滤后的数据
const filteredCompanies = computed(() => {
  let result = logisticsCompanies.value
  
  if (searchFormData.value.keyword) {
    const query = searchFormData.value.keyword.toLowerCase()
    result = result.filter(
      c => c.name.toLowerCase().includes(query) || 
           c.code.toLowerCase().includes(query)
    )
  }
  
  if (searchFormData.value.status) {
    result = result.filter(c => c.status === searchFormData.value.status)
  }
  
  return result.map(c => ({ ...c, key: c.id }))
})

// 表格配置
const tableSchema = computed<TableSchema>(() => ({
  columns: [
    {
      title: '公司名称',
      dataIndex: 'name',
      width: 180,
      slot: 'name'
    },
    {
      title: '编码',
      dataIndex: 'code',
      width: 100
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      width: 120
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      width: 140
    },
    {
      title: '评分',
      dataIndex: 'rating',
      width: 100,
      slot: 'rating'
    },
    {
      title: '配送订单',
      dataIndex: 'deliveryCount',
      width: 120,
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
      onClick: (record) => handleEdit(record as unknown as LogisticsCompany)
    },
    {
      text: '删除',
      type: 'danger',
      confirm: true,
      confirmText: '确定要删除该物流公司吗？',
      onClick: (record) => handleDelete((record as unknown as LogisticsCompany).id)
    }
  ],
  actionWidth: 150,
  actionFixed: 'right'
}))

// 新增/编辑
const isAddOpen = ref(false)
const isEditOpen = ref(false)
const editingItem = ref<LogisticsCompany | null>(null)

const addFormData = ref({
  name: '',
  code: '',
  contact: '',
  phone: '',
  address: '',
  status: 'active' as 'active' | 'inactive'
})

const editFormData = ref({
  id: '',
  name: '',
  code: '',
  contact: '',
  phone: '',
  address: '',
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
      label: '公司名称',
      placeholder: '请输入公司名称',
      rules: [{ required: true, message: '公司名称不能为空' }]
    },
    {
      name: 'code',
      type: 'input',
      label: '公司编码',
      placeholder: '请输入公司编码',
      rules: [{ required: true, message: '公司编码不能为空' }]
    },
    {
      name: 'contact',
      type: 'input',
      label: '联系人',
      placeholder: '请输入联系人姓名'
    },
    {
      name: 'phone',
      type: 'input',
      label: '联系电话',
      placeholder: '请输入联系电话'
    },
    {
      name: 'address',
      type: 'input',
      label: '公司地址',
      placeholder: '请输入公司地址'
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '合作中', value: 'active' },
        { label: '已停用', value: 'inactive' }
      ]
    }
  ],
  actions: {
    showSubmit: true,
    showReset: true,
    submitText: '添加公司',
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
      label: '公司名称',
      placeholder: '请输入公司名称',
      rules: [{ required: true, message: '公司名称不能为空' }]
    },
    {
      name: 'contact',
      type: 'input',
      label: '联系人',
      placeholder: '请输入联系人姓名'
    },
    {
      name: 'phone',
      type: 'input',
      label: '联系电话',
      placeholder: '请输入联系电话'
    },
    {
      name: 'address',
      type: 'input',
      label: '公司地址',
      placeholder: '请输入公司地址'
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '合作中', value: 'active' },
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

// 事件处理
function handleAddSubmit(values: Record<string, any>) {
  const newCompany: LogisticsCompany = {
    id: Date.now().toString(),
    name: values.name,
    code: values.code,
    contact: values.contact,
    phone: values.phone,
    address: values.address,
    status: values.status,
    rating: 5.0,
    deliveryCount: 0,
    createdAt: new Date().toISOString().split('T')[0] || ''
  }
  logisticsCompanies.value.push(newCompany)
  isAddOpen.value = false
  addFormData.value = { name: '', code: '', contact: '', phone: '', address: '', status: 'active' }
}

function handleEdit(item: LogisticsCompany) {
  editingItem.value = item
  editFormData.value = {
    id: item.id,
    name: item.name,
    code: item.code,
    contact: item.contact,
    phone: item.phone,
    address: item.address,
    status: item.status
  }
  isEditOpen.value = true
}

function handleEditSubmit(values: Record<string, any>) {
  if (editingItem.value) {
    const index = logisticsCompanies.value.findIndex(c => c.id === editingItem.value!.id)
    if (index !== -1) {
      const current = logisticsCompanies.value[index]!
      logisticsCompanies.value[index] = {
        ...current,
        name: values.name,
        contact: values.contact,
        phone: values.phone,
        address: values.address,
        status: values.status
      }
    }
    isEditOpen.value = false
    editingItem.value = null
  }
}

function handleDelete(id: string) {
  logisticsCompanies.value = logisticsCompanies.value.filter(c => c.id !== id)
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
        <h1 class="text-3xl font-bold tracking-tight">物流管理</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">管理物流公司和配送服务</p>
      </div>
      <Button class="gap-2" @click="isAddOpen = true">
        <Plus class="h-4 w-4" />
        添加公司
      </Button>
    </div>

    <!-- 新增弹窗 -->
    <TModal v-model:open="isAddOpen" title="添加物流公司" width="560" :footer="null">
      <TForm v-model="addFormData" :schema="addSchema" @submit="handleAddSubmit" />
    </TModal>

    <!-- 编辑弹窗 -->
    <TModal v-model:open="isEditOpen" title="编辑物流公司" width="560" :footer="null">
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
          <CardTitle class="text-base font-semibold">物流公司列表</CardTitle>
          <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            共 {{ filteredCompanies.length }} 家
          </span>
        </div>
      </CardHeader>
      <CardContent class="pt-0">
        <TTable
          ref="tableRef"
          v-model:data="filteredCompanies"
          :schema="tableSchema"
          @select-change="handleSelectChange"
        >
          <!-- 名称列 -->
          <template #name="slotProps">
            <div class="flex items-center gap-2">
              <Truck class="h-4 w-4 text-blue-500" />
              <span class="font-medium">{{ (slotProps as TableSlotProps).text }}</span>
            </div>
          </template>

          <!-- 评分列 -->
          <template #rating="slotProps">
            <div class="flex items-center gap-1">
              <Star class="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <span class="font-medium">{{ (slotProps as TableSlotProps).text }}</span>
            </div>
          </template>

          <!-- 状态列 -->
          <template #status="slotProps">
            <Badge
              :class="{
                'bg-green-500/10 text-green-500 border-green-500/20': (slotProps as TableSlotProps).text === WAREHOUSE_STATUS.ACTIVE,
                'bg-gray-500/10 text-gray-500 border-gray-500/20': (slotProps as TableSlotProps).text === WAREHOUSE_STATUS.INACTIVE
              }"
              variant="outline"
            >
              {{ (slotProps as TableSlotProps).text === WAREHOUSE_STATUS.ACTIVE ? '合作中' : '已停用' }}
            </Badge>
          </template>

          <!-- 空状态 -->
          <template #emptyText>
            <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Truck class="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p class="text-base font-medium mb-1">暂无物流公司数据</p>
              <p class="text-sm text-muted-foreground mb-4">开始添加您的第一家物流公司吧</p>
              <Button size="sm" @click="isAddOpen = true">
                <Plus class="h-4 w-4 mr-1" />
                添加公司
              </Button>
            </div>
          </template>
        </TTable>
      </CardContent>
    </Card>
  </div>
</template>
