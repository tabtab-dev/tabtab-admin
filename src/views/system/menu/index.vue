<script setup lang="ts">
/**
 * 菜单管理页面
 * @description 管理系统菜单和导航配置，使用 TTable 树形表格展示
 */
import { TTable, TForm, TModal, TDataCard, TPageHeader, TStatusBadge, TEmptyState } from '@/components/business'
import type { TableSchema, TTableExpose, TableRecord } from '@/components/business'
import type { FormSchema } from '@/components/business'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { menuApi } from '@/api'
import type { Menu as MenuType, MenuType as MenuTypeEnum } from '@/api/modules/menu'
import { useTableData, useMutation } from '@/composables'
import { Plus, Menu, FolderTree, Eye, EyeOff, Search, LayoutGrid, ExternalLink } from 'lucide-vue-next'
import { Switch, Tooltip } from 'antdv-next'
import { getIcon } from '@/composables/useIcon'
import { watch } from 'vue'

// ==================== 数据管理 ====================
const {
  data: flatMenus,
  loading,
  searchQuery,
  fetchData,
} = useTableData<MenuType>({
  apiCall: async (params) => {
    const res = await menuApi.getMenus(params)
    return res || { list: [], total: 0, page: 1, pageSize: 10 }
  },
  apiCallParams: (ctx) => ({
    search: ctx.searchQuery,
  }),
})

/**
 * 将扁平菜单数据转换为树形结构
 * @param menus 扁平菜单列表
 * @returns 树形菜单数据
 */
function buildMenuTree(menus: MenuType[]): MenuType[] {
  const menuMap = new Map<string, MenuType>()
  const roots: MenuType[] = []

  // 先创建所有节点的副本（不添加 children 字段）
  menus.forEach(menu => {
    menuMap.set(menu.id, { ...menu })
  })

  // 构建树形结构
  menus.forEach(menu => {
    const node = menuMap.get(menu.id)!
    if (menu.parentId && menuMap.has(menu.parentId)) {
      const parent = menuMap.get(menu.parentId)!
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(node)
      // 按排序值排序
      parent.children.sort((a, b) => a.sort - b.sort)
    } else {
      roots.push(node)
    }
  })

  // 根节点也按排序值排序
  return roots.sort((a, b) => a.sort - b.sort)
}

/**
 * 树形菜单数据
 */
const treeMenus = computed(() => buildMenuTree(flatMenus.value))

const { mutate: createMenu } = useMutation({
  mutationFn: (values: Record<string, any>) => menuApi.createMenu({
    name: values.name,
    title: values.title,
    path: values.path,
    component: values.component,
    icon: values.icon,
    parentId: values.parentId || null,
    sort: values.sort || 0,
    status: values.status,
    hidden: values.hidden || false,
    keepAlive: values.keepAlive || false,
    external: values.external || false,
    permission: values.permission,
    type: values.type || 'menu'
  }),
  successMessage: '菜单创建成功',
  onSuccess: () => {
    isAddDialogOpen.value = false
    resetAddForm()
    fetchData()
  }
})

const { mutate: updateMenu } = useMutation({
  mutationFn: ({ id, values }: { id: string; values: Record<string, any> }) =>
    menuApi.updateMenu(id, {
      name: values.name,
      title: values.title,
      path: values.path,
      component: values.component,
      icon: values.icon,
      parentId: values.parentId || null,
      sort: values.sort,
      status: values.status,
      hidden: values.hidden,
      keepAlive: values.keepAlive,
      external: values.external,
      permission: values.permission,
      type: values.type
    }),
  successMessage: '菜单更新成功',
  onSuccess: () => {
    isEditDialogOpen.value = false
    editingMenu.value = null
    fetchData()
  }
})

const { mutate: deleteMenu } = useMutation({
  mutationFn: (id: string) => menuApi.deleteMenu(id),
  successMessage: '菜单删除成功',
  onSuccess: () => fetchData()
})

const { mutate: updateMenuStatus } = useMutation({
  mutationFn: ({ id, status }: { id: string; status: string }) =>
    menuApi.updateMenuStatus(id, status),
  successMessage: '状态更新成功',
  onSuccess: () => fetchData()
})

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
      placeholder: '搜索菜单名称或路径...',
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

/**
 * 获取图标组件
 * @param iconName 图标名称
 * @returns 图标组件
 */
function getIconComponent(iconName: string) {
  return getIcon(iconName) || Menu
}

/**
 * 获取菜单类型标签配置
 * @param type 菜单类型
 * @returns 标签配置
 */
function getMenuTypeConfig(type: MenuTypeEnum) {
  const config = {
    directory: { label: '目录', color: 'blue' },
    menu: { label: '菜单', color: 'green' },
    button: { label: '按钮', color: 'orange' }
  }
  return config[type] || config.menu
}

const tableSchema = computed<TableSchema>(() => ({
  columns: [
    {
      title: '菜单名称',
      dataIndex: 'title',
      width: 200,
      slot: 'title'
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      align: 'center',
      slot: 'type'
    },
    {
      title: '路由路径',
      dataIndex: 'path',
      width: 160,
      ellipsis: true
    },
    {
      title: '组件',
      dataIndex: 'component',
      width: 140,
      ellipsis: true
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 70,
      align: 'center',
      slot: 'icon'
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 60,
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      slot: 'status'
    },
    {
      title: '可见',
      dataIndex: 'hidden',
      width: 60,
      align: 'center',
      slot: 'hidden'
    },
    {
      title: '缓存',
      dataIndex: 'keepAlive',
      width: 60,
      align: 'center',
      slot: 'keepAlive'
    },
    {
      title: '外链',
      dataIndex: 'external',
      width: 60,
      align: 'center',
      slot: 'external'
    }
  ],
  // 树形表格配置
  childrenColumnName: 'children',
  indentSize: 20,
  expandable: {
    defaultExpandAllRows: true
  },
  // 禁用分页，树形表格通常不需要分页
  pagination: false,
  actions: [
    {
      text: '编辑',
      type: 'primary',
      onClick: (record) => handleEditMenu(record as MenuType)
    },
    {
      text: '删除',
      type: 'danger',
      confirm: true,
      confirmText: '确定要删除该菜单吗？子菜单也会被删除，此操作不可恢复。',
      onClick: (record) => handleDeleteMenu((record as MenuType).id)
    }
  ],
  actionWidth: 150,
  actionFixed: 'right'
}))

// ==================== 弹窗和表单 ====================
const isAddDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const editingMenu = ref<MenuType | null>(null)

/**
 * 创建表单初始值
 * @returns 表单初始值对象
 */
function createInitialFormData() {
  return {
    name: '',
    title: '',
    path: '',
    component: '',
    icon: '',
    parentId: null as string | null,
    sort: 0,
    status: 'active' as 'active' | 'inactive',
    hidden: false,
    keepAlive: false,
    external: false,
    permission: '',
    type: 'menu' as MenuTypeEnum
  }
}

const addFormData = ref(createInitialFormData())
const editFormData = ref({ id: '', ...createInitialFormData() })

// 监听路由路径变化，自动填充组件路径
watch(() => addFormData.value.path, (newPath) => {
  if (newPath && !addFormData.value.component) {
    // 将 /system/user 转换为 system/user/index
    const cleanPath = newPath.startsWith('/') ? newPath.slice(1) : newPath
    addFormData.value.component = cleanPath ? `${cleanPath}/index` : ''
  }
})

// 菜单选择选项
const menuOptions = computed(() => {
  const list = flatMenus.value || []
  return [
    { label: '顶级菜单', value: null },
    ...list.map(item => ({
      label: item.title,
      value: item.id
    }))
  ]
})

/**
 * 上级菜单树形选项
 */
const menuTreeOptions = computed(() => {
  const buildTree = (menus: MenuType[]): any[] => {
    return menus.map(menu => ({
      title: menu.title,
      value: menu.id,
      key: menu.id,
      children: menu.children ? buildTree(menu.children) : undefined
    }))
  }

  const treeData = buildTree(treeMenus.value)

  return [
    {
      title: '顶级菜单',
      value: '',
      key: 'root',
      children: treeData
    }
  ]
})

/**
 * 菜单类型选项
 */
const menuTypeOptions = [
  { label: '目录', value: 'directory', color: 'blue' },
  { label: '菜单', value: 'menu', color: 'green' },
  { label: '按钮', value: 'button', color: 'orange' }
]

/**
 * 获取表单字段配置
 * @param isEdit 是否为编辑模式
 * @returns 表单字段配置数组
 */
function getFormFields(isEdit: boolean) {
  return [
    {
      name: 'type',
      type: 'select' as const,
      label: '菜单类型',
      placeholder: '请选择菜单类型',
      options: menuTypeOptions,
      disabled: isEdit,
      rules: [{ required: true, message: '请选择菜单类型' }]
    },
    {
      name: 'title',
      type: 'input' as const,
      label: '菜单标题',
      placeholder: '请输入菜单标题',
      rules: [
        { required: true, message: '菜单标题不能为空' },
        { min: 2, message: '菜单标题至少2个字符' }
      ]
    },
    {
      name: 'name',
      type: 'input' as const,
      label: '路由名称',
      placeholder: '请输入路由名称',
      disabled: isEdit,
      dependencies: {
        field: 'type',
        condition: (value) => value !== 'button'
      },
      rules: [
        { required: true, message: '路由名称不能为空' },
        { pattern: /^[A-Za-z0-9_-]+$/, message: '名称只能包含字母、数字、下划线和横线' }
      ]
    },
    {
      name: 'path',
      type: 'input' as const,
      label: '路由路径',
      placeholder: '请输入路由路径，如 /system/user',
      dependencies: {
        field: 'type',
        condition: (value) => value !== 'button'
      },
      rules: [
        { required: true, message: '路由路径不能为空' },
        { pattern: /^\/[A-Za-z0-9/_-]*$/, message: '路径格式不正确' }
      ]
    },
    {
      name: 'component',
      type: 'input' as const,
      label: '组件路径',
      placeholder: '请输入组件路径，如 system/user/index',
      dependencies: {
        field: 'type',
        condition: (value) => value === 'menu'
      },
      rules: [
        { required: true, message: '组件路径不能为空' }
      ]
    },
    {
      name: 'parentId',
      type: 'tree-select' as const,
      label: '上级菜单',
      placeholder: '请选择上级菜单',
      options: menuTreeOptions.value,
      disabled: isEdit,
      props: {
        treeDefaultExpandAll: true,
        allowClear: true,
        showSearch: true,
        treeNodeFilterProp: 'title'
      }
    },
    {
      name: 'icon',
      type: 'icon' as const,
      label: '图标',
      placeholder: '请选择图标',
      dependencies: {
        field: 'type',
        condition: (value) => value !== 'button'
      },
      props: {
        showClear: true,
        showCategoryTabs: true,
        popupWidth: 840,
        columns: 10
      }
    },
    {
      name: 'sort',
      type: 'number' as const,
      label: '排序',
      placeholder: '请输入排序号',
      min: 0
    },
    {
      name: 'permission',
      type: 'input' as const,
      label: '权限标识',
      placeholder: '请输入权限标识，如 system:user:view',
      dependencies: {
        field: 'type',
        condition: (value) => value === 'button'
      }
    },
    {
      name: 'status',
      type: 'select' as const,
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ],
      rules: [{ required: true, message: '请选择状态' }]
    },
    {
      name: 'hidden',
      type: 'switch' as const,
      label: '隐藏菜单',
      checkedChildren: '是',
      unCheckedChildren: '否',
      dependencies: {
        field: 'type',
        condition: (value) => value !== 'button'
      }
    },
    {
      name: 'keepAlive',
      type: 'switch' as const,
      label: '缓存页面',
      checkedChildren: '是',
      unCheckedChildren: '否',
      dependencies: {
        field: 'type',
        condition: (value) => value === 'menu'
      }
    },
    {
      name: 'external',
      type: 'switch' as const,
      label: '外部链接',
      checkedChildren: '是',
      unCheckedChildren: '否',
      dependencies: {
        field: 'type',
        condition: (value) => value === 'menu'
      }
    }
  ]
}

const addSchema = computed<FormSchema>(() => ({
  layout: 'horizontal',
  // 每行显示2个组件
  columns: 2,
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  fields: getFormFields(false),
  actions: {
    showSubmit: true,
    showReset: true,
    submitText: '添加菜单',
    resetText: '取消',
    align: 'right',
    onReset: () => {
      isAddDialogOpen.value = false
    }
  }
}))

const editSchema = computed<FormSchema>(() => ({
  layout: 'horizontal',
  // 每行显示2个组件
  columns: 2,
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  fields: getFormFields(true),
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
}))

// ==================== 事件处理 ====================
/**
 * 处理编辑菜单
 * @param menu 菜单数据
 */
function handleEditMenu(menu: MenuType): void {
  editingMenu.value = menu
  editFormData.value = {
    id: menu.id,
    name: menu.name,
    title: menu.title,
    path: menu.path,
    component: menu.component,
    icon: menu.icon,
    parentId: menu.parentId,
    sort: menu.sort,
    status: menu.status,
    hidden: menu.hidden,
    keepAlive: menu.keepAlive,
    external: menu.external,
    permission: menu.permission,
    type: menu.type
  }
  isEditDialogOpen.value = true
}

/**
 * 处理添加菜单提交
 * @param values 表单值
 */
function handleAddSubmit(values: Record<string, any>): void {
  createMenu(values)
}

/**
 * 处理编辑菜单提交
 * @param values 表单值
 */
function handleEditSubmit(values: Record<string, any>): void {
  if (editingMenu.value) {
    updateMenu({ id: editingMenu.value.id, values })
  }
}

/**
 * 处理删除菜单
 * @param id 菜单ID
 */
function handleDeleteMenu(id: string): void {
  deleteMenu(id)
}

/**
 * 处理切换菜单状态
 * @param menu 菜单数据
 */
function handleToggleStatus(menu: MenuType): void {
  const newStatus = menu.status === 'active' ? 'inactive' : 'active'
  updateMenuStatus({ id: menu.id, status: newStatus })
}

/**
 * 重置添加表单
 */
function resetAddForm(): void {
  addFormData.value = createInitialFormData()
}

// 统计卡片
const statisticsCards = computed(() => {
  const list = flatMenus.value || []
  const total = list.length
  const active = list.filter(m => m.status === 'active').length
  const visible = list.filter(m => !m.hidden).length
  const directoryCount = list.filter(m => m.type === 'directory').length
  const menuCount = list.filter(m => m.type === 'menu').length
  const buttonCount = list.filter(m => m.type === 'button').length

  return [
    { title: '菜单总数', value: total, icon: Menu, color: 'text-blue-500' },
    { title: '目录', value: directoryCount, icon: FolderTree, color: 'text-cyan-500' },
    { title: '菜单', value: menuCount, icon: LayoutGrid, color: 'text-green-500' },
    { title: '按钮', value: buttonCount, icon: Eye, color: 'text-orange-500' }
  ]
})
</script>

<template>
  <div class="space-y-6">
    <TPageHeader
      title="菜单管理"
      subtitle="管理系统导航菜单和路由配置"
      :actions="[
        { text: '添加菜单', type: 'primary', iconName: 'Plus', onClick: () => isAddDialogOpen = true }
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

    <!-- 树形表格 -->
    <Card class="bg-muted/40 border border-border/50 rounded-xl">
      <CardHeader class="pb-4">
        <CardTitle class="text-base font-semibold">菜单结构</CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <TTable
          ref="tableRef"
          v-model:data="treeMenus"
          :schema="tableSchema"
          :loading="loading"
        >
          <!-- 菜单名称列 -->
          <template #title="{ text, record }">
            <div class="flex items-center gap-2">
              <component
                v-if="record"
                :is="getIconComponent((record as MenuType).icon)"
                class="h-4 w-4 text-muted-foreground"
              />
              <span class="font-medium">{{ text }}</span>
            </div>
          </template>

          <!-- 图标列 -->
          <template #icon="{ text }">
            <component
              :is="getIconComponent(text as string)"
              v-if="text"
              class="h-4 w-4 text-muted-foreground mx-auto"
            />
            <span v-else class="text-muted-foreground">-</span>
          </template>

          <!-- 类型列 -->
          <template #type="{ text }">
            <TStatusBadge
              v-if="text"
              :status="text"
              :status-map="{
                directory: { text: '目录', color: 'info' },
                menu: { text: '菜单', color: 'success' },
                button: { text: '按钮', color: 'warning' }
              }"
            />
          </template>

          <!-- 状态列 -->
          <template #status="{ text, record }">
            <TStatusBadge
              v-if="record"
              :status="text"
              :status-map="{
                active: { text: '启用', color: 'success' },
                inactive: { text: '禁用', color: 'default' }
              }"
              clickable
              @click="handleToggleStatus(record as MenuType)"
            />
          </template>

          <!-- 可见列 -->
          <template #hidden="{ text }">
            <Eye v-if="!text" class="h-4 w-4 text-green-500 mx-auto" />
            <EyeOff v-else class="h-4 w-4 text-gray-400 mx-auto" />
          </template>

          <!-- 缓存列 -->
          <template #keepAlive="{ text }">
            <Switch
              :checked="text as boolean"
              size="small"
              disabled
              class="mx-auto"
            />
          </template>

          <!-- 外链列 -->
          <template #external="{ text }">
            <ExternalLink
              v-if="text"
              class="h-4 w-4 text-blue-500 mx-auto"
            />
            <span v-else class="text-muted-foreground block text-center">-</span>
          </template>

          <!-- 空状态 -->
          <template #emptyText>
            <TEmptyState
              type="data"
              title="暂无菜单数据"
              description="开始添加您的第一个菜单吧"
              :action="{ text: '添加菜单', type: 'primary', iconName: 'Plus', onClick: () => isAddDialogOpen = true }"
            />
          </template>
        </TTable>
      </CardContent>
    </Card>

    <!-- 添加菜单弹窗 -->
    <TModal
      v-model:open="isAddDialogOpen"
      title="添加菜单"
      width="800"
      :footer="null"
    >
      <TForm
        v-model="addFormData"
        :schema="addSchema"
        @submit="handleAddSubmit"
      />
    </TModal>

    <!-- 编辑菜单弹窗 -->
    <TModal
      v-model:open="isEditDialogOpen"
      title="编辑菜单"
      width="800"
      :footer="null"
    >
      <TForm
        v-if="editingMenu"
        v-model="editFormData"
        :schema="editSchema"
        @submit="handleEditSubmit"
      />
    </TModal>
  </div>
</template>
