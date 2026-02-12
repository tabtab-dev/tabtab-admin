<script setup lang="ts">
/**
 * 用户管理页面
 * @description 系统用户管理，包含用户的增删改查、状态管理等功能
 */
import { TTable, TForm, TModal, TDataCard, TPageHeader, TBatchActions, TStatusBadge, TEmptyState } from '@/components/business'
import type { TableSchema, TTableExpose } from '@/components/business'
import type { FormSchema } from '@/components/business'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usersApi } from '@/api'
import { useTableData, useMutation } from '@/composables'
import type { User } from '@/types'
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
} = useTableData<User>({
  apiCall: async (params) => {
    const res = await usersApi.getUsers(params)
    return res || { list: [], total: 0, page: 1, pageSize: 10 }
  },
  apiCallParams: (ctx) => ({
    page: ctx.page,
    pageSize: ctx.pageSize,
    search: ctx.searchQuery,
    role: ctx.filters.role,
    status: ctx.filters.status,
  }),
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

const { mutate: createUser } = useMutation({
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

const { mutate: updateUser } = useMutation({
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

const { mutate: deleteUser } = useMutation({
  mutationFn: (id: string) => usersApi.deleteUser(id),
  successMessage: '用户删除成功',
  onSuccess: () => fetchData()
})

const { mutate: batchDeleteUsers } = useMutation({
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

function handleClearSelection(): void {
  selectedRowKeys.value = []
  selectedRows.value = []
  tableRef.value?.clearSelection()
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

function handleTableChange(pagination: any): void {
  if (pagination.current !== undefined) {
    goToPage(pagination.current)
  }
  if (pagination.pageSize !== undefined) {
    setPageSize(pagination.pageSize)
  }
}
</script>

<template>
  <div class="space-y-6">
    <TPageHeader
      title="用户管理"
      subtitle="管理系统用户账号和权限分配"
      :actions="[
        { text: '添加用户', type: 'primary', iconName: 'Plus', onClick: () => isAddDialogOpen = true }
      ]"
    />

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

    <div class="bg-muted/40 border border-border/50 rounded-xl px-3 py-3">
      <TForm v-model="searchFormData" :schema="searchSchema" />
    </div>

    <Card class="bg-muted/40 border border-border/50 rounded-xl">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <CardTitle class="text-base font-semibold">用户列表</CardTitle>
            <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              共 {{ total }} 人
            </span>
          </div>
          <TBatchActions
            :count="selectedRowKeys.length"
            :total="total"
            item-name="用户"
            class-name="border-0 bg-transparent shadow-none px-0 py-0"
            :actions="[
              {
                text: '批量删除',
                type: 'danger',
                confirm: true,
                confirmText: '确定要删除选中的用户吗？此操作不可恢复。',
                onClick: handleBatchDelete
              }
            ]"
            @clear="handleClearSelection"
          />
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
            <TStatusBadge
              :status="(slotProps as any).text"
              :status-map="{
                [USER_STATUS.ACTIVE]: { text: '启用', color: 'success' },
                [USER_STATUS.INACTIVE]: { text: '禁用', color: 'default' },
                [USER_STATUS.SUSPENDED]: { text: '已暂停', color: 'error' }
              }"
            />
          </template>

          <template #emptyText>
            <TEmptyState
              type="data"
              title="暂无用户数据"
              description="开始添加您的第一个用户吧"
              :action="{ text: '添加用户', type: 'primary', iconName: 'Plus', onClick: () => isAddDialogOpen = true }"
            />
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
