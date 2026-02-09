<script setup lang="ts">
/**
 * 角色管理页面
 * @description 管理系统角色和权限分配
 */
import { TTable } from '@/components/business/TTable'
import { TForm } from '@/components/business/TForm'
import type { TableSchema, TTableExpose } from '@/components/business/TTable'
import type { FormSchema } from '@/components/business/TForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TModal } from '@/components/business/TModal'
import { TDrawer } from '@/components/business/TDrawer'
import { roleApi } from '@/api'
import { useTableData, useMutation } from '@/composables'
import { Plus, Shield, Users, Key, Search, Check } from 'lucide-vue-next'
import { Tag, Tree, Checkbox, Space } from 'antdv-next'
import type { TreeProps } from 'antdv-next'

// ==================== 类型定义 ====================
interface Role {
  id: string
  name: string
  code: string
  description: string
  userCount: number
  permissions: string[]
  status: 'active' | 'inactive'
  createdAt: string
}

interface Permission {
  id: string
  name: string
  code: string
  children?: Permission[]
}

// ==================== 数据管理 ====================
const {
  data: roles,
  loading,
  searchQuery,
  fetchData,
} = useTableData<Role>({
  apiCall: async (params) => {
    const res = await roleApi.getRoles(params)
    return res || { list: [], total: 0, page: 1, pageSize: 10 }
  },
  apiCallParams: (ctx) => ({
    search: ctx.searchQuery,
  }),
})

const { mutate: createRole } = useMutation({
  mutationFn: (values: Record<string, any>) => roleApi.createRole({
    name: values.name,
    code: values.code,
    description: values.description,
    permissions: values.permissions || [],
    status: values.status
  }),
  successMessage: '角色创建成功',
  onSuccess: () => {
    isAddDialogOpen.value = false
    resetAddForm()
    fetchData()
  }
})

const { mutate: updateRole } = useMutation({
  mutationFn: ({ id, values }: { id: string; values: Record<string, any> }) =>
    roleApi.updateRole(id, {
      name: values.name,
      code: values.code,
      description: values.description,
      permissions: values.permissions,
      status: values.status
    }),
  successMessage: '角色更新成功',
  onSuccess: () => {
    isEditDialogOpen.value = false
    editingRole.value = null
    fetchData()
  }
})

const { mutate: deleteRole } = useMutation({
  mutationFn: (id: string) => roleApi.deleteRole(id),
  successMessage: '角色删除成功',
  onSuccess: () => fetchData()
})

const { mutate: updateRolePermissions } = useMutation({
  mutationFn: ({ id, permissions }: { id: string; permissions: string[] }) =>
    roleApi.updateRolePermissions(id, permissions),
  successMessage: '权限分配成功',
  onSuccess: () => {
    isPermissionDrawerOpen.value = false
    currentRole.value = null
    fetchData()
  }
})

// ==================== 权限数据 ====================
const permissionTree = ref<Permission[]>([
  {
    id: 'dashboard',
    name: '仪表盘',
    code: 'dashboard',
    children: [
      { id: 'dashboard:view', name: '查看仪表盘', code: 'dashboard:view' },
      { id: 'dashboard:export', name: '导出数据', code: 'dashboard:export' }
    ]
  },
  {
    id: 'system',
    name: '系统管理',
    code: 'system',
    children: [
      {
        id: 'system:user',
        name: '用户管理',
        code: 'system:user',
        children: [
          { id: 'system:user:view', name: '查看用户', code: 'system:user:view' },
          { id: 'system:user:create', name: '创建用户', code: 'system:user:create' },
          { id: 'system:user:update', name: '编辑用户', code: 'system:user:update' },
          { id: 'system:user:delete', name: '删除用户', code: 'system:user:delete' }
        ]
      },
      {
        id: 'system:organization',
        name: '组织架构',
        code: 'system:organization',
        children: [
          { id: 'system:organization:view', name: '查看部门', code: 'system:organization:view' },
          { id: 'system:organization:create', name: '创建部门', code: 'system:organization:create' },
          { id: 'system:organization:update', name: '编辑部门', code: 'system:organization:update' },
          { id: 'system:organization:delete', name: '删除部门', code: 'system:organization:delete' }
        ]
      },
      {
        id: 'system:role',
        name: '角色管理',
        code: 'system:role',
        children: [
          { id: 'system:role:view', name: '查看角色', code: 'system:role:view' },
          { id: 'system:role:create', name: '创建角色', code: 'system:role:create' },
          { id: 'system:role:update', name: '编辑角色', code: 'system:role:update' },
          { id: 'system:role:delete', name: '删除角色', code: 'system:role:delete' },
          { id: 'system:role:permission', name: '分配权限', code: 'system:role:permission' }
        ]
      },
      {
        id: 'system:menu',
        name: '菜单管理',
        code: 'system:menu',
        children: [
          { id: 'system:menu:view', name: '查看菜单', code: 'system:menu:view' },
          { id: 'system:menu:create', name: '创建菜单', code: 'system:menu:create' },
          { id: 'system:menu:update', name: '编辑菜单', code: 'system:menu:update' },
          { id: 'system:menu:delete', name: '删除菜单', code: 'system:menu:delete' }
        ]
      }
    ]
  },
  {
    id: 'products',
    name: '商品管理',
    code: 'products',
    children: [
      { id: 'products:view', name: '查看商品', code: 'products:view' },
      { id: 'products:create', name: '创建商品', code: 'products:create' },
      { id: 'products:update', name: '编辑商品', code: 'products:update' },
      { id: 'products:delete', name: '删除商品', code: 'products:delete' }
    ]
  },
  {
    id: 'orders',
    name: '订单管理',
    code: 'orders',
    children: [
      { id: 'orders:view', name: '查看订单', code: 'orders:view' },
      { id: 'orders:create', name: '创建订单', code: 'orders:create' },
      { id: 'orders:update', name: '编辑订单', code: 'orders:update' },
      { id: 'orders:delete', name: '删除订单', code: 'orders:delete' }
    ]
  }
])

// ==================== 搜索 ====================
const searchFormData = ref({
  keyword: ''
})

const searchSchema: FormSchema = {
  layout: 'inline',
  fields: [
    {
      name: 'keyword',
      type: 'input',
      label: '',
      placeholder: '搜索角色名称或编码...',
      className: 'w-[280px]'
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
    },
    onReset: () => {
      searchQuery.value = ''
    }
  }
}

// ==================== 表格配置 ====================
const tableRef = ref<TTableExpose>()

const tableSchema = computed<TableSchema>(() => ({
  columns: [
    {
      title: '角色名称',
      dataIndex: 'name',
      width: 180,
      slot: 'name'
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      width: 150
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      width: 100,
      align: 'center',
      slot: 'userCount'
    },
    {
      title: '权限数',
      dataIndex: 'permissions',
      width: 100,
      align: 'center',
      customRender: ({ text }) => (text as string[])?.length || 0
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      slot: 'status'
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 150
    }
  ],
  pagination: {
    pageSize: 10,
    show: true,
    showSizeChanger: true,
    showQuickJumper: true
  },
  actions: [
    {
      text: '权限',
      type: 'default',
      onClick: (record) => handleOpenPermissionDrawer(record as unknown as Role)
    },
    {
      text: '编辑',
      type: 'primary',
      onClick: (record) => handleEditRole(record as unknown as Role)
    },
    {
      text: '删除',
      type: 'danger',
      confirm: true,
      confirmText: '确定要删除该角色吗？此操作不可恢复。',
      onClick: (record) => handleDeleteRole((record as unknown as Role).id)
    }
  ],
  actionWidth: 200,
  actionFixed: 'right'
}))

// ==================== 弹窗和表单 ====================
const isAddDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const isPermissionDrawerOpen = ref(false)
const editingRole = ref<Role | null>(null)
const currentRole = ref<Role | null>(null)
const selectedPermissions = ref<string[]>([])
const expandedPermissionKeys = ref<string[]>(['system'])

const addFormData = ref({
  name: '',
  code: '',
  description: '',
  permissions: [] as string[],
  status: 'active'
})

const editFormData = ref({
  id: '',
  name: '',
  code: '',
  description: '',
  permissions: [] as string[],
  status: 'active'
})

const addSchema: FormSchema = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'name',
      type: 'input',
      label: '角色名称',
      placeholder: '请输入角色名称',
      rules: [
        { required: true, message: '角色名称不能为空' },
        { min: 2, message: '角色名称至少2个字符' }
      ]
    },
    {
      name: 'code',
      type: 'input',
      label: '角色编码',
      placeholder: '请输入角色编码',
      rules: [
        { required: true, message: '角色编码不能为空' },
        { pattern: /^[A-Za-z0-9_]+$/, message: '编码只能包含字母、数字和下划线' }
      ]
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ],
      rules: [{ required: true, message: '请选择状态' }]
    },
    {
      name: 'description',
      type: 'textarea',
      label: '描述',
      placeholder: '请输入角色描述',
      rows: 3
    }
  ],
  actions: {
    showSubmit: true,
    showReset: true,
    submitText: '添加角色',
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
      label: '角色名称',
      placeholder: '请输入角色名称',
      rules: [
        { required: true, message: '角色名称不能为空' },
        { min: 2, message: '角色名称至少2个字符' }
      ]
    },
    {
      name: 'code',
      type: 'input',
      label: '角色编码',
      placeholder: '请输入角色编码',
      disabled: true,
      rules: [
        { required: true, message: '角色编码不能为空' }
      ]
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ],
      rules: [{ required: true, message: '请选择状态' }]
    },
    {
      name: 'description',
      type: 'textarea',
      label: '描述',
      placeholder: '请输入角色描述',
      rows: 3
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
function handleEditRole(role: Role): void {
  editingRole.value = role
  editFormData.value = {
    id: role.id,
    name: role.name,
    code: role.code,
    description: role.description,
    permissions: role.permissions || [],
    status: role.status
  }
  isEditDialogOpen.value = true
}

function handleAddSubmit(values: Record<string, any>): void {
  createRole(values)
}

function handleEditSubmit(values: Record<string, any>): void {
  if (editingRole.value) {
    updateRole({ id: editingRole.value.id, values })
  }
}

function handleDeleteRole(id: string): void {
  deleteRole(id)
}

function resetAddForm(): void {
  addFormData.value = {
    name: '',
    code: '',
    description: '',
    permissions: [],
    status: 'active'
  }
}

// ==================== 权限分配 ====================
function handleOpenPermissionDrawer(role: Role): void {
  currentRole.value = role
  selectedPermissions.value = [...(role.permissions || [])]
  isPermissionDrawerOpen.value = true
}

function handlePermissionCheck(checkedKeys: string[]): void {
  selectedPermissions.value = checkedKeys
}

function handleSavePermissions(): void {
  if (currentRole.value) {
    updateRolePermissions({
      id: currentRole.value.id,
      permissions: selectedPermissions.value
    })
  }
}

// 统计卡片
const statisticsCards = computed(() => {
  const list = roles.value || []
  const total = list.length
  const active = list.filter(r => r.status === 'active').length
  const totalUsers = list.reduce((sum, r) => sum + (r.userCount || 0), 0)
  const totalPermissions = list.reduce((sum, r) => sum + ((r.permissions as string[])?.length || 0), 0)

  return [
    { title: '角色总数', value: total, icon: Shield, color: 'text-blue-500' },
    { title: '启用角色', value: active, icon: Check, color: 'text-green-500' },
    { title: '关联用户', value: totalUsers, icon: Users, color: 'text-purple-500' },
    { title: '权限总数', value: totalPermissions, icon: Key, color: 'text-orange-500' }
  ]
})

// 将权限数据转换为树形结构
const permissionTreeData = computed(() => {
  const convert = (items: Permission[]): any[] => {
    return items.map(item => ({
      key: item.id,
      title: item.name,
      children: item.children ? convert(item.children) : undefined
    }))
  }
  return convert(permissionTree.value)
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">角色管理</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">管理系统角色和权限分配</p>
      </div>
      <Button class="gap-2" @click="isAddDialogOpen = true">
        <Plus class="h-4 w-4" />
        添加角色
      </Button>
    </div>

    <!-- 统计卡片 -->
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

    <!-- 搜索栏 -->
    <div class="bg-muted/30 rounded-lg p-4">
      <TForm v-model="searchFormData" :schema="searchSchema" />
    </div>

    <!-- 角色列表 -->
    <Card class="border-0 shadow-sm">
      <CardHeader class="pb-4">
        <CardTitle class="text-base font-semibold">角色列表</CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <TTable
          ref="tableRef"
          v-model:data="roles"
          :schema="tableSchema"
          :loading="loading"
        >
          <template #name="slotProps">
            <div class="flex items-center gap-2">
              <Shield class="h-4 w-4 text-muted-foreground" />
              <span class="font-medium">{{ (slotProps as any).text }}</span>
            </div>
          </template>

          <template #userCount="slotProps">
            <Tag color="blue">{{ (slotProps as any).text }}人</Tag>
          </template>

          <template #status="slotProps">
            <Badge
              :class="{
                'bg-green-500/10 text-green-500 border-green-500/20': (slotProps as any).text === 'active',
                'bg-gray-500/10 text-gray-500 border-gray-500/20': (slotProps as any).text === 'inactive'
              }"
              variant="outline"
            >
              {{ (slotProps as any).text === 'active' ? '启用' : '禁用' }}
            </Badge>
          </template>

          <template #emptyText>
            <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search class="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p class="text-base font-medium mb-1">暂无角色数据</p>
              <p class="text-sm text-muted-foreground mb-4">开始添加您的第一个角色吧</p>
              <Button size="sm" @click="isAddDialogOpen = true">
                <Plus class="h-4 w-4 mr-1" />
                添加角色
              </Button>
            </div>
          </template>
        </TTable>
      </CardContent>
    </Card>

    <!-- 添加角色弹窗 -->
    <TModal
      v-model:open="isAddDialogOpen"
      title="添加角色"
      width="560"
      :footer="null"
    >
      <TForm
        v-model="addFormData"
        :schema="addSchema"
        @submit="handleAddSubmit"
      />
    </TModal>

    <!-- 编辑角色弹窗 -->
    <TModal
      v-model:open="isEditDialogOpen"
      title="编辑角色"
      width="560"
      :footer="null"
    >
      <TForm
        v-if="editingRole"
        v-model="editFormData"
        :schema="editSchema"
        @submit="handleEditSubmit"
      />
    </TModal>

    <!-- 权限分配抽屉 -->
    <TDrawer
      v-model:open="isPermissionDrawerOpen"
      title="权限分配"
      width="480"
      :footer="true"
      @confirm="handleSavePermissions"
    >
      <div v-if="currentRole" class="space-y-4">
        <div class="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Shield class="h-5 w-5 text-primary" />
          <div>
            <div class="font-medium">{{ currentRole.name }}</div>
            <div class="text-sm text-muted-foreground">{{ currentRole.code }}</div>
          </div>
        </div>
        <div class="border rounded-lg p-4">
          <Tree
            v-model:checked-keys="selectedPermissions"
            :tree-data="permissionTreeData"
            :expanded-keys="expandedPermissionKeys"
            checkable
            @check="handlePermissionCheck"
          />
        </div>
        <div class="text-sm text-muted-foreground">
          已选择 {{ selectedPermissions.length }} 个权限
        </div>
      </div>
    </TDrawer>
  </div>
</template>
