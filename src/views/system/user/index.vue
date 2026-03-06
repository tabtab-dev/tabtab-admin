<script setup lang="ts">
import type { FormSchema, TableSchema, TTableExpose } from '@/components/business'

import type { User } from '@/types'
import { Avatar } from 'antdv-next'
import { 
  TrendingUp, 
  UserCheck, 
  UserCog, 
  Users, 
  Mail,
  Phone,
  Calendar,
  Shield,
  Clock,
  Edit,
  Trash2,
} from 'lucide-vue-next'
import { usersApi } from '@/api'
import { TBatchActions, TDataCard, TEmptyState, TForm, TModal, TPageHeader, TTable } from '@/components/business'
import { useMutation, useTableData } from '@/composables'
import { STATUS_CONFIG, USER_ROLES, USER_STATUS } from '@/constants'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * 用户管理页面
 * @description 系统用户管理，包含用户的增删改查、状态管理等功能
 */

// ==================== 数据管理 ====================
const {
  data: users,
  loading,
  searchQuery,
  filters,
  statistics,
  total,
  fetchData,
  goToPage,
  setPageSize,
  pageSize,
} = useTableData<User>({
  apiCall: async (params) => {
    const res = await usersApi.getUsers(params)
    return res || { list: [], total: 0, page: 1, pageSize: 10 }
  },
  apiCallParams: ctx => ({
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
    const today = items.filter((u) => {
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

// ==================== 状态 ====================
const selectedUser = ref<User | null>(null)
const isDetailDrawerOpen = ref(false)

// ==================== 弹窗和表单状态 ====================
const isAddDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const editingUser = ref<User | null>(null)
const tableRef = ref<TTableExpose>()

const addFormData = ref({
  name: '',
  email: '',
  role: USER_ROLES.VIEWER,
  status: USER_STATUS.ACTIVE,
})

const { mutate: createUser } = useMutation({
  mutationFn: (values: Record<string, any>) => usersApi.createUser({
    name: values.name,
    email: values.email,
    role: values.role,
    status: values.status,
  }),
  successMessage: '用户创建成功',
  onSuccess: () => {
    isAddDialogOpen.value = false
    addFormData.value = {
      name: '',
      email: '',
      role: USER_ROLES.VIEWER,
      status: USER_STATUS.ACTIVE,
    }
    fetchData()
  },
})

const { mutate: updateUser } = useMutation({
  mutationFn: ({ id, values }: { id: string, values: Record<string, any> }) =>
    usersApi.updateUser(id, {
      name: values.name,
      email: values.email,
      role: values.role,
      status: values.status,
    }),
  successMessage: '用户更新成功',
  onSuccess: () => {
    isEditDialogOpen.value = false
    editingUser.value = null
    fetchData()
  },
})

const { mutate: deleteUser } = useMutation({
  mutationFn: (id: string) => usersApi.deleteUser(id),
  successMessage: '用户删除成功',
  onSuccess: () => fetchData(),
})

const { mutate: batchDeleteUsers } = useMutation({
  mutationFn: (ids: string[]) => usersApi.batchDeleteUsers(ids),
  successMessage: '批量删除成功',
  onSuccess: () => {
    tableRef.value?.clearSelection()
    fetchData()
  },
})

// ==================== 统计卡片数据 ====================
const statisticsCards = computed(() => {
  const stats = statistics.value || {}
  return [
    { title: '总用户', value: stats.total || 0, icon: Users, color: 'blue' },
    { title: '活跃用户', value: stats.active || 0, icon: UserCheck, color: 'green' },
    { title: '管理员', value: stats.admins || 0, icon: UserCog, color: 'purple' },
    { title: '今日新增', value: stats.today || 0, icon: TrendingUp, color: 'orange' },
  ]
})

// ==================== 搜索筛选 ====================
const searchFormData = ref({
  search: '',
  role: 'all',
  status: 'all',
})

const searchSchema: FormSchema = {
  layout: 'inline',
  fields: [
    {
      name: 'search',
      type: 'input',
      placeholder: '搜索用户名或邮箱...',
      props: {
        allowClear: true,
      },
    },
    {
      name: 'role',
      type: 'select',
      placeholder: '全部角色',
      options: [
        { label: '全部角色', value: 'all' },
        { label: '管理员', value: USER_ROLES.ADMIN },
        { label: '编辑', value: USER_ROLES.EDITOR },
        { label: '查看者', value: USER_ROLES.VIEWER },
      ],
    },
    {
      name: 'status',
      type: 'select',
      placeholder: '全部状态',
      options: [
        { label: '全部状态', value: 'all' },
        { label: '启用', value: USER_STATUS.ACTIVE },
        { label: '禁用', value: USER_STATUS.INACTIVE },
        { label: '已暂停', value: USER_STATUS.SUSPENDED },
      ],
    },
  ],
  searchConfig: {
    enabled: true,
    searchText: '搜索',
    resetText: '重置',
    showReset: true,
    onSearch: (values) => {
      searchQuery.value = values.search
      filters.value = {
        role: values.role === 'all' ? undefined : values.role,
        status: values.status === 'all' ? undefined : values.status,
      }
    },
    onReset: () => {
      searchFormData.value = {
        search: '',
        role: 'all',
        status: 'all',
      }
      searchQuery.value = ''
      filters.value = {}
    },
  },
}

// ==================== 表格配置 ====================
const tableSchema = computed<TableSchema>(() => ({
  columns: [
    {
      title: '用户',
      dataIndex: 'name',
      width: 200,
      slot: 'user',
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 120,
      slot: 'role',
      filters: [
        { text: '管理员', value: USER_ROLES.ADMIN },
        { text: '编辑', value: USER_ROLES.EDITOR },
        { text: '查看者', value: USER_ROLES.VIEWER },
      ],
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      slot: 'status',
      filters: [
        { text: STATUS_CONFIG.USER.ACTIVE.text, value: STATUS_CONFIG.USER.ACTIVE.value },
        { text: STATUS_CONFIG.USER.INACTIVE.text, value: STATUS_CONFIG.USER.INACTIVE.value },
        { text: STATUS_CONFIG.USER.SUSPENDED.text, value: STATUS_CONFIG.USER.SUSPENDED.value },
      ],
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 120,
      sorter: true,
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      width: 120,
      customRender: ({ text }) => text || '-',
    },
  ],
  pagination: {
    pageSize: 10,
    show: true,
    showSizeChanger: true,
    showQuickJumper: true,
    total: total.value,
  },
  rowSelection: {
    type: 'checkbox',
    show: true,
  },
  actions: [
    {
      text: '编辑',
      type: 'primary',
      onClick: record => handleEditUser(record as unknown as User),
    },
    {
      text: '删除',
      type: 'danger',
      confirm: true,
      confirmText: '确定要删除该用户吗？此操作不可恢复。',
      onClick: record => handleDeleteUser((record as unknown as User).id),
    },
  ],
  actionWidth: 150,
  actionFixed: 'right',
}))

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
  status: USER_STATUS.ACTIVE,
})

const userFormFields = [
  {
    name: 'name',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名',
    rules: [
      { required: true, message: '姓名不能为空' },
      { min: 2, message: '姓名至少2个字符' },
    ],
  },
  {
    name: 'email',
    type: 'input',
    label: '邮箱',
    placeholder: '请输入邮箱',
    rules: [
      { required: true, message: '邮箱不能为空' },
      { type: 'email', message: '邮箱格式不正确' },
    ],
  },
  {
    name: 'role',
    type: 'select',
    label: '角色',
    placeholder: '请选择角色',
    options: [
      { label: '管理员', value: USER_ROLES.ADMIN },
      { label: '编辑', value: USER_ROLES.EDITOR },
      { label: '查看者', value: USER_ROLES.VIEWER },
    ],
    rules: [{ required: true, message: '请选择角色' }],
  },
  {
    name: 'status',
    type: 'select',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      { label: STATUS_CONFIG.USER.ACTIVE.text, value: STATUS_CONFIG.USER.ACTIVE.value },
      { label: STATUS_CONFIG.USER.INACTIVE.text, value: STATUS_CONFIG.USER.INACTIVE.value },
      { label: STATUS_CONFIG.USER.SUSPENDED.text, value: STATUS_CONFIG.USER.SUSPENDED.value },
    ],
    rules: [{ required: true, message: '请选择状态' }],
  },
]

const formLayoutConfig = {
  layout: 'horizontal' as const,
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

const addSchema: FormSchema = {
  ...formLayoutConfig,
  fields: userFormFields,
  actions: {
    showSubmit: true,
    showReset: true,
    submitText: '添加用户',
    resetText: '取消',
    align: 'right',
    onReset: () => {
      isAddDialogOpen.value = false
    },
  },
}

const editSchema: FormSchema = {
  ...formLayoutConfig,
  fields: userFormFields,
  actions: {
    showSubmit: true,
    showReset: true,
    submitText: '保存修改',
    resetText: '取消',
    align: 'right',
    onReset: () => {
      isEditDialogOpen.value = false
    },
  },
}

// ==================== 事件处理 ====================
function handleEditUser(user: User): void {
  editingUser.value = user
  editFormData.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  }
  isEditDialogOpen.value = true
}

function handleViewUser(user: User): void {
  selectedUser.value = user
  isDetailDrawerOpen.value = true
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
    return
  }
  batchDeleteUsers(selectedRowKeys.value as string[])
}

function handleTableChange(pagination: any): void {
  if (pagination.pageSize !== undefined && pagination.pageSize !== pageSize.value) {
    setPageSize(pagination.pageSize)
  }
  else if (pagination.current !== undefined) {
    goToPage(pagination.current)
  }
}

// ==================== 辅助函数 ====================
function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    [USER_ROLES.ADMIN]: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
    [USER_ROLES.EDITOR]: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    [USER_ROLES.VIEWER]: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  }
  return colors[role] || 'bg-gray-100 text-gray-700'
}

function getRoleText(role: string): string {
  const texts: Record<string, string> = {
    [USER_ROLES.ADMIN]: '管理员',
    [USER_ROLES.EDITOR]: '编辑',
    [USER_ROLES.VIEWER]: '查看者',
  }
  return texts[role] || role
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    [USER_STATUS.ACTIVE]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    [USER_STATUS.INACTIVE]: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    [USER_STATUS.SUSPENDED]: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

function getStatusText(status: string): string {
  const texts: Record<string, string> = {
    [USER_STATUS.ACTIVE]: '启用',
    [USER_STATUS.INACTIVE]: '禁用',
    [USER_STATUS.SUSPENDED]: '已暂停',
  }
  return texts[status] || status
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
</script>

<template>
  <div class="space-y-6">
    <TPageHeader
      title="用户管理"
      subtitle="管理系统用户账号和权限分配"
      :actions="[
        { text: '添加用户', type: 'primary', iconName: 'Plus', onClick: () => isAddDialogOpen = true },
      ]"
    />

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

    <!-- 搜索栏 -->
    <div class="bg-muted/40 border border-border/50 rounded-xl px-3 py-3">
      <TForm
        v-model="searchFormData"
        :schema="searchSchema"
      />
    </div>

    <!-- 用户列表 -->
    <Card class="bg-muted/40 border border-border/50 rounded-xl">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <CardTitle class="text-base font-semibold">
              用户列表
            </CardTitle>
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
                onClick: handleBatchDelete,
              },
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
            <div 
              class="flex items-center gap-3 cursor-pointer group"
              @click="handleViewUser((slotProps as any).record)"
            >
              <Avatar
                :style="{
                  backgroundColor: (slotProps as any).record.status === USER_STATUS.ACTIVE ? '#87d068' : '#ccc',
                }"
                class="transition-transform group-hover:scale-110"
              >
                {{ (slotProps as any).record.name.charAt(0) }}
              </Avatar>
              <div>
                <div class="font-medium group-hover:text-primary transition-colors">
                  {{ (slotProps as any).record.name }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ (slotProps as any).record.email }}
                </div>
              </div>
            </div>
          </template>

          <template #role="slotProps">
            <span :class="['px-2.5 py-1 rounded-full text-xs font-medium', getRoleColor((slotProps as any).text)]">
              {{ getRoleText((slotProps as any).text) }}
            </span>
          </template>

          <template #status="slotProps">
            <span :class="['px-2.5 py-1 rounded-full text-xs font-medium', getStatusColor((slotProps as any).text)]">
              {{ getStatusText((slotProps as any).text) }}
            </span>
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

    <!-- 添加用户弹窗 -->
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

    <!-- 编辑用户弹窗 -->
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

    <!-- 用户详情抽屉 -->
    <Drawer v-model:open="isDetailDrawerOpen" direction="right">
      <DrawerContent class="w-[400px] sm:max-w-[400px]">
        <DrawerHeader class="border-b border-border">
          <DrawerTitle class="flex items-center gap-3">
            <Avatar
              v-if="selectedUser"
              :style="{
                backgroundColor: selectedUser.status === USER_STATUS.ACTIVE ? '#87d068' : '#ccc',
              }"
              class="w-10 h-10"
            >
              {{ selectedUser?.name.charAt(0) }}
            </Avatar>
            <div>
              <div class="text-lg font-semibold">{{ selectedUser?.name }}</div>
              <div class="text-sm font-normal text-muted-foreground">{{ selectedUser?.email }}</div>
            </div>
          </DrawerTitle>
          <DrawerDescription class="sr-only">
            用户详细信息
          </DrawerDescription>
        </DrawerHeader>
        
        <div v-if="selectedUser" class="p-6 space-y-6">
          <!-- 状态和角色 -->
          <div class="flex items-center gap-3">
            <span :class="['px-3 py-1.5 rounded-full text-sm font-medium', getRoleColor(selectedUser.role)]">
              {{ getRoleText(selectedUser.role) }}
            </span>
            <span :class="['px-3 py-1.5 rounded-full text-sm font-medium', getStatusColor(selectedUser.status)]">
              {{ getStatusText(selectedUser.status) }}
            </span>
          </div>

          <!-- 详细信息 -->
          <div class="space-y-4">
            <div class="flex items-center gap-3 text-sm">
              <div class="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Mail class="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div class="text-muted-foreground">邮箱</div>
                <div class="font-medium">{{ selectedUser.email }}</div>
              </div>
            </div>

            <div v-if="selectedUser.phone" class="flex items-center gap-3 text-sm">
              <div class="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Phone class="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div class="text-muted-foreground">电话</div>
                <div class="font-medium">{{ selectedUser.phone }}</div>
              </div>
            </div>

            <div class="flex items-center gap-3 text-sm">
              <div class="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Shield class="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div class="text-muted-foreground">角色</div>
                <div class="font-medium">{{ getRoleText(selectedUser.role) }}</div>
              </div>
            </div>

            <div class="flex items-center gap-3 text-sm">
              <div class="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Calendar class="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div class="text-muted-foreground">创建时间</div>
                <div class="font-medium">{{ formatDate(selectedUser.createdAt) }}</div>
              </div>
            </div>

            <div class="flex items-center gap-3 text-sm">
              <div class="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Clock class="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div class="text-muted-foreground">最后登录</div>
                <div class="font-medium">{{ formatDate(selectedUser.lastLogin) }}</div>
              </div>
            </div>
          </div>

          <!-- 简介 -->
          <div v-if="selectedUser.bio" class="pt-4 border-t border-border">
            <h4 class="text-sm font-medium text-muted-foreground mb-2">简介</h4>
            <p class="text-sm text-muted-foreground leading-relaxed">
              {{ selectedUser.bio }}
            </p>
          </div>
        </div>

        <DrawerFooter class="border-t border-border">
          <div class="flex gap-2 w-full">
            <Button variant="outline" class="flex-1" @click="selectedUser && handleEditUser(selectedUser); isDetailDrawerOpen = false">
              <Edit class="w-4 h-4 mr-2" />
              编辑
            </Button>
            <Button variant="destructive" class="flex-1" @click="selectedUser && handleDeleteUser(selectedUser.id); isDetailDrawerOpen = false">
              <Trash2 class="w-4 h-4 mr-2" />
              删除
            </Button>
          </div>
          <DrawerClose as-child>
            <Button variant="ghost" class="w-full">关闭</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>
