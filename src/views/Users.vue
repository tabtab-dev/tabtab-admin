<script setup lang="ts">
/**
 * 用户管理页 - 使用 TTable + TForm 重构
 *
 * @description 基于 JSON 配置化的用户管理页面
 */
import { ref, computed } from 'vue'
import { TTable } from '@/components/data/TTable'
import { TForm } from '@/components/data/TForm'
import type { TableSchema, TTableExpose } from '@/components/data/TTable'
import type { FormSchema, TFormExpose } from '@/components/data/TForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TModal } from '@/components/data/TModal'
import type { TModalExpose } from '@/components/data/TModal'
import { useUsersStore, type User } from '@/stores/users'
import { Plus } from 'lucide-vue-next'
import { Avatar, Space, Tag } from 'antdv-next'

// ==================== Store ====================
const usersStore = useUsersStore()

// ==================== 搜索表单 ====================
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
      label: '用户名',
      placeholder: '请输入用户名'
    },
    {
      name: 'role',
      type: 'select',
      label: '角色',
      placeholder: '请选择角色',
      options: [
        { label: '全部', value: '' },
        { label: '管理员', value: 'admin' },
        { label: '编辑', value: 'editor' },
        { label: '查看者', value: 'viewer' }
      ]
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '全部', value: '' },
        { label: '活跃', value: 'active' },
        { label: '非活跃', value: 'inactive' },
        { label: '已暂停', value: 'suspended' }
      ]
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
      // 更新搜索条件，触发表格数据过滤
      usersStore.searchQuery = values.keyword || ''
      // 这里可以添加更多过滤逻辑
      console.log('搜索条件:', values)
    },
    onReset: () => {
      usersStore.searchQuery = ''
      console.log('重置搜索')
    }
  }
}

// ==================== 表格配置 ====================
const tableRef = ref<TTableExpose>()

// 角色标签映射
const roleLabels: Record<string, string> = {
  admin: '管理员',
  editor: '编辑',
  viewer: '查看者'
}

// 状态样式映射
const statusConfig: Record<string, { color: string; text: string }> = {
  active: { color: 'success', text: '活跃' },
  inactive: { color: 'default', text: '非活跃' },
  suspended: { color: 'error', text: '已暂停' }
}

// 表格 Schema
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
        { text: '管理员', value: 'admin' },
        { text: '编辑', value: 'editor' },
        { text: '查看者', value: 'viewer' }
      ]
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      slot: 'status',
      filters: [
        { text: '活跃', value: 'active' },
        { text: '非活跃', value: 'inactive' },
        { text: '已暂停', value: 'suspended' }
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
    showTotal: (total: number) => `共 ${total} 条`
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

// 表格数据
const tableData = computed(() => {
  let data = usersStore.users

  // 关键词过滤
  if (searchFormData.value.keyword) {
    const query = searchFormData.value.keyword.toLowerCase()
    data = data.filter(
      user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    )
  }

  // 角色过滤
  if (searchFormData.value.role) {
    data = data.filter(user => user.role === searchFormData.value.role)
  }

  // 状态过滤
  if (searchFormData.value.status) {
    data = data.filter(user => user.status === searchFormData.value.status)
  }

  return data.map(user => ({
    ...user,
    key: user.id
  }))
})

// ==================== 新增/编辑表单 ====================
const isAddDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const editingUser = ref<User | null>(null)

const formRef = ref<TFormExpose>()
const addModalRef = ref<TModalExpose>()
const editModalRef = ref<TModalExpose>()

// 新增表单数据
const addFormData = ref({
  name: '',
  email: '',
  role: 'viewer',
  status: 'active'
})

// 编辑表单数据
const editFormData = ref({
  id: '',
  name: '',
  email: '',
  role: 'viewer' as 'admin' | 'editor' | 'viewer',
  status: 'active' as 'active' | 'inactive' | 'suspended'
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
        { label: '管理员', value: 'admin' },
        { label: '编辑', value: 'editor' },
        { label: '查看者', value: 'viewer' }
      ],
      rules: [{ required: true, message: '请选择角色' }]
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '活跃', value: 'active' },
        { label: '非活跃', value: 'inactive' },
        { label: '已暂停', value: 'suspended' }
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

// 编辑表单 Schema
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
        { label: '管理员', value: 'admin' },
        { label: '编辑', value: 'editor' },
        { label: '查看者', value: 'viewer' }
      ],
      rules: [{ required: true, message: '请选择角色' }]
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '活跃', value: 'active' },
        { label: '非活跃', value: 'inactive' },
        { label: '已暂停', value: 'suspended' }
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

// ==================== 事件处理 ====================

/**
 * 处理新增用户提交
 */
function handleAddSubmit(values: Record<string, any>): void {
  usersStore.addUser({
    name: values.name,
    email: values.email,
    role: values.role,
    status: values.status
  })
  isAddDialogOpen.value = false
  // 重置表单
  addFormData.value = {
    name: '',
    email: '',
    role: 'viewer',
    status: 'active'
  }
}

/**
 * 处理编辑用户
 */
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

/**
 * 处理编辑提交
 */
function handleEditSubmit(values: Record<string, any>): void {
  if (editingUser.value) {
    usersStore.updateUser(editingUser.value.id, {
      name: values.name,
      email: values.email,
      role: values.role,
      status: values.status
    })
    isEditDialogOpen.value = false
    editingUser.value = null
  }
}

/**
 * 处理删除用户
 */
function handleDeleteUser(id: string): void {
  usersStore.deleteUser(id)
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
const selectedRows = ref<User[]>([])

function handleSelectChange(keys: (string | number)[], rows: any[]): void {
  selectedRowKeys.value = keys
  selectedRows.value = rows as User[]
}

/**
 * 批量删除
 */
function handleBatchDelete(): void {
  if (selectedRowKeys.value.length === 0) {
    alert('请先选择要删除的用户')
    return
  }
  if (confirm(`确定要删除选中的 ${selectedRowKeys.value.length} 个用户吗？`)) {
    selectedRowKeys.value.forEach(id => {
      usersStore.deleteUser(String(id))
    })
    tableRef.value?.clearSelection()
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
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

    <!-- 新增用户弹窗 -->
    <TModal
      ref="addModalRef"
      v-model:open="isAddDialogOpen"
      title="添加新用户"
      width="480"
      :footer="null"
    >
      <TForm
        ref="formRef"
        v-model="addFormData"
        :schema="addSchema"
        @submit="handleAddSubmit"
      />
    </TModal>

    <!-- 搜索表单 -->
    <Card class="border-dashed">
      <CardContent>
        <TForm v-model="searchFormData" :schema="searchSchema" />
      </CardContent>
    </Card>

    <!-- 用户表格 -->
    <Card>
      <CardHeader class="pb-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <CardTitle class="text-lg">用户列表</CardTitle>
            <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              共 {{ tableData.length }} 人
            </span>
          </div>
          <div class="flex items-center gap-2">
            <Button
              v-if="selectedRowKeys.length > 0"
              variant="outline"
              size="sm"
              class="h-8 text-xs"
              @click="handleBatchDelete"
            >
              批量删除 ({{ selectedRowKeys.length }})
            </Button>
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
          <!-- 自定义用户列 -->
          <template #user="slotProps">
            <Space>
              <Avatar
                :style="{
                  backgroundColor: (slotProps as any).record.status === 'active' ? '#87d068' : '#ccc'
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

          <!-- 自定义角色列 -->
          <template #role="slotProps">
            <Tag :color="(slotProps as any).text === 'admin' ? 'red' : (slotProps as any).text === 'editor' ? 'blue' : 'default'">
              {{ roleLabels[(slotProps as any).text] }}
            </Tag>
          </template>

          <!-- 自定义状态列 -->
          <template #status="slotProps">
            <Badge
              :class="{
                'bg-green-500/10 text-green-500 border-green-500/20': (slotProps as any).text === 'active',
                'bg-gray-500/10 text-gray-500 border-gray-500/20': (slotProps as any).text === 'inactive',
                'bg-red-500/10 text-red-500 border-red-500/20': (slotProps as any).text === 'suspended'
              }"
              variant="outline"
            >
              {{ statusConfig[(slotProps as any).text]?.text || (slotProps as any).text }}
            </Badge>
          </template>
        </TTable>
      </CardContent>
    </Card>

    <!-- 编辑弹窗 -->
    <TModal
      ref="editModalRef"
      v-model:open="isEditDialogOpen"
      title="编辑用户"
      width="480"
      :footer="null"
    >
      <TForm
        v-if="editingUser"
        ref="formRef"
        v-model="editFormData"
        :schema="editSchema"
        @submit="handleEditSubmit"
      />
    </TModal>
  </div>
</template>
