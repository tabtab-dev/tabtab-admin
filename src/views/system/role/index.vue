<script setup lang="ts">
/**
 * 角色管理页面
 * @description 管理系统角色和权限分配
 */
import { TTable, TForm, TModal, TDrawer, TDataCard, TPageHeader, TBatchActions, TStatusBadge, TEmptyState, TTree } from '@/components/business'
import type { TableSchema, TTableExpose } from '@/components/business'
import type { FormSchema } from '@/components/business'
import type { TTreeExpose, TreeNode } from '@/components/business'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { roleApi } from '@/api'
import { useTableData, useMutation } from '@/composables'
import { Plus, Shield, Users, Key, Search, Check, Edit, Trash2, Lock } from 'lucide-vue-next'
import { Tag, Checkbox, Space, Tooltip, Switch, Badge } from 'antdv-next'
import { nextTick } from 'vue'

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
  currentPage,
  pageSize,
  total,
  fetchData,
  goToPage,
  setPageSize,
} = useTableData<Role>({
  apiCall: async (params) => {
    const res = await roleApi.getRoles(params)
    return res || { list: [], total: 0, page: 1, pageSize: 10 }
  },
  apiCallParams: (ctx) => ({
    page: ctx.page,
    pageSize: ctx.pageSize,
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

const { mutate: batchDeleteRoles } = useMutation({
  mutationFn: (ids: string[]) => roleApi.batchDeleteRoles(ids),
  successMessage: '批量删除成功',
  onSuccess: () => {
    tableRef.value?.clearSelection()
    fetchData()
  }
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
      slot: 'permissionCount'
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
      ellipsis: true,
      slot: 'description'
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
    showQuickJumper: true,
    total: total.value
  },
  rowSelection: {
    type: 'checkbox',
    show: true
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
  actionWidth: 260,
  actionFixed: 'right'
}))

// ==================== 弹窗和表单 ====================
const isAddDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const isPermissionDrawerOpen = ref(false)
const editingRole = ref<Role | null>(null)
const currentRole = ref<Role | null>(null)

// 表单 ref，用于 TModal 触发表单验证
const addFormRef = ref()
const editFormRef = ref()
const selectedPermissions = ref<string[]>([])
const expandedPermissionKeys = ref<string[]>(['system'])

/**
 * 将权限数据转换为 TTree 格式
 */
const permissionTreeData = computed<TreeNode[]>(() => {
  const convert = (items: Permission[]): TreeNode[] => {
    return items.map(item => ({
      key: item.id,
      title: item.name,
      children: item.children ? convert(item.children) : undefined
    }))
  }
  return convert(permissionTree.value)
})

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

const selectedRowKeys = ref<(string | number)[]>([])
const selectedRows = ref<Role[]>([])

function handleSelectChange(keys: (string | number)[], rows: any[]): void {
  selectedRowKeys.value = keys
  selectedRows.value = rows as Role[]
}

function handleClearSelection(): void {
  selectedRowKeys.value = []
  selectedRows.value = []
  tableRef.value?.clearSelection()
}

function handleBatchDelete(): void {
  if (selectedRowKeys.value.length === 0) {
    alert('请先选择要删除的角色')
    return
  }
  if (confirm(`确定要删除选中的 ${selectedRowKeys.value.length} 个角色吗？`)) {
    batchDeleteRoles(selectedRowKeys.value as string[])
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
/** 是否启用父子节点联动模式 */
const checkStrictly = ref(false)
/** 半选状态的节点 keys */
const halfCheckedKeys = ref<string[]>([])
/** 权限树引用 */
const permissionTreeRef = ref<TTreeExpose | null>(null)

/**
 * 打开权限分配抽屉
 * @param role - 当前角色
 */
function handleOpenPermissionDrawer(role: Role): void {
  currentRole.value = role
  checkStrictly.value = false
  halfCheckedKeys.value = []
  selectedPermissions.value = [...(role.permissions || [])]
  expandedPermissionKeys.value = ['system']
  isPermissionDrawerOpen.value = true
}

/**
 * 处理权限节点选择
 */
function handlePermissionCheck(event: any): void {
  if (!checkStrictly.value) {
    halfCheckedKeys.value = event.halfCheckedKeys as string[]
  }
}

/**
 * 切换父子节点联动模式
 */
function handleCheckStrictlyChange(value: boolean): void {
  checkStrictly.value = value
  if (value) {
    halfCheckedKeys.value = []
  } else {
    nextTick(() => {
      const halfKeys = permissionTreeRef.value?.getHalfCheckedKeys()
      if (halfKeys) {
        halfCheckedKeys.value = halfKeys as string[]
      }
    })
  }
}

/**
 * 保存权限分配
 */
function handleSavePermissions(): void {
  if (currentRole.value) {
    const permissions = Array.isArray(selectedPermissions.value) ? selectedPermissions.value : []
    const halfKeys = Array.isArray(halfCheckedKeys.value) ? halfCheckedKeys.value : []
    
    const permissionsToSave = checkStrictly.value
      ? permissions
      : [...permissions, ...halfKeys]

    updateRolePermissions({
      id: currentRole.value.id,
      permissions: [...new Set(permissionsToSave)]
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
</script>

<template>
  <div class="space-y-6">
    <TPageHeader
      title="角色管理"
      subtitle="管理系统角色和权限分配"
      :actions="[
        { text: '添加角色', type: 'primary', iconName: 'Plus', onClick: () => isAddDialogOpen = true }
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
      <TForm v-model="searchFormData" :schema="searchSchema" />
    </div>

    <!-- 角色列表 -->
    <Card class="bg-muted/40 border border-border/50 rounded-xl">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <CardTitle class="text-base font-semibold">角色列表</CardTitle>
            <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              共 {{ roles?.length || 0 }} 个角色
            </span>
          </div>
          <TBatchActions
            :count="selectedRowKeys.length"
            :total="total"
            item-name="角色"
            class-name="border-0 bg-transparent shadow-none px-0 py-0"
            :actions="[
              {
                text: '批量删除',
                type: 'danger',
                confirm: true,
                confirmText: '确定要删除选中的角色吗？此操作不可恢复。',
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
          v-model:data="roles"
          :schema="tableSchema"
          :loading="loading"
          @select-change="handleSelectChange"
          @change="handleTableChange"
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

          <template #permissionCount="slotProps">
            <Tag color="purple">{{ ((slotProps as any).text as string[])?.length || 0 }}</Tag>
          </template>

          <template #status="slotProps">
            <TStatusBadge
              :status="(slotProps as any).text"
              :status-map="{
                active: { text: '启用', color: 'success' },
                inactive: { text: '禁用', color: 'default' },
                disabled: { text: '停用', color: 'error' }
              }"
            />
          </template>

          <template #description="slotProps">
            <Tooltip v-if="(slotProps as any).text" :title="(slotProps as any).text">
              <span class="truncate block max-w-[200px]">{{ (slotProps as any).text }}</span>
            </Tooltip>
            <span v-else class="text-muted-foreground">-</span>
          </template>

          <template #emptyText>
            <TEmptyState
              type="data"
              title="暂无角色数据"
              description="开始添加您的第一个角色吧"
              :action="{ text: '添加角色', type: 'primary', iconName: 'Plus', onClick: () => isAddDialogOpen = true }"
            />
          </template>
        </TTable>
      </CardContent>
    </Card>

    <!-- 添加角色弹窗 -->
    <TModal
      v-model:open="isAddDialogOpen"
      title="添加角色"
      width="560"
      :form-ref="addFormRef"
      @submit="handleAddSubmit"
    >
      <TForm
        ref="addFormRef"
        v-model="addFormData"
        :schema="addSchema"
        embedded
      />
    </TModal>

    <!-- 编辑角色弹窗 -->
    <TModal
      v-model:open="isEditDialogOpen"
      title="编辑角色"
      width="560"
      :form-ref="editFormRef"
      @submit="handleEditSubmit"
    >
      <TForm
        v-if="editingRole"
        ref="editFormRef"
        v-model="editFormData"
        :schema="editSchema"
        embedded
      />
    </TModal>

    <!-- 权限分配抽屉 -->
    <TDrawer
      v-model:open="isPermissionDrawerOpen"
      title="权限分配"
      width="520"
    >
      <div v-if="currentRole" class="space-y-4">
        <!-- 角色信息卡片 -->
        <div class="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/10">
          <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield class="h-5 w-5 text-primary" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-medium text-base">{{ currentRole.name }}</div>
            <div class="text-sm text-muted-foreground truncate">{{ currentRole.code }}</div>
          </div>
          <Badge
            :class="{
              'bg-green-500/10 text-green-500 border-green-500/20': currentRole.status === 'active',
              'bg-gray-500/10 text-gray-500 border-gray-500/20': currentRole.status === 'inactive'
            }"
            variant="outline"
          >
            {{ currentRole.status === 'active' ? '启用' : '禁用' }}
          </Badge>
        </div>

        <!-- 权限统计 -->
        <div class="flex items-center justify-between px-1 flex-wrap gap-y-2">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">权限列表</span>
            <Tag color="blue">{{ permissionTreeData.length }} 个模块</Tag>
          </div>
        </div>

        <!-- 联动模式开关 -->
        <div class="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-lg">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">父子节点联动</span>
            <Tooltip title="开启后，选中父节点会自动选中所有子节点">
              <span class="text-muted-foreground cursor-help">(?)</span>
            </Tooltip>
          </div>
          <Switch
            v-model:checked="checkStrictly"
            checked-children="独立"
            un-checked-children="联动"
            @change="handleCheckStrictlyChange"
          />
        </div>

        <!-- 权限树 -->
        <div class="border rounded-lg p-4 bg-muted/20">
          <TTree
            ref="permissionTreeRef"
            v-model="selectedPermissions"
            v-model:half-checked-keys="halfCheckedKeys"
            v-model:expanded-keys="expandedPermissionKeys"
            :tree-data="permissionTreeData"
            :check-strictly="checkStrictly"
            checkable
            toolbar
            :statistics="{ enabled: true, label: '已选择', unit: '个权限', showHalfChecked: !checkStrictly }"
            @check="handlePermissionCheck"
          />
        </div>
      </div>

      <!-- 底部按钮 -->
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button variant="outline" @click="isPermissionDrawerOpen = false">
            取消
          </Button>
          <Button @click="handleSavePermissions">
            保存
          </Button>
        </div>
      </template>
    </TDrawer>
  </div>
</template>
