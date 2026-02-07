<script setup lang="ts">
/**
 * 用户管理页 - 使用 useQuery + useMutation 重构
 *
 * @description 基于 JSON 配置化的用户管理页面
 */
import { ref, computed } from 'vue'
import { TTable } from '@/components/business/TTable'
import { TForm } from '@/components/business/TForm'
import type { TableSchema, TTableExpose } from '@/components/business/TTable'
import type { FormSchema } from '@/components/business/TForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TModal } from '@/components/business/TModal'
import { usersApi } from '@/api'
import { useTableData, useMutation } from '@/composables'
import type { User } from '@/types/models'
import { Plus, Users, UserCheck, UserCog, TrendingUp, Search } from 'lucide-vue-next'
import { Avatar, Space, Tag } from 'antdv-next'
import { USER_STATUS, USER_ROLES, STATUS_CONFIG } from '@/constants'

// ==================== 类型定义 ====================
interface TableSlotProps {
  record: User
  text: any
  index: number
  column: any
}

// ==================== 数据管理 ====================
const {
  data: users,
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
  addData: _addData,
  updateData: _updateData,
  removeData: _removeData,
  batchRemoveData: _batchRemoveData,
} = useTableData<User>({
  // API 调用函数
  apiCall: async (params) => {
    const res = await usersApi.getUsers(params)
    return res || { list: [], total: 0, page: 1, pageSize: 10 }
  },
  // 构建 API 请求参数
  apiCallParams: (ctx) => ({
    page: ctx.page,
    pageSize: ctx.pageSize,
    search: ctx.searchQuery,
    role: ctx.filters.role,
    status: ctx.filters.status,
  }),
  // 统计数据计算（基于当前页数据，如需全局统计需后端提供单独接口）
  statisticsFn: (items) => {
    const total = items.length
    const active = items.filter(u => u.status === USER_STATUS.ACTIVE).length
    const admins = items.filter(u => u.role === USER_ROLES.ADMIN).length
    const today = items.filter(u => {
      const created = new Date(u.createdAt)
      const now = new Date()
      return created.toDateString() === now.toDateString()
    }).length

    return {
      total,
      active,
      admins,
      today,
    }
  },
})

const { mutate: createUser, loading: _creating } = useMutation({
  mutationFn: (values: Record<string, any>) => usersApi.createUser({
    name: values.name,
    email: values.email,
    role: values.role,
    status: values.status
  }),
  successMessage: '用户创建成功',
  onSuccess: () => {
    isAddDialogOpen.value = false
    addFormData.value = {
      name: '',
      email: '',
      role: USER_ROLES.VIEWER,
      status: USER_STATUS.ACTIVE
    }
    fetchData()
  }
})

const { mutate: updateUser, loading: _updating } = useMutation({
  mutationFn: ({ id, values }: { id: string; values: Record<string, any> }) => 
    usersApi.updateUser(id, {
      name: values.name,
      email: values.email,
      role: values.role,
      status: values.status
    }),
  successMessage: '用户更新成功',
  onSuccess: () => {
    isEditDialogOpen.value = false
    editingUser.value = null
    fetchData()
  }
})

const { mutate: deleteUser, loading: _deleting } = useMutation({
  mutationFn: (id: string) => usersApi.deleteUser(id),
  successMessage: '用户删除成功',
  onSuccess: () => fetchData()
})

const { mutate: batchDeleteUsers, loading: _batchDeleting } = useMutation({
  mutationFn: (ids: string[]) => usersApi.batchDeleteUsers(ids),
  successMessage: '批量删除成功',
  onSuccess: () => {
    tableRef.value?.clearSelection()
    fetchData()
  }
})

const statisticsCards = computed(() => {
  const stats = statistics.value || {}
  return [
    { title: '总用户', value: stats.total || 0, icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { title: '活跃用户', value: stats.active || 0, icon: UserCheck, color: 'text-green-500', bgColor: 'bg-green-50' },
    { title: '管理员', value: stats.admins || 0, icon: UserCog, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { title: '今日新增', value: stats.today || 0, icon: TrendingUp, color: 'text-orange-500', bgColor: 'bg-orange-50' }
  ]
})

const searchFormData = ref({
  keyword: '',
  role: '',
  status: ''
})

const searchSchema: FormSchema = {
  layout: 'inline',
  fields: [
    {
      name: 'keyword',
      type: 'input',
      label: '',
      placeholder: '搜索用户名或邮箱...',
      className: 'w-[200px]'
    },
    {
      name: 'role',
      type: 'select',
      label: '',
      placeholder: '全部角色',
      options: [
        { label: '全部角色', value: '' },
        { label: '管理员', value: USER_ROLES.ADMIN },
        { label: '编辑', value: USER_ROLES.EDITOR },
        { label: '查看者', value: USER_ROLES.VIEWER }
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
        { label: STATUS_CONFIG.USER.ACTIVE.text, value: STATUS_CONFIG.USER.ACTIVE.value },
        { label: STATUS_CONFIG.USER.INACTIVE.text, value: STATUS_CONFIG.USER.INACTIVE.value },
        { label: STATUS_CONFIG.USER.SUSPENDED.text, value: STATUS_CONFIG.USER.SUSPENDED.value }
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
        role: values.role,
        status: values.status,
      }
    },
    onReset: () => {
      searchQuery.value = ''
      filters.value = {}
    }
  }
}

const tableRef = ref<TTableExpose>()

const tableSchema = computed<TableSchema>(() => ({
  columns: [
    {
      title: '用户',
      dataIndex: 'name',
      width: 200,
      slot: 'user'
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 120,
      slot: 'role',
      filters: [
        { text: '管理员', value: USER_ROLES.ADMIN },
        { text: '编辑', value: USER_ROLES.EDITOR },
        { text: '查看者', value: USER_ROLES.VIEWER }
      ]
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      slot: 'status',
      filters: [
        { text: STATUS_CONFIG.USER.ACTIVE.text, value: STATUS_CONFIG.USER.ACTIVE.value },
        { text: STATUS_CONFIG.USER.INACTIVE.text, value: STATUS_CONFIG.USER.INACTIVE.value },
        { text: STATUS_CONFIG.USER.SUSPENDED.text, value: STATUS_CONFIG.USER.SUSPENDED.value }
      ]
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 120,
      sorter: true
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      width: 120,
      customRender: ({ text }) => text || '-'
    }
  ],
  pagination: {
    pageSize: 10,
    show: true,
    showSizeChanger: true,
    showQuickJumper: true,
    total: total.value
  },
  rowSelection: {
    type: 'checkbox',
    show: true
  },
  actions: [
    {
      text: '编辑',
      type: 'primary',
      onClick: (record) => handleEditUser(record as unknown as User)
    },
    {
      text: '删除',
      type: 'danger',
      confirm: true,
      confirmText: '确定要删除该用户吗？此操作不可恢复。',
      onClick: (record) => handleDeleteUser((record as unknown as User).id)
    }
  ],
  actionWidth: 150,
  actionFixed: 'right'
}))

const isAddDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const editingUser = ref<User | null>(null)

const addFormData = ref({
  name: '',
  email: '',
  role: USER_ROLES.VIEWER,
  status: USER_STATUS.ACTIVE
})

const editFormData = ref<{
  id: string
  name: string
  email: string
  role: User['role']
  status: User['status']
}>({
  id: '',
  name: '',
  email: '',
  role: USER_ROLES.VIEWER,
  status: USER_STATUS.ACTIVE
})

const addSchema: FormSchema = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'name',
      type: 'input',
      label: '姓名',
      placeholder: '请输入姓名',
      rules: [
        { required: true, message: '姓名不能为空' },
        { min: 2, message: '姓名至少2个字符' }
      ]
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
      name: 'role',
      type: 'select',
      label: '角色',
      placeholder: '请选择角色',
      options: [
        { label: '管理员', value: USER_ROLES.ADMIN },
        { label: '编辑', value: USER_ROLES.EDITOR },
        { label: '查看者', value: USER_ROLES.VIEWER }
      ],
      rules: [{ required: true, message: '请选择角色' }]
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: STATUS_CONFIG.USER.ACTIVE.text, value: STATUS_CONFIG.USER.ACTIVE.value },
        { label: STATUS_CONFIG.USER.INACTIVE.text, value: STATUS_CONFIG.USER.INACTIVE.value },
        { label: STATUS_CONFIG.USER.SUSPENDED.text, value: STATUS_CONFIG.USER.SUSPENDED.value }
      ],
      rules: [{ required: true, message: '请选择状态' }]
    }
  ],
  actions: {
    showSubmit: true,
    showReset: true,
    submitText: '添加用户',
    resetText: '取消',
    align: 'right',
    onReset: () => {
      isAddDialogOpen.value = false
    }
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
      label: '姓名',
      placeholder: '请输入姓名',
      rules: [
        { required: true, message: '姓名不能为空' },
        { min: 2, message: '姓名至少2个字符' }
      ]
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
      name: 'role',
      type: 'select',
      label: '角色',
      placeholder: '请选择角色',
      options: [
        { label: '管理员', value: USER_ROLES.ADMIN },
        { label: '编辑', value: USER_ROLES.EDITOR },
        { label: '查看者', value: USER_ROLES.VIEWER }
      ],
      rules: [{ required: true, message: '请选择角色' }]
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: STATUS_CONFIG.USER.ACTIVE.text, value: STATUS_CONFIG.USER.ACTIVE.value },
        { label: STATUS_CONFIG.USER.INACTIVE.text, value: STATUS_CONFIG.USER.INACTIVE.value },
        { label: STATUS_CONFIG.USER.SUSPENDED.text, value: STATUS_CONFIG.USER.SUSPENDED.value }
      ],
      rules: [{ required: true, message: '请选择状态' }]
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

function handleEditUser(user: User): void {
  editingUser.value = user
  editFormData.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  }
  isEditDialogOpen.value = true
}

function handleAddSubmit(values: Record<string, any>): void {
  createUser(values)
}

function handleEditSubmit(values: Record<string, any>): void {
  if (editingUser.value) {
    updateUser({ id: editingUser.value.id, values })
  }
}

function handleDeleteUser(id: string): void {
  deleteUser(id)
}

const selectedRowKeys = ref<(string | number)[]>([])
const selectedRows = ref<User[]>([])

function handleSelectChange(keys: (string | number)[], rows: any[]): void {
  selectedRowKeys.value = keys
  selectedRows.value = rows as User[]
}

function handleBatchDelete(): void {
  if (selectedRowKeys.value.length === 0) {
    alert('请先选择要删除的用户')
    return
  }
  if (confirm(`确定要删除选中的 ${selectedRowKeys.value.length} 个用户吗？`)) {
    batchDeleteUsers(selectedRowKeys.value as string[])
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
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">用户管理</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">管理系统用户和权限</p>
      </div>
      <Button class="gap-2" @click="isAddDialogOpen = true">
        <Plus class="h-4 w-4" />
        添加用户
      </Button>
    </div>

    <TModal
      v-model:open="isAddDialogOpen"
      title="添加新用户"
      width="480"
      :footer="null"
    >
      <TForm
        v-model="addFormData"
        :schema="addSchema"
        @submit="handleAddSubmit"
      />
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

    <Card class="border-0 shadow-sm">
      <CardHeader class="pb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <CardTitle class="text-base font-semibold">用户列表</CardTitle>
            <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              共 {{ total }} 人
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent class="pt-0">
        <TTable
          ref="tableRef"
          v-model:data="users"
          :schema="tableSchema"
          :loading="loading"
          @select-change="handleSelectChange"
          @change="handleTableChange"
        >
          <template #user="slotProps">
            <Space>
              <Avatar
                :style="{
                  backgroundColor: (slotProps as any).record.status === USER_STATUS.ACTIVE ? '#87d068' : '#ccc'
                }"
              >
                {{ (slotProps as any).record.name.charAt(0) }}
              </Avatar>
              <div>
                <div class="font-medium">{{ (slotProps as any).record.name }}</div>
                <div class="text-sm text-muted-foreground">{{ (slotProps as any).record.email }}</div>
              </div>
            </Space>
          </template>

          <template #role="slotProps">
            <Tag :color="(slotProps as any).text === USER_ROLES.ADMIN ? 'red' : (slotProps as any).text === USER_ROLES.EDITOR ? 'blue' : 'default'">
              {{ STATUS_CONFIG.USER[(slotProps as any).text as keyof typeof STATUS_CONFIG.USER]?.text || (slotProps as any).text }}
            </Tag>
          </template>

          <template #status="slotProps">
            <Badge
              :class="{
                'bg-green-500/10 text-green-500 border-green-500/20': (slotProps as any).text === USER_STATUS.ACTIVE,
                'bg-gray-500/10 text-gray-500 border-gray-500/20': (slotProps as any).text === USER_STATUS.INACTIVE,
                'bg-red-500/10 text-red-500 border-red-500/20': (slotProps as any).text === USER_STATUS.SUSPENDED
              }"
              variant="outline"
            >
              {{ STATUS_CONFIG.USER[(slotProps as any).text as keyof typeof STATUS_CONFIG.USER]?.text || (slotProps as any).text }}
            </Badge>
          </template>

          <template #emptyText>
            <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search class="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p class="text-base font-medium mb-1">暂无用户数据</p>
              <p class="text-sm text-muted-foreground mb-4">开始添加您的第一个用户吧</p>
              <Button size="sm" @click="isAddDialogOpen = true">
                <Plus class="h-4 w-4 mr-1" />
                添加用户
              </Button>
            </div>
          </template>
        </TTable>
      </CardContent>
    </Card>

    <TModal
      v-model:open="isEditDialogOpen"
      title="编辑用户"
      width="480"
      :footer="null"
    >
      <TForm
        v-if="editingUser"
        v-model="editFormData"
        :schema="editSchema"
        @submit="handleEditSubmit"
      />
    </TModal>
  </div>
</template>
