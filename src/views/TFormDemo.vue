<script setup lang="ts">
/**
 * TFormDemo - TForm 组件演示页面
 *
 * @description 展示 TForm 表单组件的各种使用场景和配置方式
 */
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { TForm } from '@/components/data/TForm'
import type { FormSchema } from '@/components/data/TForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/stores/theme'
import { Moon, Sun } from 'lucide-vue-next'

/**
 * i18n
 */
const { t } = useI18n()

/**
 * 表单引用
 */


/**
 * 主题状态管理
 */
const themeStore = useThemeStore()

/**
 * 表单数据 - 基础示例
 */
const basicFormData = ref({
  name: '',
  email: '',
  phone: '',
  age: null
})

/**
 * 基础表单 Schema
 */
const basicSchema = computed<FormSchema>(() => ({
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'name',
      type: 'input',
      label: '姓名',
      placeholder: '请输入姓名',
      rules: [{ required: true, message: '姓名不能为空' }]
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
      name: 'phone',
      type: 'input',
      label: '电话',
      placeholder: '请输入电话号码'
    },
    {
      name: 'age',
      type: 'number',
      label: '年龄',
      placeholder: '请输入年龄',
      props: { min: 0, max: 150 }
    }
  ],
  actions: {
    submitText: t('common.submit'),
    resetText: t('common.reset'),
    showReset: true,
    align: 'right'
  }
}))

/**
 * 表单数据 - 高级示例
 */
const advancedFormData = ref({
  username: '',
  password: '',
  role: 'viewer',
  status: true,
  tags: [],
  description: ''
})

/**
 * 高级表单 Schema
 */
const advancedSchema = computed<FormSchema>(() => ({
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'username',
      type: 'input',
      label: '用户名',
      placeholder: '请输入用户名',
      rules: [{ required: true, message: '用户名不能为空' }]
    },
    {
      name: 'password',
      type: 'password',
      label: '密码',
      placeholder: '请输入密码',
      rules: [
        { required: true, message: '密码不能为空' },
        { min: 6, message: '密码长度不能少于6位' }
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
      type: 'switch',
      label: '启用状态',
      defaultValue: true
    },
    {
      name: 'tags',
      type: 'checkbox',
      label: '标签',
      options: [
        { label: '前端', value: 'frontend' },
        { label: '后端', value: 'backend' },
        { label: '设计', value: 'design' },
        { label: '产品', value: 'product' }
      ]
    },
    {
      name: 'description',
      type: 'textarea',
      label: '个人简介',
      placeholder: '请输入个人简介',
      props: { rows: 4 }
    }
  ],
  actions: {
    submitText: t('common.save'),
    resetText: t('common.clear'),
    showReset: true,
    align: 'right'
  }
}))

/**
 * 表单数据 - 字段联动示例
 */
const dependencyFormData = ref({
  userType: 'personal',
  companyName: '',
  personalName: ''
})

/**
 * 字段联动表单 Schema
 */
const dependencySchema = computed<FormSchema>(() => ({
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'userType',
      type: 'radio',
      label: '用户类型',
      options: [
        { label: '个人', value: 'personal' },
        { label: '企业', value: 'company' }
      ],
      defaultValue: 'personal'
    },
    {
      name: 'personalName',
      type: 'input',
      label: '姓名',
      placeholder: '请输入姓名',
      dependencies: {
        field: 'userType',
        condition: (value) => value === 'personal'
      },
      rules: [{ required: true, message: '姓名不能为空' }]
    },
    {
      name: 'companyName',
      type: 'input',
      label: '企业名称',
      placeholder: '请输入企业名称',
      dependencies: {
        field: 'userType',
        condition: (value) => value === 'company'
      },
      rules: [{ required: true, message: '企业名称不能为空' }]
    }
  ],
  actions: {
    submitText: t('common.submit'),
    showReset: false,
    align: 'right'
  }
}))

/**
 * 表单数据 - 内联布局示例
 */
const inlineFormData = ref({
  keyword: '',
  category: '',
  status: ''
})

/**
 * 内联布局表单 Schema
 */
const inlineSchema = computed<FormSchema>(() => ({
  layout: 'inline',
  fields: [
    {
      name: 'keyword',
      type: 'input',
      placeholder: '请输入关键词',
      props: { style: { width: '200px' } }
    },
    {
      name: 'category',
      type: 'select',
      placeholder: '请选择分类',
      options: [
        { label: '全部', value: '' },
        { label: '技术', value: 'tech' },
        { label: '设计', value: 'design' },
        { label: '产品', value: 'product' }
      ],
      props: { style: { width: '150px' } }
    },
    {
      name: 'status',
      type: 'select',
      placeholder: '请选择状态',
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ],
      props: { style: { width: '150px' } }
    }
  ],
  actions: {
    submitText: t('common.search'),
    resetText: t('common.reset'),
    showReset: true,
    align: 'left'
  }
}))

/**
 * 表单数据 - 更多组件示例
 */
const moreComponentsFormData = ref({
  priority: 50,
  rating: 3,
  theme: 'light',
  city: '',
  mention: '',
  date: null,
  dateRange: null,
  time: null,
  category: [],
  department: ''
})

/**
 * 更多组件表单 Schema
 */
const moreComponentsSchema = computed<FormSchema>(() => ({
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'priority',
      type: 'slider',
      label: '优先级',
      defaultValue: 50,
      props: { min: 0, max: 100, step: 10, marks: { 0: '低', 50: '中', 100: '高' } }
    },
    {
      name: 'rating',
      type: 'rate',
      label: '评分',
      defaultValue: 3,
      props: { allowHalf: true }
    },
    {
      name: 'theme',
      type: 'radio-button',
      label: '主题',
      options: [
        { label: '浅色', value: 'light' },
        { label: '深色', value: 'dark' },
        { label: '自动', value: 'auto' }
      ],
      defaultValue: 'light'
    },
    {
      name: 'city',
      type: 'auto-complete',
      label: '城市',
      placeholder: '请输入城市名',
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' },
        { label: '杭州', value: 'hangzhou' }
      ]
    },
    {
      name: 'mention',
      type: 'mention',
      label: '提及',
      placeholder: '输入 @ 提及用户',
      options: [
        { label: '张三', value: 'zhangsan' },
        { label: '李四', value: 'lisi' },
        { label: '王五', value: 'wangwu' }
      ]
    },
    {
      name: 'date',
      type: 'date-picker',
      label: '日期',
      placeholder: '请选择日期'
    },
    {
      name: 'dateRange',
      type: 'range-picker',
      label: '日期范围',
      placeholder: ['开始日期', '结束日期']
    },
    {
      name: 'time',
      type: 'time-picker',
      label: '时间',
      placeholder: '请选择时间'
    },
    {
      name: 'category',
      type: 'cascader',
      label: '商品分类',
      placeholder: '请选择分类',
      options: [
        {
          label: '数码电子',
          value: 'electronics',
          children: [
            { label: '手机', value: 'phone' },
            { label: '电脑', value: 'computer' },
            { label: '配件', value: 'accessories' }
          ]
        },
        {
          label: '服装鞋帽',
          value: 'clothing',
          children: [
            { label: '男装', value: 'men' },
            { label: '女装', value: 'women' },
            { label: '童装', value: 'kids' }
          ]
        },
        {
          label: '食品生鲜',
          value: 'food',
          children: [
            { label: '水果', value: 'fruit' },
            { label: '蔬菜', value: 'vegetable' },
            { label: '零食', value: 'snack' }
          ]
        }
      ]
    },
    {
      name: 'department',
      type: 'tree-select',
      label: '部门',
      placeholder: '请选择部门',
      options: [
        {
          label: '技术部',
          value: 'tech',
          children: [
            { label: '前端组', value: 'frontend' },
            { label: '后端组', value: 'backend' },
            { label: '测试组', value: 'qa' }
          ]
        },
        {
          label: '产品部',
          value: 'product',
          children: [
            { label: '产品设计', value: 'design' },
            { label: '产品运营', value: 'operation' }
          ]
        },
        {
          label: '市场部',
          value: 'marketing',
          children: [
            { label: '销售', value: 'sales' },
            { label: '推广', value: 'promotion' }
          ]
        }
      ]
    }
  ],
  actions: {
    submitText: t('common.submit'),
    resetText: t('common.reset'),
    showReset: true,
    align: 'right'
  }
}))

/**
 * 表单数据 - 动态列表示例
 */
const listFormData = ref({
  members: [{ name: '', role: 'developer' }]
})

/**
 * 动态列表表单 Schema
 */
const listSchema = computed<FormSchema>(() => ({
  layout: 'horizontal',
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
  fields: [
    {
      name: 'members',
      type: 'list',
      label: '团队成员',
      listConfig: {
        fields: [
          {
            name: 'name',
            type: 'input',
            label: '姓名',
            placeholder: '请输入姓名',
            rules: [{ required: true, message: '姓名不能为空' }]
          },
          {
            name: 'role',
            type: 'select',
            label: '角色',
            options: [
              { label: '开发', value: 'developer' },
              { label: '设计', value: 'designer' },
              { label: '产品', value: 'product' },
              { label: '测试', value: 'tester' }
            ]
          }
        ],
        min: 1,
        max: 5,
        addText: '添加成员',
        showAdd: true,
        showRemove: true
      }
    }
  ],
  actions: {
    submitText: t('common.save'),
    resetText: t('common.reset'),
    showReset: true,
    align: 'right'
  }
}))

/**
 * 表单数据 - 分组示例
 */
const groupFormData = ref({
  basicName: '',
  basicEmail: '',
  contactPhone: '',
  contactAddress: ''
})

/**
 * 分组表单 Schema
 */
const groupSchema = computed<FormSchema>(() => ({
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'basicInfo',
      type: 'group',
      label: '基本信息',
      groupConfig: {
        title: '基本信息',
        collapsible: true,
        defaultExpanded: true,
        children: [
          {
            name: 'basicName',
            type: 'input',
            label: '姓名',
            placeholder: '请输入姓名',
            rules: [{ required: true, message: '姓名不能为空' }]
          },
          {
            name: 'basicEmail',
            type: 'input',
            label: '邮箱',
            placeholder: '请输入邮箱',
            rules: [
              { required: true, message: '邮箱不能为空' },
              { type: 'email', message: '邮箱格式不正确' }
            ]
          }
        ]
      }
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: '联系信息',
      groupConfig: {
        title: '联系信息',
        collapsible: true,
        defaultExpanded: false,
        children: [
          {
            name: 'contactPhone',
            type: 'input',
            label: '电话',
            placeholder: '请输入电话'
          },
          {
            name: 'contactAddress',
            type: 'textarea',
            label: '地址',
            placeholder: '请输入地址',
            props: { rows: 2 }
          }
        ]
      }
    }
  ],
  actions: {
    submitText: t('common.submit'),
    resetText: t('common.reset'),
    showReset: true,
    align: 'right'
  }
}))

/**
 * 处理基础表单提交
 * @param values - 表单值
 */
function handleBasicSubmit(values: Record<string, any>): void {
  console.log('基础表单提交:', values)
  alert(`基础表单提交成功！\n${JSON.stringify(values, null, 2)}`)
}

/**
 * 处理高级表单提交
 * @param values - 表单值
 */
function handleAdvancedSubmit(values: Record<string, any>): void {
  console.log('高级表单提交:', values)
  alert(`高级表单提交成功！\n${JSON.stringify(values, null, 2)}`)
}

/**
 * 处理联动表单提交
 * @param values - 表单值
 */
function handleDependencySubmit(values: Record<string, any>): void {
  console.log('联动表单提交:', values)
  alert(`联动表单提交成功！\n${JSON.stringify(values, null, 2)}`)
}

/**
 * 处理内联表单提交
 * @param values - 表单值
 */
function handleInlineSubmit(values: Record<string, any>): void {
  console.log('搜索表单提交:', values)
  alert(`搜索条件：\n${JSON.stringify(values, null, 2)}`)
}

/**
 * 处理更多组件表单提交
 * @param values - 表单值
 */
function handleMoreComponentsSubmit(values: Record<string, any>): void {
  console.log('更多组件表单提交:', values)
  alert(`表单提交成功！\n${JSON.stringify(values, null, 2)}`)
}

/**
 * 处理动态列表表单提交
 * @param values - 表单值
 */
function handleListSubmit(values: Record<string, any>): void {
  console.log('动态列表表单提交:', values)
  alert(`团队成员保存成功！\n${JSON.stringify(values, null, 2)}`)
}

/**
 * 处理分组表单提交
 * @param values - 表单值
 */
function handleGroupSubmit(values: Record<string, any>): void {
  console.log('分组表单提交:', values)
  alert(`分组表单提交成功！\n${JSON.stringify(values, null, 2)}`)
}

/**
 * 处理表单值变化
 * @param changedValues - 变化的值
 * @param allValues - 所有值
 */
function handleFormChange(changedValues: Record<string, any>, allValues: Record<string, any>): void {
  console.log('表单值变化:', changedValues, allValues)
}

// ==================== 异步选项示例 ====================

/**
 * 表单数据 - 异步选项示例
 */
const asyncFormData = ref({
  category: '',
  product: ''
})

/**
 * 模拟异步加载产品列表
 * @param formData - 表单数据
 * @returns 产品选项列表
 */
async function loadProducts(formData: Record<string, any>): Promise<Array<{ label: string; value: string }>> {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  const category = formData.category
  if (!category) {
    return []
  }

  const products: Record<string, Array<{ label: string; value: string }>> = {
    electronics: [
      { label: 'iPhone 15', value: 'iphone15' },
      { label: 'MacBook Pro', value: 'macbook' },
      { label: 'AirPods Pro', value: 'airpods' }
    ],
    clothing: [
      { label: 'T恤', value: 'tshirt' },
      { label: '牛仔裤', value: 'jeans' },
      { label: '运动鞋', value: 'sneakers' }
    ],
    food: [
      { label: '巧克力', value: 'chocolate' },
      { label: '咖啡', value: 'coffee' },
      { label: '饼干', value: 'cookies' }
    ]
  }

  return products[category] || []
}

/**
 * 异步选项表单 Schema
 */
const asyncSchema = computed<FormSchema>(() => ({
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'category',
      type: 'select',
      label: '商品分类',
      placeholder: '请选择分类',
      options: [
        { label: '数码电子', value: 'electronics' },
        { label: '服装鞋帽', value: 'clothing' },
        { label: '食品生鲜', value: 'food' }
      ]
    },
    {
      name: 'product',
      type: 'select',
      label: '商品',
      placeholder: '请选择商品',
      options: loadProducts,
      props: {
        disabled: false
      }
    }
  ],
  actions: {
    submitText: t('common.submit'),
    resetText: t('common.reset'),
    showReset: true,
    align: 'right'
  }
}))

/**
 * 处理异步选项表单提交
 * @param values - 表单值
 */
function handleAsyncSubmit(values: Record<string, any>): void {
  console.log('异步选项表单提交:', values)
  alert(`表单提交成功！\n${JSON.stringify(values, null, 2)}`)
}

// ==================== 搜索表单示例 ====================

/**
 * 表单数据 - 搜索表单示例（多条件 - 网格布局）
 */
const searchFormData = ref({
  keyword: '',
  status: '',
  category: '',
  dateRange: null,
  priority: '',
  tags: [],
  author: ''
})

/**
 * 表单数据 - 搜索表单示例（少条件 - 同行布局）
 */
const searchInlineFormData = ref({
  keyword: '',
  status: '',
  category: ''
})

/**
 * 表单数据 - 搜索表单示例（中等条件 - 可配置同行数量）
 */
const searchCustomInlineFormData = ref({
  keyword: '',
  status: '',
  category: '',
  dateRange: null
})

/**
 * 搜索表单 Schema - 网格布局（7个条件 + 折叠）
 */
const searchSchema = computed<FormSchema>(() => ({
  layout: 'inline',
  fields: [
    {
      name: 'keyword',
      type: 'input',
      label: '关键词',
      placeholder: '请输入关键词搜索',
      tooltip: '支持模糊搜索标题、内容'
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' },
        { label: '待审核', value: 'pending' }
      ]
    },
    {
      name: 'category',
      type: 'select',
      label: '分类',
      placeholder: '请选择分类',
      options: [
        { label: '全部', value: '' },
        { label: '技术', value: 'tech' },
        { label: '设计', value: 'design' },
        { label: '产品', value: 'product' },
        { label: '运营', value: 'operation' }
      ]
    },
    {
      name: 'dateRange',
      type: 'range-picker',
      label: '创建时间',
      placeholder: ['开始日期', '结束日期']
    },
    {
      name: 'priority',
      type: 'select',
      label: '优先级',
      placeholder: '请选择优先级',
      options: [
        { label: '全部', value: '' },
        { label: '高', value: 'high' },
        { label: '中', value: 'medium' },
        { label: '低', value: 'low' }
      ]
    },
    {
      name: 'tags',
      type: 'select',
      label: '标签',
      placeholder: '请选择标签',
      options: [
        { label: '前端', value: 'frontend' },
        { label: '后端', value: 'backend' },
        { label: '移动端', value: 'mobile' },
        { label: '数据库', value: 'database' }
      ],
      props: { mode: 'multiple' }
    },
    {
      name: 'author',
      type: 'input',
      label: '创建人',
      placeholder: '请输入创建人'
    }
  ],
  searchConfig: {
    enabled: true,
    collapsed: true,
    collapseThreshold: 3,
    showCollapseButton: true,
    columns: 3,
    gutter: 20,
    searchText: t('common.search'),
    resetText: t('common.reset'),
    showReset: true,
    onSearch: (values) => {
      console.log('搜索条件:', values)
      alert(`搜索条件：\n${JSON.stringify(values, null, 2)}`)
    },
    onReset: () => {
      console.log('重置搜索条件')
    }
  }
}))

/**
 * 搜索表单 Schema - 少条件（同行布局）
 * @description 3个条件，默认使用同行布局（<= collapseThreshold+1）
 */
const searchInlineSchema = computed<FormSchema>(() => ({
  layout: 'inline',
  fields: [
    {
      name: 'keyword',
      type: 'input',
      label: '关键词',
      placeholder: '请输入关键词'
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    },
    {
      name: 'category',
      type: 'select',
      label: '分类',
      placeholder: '请选择分类',
      options: [
        { label: '全部', value: '' },
        { label: '技术', value: 'tech' },
        { label: '设计', value: 'design' }
      ]
    }
  ],
  searchConfig: {
    enabled: true,
    collapsed: false,
    collapseThreshold: 3,
    showCollapseButton: false,
    searchText: t('common.search'),
    resetText: t('common.reset'),
    showReset: true,
    onSearch: (values) => {
      alert(`同行布局搜索：\n${JSON.stringify(values, null, 2)}`)
    },
    onReset: () => {
      console.log('重置')
    }
  }
}))

/**
 * 搜索表单 Schema - 自定义同行数量
 * @description 4个条件，通过调整 collapseThreshold 控制同行/网格布局
 */
const searchCustomInlineSchema = computed<FormSchema>(() => ({
  layout: 'inline',
  fields: [
    {
      name: 'keyword',
      type: 'input',
      label: '关键词',
      placeholder: '请输入关键词'
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请选择状态',
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    },
    {
      name: 'category',
      type: 'select',
      label: '分类',
      placeholder: '请选择分类',
      options: [
        { label: '全部', value: '' },
        { label: '技术', value: 'tech' },
        { label: '设计', value: 'design' }
      ]
    },
    {
      name: 'dateRange',
      type: 'range-picker',
      label: '创建时间',
      placeholder: ['开始日期', '结束日期']
    }
  ],
  searchConfig: {
    enabled: true,
    collapsed: false,
    // 设置 collapseThreshold = 3，则 4 个条件 > 3+1，使用网格布局
    // 设置 collapseThreshold = 4，则 4 个条件 <= 4+1，使用同行布局
    collapseThreshold: 3,
    showCollapseButton: false,
    searchText: t('common.search'),
    resetText: t('common.reset'),
    showReset: true,
    onSearch: (values) => {
      alert(`自定义布局搜索：\n${JSON.stringify(values, null, 2)}`)
    },
    onReset: () => {
      console.log('重置')
    }
  }
}))

/**
 * 处理搜索表单提交
 * @param values - 表单值
 */
function handleSearchSubmit(values: Record<string, any>): void {
  console.log('搜索表单提交:', values)
}

/**
 * 处理同行布局搜索表单提交
 * @param values - 表单值
 */
function handleInlineSearchSubmit(values: Record<string, any>): void {
  console.log('同行布局搜索:', values)
}

/**
 * 处理自定义布局搜索表单提交
 * @param values - 表单值
 */
function handleCustomInlineSearchSubmit(values: Record<string, any>): void {
  console.log('自定义布局搜索:', values)
}

// ==================== 新组件示例 ====================

/**
 * 表单数据 - 新组件示例
 */
const newComponentsFormData = ref({
  agreement: false,
  month: null,
  quarter: null,
  year: null,
  week: null,
  timeRange: null,
  viewMode: 'list',
  selectedKeys: [],
  themeColor: '#3b82f6',
  fileList: []
})

/**
 * 新组件表单 Schema
 */
const newComponentsSchema = computed<FormSchema>(() => ({
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'agreement',
      type: 'checkbox-single',
      label: '协议确认',
      props: { label: '我已阅读并同意用户协议' },
      rules: [{ required: true, message: '请同意协议' }]
    },
    {
      name: 'month',
      type: 'month-picker',
      label: '月份',
      placeholder: '请选择月份'
    },
    {
      name: 'quarter',
      type: 'quarter-picker',
      label: '季度',
      placeholder: '请选择季度'
    },
    {
      name: 'year',
      type: 'year-picker',
      label: '年份',
      placeholder: '请选择年份'
    },
    {
      name: 'week',
      type: 'week-picker',
      label: '周',
      placeholder: '请选择周'
    },
    {
      name: 'timeRange',
      type: 'time-range-picker',
      label: '时间范围',
      placeholder: ['开始时间', '结束时间']
    },
    {
      name: 'viewMode',
      type: 'segmented',
      label: '视图模式',
      options: [
        { label: '列表', value: 'list' },
        { label: '网格', value: 'grid' },
        { label: '卡片', value: 'card' }
      ],
      defaultValue: 'list'
    },
    {
      name: 'selectedKeys',
      type: 'transfer',
      label: '穿梭选择',
      options: [
        { label: '选项 A', value: 'a', key: 'a' },
        { label: '选项 B', value: 'b', key: 'b' },
        { label: '选项 C', value: 'c', key: 'c' },
        { label: '选项 D', value: 'd', key: 'd' },
        { label: '选项 E', value: 'e', key: 'e' }
      ]
    },
    {
      name: 'themeColor',
      type: 'color-picker',
      label: '主题颜色',
      defaultValue: '#3b82f6'
    },
    {
      name: 'fileList',
      type: 'upload',
      label: '文件上传',
      props: {
        uploadText: '选择文件',
        multiple: true,
        accept: '.jpg,.png,.pdf'
      }
    }
  ],
  actions: {
    submitText: t('common.submit'),
    resetText: t('common.reset'),
    showReset: true,
    align: 'right'
  }
}))

/**
 * 处理新组件表单提交
 * @param values - 表单值
 */
function handleNewComponentsSubmit(values: Record<string, any>): void {
  console.log('新组件表单提交:', values)
  alert(`表单提交成功！\n${JSON.stringify(values, null, 2)}`)
}

// ==================== antdv-next 新特性示例 ====================

/**
 * 表单数据 - 新特性示例
 */
const newFeaturesFormData = ref({
  username: '',
  email: '',
  role: '',
  status: true,
  category: '',
  product: '',
  description: ''
})

/**
 * 模拟大量选项数据
 */
const generateLargeOptions = (prefix: string, count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    label: `${prefix}选项 ${i + 1}`,
    value: `${prefix.toLowerCase()}_${i + 1}`
  }))
}

/**
 * 异步加载大量选项
 */
async function loadLargeOptions(_formData: Record<string, any>): Promise<Array<{ label: string; value: string }>> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return generateLargeOptions('商品', 1000)
}

/**
 * 新特性表单 Schema
 */
const newFeaturesSchema = computed<FormSchema>(() => ({
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  // antdv-next 新特性
  variant: 'filled',
  scrollToFirstError: true,
  validateDebounce: 500,
  validateFirst: true,
  fields: [
    {
      name: 'username',
      type: 'input',
      label: '用户名',
      placeholder: '请输入用户名',
      tooltip: '用户名用于登录系统，创建后不可修改',
      hasFeedback: true,
      validateStatus: undefined,
      rules: [
        { required: true, message: '用户名不能为空' },
        { min: 3, message: '用户名至少3个字符' }
      ],
      // 字段级校验配置
      validateTrigger: 'blur',
      validateDebounce: 300
    },
    {
      name: 'email',
      type: 'input',
      label: '邮箱',
      placeholder: '请输入邮箱',
      tooltip: {
        title: '邮箱格式要求',
        content: '请输入有效的邮箱地址，如 example@domain.com'
      },
      hasFeedback: true,
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
      required: true,
      help: '选择用户角色后将决定其权限范围',
      extra: '管理员拥有所有权限，普通用户仅有查看权限',
      options: [
        { label: '管理员', value: 'admin' },
        { label: '编辑', value: 'editor' },
        { label: '查看者', value: 'viewer' }
      ]
    },
    {
      name: 'status',
      type: 'switch',
      label: '启用状态',
      defaultValue: true,
      help: '关闭后用户将无法登录系统'
    },
    {
      name: 'category',
      type: 'select',
      label: '商品分类（虚拟滚动）',
      placeholder: '请选择分类',
      help: '此选择器启用了虚拟滚动，支持大量选项',
      // 虚拟滚动配置
      virtualScroll: {
        enabled: true,
        itemHeight: 32,
        overscan: 5
      },
      options: generateLargeOptions('分类', 1000)
    },
    {
      name: 'product',
      type: 'select',
      label: '商品（异步+虚拟滚动）',
      placeholder: '请先选择分类',
      help: '异步加载大量选项，带防抖和缓存',
      virtualScroll: true,
      optionsDebounce: 500,
      cacheFields: ['category'],
      options: loadLargeOptions
    },
    {
      name: 'description',
      type: 'textarea',
      label: '描述',
      placeholder: '请输入描述',
      props: { rows: 4 }
    }
  ],
  actions: {
    submitText: t('common.submit'),
    resetText: t('common.reset'),
    showReset: true,
    align: 'right'
  }
}))

/**
 * 处理高级表单提交
 * @param values - 表单值
 */
function handleNewFeaturesSubmit(values: Record<string, any>): void {
  console.log('新特性表单提交:', values)
  alert(`表单提交成功！\n${JSON.stringify(values, null, 2)}`)
}

// ==================== Watch 监听示例 ====================

/**
 * 表单数据 - Watch 监听示例
 */
const watchFormData = ref({
  price: 100,
  quantity: 1,
  total: 100,
  discount: 0
})

/**
 * Watch 监听表单 Schema
 */
const watchSchema = computed<FormSchema>(() => ({
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'price',
      type: 'number',
      label: '单价',
      defaultValue: 100,
      props: { min: 0, precision: 2 }
    },
    {
      name: 'quantity',
      type: 'number',
      label: '数量',
      defaultValue: 1,
      props: { min: 1 }
    },
    {
      name: 'discount',
      type: 'slider',
      label: '折扣',
      defaultValue: 0,
      props: { min: 0, max: 50, step: 5, marks: { 0: '0%', 25: '25%', 50: '50%' } }
    },
    {
      name: 'total',
      type: 'number',
      label: '总价',
      disabled: true,
      props: { precision: 2 }
    }
  ],
  actions: {
    submitText: t('common.submit'),
    resetText: t('common.reset'),
    showReset: true,
    align: 'right'
  }
}))

// 为字段添加 watch 监听
if (watchSchema.value.fields[0]) {
  watchSchema.value.fields[0].watch = [
    {
      field: 'price',
      handler: (value, formData, methods) => {
        const total = (value || 0) * (formData.quantity || 1) * (1 - (formData.discount || 0) / 100)
        methods.setFieldValue('total', Math.round(total * 100) / 100)
      }
    }
  ]
}
if (watchSchema.value.fields[1]) {
  watchSchema.value.fields[1].watch = [
    {
      field: 'quantity',
      handler: (value, formData, methods) => {
        const total = (formData.price || 0) * (value || 1) * (1 - (formData.discount || 0) / 100)
        methods.setFieldValue('total', Math.round(total * 100) / 100)
      }
    }
  ]
}
if (watchSchema.value.fields[2]) {
  watchSchema.value.fields[2].watch = [
    {
      field: 'discount',
      handler: (value, formData, methods) => {
        const total = (formData.price || 0) * (formData.quantity || 1) * (1 - (value || 0) / 100)
        methods.setFieldValue('total', Math.round(total * 100) / 100)
      }
    }
  ]
}

/**
 * 处理 Watch 监听表单提交
 * @param values - 表单值
 */
function handleWatchSubmit(values: Record<string, any>): void {
  console.log('Watch 监听表单提交:', values)
  alert(`表单提交成功！\n${JSON.stringify(values, null, 2)}`)
}
</script>

<template>
  <div class="space-y-6 p-6">
    <!-- 页面标题 -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-3xl font-bold">TForm 组件演示</h1>
        <p class="text-muted-foreground mt-1">
          基于 antdv-next 的 JSON 配置化表单组件
        </p>
      </div>
      <!-- 主题切换按钮 -->
      <Button
        variant="outline"
        size="icon"
        @click="themeStore.toggleMode()"
      >
        <Sun v-if="themeStore.currentMode === 'dark'" class="h-4 w-4" />
        <Moon v-else class="h-4 w-4" />
      </Button>
    </div>

    <!-- 标签页切换不同示例 -->
    <Tabs default-value="basic" class="w-full">
      <TabsList class="grid w-full grid-cols-12">
        <TabsTrigger value="basic">基础用法</TabsTrigger>
        <TabsTrigger value="advanced">高级组件</TabsTrigger>
        <TabsTrigger value="more">更多组件</TabsTrigger>
        <TabsTrigger value="new">新组件</TabsTrigger>
        <TabsTrigger value="features" class="bg-primary/10">新特性</TabsTrigger>
        <TabsTrigger value="search">搜索表单</TabsTrigger>
        <TabsTrigger value="dependency">字段联动</TabsTrigger>
        <TabsTrigger value="async">异步选项</TabsTrigger>
        <TabsTrigger value="watch">Watch监听</TabsTrigger>
        <TabsTrigger value="list">动态列表</TabsTrigger>
        <TabsTrigger value="group">分组表单</TabsTrigger>
        <TabsTrigger value="inline">内联布局</TabsTrigger>
      </TabsList>

      <!-- 基础用法 -->
      <TabsContent value="basic">
        <Card>
          <CardHeader>
            <CardTitle>基础表单</CardTitle>
            <CardDescription>
              展示基本的输入框、数字输入框和表单验证功能
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="max-w-2xl">
              <TForm
                v-model="basicFormData"
                :schema="basicSchema"
                @submit="handleBasicSubmit"
                @change="handleFormChange"
              />
            </div>

            <!-- 当前数据展示 -->
            <div class="mt-6 p-4 bg-muted rounded-lg">
              <h4 class="text-sm font-medium mb-2">当前表单数据：</h4>
              <pre class="text-xs text-muted-foreground">{{ JSON.stringify(basicFormData, null, 2) }}</pre>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 高级组件 -->
      <TabsContent value="advanced">
        <Card>
          <CardHeader>
            <CardTitle>高级组件</CardTitle>
            <CardDescription>
              展示密码框、选择器、开关、复选框、文本域等组件
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="max-w-2xl">
              <TForm
                v-model="advancedFormData"
                :schema="advancedSchema"
                @submit="handleAdvancedSubmit"
                @change="handleFormChange"
              />
            </div>

            <!-- 当前数据展示 -->
            <div class="mt-6 p-4 bg-muted rounded-lg">
              <h4 class="text-sm font-medium mb-2">当前表单数据：</h4>
              <pre class="text-xs text-muted-foreground">{{ JSON.stringify(advancedFormData, null, 2) }}</pre>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 更多组件 -->
      <TabsContent value="more">
        <Card>
          <CardHeader>
            <CardTitle>更多组件</CardTitle>
            <CardDescription>
              展示滑块、评分、按钮式单选框、自动完成、提及、日期选择器、级联选择器、树形选择器等组件
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="max-w-2xl">
              <TForm
                v-model="moreComponentsFormData"
                :schema="moreComponentsSchema"
                @submit="handleMoreComponentsSubmit"
                @change="handleFormChange"
              />
            </div>

            <!-- 当前数据展示 -->
            <div class="mt-6 p-4 bg-muted rounded-lg">
              <h4 class="text-sm font-medium mb-2">当前表单数据：</h4>
              <pre class="text-xs text-muted-foreground">{{ JSON.stringify(moreComponentsFormData, null, 2) }}</pre>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 新组件 -->
      <TabsContent value="new">
        <Card>
          <CardHeader>
            <CardTitle>新扩展组件</CardTitle>
            <CardDescription>
              展示新添加的 10 个组件：上传、穿梭框、颜色选择器、日期变体、分段控制器等
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="max-w-2xl">
              <TForm
                v-model="newComponentsFormData"
                :schema="newComponentsSchema"
                @submit="handleNewComponentsSubmit"
                @change="handleFormChange"
              />
            </div>

            <!-- 当前数据展示 -->
            <div class="mt-6 p-4 bg-muted rounded-lg">
              <h4 class="text-sm font-medium mb-2">当前表单数据：</h4>
              <pre class="text-xs text-muted-foreground">{{ JSON.stringify(newComponentsFormData, null, 2) }}</pre>
            </div>

            <!-- 组件说明 -->
            <div class="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div class="flex items-center gap-2">
                <Badge variant="outline">checkbox-single</Badge>
                <span>单个复选框</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge variant="outline">month-picker</Badge>
                <span>月份选择器</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge variant="outline">quarter-picker</Badge>
                <span>季度选择器</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge variant="outline">year-picker</Badge>
                <span>年份选择器</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge variant="outline">week-picker</Badge>
                <span>周选择器</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge variant="outline">time-range-picker</Badge>
                <span>时间范围选择器</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge variant="outline">segmented</Badge>
                <span>分段控制器</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge variant="outline">transfer</Badge>
                <span>穿梭框</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge variant="outline">color-picker</Badge>
                <span>颜色选择器</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge variant="outline">upload</Badge>
                <span>文件上传</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- antdv-next 新特性 -->
      <TabsContent value="features">
        <div class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>antdv-next 新特性</CardTitle>
              <CardDescription>
                展示新增的表单特性：variant 变体、tooltip 提示、虚拟滚动、防抖校验等
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="max-w-2xl">
                <TForm
                  v-model="newFeaturesFormData"
                  :schema="newFeaturesSchema"
                  @submit="handleNewFeaturesSubmit"
                  @change="handleFormChange"
                />
              </div>

              <!-- 当前数据展示 -->
              <div class="mt-6 p-4 bg-muted rounded-lg">
                <h4 class="text-sm font-medium mb-2">当前表单数据：</h4>
                <pre class="text-xs text-muted-foreground">{{ JSON.stringify(newFeaturesFormData, null, 2) }}</pre>
              </div>
            </CardContent>
          </Card>

          <!-- 特性说明 -->
          <Card>
            <CardHeader>
              <CardTitle>新增特性说明</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-4 border rounded-lg">
                  <h4 class="font-medium mb-2 text-primary">variant 变体</h4>
                  <p class="text-sm text-muted-foreground mb-2">
                    支持 outlined、filled、borderless 三种变体
                  </p>
                  <pre class="text-xs bg-muted p-2 rounded">variant: 'filled'</pre>
                </div>
                <div class="p-4 border rounded-lg">
                  <h4 class="font-medium mb-2 text-primary">tooltip 提示</h4>
                  <p class="text-sm text-muted-foreground mb-2">
                    为标签添加提示信息，支持字符串或对象配置
                  </p>
                  <pre class="text-xs bg-muted p-2 rounded">tooltip: '提示内容'
// 或
tooltip: { title: '标题', content: '内容' }</pre>
                </div>
                <div class="p-4 border rounded-lg">
                  <h4 class="font-medium mb-2 text-primary">hasFeedback 反馈</h4>
                  <p class="text-sm text-muted-foreground mb-2">
                    显示校验状态图标，提升用户体验
                  </p>
                  <pre class="text-xs bg-muted p-2 rounded">hasFeedback: true</pre>
                </div>
                <div class="p-4 border rounded-lg">
                  <h4 class="font-medium mb-2 text-primary">help / extra 提示</h4>
                  <p class="text-sm text-muted-foreground mb-2">
                    添加字段说明和额外信息
                  </p>
                  <pre class="text-xs bg-muted p-2 rounded">help: '提示信息'
extra: '额外说明'</pre>
                </div>
                <div class="p-4 border rounded-lg">
                  <h4 class="font-medium mb-2 text-primary">虚拟滚动</h4>
                  <p class="text-sm text-muted-foreground mb-2">
                    大数据量选项启用虚拟滚动，提升性能
                  </p>
                  <pre class="text-xs bg-muted p-2 rounded">virtualScroll: true
// 或详细配置
virtualScroll: {
  enabled: true,
  itemHeight: 32,
  overscan: 5
}</pre>
                </div>
                <div class="p-4 border rounded-lg">
                  <h4 class="font-medium mb-2 text-primary">防抖配置</h4>
                  <p class="text-sm text-muted-foreground mb-2">
                    异步选项加载和校验支持防抖
                  </p>
                  <pre class="text-xs bg-muted p-2 rounded">// 表单级
validateDebounce: 500
// 字段级
optionsDebounce: 300</pre>
                </div>
                <div class="p-4 border rounded-lg">
                  <h4 class="font-medium mb-2 text-primary">scrollToFirstError</h4>
                  <p class="text-sm text-muted-foreground mb-2">
                    提交失败自动滚动到第一个错误字段
                  </p>
                  <pre class="text-xs bg-muted p-2 rounded">scrollToFirstError: true
// 或详细配置
scrollToFirstError: {
  behavior: 'smooth',
  block: 'center'
}</pre>
                </div>
                <div class="p-4 border rounded-lg">
                  <h4 class="font-medium mb-2 text-primary">validateFirst</h4>
                  <p class="text-sm text-muted-foreground mb-2">
                    第一个规则失败后停止校验
                  </p>
                  <pre class="text-xs bg-muted p-2 rounded">validateFirst: true
// 或并行校验
validateFirst: 'parallel'</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- 搜索表单 -->
      <TabsContent value="search">
        <div class="space-y-6">
          <!-- 示例1：同行布局（少条件） -->
          <Card>
            <CardHeader>
              <CardTitle>同行布局（3个条件）</CardTitle>
              <CardDescription>
                当搜索条件数量 ≤ collapseThreshold + 1 时，自动使用同行布局
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TForm
                v-model="searchInlineFormData"
                :schema="searchInlineSchema"
                @submit="handleInlineSearchSubmit"
              />

              <!-- 配置说明 -->
              <div class="mt-4 p-3 bg-muted rounded-lg">
                <h4 class="text-sm font-medium mb-1">配置说明：</h4>
                <p class="text-xs text-muted-foreground">
                  3个条件 ≤ 3+1，自动使用同行布局，搜索按钮紧跟字段右侧
                </p>
              </div>
            </CardContent>
          </Card>

          <!-- 示例2：自定义同行数量 -->
          <Card>
            <CardHeader>
              <CardTitle>自定义同行数量（4个条件）</CardTitle>
              <CardDescription>
                通过调整 collapseThreshold 控制同行/网格布局切换
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TForm
                v-model="searchCustomInlineFormData"
                :schema="searchCustomInlineSchema"
                @submit="handleCustomInlineSearchSubmit"
              />

              <!-- 配置说明 -->
              <div class="mt-4 p-3 bg-muted rounded-lg">
                <h4 class="text-sm font-medium mb-1">配置说明：</h4>
                <pre class="text-xs text-muted-foreground">// 当前配置：collapseThreshold = 3
// 4个条件 > 3+1，使用网格布局

// 如需同行布局，设置：collapseThreshold = 4
// 4个条件 ≤ 4+1，使用同行布局</pre>
              </div>
            </CardContent>
          </Card>

          <!-- 示例3：网格布局（多条件） -->
          <Card>
            <CardHeader>
              <CardTitle>网格布局（7个条件 + 折叠）</CardTitle>
              <CardDescription>
                多条件时使用网格布局，支持折叠展开
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TForm
                v-model="searchFormData"
                :schema="searchSchema"
                @submit="handleSearchSubmit"
              />

              <!-- 使用说明 -->
              <div class="mt-4 p-3 bg-muted rounded-lg">
                <h4 class="text-sm font-medium mb-1">完整配置示例：</h4>
                <pre class="text-xs text-muted-foreground">searchConfig: {
  enabled: true,              // 启用搜索表单模式
  collapsed: true,            // 默认折叠
  collapseThreshold: 3,       // 阈值：决定同行/网格布局切换
  showCollapseButton: true,   // 显示展开/收起按钮
  columns: 3,                 // 网格布局每行列数
  searchText: t('common.search'),  // 搜索按钮文本
  resetText: t('common.reset'),    // 重置按钮文本
  showReset: true,            // 显示重置按钮
  onSearch: (values) => {     // 搜索回调
    // 触发 TTable 刷新
  },
  onReset: () => {            // 重置回调
    // 触发 TTable 刷新
  }
}</pre>
              </div>
            </CardContent>
          </Card>

          <!-- 布局规则说明 -->
          <Card>
            <CardHeader>
              <CardTitle>布局规则说明</CardTitle>
              <CardDescription>
                智能布局切换逻辑
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-3 gap-4">
                <div class="p-4 border rounded-lg">
                  <h5 class="font-medium mb-2 text-primary">同行布局</h5>
                  <p class="text-sm text-muted-foreground mb-2">
                    条件数量 ≤ collapseThreshold + 1
                  </p>
                  <p class="text-xs text-muted-foreground">
                    所有条件和按钮横向排列在一行，适合少量搜索条件场景
                  </p>
                </div>
                <div class="p-4 border rounded-lg">
                  <h5 class="font-medium mb-2 text-primary">网格布局</h5>
                  <p class="text-sm text-muted-foreground mb-2">
                    条件数量 > collapseThreshold + 1
                  </p>
                  <p class="text-xs text-muted-foreground">
                    使用 CSS Grid 布局，按钮在下方单独一行，适合多条件场景
                  </p>
                </div>
                <div class="p-4 border rounded-lg">
                  <h5 class="font-medium mb-2 text-primary">折叠展开</h5>
                  <p class="text-sm text-muted-foreground mb-2">
                    collapsed + collapseThreshold
                  </p>
                  <p class="text-xs text-muted-foreground">
                    默认显示阈值数量的字段，点击展开显示全部，收起恢复默认
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- 字段联动 -->
      <TabsContent value="dependency">
        <Card>
          <CardHeader>
            <CardTitle>字段联动</CardTitle>
            <CardDescription>
              根据用户类型动态显示不同的字段
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="max-w-2xl">
              <TForm
                v-model="dependencyFormData"
                :schema="dependencySchema"
                @submit="handleDependencySubmit"
                @change="handleFormChange"
              />
            </div>

            <!-- 当前数据展示 -->
            <div class="mt-6 p-4 bg-muted rounded-lg">
              <h4 class="text-sm font-medium mb-2">当前表单数据：</h4>
              <pre class="text-xs text-muted-foreground">{{ JSON.stringify(dependencyFormData, null, 2) }}</pre>
            </div>

            <!-- 说明 -->
            <div class="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">提示</Badge>
              <span>切换用户类型，观察字段的动态显示/隐藏</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 异步选项 -->
      <TabsContent value="async">
        <Card>
          <CardHeader>
            <CardTitle>异步选项</CardTitle>
            <CardDescription>
              选项通过异步函数加载，支持根据其他字段值动态获取
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="max-w-2xl">
              <TForm
                v-model="asyncFormData"
                :schema="asyncSchema"
                @submit="handleAsyncSubmit"
                @change="handleFormChange"
              />
            </div>

            <!-- 当前数据展示 -->
            <div class="mt-6 p-4 bg-muted rounded-lg">
              <h4 class="text-sm font-medium mb-2">当前表单数据：</h4>
              <pre class="text-xs text-muted-foreground">{{ JSON.stringify(asyncFormData, null, 2) }}</pre>
            </div>

            <!-- 说明 -->
            <div class="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">提示</Badge>
              <span>选择商品分类后，商品选项会自动加载</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Watch 监听 -->
      <TabsContent value="watch">
        <Card>
          <CardHeader>
            <CardTitle>Watch 字段监听</CardTitle>
            <CardDescription>
              监听字段变化并自动计算其他字段值
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="max-w-2xl">
              <TForm
                v-model="watchFormData"
                :schema="watchSchema"
                @submit="handleWatchSubmit"
                @change="handleFormChange"
              />
            </div>

            <!-- 当前数据展示 -->
            <div class="mt-6 p-4 bg-muted rounded-lg">
              <h4 class="text-sm font-medium mb-2">当前表单数据：</h4>
              <pre class="text-xs text-muted-foreground">{{ JSON.stringify(watchFormData, null, 2) }}</pre>
            </div>

            <!-- 说明 -->
            <div class="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">提示</Badge>
              <span>修改单价、数量或折扣，总价会自动计算</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 动态列表 -->
      <TabsContent value="list">
        <Card>
          <CardHeader>
            <CardTitle>动态列表</CardTitle>
            <CardDescription>
              支持动态添加/删除的表单列表，适用于多组相同字段的场景
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="max-w-3xl">
              <TForm
                v-model="listFormData"
                :schema="listSchema"
                @submit="handleListSubmit"
                @change="handleFormChange"
              />
            </div>

            <!-- 当前数据展示 -->
            <div class="mt-6 p-4 bg-muted rounded-lg">
              <h4 class="text-sm font-medium mb-2">当前表单数据：</h4>
              <pre class="text-xs text-muted-foreground">{{ JSON.stringify(listFormData, null, 2) }}</pre>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 分组表单 -->
      <TabsContent value="group">
        <Card>
          <CardHeader>
            <CardTitle>分组表单</CardTitle>
            <CardDescription>
              将相关字段分组显示，支持折叠展开
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="max-w-2xl space-y-4">
              <TForm
                v-model="groupFormData"
                :schema="groupSchema"
                @submit="handleGroupSubmit"
                @change="handleFormChange"
              />
            </div>

            <!-- 当前数据展示 -->
            <div class="mt-6 p-4 bg-muted rounded-lg">
              <h4 class="text-sm font-medium mb-2">当前表单数据：</h4>
              <pre class="text-xs text-muted-foreground">{{ JSON.stringify(groupFormData, null, 2) }}</pre>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 内联布局 -->
      <TabsContent value="inline">
        <Card>
          <CardHeader>
            <CardTitle>内联布局</CardTitle>
            <CardDescription>
              适合搜索筛选等场景，节省垂直空间
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TForm
              v-model="inlineFormData"
              :schema="inlineSchema"
              @submit="handleInlineSubmit"
              @change="handleFormChange"
            />

            <!-- 当前数据展示 -->
            <div class="mt-6 p-4 bg-muted rounded-lg">
              <h4 class="text-sm font-medium mb-2">当前搜索条件：</h4>
              <pre class="text-xs text-muted-foreground">{{ JSON.stringify(inlineFormData, null, 2) }}</pre>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <!-- 特性说明 -->
    <Card>
      <CardHeader>
        <CardTitle>组件特性</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">30+ 字段类型</h4>
            <p class="text-sm text-muted-foreground">
              支持输入框、选择器、滑块、评分、日期、上传、穿梭框等常用组件
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">异步选项</h4>
            <p class="text-sm text-muted-foreground">
              支持通过异步函数加载选项，自动处理 loading 状态
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">Watch 监听</h4>
            <p class="text-sm text-muted-foreground">
              支持字段监听，实现字段间联动计算
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">表单状态</h4>
            <p class="text-sm text-muted-foreground">
              提供 dirty、touched、valid 等表单元数据
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">动态列表</h4>
            <p class="text-sm text-muted-foreground">
              支持动态增减表单项，适用于多组相同字段
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">字段分组</h4>
            <p class="text-sm text-muted-foreground">
              支持字段分组显示，可折叠展开
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">字段联动</h4>
            <p class="text-sm text-muted-foreground">
              支持根据其他字段值动态控制字段显示/隐藏
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">JSON 配置驱动</h4>
            <p class="text-sm text-muted-foreground">
              通过 Schema 配置表单结构，无需编写大量模板代码
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">表单验证</h4>
            <p class="text-sm text-muted-foreground">
              内置必填、邮箱、长度等常用验证规则
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">主题对齐</h4>
            <p class="text-sm text-muted-foreground">
              样式与 shadcn-vue 主题保持一致
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">TypeScript</h4>
            <p class="text-sm text-muted-foreground">
              完整的类型定义，支持泛型约束
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">Composables</h4>
            <p class="text-sm text-muted-foreground">
              提供 useFieldState、useFormMeta 等可复用逻辑
            </p>
          </div>
          <div class="p-4 border rounded-lg border-primary/50 bg-primary/5">
            <h4 class="font-medium mb-2 text-primary">variant 变体</h4>
            <p class="text-sm text-muted-foreground">
              支持 outlined、filled、borderless 三种表单控件变体
            </p>
          </div>
          <div class="p-4 border rounded-lg border-primary/50 bg-primary/5">
            <h4 class="font-medium mb-2 text-primary">tooltip 提示</h4>
            <p class="text-sm text-muted-foreground">
              为标签添加提示信息，支持字符串或对象配置
            </p>
          </div>
          <div class="p-4 border rounded-lg border-primary/50 bg-primary/5">
            <h4 class="font-medium mb-2 text-primary">虚拟滚动</h4>
            <p class="text-sm text-muted-foreground">
              大数据量选项启用虚拟滚动，提升性能
            </p>
          </div>
          <div class="p-4 border rounded-lg border-primary/50 bg-primary/5">
            <h4 class="font-medium mb-2 text-primary">防抖校验</h4>
            <p class="text-sm text-muted-foreground">
              支持 validateDebounce、validateFirst 等校验优化
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
