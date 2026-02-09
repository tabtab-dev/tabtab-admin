<script setup lang="ts">
/**
 * 菜单管理页面
 * @description 管理系统菜单和导航配置
 */
import { TTable } from '@/components/business/TTable'
import { TForm } from '@/components/business/TForm'
import type { TableSchema, TTableExpose } from '@/components/business/TTable'
import type { FormSchema } from '@/components/business/TForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TModal } from '@/components/business/TModal'
import { menuApi } from '@/api'
import { useTableData, useMutation } from '@/composables'
import { Plus, Menu, FolderTree, Eye, EyeOff, Search, LayoutGrid, ExternalLink } from 'lucide-vue-next'
import { Tag, Tree, Switch, Space, Tooltip } from 'antdv-next'
import type { TreeProps } from 'antdv-next'

// ==================== 类型定义 ====================
interface Menu {
  id: string
  name: string
  title: string
  path: string
  component: string
  icon: string
  parentId: string | null
  sort: number
  status: 'active' | 'inactive'
  hidden: boolean
  keepAlive: boolean
  external: boolean
  permission: string
  createdAt: string
  children?: Menu[]
}

// ==================== 数据管理 ====================
const {
  data: menus,
  loading,
  searchQuery,
  fetchData,
} = useTableData<Menu>({
  apiCall: async (params) => {
    const res = await menuApi.getMenus(params)
    return res || { list: [], total: 0, page: 1, pageSize: 10 }
  },
  apiCallParams: (ctx) => ({
    search: ctx.searchQuery,
  }),
})

const { mutate: createMenu } = useMutation({
  mutationFn: (values: Record<string, any>) => menuApi.createMenu({
    name: values.name,
    title: values.title,
    path: values.path,
    component: values.component,
    icon: values.icon,
    parentId: values.parentId,
    sort: values.sort || 0,
    status: values.status,
    hidden: values.hidden || false,
    keepAlive: values.keepAlive || false,
    external: values.external || false,
    permission: values.permission
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
      parentId: values.parentId,
      sort: values.sort,
      status: values.status,
      hidden: values.hidden,
      keepAlive: values.keepAlive,
      external: values.external,
      permission: values.permission
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

// ==================== 视图模式 ====================
const viewMode = ref<'tree' | 'list'>('tree')
const expandedKeys = ref<string[]>([])

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

// ==================== 树形数据转换 ====================
const treeData = computed(() => {
  const list = menus.value || []
  const buildTree = (parentId: string | null): any[] => {
    return list
      .filter(item => item.parentId === parentId)
      .sort((a, b) => a.sort - b.sort)
      .map(item => ({
        key: item.id,
        title: item.title,
        data: item,
        children: buildTree(item.id)
      }))
  }
  return buildTree(null)
})

// ==================== 表格配置 ====================
const tableRef = ref<TTableExpose>()

const tableSchema = computed<TableSchema>(() => ({
  columns: [
    {
      title: '菜单名称',
      dataIndex: 'title',
      width: 200,
      slot: 'title'
    },
    {
      title: '路由路径',
      dataIndex: 'path',
      width: 180
    },
    {
      title: '组件',
      dataIndex: 'component',
      width: 150,
      ellipsis: true
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 100,
      align: 'center'
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      slot: 'status'
    },
    {
      title: '可见',
      dataIndex: 'hidden',
      width: 80,
      align: 'center',
      slot: 'hidden'
    },
    {
      title: '缓存',
      dataIndex: 'keepAlive',
      width: 80,
      align: 'center',
      slot: 'keepAlive'
    },
    {
      title: '外链',
      dataIndex: 'external',
      width: 80,
      align: 'center',
      slot: 'external'
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
      text: '编辑',
      type: 'primary',
      onClick: (record) => handleEditMenu(record as unknown as Menu)
    },
    {
      text: '删除',
      type: 'danger',
      confirm: true,
      confirmText: '确定要删除该菜单吗？此操作不可恢复。',
      onClick: (record) => handleDeleteMenu((record as unknown as Menu).id)
    }
  ],
  actionWidth: 150,
  actionFixed: 'right'
}))

// ==================== 弹窗和表单 ====================
const isAddDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const editingMenu = ref<Menu | null>(null)

const addFormData = ref({
  name: '',
  title: '',
  path: '',
  component: '',
  icon: '',
  parentId: null as string | null,
  sort: 0,
  status: 'active',
  hidden: false,
  keepAlive: false,
  external: false,
  permission: ''
})

const editFormData = ref({
  id: '',
  name: '',
  title: '',
  path: '',
  component: '',
  icon: '',
  parentId: null as string | null,
  sort: 0,
  status: 'active',
  hidden: false,
  keepAlive: false,
  external: false,
  permission: ''
})

// 菜单选择选项
const menuOptions = computed(() => {
  const list = menus.value || []
  return [
    { label: '顶级菜单', value: null },
    ...list.map(item => ({
      label: item.title,
      value: item.id
    }))
  ]
})

// 图标选项
const iconOptions = [
  { label: '仪表盘', value: 'LayoutDashboard' },
  { label: '用户', value: 'Users' },
  { label: '购物车', value: 'ShoppingCart' },
  { label: '包裹', value: 'Package' },
  { label: '文件', value: 'FileText' },
  { label: '标签', value: 'Tags' },
  { label: '文件夹', value: 'FolderTree' },
  { label: '图层', value: 'Layers' },
  { label: '盒子', value: 'Box' },
  { label: '仓库', value: 'Warehouse' },
  { label: '列表', value: 'ClipboardList' },
  { label: '建筑', value: 'Building' },
  { label: '地图标记', value: 'MapPin' },
  { label: '卡车', value: 'Truck' },
  { label: '图表', value: 'ChartBar' },
  { label: '趋势', value: 'TrendingUp' },
  { label: '美元', value: 'DollarSign' },
  { label: '用户圆', value: 'UserRound' },
  { label: '设置', value: 'Settings' },
  { label: '表单', value: 'Form' },
  { label: '表格', value: 'Table' },
  { label: '消息', value: 'MessageSquare' },
  { label: '面板', value: 'PanelRight' },
  { label: '盾牌', value: 'Shield' },
  { label: '菜单', value: 'Menu' },
  { label: '列表树', value: 'FolderTree' },
  { label: '眼睛', value: 'Eye' },
  { label: '网格', value: 'LayoutGrid' },
  { label: '链接', value: 'ExternalLink' }
]

const addSchema: FormSchema = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'title',
      type: 'input',
      label: '菜单标题',
      placeholder: '请输入菜单标题',
      rules: [
        { required: true, message: '菜单标题不能为空' },
        { min: 2, message: '菜单标题至少2个字符' }
      ]
    },
    {
      name: 'name',
      type: 'input',
      label: '路由名称',
      placeholder: '请输入路由名称',
      rules: [
        { required: true, message: '路由名称不能为空' },
        { pattern: /^[A-Za-z0-9_-]+$/, message: '名称只能包含字母、数字、下划线和横线' }
      ]
    },
    {
      name: 'path',
      type: 'input',
      label: '路由路径',
      placeholder: '请输入路由路径，如 /system/user',
      rules: [
        { required: true, message: '路由路径不能为空' },
        { pattern: /^\/[A-Za-z0-9/_-]*$/, message: '路径格式不正确' }
      ]
    },
    {
      name: 'component',
      type: 'input',
      label: '组件路径',
      placeholder: '请输入组件路径，如 /user/index',
      rules: [
        { required: true, message: '组件路径不能为空' }
      ]
    },
    {
      name: 'parentId',
      type: 'select',
      label: '上级菜单',
      placeholder: '请选择上级菜单',
      options: menuOptions.value
    },
    {
      name: 'icon',
      type: 'select',
      label: '图标',
      placeholder: '请选择图标',
      options: iconOptions
    },
    {
      name: 'sort',
      type: 'number',
      label: '排序',
      placeholder: '请输入排序号',
      min: 0
    },
    {
      name: 'permission',
      type: 'input',
      label: '权限标识',
      placeholder: '请输入权限标识，如 system:user:view'
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
      name: 'hidden',
      type: 'switch',
      label: '隐藏菜单',
      checkedChildren: '是',
      unCheckedChildren: '否'
    },
    {
      name: 'keepAlive',
      type: 'switch',
      label: '缓存页面',
      checkedChildren: '是',
      unCheckedChildren: '否'
    },
    {
      name: 'external',
      type: 'switch',
      label: '外部链接',
      checkedChildren: '是',
      unCheckedChildren: '否'
    }
  ],
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
}

const editSchema: FormSchema = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'title',
      type: 'input',
      label: '菜单标题',
      placeholder: '请输入菜单标题',
      rules: [
        { required: true, message: '菜单标题不能为空' },
        { min: 2, message: '菜单标题至少2个字符' }
      ]
    },
    {
      name: 'name',
      type: 'input',
      label: '路由名称',
      placeholder: '请输入路由名称',
      disabled: true
    },
    {
      name: 'path',
      type: 'input',
      label: '路由路径',
      placeholder: '请输入路由路径',
      rules: [
        { required: true, message: '路由路径不能为空' }
      ]
    },
    {
      name: 'component',
      type: 'input',
      label: '组件路径',
      placeholder: '请输入组件路径',
      rules: [
        { required: true, message: '组件路径不能为空' }
      ]
    },
    {
      name: 'parentId',
      type: 'select',
      label: '上级菜单',
      placeholder: '请选择上级菜单',
      options: menuOptions.value,
      disabled: true
    },
    {
      name: 'icon',
      type: 'select',
      label: '图标',
      placeholder: '请选择图标',
      options: iconOptions
    },
    {
      name: 'sort',
      type: 'number',
      label: '排序',
      placeholder: '请输入排序号',
      min: 0
    },
    {
      name: 'permission',
      type: 'input',
      label: '权限标识',
      placeholder: '请输入权限标识'
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
      name: 'hidden',
      type: 'switch',
      label: '隐藏菜单',
      checkedChildren: '是',
      unCheckedChildren: '否'
    },
    {
      name: 'keepAlive',
      type: 'switch',
      label: '缓存页面',
      checkedChildren: '是',
      unCheckedChildren: '否'
    },
    {
      name: 'external',
      type: 'switch',
      label: '外部链接',
      checkedChildren: '是',
      unCheckedChildren: '否'
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
function handleEditMenu(menu: Menu): void {
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
    permission: menu.permission
  }
  isEditDialogOpen.value = true
}

function handleAddSubmit(values: Record<string, any>): void {
  createMenu(values)
}

function handleEditSubmit(values: Record<string, any>): void {
  if (editingMenu.value) {
    updateMenu({ id: editingMenu.value.id, values })
  }
}

function handleDeleteMenu(id: string): void {
  deleteMenu(id)
}

function handleToggleStatus(menu: Menu): void {
  const newStatus = menu.status === 'active' ? 'inactive' : 'active'
  updateMenuStatus({ id: menu.id, status: newStatus })
}

function resetAddForm(): void {
  addFormData.value = {
    name: '',
    title: '',
    path: '',
    component: '',
    icon: '',
    parentId: null,
    sort: 0,
    status: 'active',
    hidden: false,
    keepAlive: false,
    external: false,
    permission: ''
  }
}

// 树节点展开
const onExpand: TreeProps['onExpand'] = (keys) => {
  expandedKeys.value = keys as string[]
}

// 统计卡片
const statisticsCards = computed(() => {
  const list = menus.value || []
  const total = list.length
  const active = list.filter(m => m.status === 'active').length
  const visible = list.filter(m => !m.hidden).length
  const cached = list.filter(m => m.keepAlive).length

  return [
    { title: '菜单总数', value: total, icon: Menu, color: 'text-blue-500' },
    { title: '启用菜单', value: active, icon: FolderTree, color: 'text-green-500' },
    { title: '可见菜单', value: visible, icon: Eye, color: 'text-purple-500' },
    { title: '缓存页面', value: cached, icon: LayoutGrid, color: 'text-orange-500' }
  ]
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">菜单管理</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">管理系统导航菜单和路由配置</p>
      </div>
      <Button class="gap-2" @click="isAddDialogOpen = true">
        <Plus class="h-4 w-4" />
        添加菜单
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
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <TForm v-model="searchFormData" :schema="searchSchema" />
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            :class="viewMode === 'tree' ? 'bg-primary text-primary-foreground' : ''"
            @click="viewMode = 'tree'"
          >
            <FolderTree class="h-4 w-4 mr-1" />
            树形视图
          </Button>
          <Button
            variant="outline"
            size="sm"
            :class="viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''"
            @click="viewMode = 'list'"
          >
            <Menu class="h-4 w-4 mr-1" />
            列表视图
          </Button>
        </div>
      </div>
    </div>

    <!-- 树形视图 -->
    <Card v-if="viewMode === 'tree'" class="border-0 shadow-sm">
      <CardHeader class="pb-4">
        <CardTitle class="text-base font-semibold">菜单结构</CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <Tree
          :tree-data="treeData"
          :expanded-keys="expandedKeys"
          @expand="onExpand"
        >
          <template #title="{ dataRef }">
            <div class="flex items-center gap-2 py-1">
              <LayoutGrid v-if="dataRef.data.icon === 'LayoutGrid'" class="h-4 w-4 text-muted-foreground" />
              <Menu v-else class="h-4 w-4 text-muted-foreground" />
              <span class="font-medium">{{ dataRef.title }}</span>
              <Tag v-if="dataRef.data.path" size="small" class="text-xs">
                {{ dataRef.data.path }}
              </Tag>
              <Badge
                :class="{
                  'bg-green-500/10 text-green-500': dataRef.data.status === 'active',
                  'bg-gray-500/10 text-gray-500': dataRef.data.status === 'inactive'
                }"
                variant="outline"
                class="text-xs"
              >
                {{ dataRef.data.status === 'active' ? '启用' : '禁用' }}
              </Badge>
              <Tooltip v-if="dataRef.data.hidden" title="隐藏菜单">
                <EyeOff class="h-3 w-3 text-muted-foreground" />
              </Tooltip>
              <Tooltip v-if="dataRef.data.keepAlive" title="缓存页面">
                <LayoutGrid class="h-3 w-3 text-muted-foreground" />
              </Tooltip>
              <Tooltip v-if="dataRef.data.external" title="外部链接">
                <ExternalLink class="h-3 w-3 text-muted-foreground" />
              </Tooltip>
              <Space class="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-6 text-xs"
                  @click.stop="handleEditMenu(dataRef.data)"
                >
                  编辑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-6 text-xs text-destructive"
                  @click.stop="handleDeleteMenu(dataRef.data.id)"
                >
                  删除
                </Button>
              </Space>
            </div>
          </template>
        </Tree>
      </CardContent>
    </Card>

    <!-- 列表视图 -->
    <Card v-else class="border-0 shadow-sm">
      <CardHeader class="pb-4">
        <CardTitle class="text-base font-semibold">菜单列表</CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <TTable
          ref="tableRef"
          v-model:data="menus"
          :schema="tableSchema"
          :loading="loading"
        >
          <template #title="slotProps">
            <div class="flex items-center gap-2">
              <Menu class="h-4 w-4 text-muted-foreground" />
              <span class="font-medium">{{ (slotProps as any).text }}</span>
            </div>
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

          <template #hidden="slotProps">
            <Eye v-if="!(slotProps as any).text" class="h-4 w-4 text-green-500" />
            <EyeOff v-else class="h-4 w-4 text-gray-400" />
          </template>

          <template #keepAlive="slotProps">
            <Switch
              :checked="(slotProps as any).text"
              size="small"
              disabled
            />
          </template>

          <template #external="slotProps">
            <ExternalLink
              v-if="(slotProps as any).text"
              class="h-4 w-4 text-blue-500"
            />
            <span v-else class="text-muted-foreground">-</span>
          </template>

          <template #emptyText>
            <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search class="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p class="text-base font-medium mb-1">暂无菜单数据</p>
              <p class="text-sm text-muted-foreground mb-4">开始添加您的第一个菜单吧</p>
              <Button size="sm" @click="isAddDialogOpen = true">
                <Plus class="h-4 w-4 mr-1" />
                添加菜单
              </Button>
            </div>
          </template>
        </TTable>
      </CardContent>
    </Card>

    <!-- 添加菜单弹窗 -->
    <TModal
      v-model:open="isAddDialogOpen"
      title="添加菜单"
      width="600"
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
      width="600"
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
