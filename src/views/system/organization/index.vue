<script setup lang="ts">
/**
 * 组织架构管理页面
 * @description 管理部门组织架构，支持树形结构展示和拖拽排序
 */
import { TTable } from '@/components/business/TTable'
import { TForm } from '@/components/business/TForm'
import type { TableSchema, TTableExpose } from '@/components/business/TTable'
import type { FormSchema } from '@/components/business/TForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TModal } from '@/components/business/TModal'
import { organizationApi } from '@/api'
import { useTableData, useMutation } from '@/composables'
import { Plus, Building, Users, Network, Search, ChevronRight, ChevronDown } from 'lucide-vue-next'
import { Tree, Tag, Space } from 'antdv-next'
import type { TreeProps } from 'antdv-next'

// ==================== 类型定义 ====================
interface Organization {
  id: string
  name: string
  code: string
  parentId: string | null
  leader: string
  memberCount: number
  sort: number
  status: 'active' | 'inactive'
  description: string
  createdAt: string
  children?: Organization[]
}

// ==================== 数据管理 ====================
const {
  data: organizations,
  loading,
  searchQuery,
  fetchData,
} = useTableData<Organization>({
  apiCall: async (params) => {
    const res = await organizationApi.getOrganizations(params)
    return res || { list: [], total: 0, page: 1, pageSize: 10 }
  },
  apiCallParams: (ctx) => ({
    search: ctx.searchQuery,
  }),
})

const { mutate: createOrganization } = useMutation({
  mutationFn: (values: Record<string, any>) => organizationApi.createOrganization({
    name: values.name,
    code: values.code,
    parentId: values.parentId,
    leader: values.leader,
    description: values.description,
    sort: values.sort || 0,
    status: values.status
  }),
  successMessage: '部门创建成功',
  onSuccess: () => {
    isAddDialogOpen.value = false
    resetAddForm()
    fetchData()
  }
})

const { mutate: updateOrganization } = useMutation({
  mutationFn: ({ id, values }: { id: string; values: Record<string, any> }) =>
    organizationApi.updateOrganization(id, {
      name: values.name,
      code: values.code,
      parentId: values.parentId,
      leader: values.leader,
      description: values.description,
      sort: values.sort,
      status: values.status
    }),
  successMessage: '部门更新成功',
  onSuccess: () => {
    isEditDialogOpen.value = false
    editingOrganization.value = null
    fetchData()
  }
})

const { mutate: deleteOrganization } = useMutation({
  mutationFn: (id: string) => organizationApi.deleteOrganization(id),
  successMessage: '部门删除成功',
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
      placeholder: '搜索部门名称或编码...',
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
  const list = organizations.value || []
  const buildTree = (parentId: string | null): any[] => {
    return list
      .filter(item => item.parentId === parentId)
      .sort((a, b) => a.sort - b.sort)
      .map(item => ({
        key: item.id,
        title: item.name,
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
      title: '部门名称',
      dataIndex: 'name',
      width: 200,
      slot: 'name'
    },
    {
      title: '部门编码',
      dataIndex: 'code',
      width: 150
    },
    {
      title: '负责人',
      dataIndex: 'leader',
      width: 120
    },
    {
      title: '成员数',
      dataIndex: 'memberCount',
      width: 100,
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      slot: 'status'
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
  rowSelection: {
    type: 'checkbox',
    show: true
  },
  actions: [
    {
      text: '编辑',
      type: 'primary',
      onClick: (record) => handleEditOrganization(record as unknown as Organization)
    },
    {
      text: '删除',
      type: 'danger',
      confirm: true,
      confirmText: '确定要删除该部门吗？此操作不可恢复。',
      onClick: (record) => handleDeleteOrganization((record as unknown as Organization).id)
    }
  ],
  actionWidth: 150,
  actionFixed: 'right'
}))

// ==================== 弹窗和表单 ====================
const isAddDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const editingOrganization = ref<Organization | null>(null)

const addFormData = ref({
  name: '',
  code: '',
  parentId: null as string | null,
  leader: '',
  description: '',
  sort: 0,
  status: 'active'
})

const editFormData = ref({
  id: '',
  name: '',
  code: '',
  parentId: null as string | null,
  leader: '',
  description: '',
  sort: 0,
  status: 'active'
})

// 部门选择选项
const organizationOptions = computed(() => {
  const list = organizations.value || []
  return [
    { label: '顶级部门', value: null },
    ...list.map(item => ({
      label: item.name,
      value: item.id
    }))
  ]
})

const addSchema: FormSchema = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'name',
      type: 'input',
      label: '部门名称',
      placeholder: '请输入部门名称',
      rules: [
        { required: true, message: '部门名称不能为空' },
        { min: 2, message: '部门名称至少2个字符' }
      ]
    },
    {
      name: 'code',
      type: 'input',
      label: '部门编码',
      placeholder: '请输入部门编码',
      rules: [
        { required: true, message: '部门编码不能为空' },
        { pattern: /^[A-Za-z0-9_-]+$/, message: '编码只能包含字母、数字、下划线和横线' }
      ]
    },
    {
      name: 'parentId',
      type: 'select',
      label: '上级部门',
      placeholder: '请选择上级部门',
      options: organizationOptions.value
    },
    {
      name: 'leader',
      type: 'input',
      label: '负责人',
      placeholder: '请输入负责人姓名'
    },
    {
      name: 'sort',
      type: 'number',
      label: '排序',
      placeholder: '请输入排序号',
      min: 0
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
      placeholder: '请输入部门描述',
      rows: 3
    }
  ],
  actions: {
    showSubmit: true,
    showReset: true,
    submitText: '添加部门',
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
      label: '部门名称',
      placeholder: '请输入部门名称',
      rules: [
        { required: true, message: '部门名称不能为空' },
        { min: 2, message: '部门名称至少2个字符' }
      ]
    },
    {
      name: 'code',
      type: 'input',
      label: '部门编码',
      placeholder: '请输入部门编码',
      rules: [
        { required: true, message: '部门编码不能为空' },
        { pattern: /^[A-Za-z0-9_-]+$/, message: '编码只能包含字母、数字、下划线和横线' }
      ]
    },
    {
      name: 'parentId',
      type: 'select',
      label: '上级部门',
      placeholder: '请选择上级部门',
      options: organizationOptions.value,
      disabled: true
    },
    {
      name: 'leader',
      type: 'input',
      label: '负责人',
      placeholder: '请输入负责人姓名'
    },
    {
      name: 'sort',
      type: 'number',
      label: '排序',
      placeholder: '请输入排序号',
      min: 0
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
      placeholder: '请输入部门描述',
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
function handleEditOrganization(org: Organization): void {
  editingOrganization.value = org
  editFormData.value = {
    id: org.id,
    name: org.name,
    code: org.code,
    parentId: org.parentId,
    leader: org.leader,
    description: org.description,
    sort: org.sort,
    status: org.status
  }
  isEditDialogOpen.value = true
}

function handleAddSubmit(values: Record<string, any>): void {
  createOrganization(values)
}

function handleEditSubmit(values: Record<string, any>): void {
  if (editingOrganization.value) {
    updateOrganization({ id: editingOrganization.value.id, values })
  }
}

function handleDeleteOrganization(id: string): void {
  deleteOrganization(id)
}

function resetAddForm(): void {
  addFormData.value = {
    name: '',
    code: '',
    parentId: null,
    leader: '',
    description: '',
    sort: 0,
    status: 'active'
  }
}

// 树节点展开
const onExpand: TreeProps['onExpand'] = (keys) => {
  expandedKeys.value = keys as string[]
}

// 统计卡片
const statisticsCards = computed(() => {
  const list = organizations.value || []
  const total = list.length
  const active = list.filter(o => o.status === 'active').length
  const topLevel = list.filter(o => o.parentId === null).length
  const totalMembers = list.reduce((sum, o) => sum + (o.memberCount || 0), 0)

  return [
    { title: '部门总数', value: total, icon: Building, color: 'text-blue-500' },
    { title: '启用部门', value: active, icon: Network, color: 'text-green-500' },
    { title: '顶级部门', value: topLevel, icon: Building, color: 'text-purple-500' },
    { title: '总成员数', value: totalMembers, icon: Users, color: 'text-orange-500' }
  ]
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">组织架构</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">管理部门组织架构和层级关系</p>
      </div>
      <Button class="gap-2" @click="isAddDialogOpen = true">
        <Plus class="h-4 w-4" />
        添加部门
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
            <Network class="h-4 w-4 mr-1" />
            树形视图
          </Button>
          <Button
            variant="outline"
            size="sm"
            :class="viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''"
            @click="viewMode = 'list'"
          >
            <Building class="h-4 w-4 mr-1" />
            列表视图
          </Button>
        </div>
      </div>
    </div>

    <!-- 树形视图 -->
    <Card v-if="viewMode === 'tree'" class="border-0 shadow-sm">
      <CardHeader class="pb-4">
        <CardTitle class="text-base font-semibold">部门结构</CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <Tree
          :tree-data="treeData"
          :expanded-keys="expandedKeys"
          @expand="onExpand"
        >
          <template #title="{ dataRef }">
            <div class="flex items-center gap-2 py-1">
              <Building class="h-4 w-4 text-muted-foreground" />
              <span class="font-medium">{{ dataRef.title }}</span>
              <Tag v-if="dataRef.data.code" size="small" class="text-xs">
                {{ dataRef.data.code }}
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
              <span v-if="dataRef.data.memberCount" class="text-xs text-muted-foreground">
                ({{ dataRef.data.memberCount }}人)
              </span>
              <Space class="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-6 text-xs"
                  @click.stop="handleEditOrganization(dataRef.data)"
                >
                  编辑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-6 text-xs text-destructive"
                  @click.stop="handleDeleteOrganization(dataRef.data.id)"
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
        <CardTitle class="text-base font-semibold">部门列表</CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <TTable
          ref="tableRef"
          v-model:data="organizations"
          :schema="tableSchema"
          :loading="loading"
        >
          <template #name="slotProps">
            <div class="flex items-center gap-2">
              <Building class="h-4 w-4 text-muted-foreground" />
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

          <template #emptyText>
            <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search class="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p class="text-base font-medium mb-1">暂无部门数据</p>
              <p class="text-sm text-muted-foreground mb-4">开始添加您的第一个部门吧</p>
              <Button size="sm" @click="isAddDialogOpen = true">
                <Plus class="h-4 w-4 mr-1" />
                添加部门
              </Button>
            </div>
          </template>
        </TTable>
      </CardContent>
    </Card>

    <!-- 添加部门弹窗 -->
    <TModal
      v-model:open="isAddDialogOpen"
      title="添加部门"
      width="560"
      :footer="null"
    >
      <TForm
        v-model="addFormData"
        :schema="addSchema"
        @submit="handleAddSubmit"
      />
    </TModal>

    <!-- 编辑部门弹窗 -->
    <TModal
      v-model:open="isEditDialogOpen"
      title="编辑部门"
      width="560"
      :footer="null"
    >
      <TForm
        v-if="editingOrganization"
        v-model="editFormData"
        :schema="editSchema"
        @submit="handleEditSubmit"
      />
    </TModal>
  </div>
</template>
