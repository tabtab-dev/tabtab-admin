<script setup lang="ts">
/**
 * 组织架构管理页面
 * @description 管理部门组织架构，支持树形结构展示和层级管理
 */
import { TTable, TForm, TModal, TDataCard, TPageHeader, TStatusBadge, TEmptyState } from '@/components/business'
import type { TableSchema, TTableExpose, TableRecord } from '@/components/business'
import type { FormSchema } from '@/components/business'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { organizationApi } from '@/api'
import type { Organization } from '@/api/modules/organization'
import { useTableData, useMutation } from '@/composables'
import { Plus, Building, Users, Network, Search, Eye, EyeOff } from 'lucide-vue-next'
import { Switch, Tooltip } from 'antdv-next'

// ==================== 数据管理 ====================
const {
  data: flatOrganizations,
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

/**
 * 将扁平部门数据转换为树形结构
 * @param orgs 扁平部门列表
 * @returns 树形部门数据
 */
function buildOrgTree(orgs: Organization[]): Organization[] {
  const orgMap = new Map<string, Organization>()
  const roots: Organization[] = []

  // 先创建所有节点的副本（不添加 children 字段）
  orgs.forEach(org => {
    orgMap.set(org.id, { ...org })
  })

  // 构建树形结构
  orgs.forEach(org => {
    const node = orgMap.get(org.id)!
    if (org.parentId && orgMap.has(org.parentId)) {
      const parent = orgMap.get(org.parentId)!
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
 * 树形部门数据
 */
const treeOrganizations = computed(() => buildOrgTree(flatOrganizations.value))

const { mutate: createOrganization } = useMutation({
  mutationFn: (values: Record<string, any>) => organizationApi.createOrganization({
    name: values.name,
    code: values.code,
    parentId: values.parentId || null,
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
      parentId: values.parentId || null,
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

const { mutate: updateOrganizationStatus } = useMutation({
  mutationFn: ({ id, status }: { id: string; status: string }) =>
    organizationApi.updateOrganizationStatus(id, status),
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

// ==================== 表格配置 ====================
const tableRef = ref<TTableExpose>()

const tableSchema = computed<TableSchema>(() => ({
  columns: [
    {
      title: '部门名称',
      dataIndex: 'name',
      width: 220,
      slot: 'name'
    },
    {
      title: '部门编码',
      dataIndex: 'code',
      width: 140,
      ellipsis: true
    },
    {
      title: '负责人',
      dataIndex: 'leader',
      width: 120
    },
    {
      title: '成员数',
      dataIndex: 'memberCount',
      width: 80,
      align: 'center'
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
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160
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
      onClick: (record) => handleEditOrganization(record as Organization)
    },
    {
      text: '删除',
      type: 'danger',
      confirm: true,
      confirmText: '确定要删除该部门吗？子部门也会被删除，此操作不可恢复。',
      onClick: (record) => handleDeleteOrganization((record as Organization).id)
    }
  ],
  actionWidth: 150,
  actionFixed: 'right'
}))

// ==================== 弹窗和表单 ====================
const isAddDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const editingOrganization = ref<Organization | null>(null)

/**
 * 创建表单初始值
 * @returns 表单初始值对象
 */
function createInitialFormData() {
  return {
    name: '',
    code: '',
    parentId: null as string | null,
    leader: '',
    description: '',
    sort: 0,
    status: 'active' as 'active' | 'inactive'
  }
}

const addFormData = ref(createInitialFormData())
const editFormData = ref({ id: '', ...createInitialFormData() })

// 部门选择选项
const organizationOptions = computed(() => {
  const list = flatOrganizations.value || []
  return [
    { label: '顶级部门', value: null },
    ...list.map(item => ({
      label: item.name,
      value: item.id
    }))
  ]
})

/**
 * 上级部门树形选项
 */
const orgTreeOptions = computed(() => {
  const buildTree = (orgs: Organization[]): any[] => {
    return orgs.map(org => ({
      title: org.name,
      value: org.id,
      key: org.id,
      children: org.children ? buildTree(org.children) : undefined
    }))
  }

  const treeData = buildTree(treeOrganizations.value)

  return [
    {
      title: '顶级部门',
      value: '',
      key: 'root',
      children: treeData
    }
  ]
})

/**
 * 获取表单字段配置
 * @param isEdit 是否为编辑模式
 * @returns 表单字段配置数组
 */
function getFormFields(isEdit: boolean) {
  return [
    {
      name: 'name',
      type: 'input' as const,
      label: '部门名称',
      placeholder: '请输入部门名称',
      rules: [
        { required: true, message: '部门名称不能为空' },
        { min: 2, message: '部门名称至少2个字符' }
      ]
    },
    {
      name: 'code',
      type: 'input' as const,
      label: '部门编码',
      placeholder: '请输入部门编码',
      disabled: isEdit,
      rules: [
        { required: true, message: '部门编码不能为空' },
        { pattern: /^[A-Za-z0-9_-]+$/, message: '编码只能包含字母、数字、下划线和横线' }
      ]
    },
    {
      name: 'parentId',
      type: 'tree-select' as const,
      label: '上级部门',
      placeholder: '请选择上级部门',
      options: orgTreeOptions.value,
      disabled: isEdit,
      props: {
        treeDefaultExpandAll: true,
        allowClear: true,
        showSearch: true,
        treeNodeFilterProp: 'title'
      }
    },
    {
      name: 'leader',
      type: 'input' as const,
      label: '负责人',
      placeholder: '请输入负责人姓名'
    },
    {
      name: 'sort',
      type: 'number' as const,
      label: '排序',
      placeholder: '请输入排序号',
      min: 0
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
      name: 'description',
      type: 'textarea' as const,
      label: '描述',
      placeholder: '请输入部门描述',
      rows: 3
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
    submitText: '添加部门',
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
 * 处理编辑部门
 * @param org 部门数据
 */
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

/**
 * 处理添加部门提交
 * @param values 表单值
 */
function handleAddSubmit(values: Record<string, any>): void {
  createOrganization(values)
}

/**
 * 处理编辑部门提交
 * @param values 表单值
 */
function handleEditSubmit(values: Record<string, any>): void {
  if (editingOrganization.value) {
    updateOrganization({ id: editingOrganization.value.id, values })
  }
}

/**
 * 处理删除部门
 * @param id 部门ID
 */
function handleDeleteOrganization(id: string): void {
  deleteOrganization(id)
}

/**
 * 处理切换部门状态
 * @param org 部门数据
 */
function handleToggleStatus(org: Organization): void {
  const newStatus = org.status === 'active' ? 'inactive' : 'active'
  updateOrganizationStatus({ id: org.id, status: newStatus })
}

/**
 * 重置添加表单
 */
function resetAddForm(): void {
  addFormData.value = createInitialFormData()
}

// 统计卡片
const statisticsCards = computed(() => {
  const list = flatOrganizations.value || []
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
    <TPageHeader
      title="组织架构"
      subtitle="管理部门组织架构和层级关系"
      :actions="[
        { text: '添加部门', type: 'primary', iconName: 'Plus', onClick: () => isAddDialogOpen = true }
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
    <div class="bg-muted/30 rounded-lg p-4">
      <TForm v-model="searchFormData" :schema="searchSchema" />
    </div>

    <!-- 树形表格 -->
    <Card class="border-0 shadow-sm">
      <CardHeader class="pb-4">
        <CardTitle class="text-base font-semibold">部门结构</CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <TTable
          ref="tableRef"
          v-model:data="treeOrganizations"
          :schema="tableSchema"
          :loading="loading"
        >
          <!-- 部门名称列 -->
          <template #name="{ text, record }">
            <div class="flex items-center gap-2">
              <Building class="h-4 w-4 text-muted-foreground" />
              <span class="font-medium">{{ text }}</span>
              <Badge
                v-if="record?.memberCount"
                variant="outline"
                class="text-xs bg-muted/50"
              >
                {{ record.memberCount }}人
              </Badge>
            </div>
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
              @click="handleToggleStatus(record as Organization)"
            />
          </template>

          <!-- 空状态 -->
          <template #emptyText>
            <TEmptyState
              type="data"
              title="暂无部门数据"
              description="开始添加您的第一个部门吧"
              :action="{ text: '添加部门', type: 'primary', iconName: 'Plus', onClick: () => isAddDialogOpen = true }"
            />
          </template>
        </TTable>
      </CardContent>
    </Card>

    <!-- 添加部门弹窗 -->
    <TModal
      v-model:open="isAddDialogOpen"
      title="添加部门"
      width="700"
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
      width="700"
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
