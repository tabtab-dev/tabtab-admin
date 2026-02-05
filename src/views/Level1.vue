<script setup lang="ts">
/**
 * 一级分类页
 */
import { ref, computed, onMounted } from 'vue'
import { TTable } from '@/components/data/TTable'
import { TForm } from '@/components/data/TForm'
import { TModal } from '@/components/data/TModal'
import type { TableSchema, TTableExpose } from '@/components/data/TTable'
import type { FormSchema } from '@/components/data/TForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCategoriesStore, type Category } from '@/stores/categories'
import {
  Plus,
  FolderTree,
  CheckCircle,
  XCircle,
  Package,
  Search,
  Layers
} from 'lucide-vue-next'

const categoriesStore = useCategoriesStore()

// 默认只显示一级分类
onMounted(() => {
  categoriesStore.levelFilter = 1
})

// 统计标签
const statistics = computed(() => {
  const level1Categories = categoriesStore.categories.filter(c => c.level === 1)
  const total = level1Categories.length
  const active = level1Categories.filter(c => c.status === 'active').length
  const inactive = level1Categories.filter(c => c.status === 'inactive').length
  const totalProducts = level1Categories.reduce((sum, c) => sum + c.productCount, 0)

  return [
    { title: '一级分类', value: total, icon: FolderTree, color: 'text-blue-500' },
    { title: '已启用', value: active, icon: CheckCircle, color: 'text-green-500' },
    { title: '已禁用', value: inactive, icon: XCircle, color: 'text-red-500' },
    { title: '关联商品', value: totalProducts, icon: Package, color: 'text-purple-500' }
  ]
})

// 搜索表单
const searchFormData = ref({
  keyword: '',
  status: ''
})

const searchSchema: FormSchema = {
  layout: 'inline',
  fields: [
    {
      name: 'keyword',
      type: 'input',
      label: '',
      placeholder: '搜索分类名称...',
      className: 'w-[200px]'
    },
    {
      name: 'status',
      type: 'select',
      label: '',
      placeholder: '全部状态',
      options: [
        { label: '全部状态', value: '' },
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ],
      className: 'w-[140px]'
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
      categoriesStore.searchQuery = values.keyword || ''
      categoriesStore.statusFilter = values.status || ''
    },
    onReset: () => {
      categoriesStore.searchQuery = ''
      categoriesStore.statusFilter = ''
    }
  }
}

// 表格配置
const tableRef = ref<TTableExpose>()

const tableSchema = computed<TableSchema>(() => ({
  columns: [
    {
      title: '分类名称',
      dataIndex: 'name',
      width: 180,
      slot: 'name'
    },
    {
      title: '分类编码',
      dataIndex: 'code',
      width: 150
    },
    {
      title: '商品数量',
      dataIndex: 'productCount',
      width: 100,
      sorter: true
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      sorter: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      slot: 'status'
    }
  ],
  pagination: {
    pageSize: 10,
    show: true,
    showSizeChanger: true,
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
      onClick: (record) => handleEdit(record as unknown as Category)
    },
    {
      text: '删除',
      type: 'danger',
      confirm: true,
      confirmText: '确定要删除该分类吗？',
      onClick: (record) => handleDelete((record as unknown as Category).id)
    }
  ],
  actionWidth: 150,
  actionFixed: 'right'
}))

const tableData = computed(() => {
  return categoriesStore.filteredCategories.map(c => ({ ...c, key: c.id }))
})

// 新增/编辑
const isAddOpen = ref(false)
const isEditOpen = ref(false)
const editingItem = ref<Category | null>(null)

const addFormData = ref({
  name: '',
  code: '',
  sort: 0,
  status: 'active' as 'active' | 'inactive',
  description: ''
})

const editFormData = ref({
  id: '',
  name: '',
  code: '',
  sort: 0,
  status: 'active' as 'active' | 'inactive',
  description: ''
})

const addSchema: FormSchema = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'name',
      type: 'input',
      label: '分类名称',
      placeholder: '请输入分类名称',
      rules: [{ required: true, message: '分类名称不能为空' }]
    },
    {
      name: 'code',
      type: 'input',
      label: '分类编码',
      placeholder: '请输入分类编码',
      rules: [{ required: true, message: '分类编码不能为空' }]
    },
    {
      name: 'sort',
      type: 'number',
      label: '排序',
      placeholder: '请输入排序号'
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    },
    {
      name: 'description',
      type: 'textarea',
      label: '描述',
      placeholder: '请输入描述（可选）'
    }
  ],
  actions: {
    showSubmit: true,
    showReset: true,
    submitText: '添加分类',
    resetText: '取消',
    align: 'right',
    onReset: () => { isAddOpen.value = false }
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
      label: '分类名称',
      placeholder: '请输入分类名称',
      rules: [{ required: true, message: '分类名称不能为空' }]
    },
    {
      name: 'code',
      type: 'input',
      label: '分类编码',
      placeholder: '请输入分类编码',
      rules: [{ required: true, message: '分类编码不能为空' }]
    },
    {
      name: 'sort',
      type: 'number',
      label: '排序',
      placeholder: '请输入排序号'
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    },
    {
      name: 'description',
      type: 'textarea',
      label: '描述',
      placeholder: '请输入描述（可选）'
    }
  ],
  actions: {
    showSubmit: true,
    showReset: true,
    submitText: '保存修改',
    resetText: '取消',
    align: 'right',
    onReset: () => { isEditOpen.value = false }
  }
}

// 事件处理
function handleAddSubmit(values: Record<string, any>) {
  categoriesStore.addCategory({
    name: values.name,
    code: values.code,
    level: 1,
    sort: Number(values.sort) || 0,
    status: values.status,
    productCount: 0,
    description: values.description
  })
  isAddOpen.value = false
  addFormData.value = { name: '', code: '', sort: 0