<script setup lang="ts">
/**
 * 角色管理页面
 * @description 管理系统角色和权限分配
 */
import { TTable, TForm, TModal, TDrawer, TDataCard, TPageHeader, TBatchActions, TStatusBadge, TEmptyState } from '@/components/business'
import type { TableSchema, TTableExpose } from '@/components/business'
import type { FormSchema } from '@/components/business'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { roleApi } from '@/api'
import { useTableData, useMutation } from '@/composables'
import { Plus, Shield, Users, Key, Search, Check, Edit, Trash2, Lock } from 'lucide-vue-next'
import { Tag, Tree, Checkbox, Space, Tooltip, Switch } from 'antdv-next'
import type { TreeProps } from 'antdv-next'
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
const permissionTreeRef = ref<any>(null)

/**
 * 打开权限分配抽屉
 * @param role - 当前角色
 */
function handleOpenPermissionDrawer(role: Role): void {
  currentRole.value = role
  // 重置联动模式为默认（联动）
  checkStrictly.value = false
  halfCheckedKeys.value = []
  selectedPermissions.value = [...(role.permissions || [])]
  // 默认展开系统管理节点
  expandedPermissionKeys.value = ['system']
  isPermissionDrawerOpen.value = true
}

/**
 * 处理权限节点选择
 * @param checkedKeys - 选中的节点 keys
 * @param e - 事件对象，包含半选状态信息
 */
function handlePermissionCheck(checkedKeys: string[], e: any): void {
  selectedPermissions.value = checkedKeys
  // 在联动模式下，保存半选状态的节点
  if (!checkStrictly.value && e?.halfCheckedKeys) {
    halfCheckedKeys.value = e.halfCheckedKeys
  }
}

/**
 * 切换父子节点联动模式
 * @param value - 是否启用严格模式（不联动）
 */
function handleCheckStrictlyChange(value: boolean): void {
  checkStrictly.value = value
  if (value) {
    // 切换到不联动模式时，清空半选状态
    halfCheckedKeys.value = []
  } else {
    // 切换到联动模式时，重新计算半选状态
    // 需要等待 Tree 组件重新渲染后计算
    nextTick(() => {
      calculateHalfCheckedKeys()
    })
  }
}

/**
 * 计算半选状态的节点 keys
 */
function calculateHalfCheckedKeys(): void {
  // 获取所有选中的叶子节点
  const checkedLeafKeys = selectedPermissions.value.filter(key => {
    const node = findNodeByKey(permissionTreeData.value, key)
    return node && !node.children
  })

  // 计算半选状态的父节点
  const halfChecked = new Set<string>()
  permissionTreeData.value.forEach(node => {
    calculateParentHalfChecked(node, checkedLeafKeys, halfChecked)
  })

  halfCheckedKeys.value = Array.from(halfChecked)
}

/**
 * 递归计算父节点的半选状态
 * @param node - 当前节点
 * @param checkedKeys - 选中的 keys
 * @param halfChecked - 半选状态集合
 * @returns 子节点选中数量
 */
function calculateParentHalfChecked(node: any, checkedKeys: string[], halfChecked: Set<string>): number {
  if (!node.children || node.children.length === 0) {
    return checkedKeys.includes(node.key) ? 1 : 0
  }

  let checkedCount = 0
  let totalChildren = 0

  node.children.forEach((child: any) => {
    const childChecked = calculateParentHalfChecked(child, checkedKeys, halfChecked)
    checkedCount += childChecked
    totalChildren += getAllLeafCount(child)
  })

  // 如果部分子节点被选中，则当前节点为半选状态
  if (checkedCount > 0 && checkedCount < totalChildren) {
    halfChecked.add(node.key)
  }

  return checkedCount
}

/**
 * 获取节点的所有叶子节点数量
 * @param node - 树节点
 * @returns 叶子节点数量
 */
function getAllLeafCount(node: any): number {
  if (!node.children || node.children.length === 0) {
    return 1
  }
  return node.children.reduce((sum: number, child: any) => sum + getAllLeafCount(child), 0)
}

/**
 * 根据 key 查找节点
 * @param tree - 树数据
 * @param key - 节点 key
 * @returns 找到的节点或 undefined
 */
function findNodeByKey(tree: any[], key: string): any | undefined {
  for (const node of tree) {
    if (node.key === key) {
      return node
    }
    if (node.children) {
      const found = findNodeByKey(node.children, key)
      if (found) return found
    }
  }
  return undefined
}

/**
 * 保存权限分配
 */
function handleSavePermissions(): void {
  if (currentRole.value) {
    // 在联动模式下，需要包含半选状态的父节点
    const permissionsToSave = checkStrictly.value
      ? selectedPermissions.value
      : [...selectedPermissions.value, ...halfCheckedKeys.value]

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

// 获取所有权限ID（用于全选功能）
/**
 * 获取所有权限ID（用于全选功能）
 * @param item - 树节点
 * @returns 所有子节点的 key 数组
 */
function getAllPermissionIds(item: any): string[] {
  const ids: string[] = [item.key]
  if (item.children && item.children.length > 0) {
    item.children.forEach((child: any) => {
      ids.push(...getAllPermissionIds(child))
    })
  }
  return ids
}

/**
 * 处理展开/折叠事件
 * @param expandedKeys - 展开的节点 keys
 */
function handleExpand(expandedKeys: string[]): void {
  expandedPermissionKeys.value = expandedKeys
}

/**
 * 展开所有节点
 */
function handleExpandAll(): void {
  const allKeys: string[] = []
  const collectKeys = (nodes: any[]) => {
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        allKeys.push(node.key)
        collectKeys(node.children)
      }
    })
  }
  collectKeys(permissionTreeData.value)
  expandedPermissionKeys.value = allKeys
}

/**
 * 折叠所有节点（只保留根节点）
 */
function handleCollapseAll(): void {
  expandedPermissionKeys.value = []
}

/**
 * 全选所有权限
 * 联动模式下：选中所有父节点，子节点自动联动
 * 不联动模式下：需要遍历选中所有节点
 */
function handleSelectAll(): void {
  if (checkStrictly.value) {
    // 不联动模式：选中所有节点（包括子节点）
    const allIds: string[] = []
    const collectAllIds = (nodes: any[]) => {
      nodes.forEach(node => {
        allIds.push(node.key)
        if (node.children) {
          collectAllIds(node.children)
        }
      })
    }
    collectAllIds(permissionTreeData.value)
    selectedPermissions.value = allIds
  } else {
    // 联动模式：只选中根节点，子节点会自动联动
    selectedPermissions.value = permissionTreeData.value.map(node => node.key)
  }
}

/**
 * 清空所有选中
 */
function handleClearAll(): void {
  selectedPermissions.value = []
  halfCheckedKeys.value = []
}

/**
 * 计算实际选中的权限数量（包含半选状态的父节点）
 */
const actualSelectedCount = computed(() => {
  if (checkStrictly.value) {
    // 不联动模式：直接返回选中的数量
    return selectedPermissions.value.length
  } else {
    // 联动模式：包含半选状态的节点
    return new Set([...selectedPermissions.value, ...halfCheckedKeys.value]).size
  }
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
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">权限列表</span>
            <Tag color="blue">{{ permissionTreeData.length }} 个模块</Tag>
          </div>
          <div class="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              class="h-7 text-xs"
              @click="handleExpandAll"
            >
              展开全部
            </Button>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 text-xs"
              @click="handleCollapseAll"
            >
              折叠全部
            </Button>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 text-xs"
              @click="handleSelectAll"
            >
              全选
            </Button>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 text-xs"
              @click="handleClearAll"
            >
              清空
            </Button>
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
          <Tree
            ref="permissionTreeRef"
            v-model:checked-keys="selectedPermissions"
            :tree-data="permissionTreeData"
            :expanded-keys="expandedPermissionKeys"
            :check-strictly="checkStrictly"
            checkable
            @check="handlePermissionCheck"
            @expand="handleExpand"
          />
        </div>

        <!-- 已选权限统计 -->
        <div class="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-lg">
          <div class="flex items-center gap-2">
            <Key class="h-4 w-4 text-muted-foreground" />
            <span class="text-sm text-muted-foreground">已选择</span>
            <Tooltip v-if="!checkStrictly && halfCheckedKeys.length > 0" :title="`包含 ${halfCheckedKeys.length} 个半选父节点`">
              <span class="text-xs text-muted-foreground cursor-help">(?)</span>
            </Tooltip>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-lg font-semibold text-primary">{{ actualSelectedCount }}</span>
            <span class="text-sm text-muted-foreground">个权限</span>
          </div>
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
