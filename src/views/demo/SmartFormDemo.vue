<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import {
  Mail,
  Lock,
  User,
  Phone,
  CheckCircle2,
  FormInput,
  Sparkles,
  SlidersHorizontal,
  Tags,
  ToggleLeft,
} from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import { SmartForm } from '@/components/smart-form'
import type { FormFieldConfig, FormFieldGroup, SmartFormExpose } from '@/components/smart-form'

// ============ 登录表单类型 ============
interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

// ============ 高级表单类型 ============
interface AdvancedForm {
  username: string
  email: string
  phone: string
  birthDate?: string
  dateRange?: { from: string; to: string }
  gender: string
  password: string
  confirmPassword: string
  age: number
  skills: string[]
  interests: string[]
  experience: number
  notifications?: boolean
  newsletter?: boolean
  agreeTerms: boolean
  verifyCode: string
  pin: string
}

// ============ 联动表单类型 ============
interface ConditionalForm {
  userType: string
  companyName?: string
  jobTitle?: string
  studentId?: string
  school?: string
  vipLevel: string
  discount?: number
}

// ============ 新功能表单类型 ============
interface NewFeaturesForm {
  themeColor?: string
  satisfaction?: number
  description: string
}

// ============ AutoForm 演示类型 ============
interface AutoFormDemo {
  name: string
  email: string
  age: number
  role: 'admin' | 'user' | 'guest'
  bio?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loginFormRef = ref<SmartFormExpose<LoginForm> | null>(null)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const advancedFormRef = ref<SmartFormExpose<AdvancedForm> | null>(null)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const conditionalFormRef = ref<SmartFormExpose<ConditionalForm> | null>(null)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const newFeaturesFormRef = ref<SmartFormExpose<NewFeaturesForm> | null>(null)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const autoFormRef = ref<SmartFormExpose<AutoFormDemo> | null>(null)

const loginLoading = ref(false)
const advancedLoading = ref(false)
const conditionalLoading = ref(false)
const newFeaturesLoading = ref(false)
const autoFormLoading = ref(false)

// ============ 登录表单配置 ============
const loginSchema = z.object({
  email: z.string().min(1, '请输入邮箱地址').email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码').min(6, '密码至少6位字符'),
  rememberMe: z.boolean().default(false),
})

const loginFields: FormFieldConfig<LoginForm>[] = [
  {
    name: 'email',
    type: 'email',
    label: '邮箱地址',
    placeholder: 'admin@example.com',
    required: true,
    prefixIcon: Mail,
  },
  {
    name: 'password',
    type: 'password',
    label: '密码',
    placeholder: '••••••••',
    required: true,
    prefixIcon: Lock,
  },
  {
    name: 'rememberMe',
    type: 'checkbox',
    label: '记住我',
  },
]

const handleLogin = async (values: LoginForm) => {
  loginLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1500))
  toast.success('登录成功', {
    description: `邮箱: ${values.email}`,
  })
  loginLoading.value = false
}

// ============ 高级表单配置 ============
const advancedSchema = z.object({
  username: z.string().min(2, '用户名至少2位字符').max(20, '用户名最多20位字符'),
  email: z.string().min(1, '请输入邮箱').email('请输入有效的邮箱地址'),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码'),
  birthDate: z.string().optional(),
  dateRange: z.object({
    from: z.string(),
    to: z.string(),
  }).optional(),
  gender: z.string().min(1, '请选择性别'),
  password: z.string().min(6, '密码至少6位字符'),
  confirmPassword: z.string().min(1, '请确认密码'),
  age: z.number().min(18, '年龄必须大于18岁').max(100, '年龄必须小于100岁'),
  skills: z.array(z.string()).min(1, '至少选择一个技能'),
  interests: z.array(z.string()).max(5, '最多选择5个兴趣'),
  experience: z.number().min(0).max(50),
  notifications: z.boolean().default(true),
  newsletter: z.boolean().default(false),
  agreeTerms: z.boolean().refine(val => val === true, { message: '请同意服务条款' }),
  verifyCode: z.string().length(6, '验证码为6位数字'),
  pin: z.string().length(4, 'PIN码为4位数字'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
})

const advancedGroups: FormFieldGroup<AdvancedForm>[] = [
  {
    title: '基本信息',
    description: '填写您的个人基本信息',
    fields: ['username', 'email', 'phone', 'birthDate', 'dateRange', 'gender'],
    defaultExpanded: true,
  },
  {
    title: '账户安全',
    description: '设置您的账户密码和验证方式',
    fields: ['password', 'confirmPassword', 'verifyCode', 'pin'],
    defaultExpanded: true,
  },
  {
    title: '个人偏好',
    description: '选择您的技能和兴趣',
    fields: ['skills', 'interests', 'experience', 'notifications', 'newsletter'],
    defaultExpanded: false,
  },
]

const advancedFields: FormFieldConfig<AdvancedForm>[] = [
  {
    name: 'username',
    type: 'text',
    label: '用户名',
    placeholder: '请输入用户名',
    required: true,
    prefixIcon: User,
    colSpan: 1,
  },
  {
    name: 'email',
    type: 'email',
    label: '邮箱',
    placeholder: 'example@email.com',
    required: true,
    prefixIcon: Mail,
    colSpan: 1,
  },
  {
    name: 'phone',
    type: 'text',
    label: '手机号',
    placeholder: '13800138000',
    required: true,
    prefixIcon: Phone,
    colSpan: 1,
  },
  {
    name: 'birthDate',
    type: 'date',
    label: '出生日期',
    placeholder: '请选择出生日期',
    colSpan: 1,
  },
  {
    name: 'dateRange',
    type: 'date-range',
    label: '活动日期范围',
    placeholder: '选择日期范围',
    colSpan: 2,
  },
  {
    name: 'gender',
    type: 'radio',
    label: '性别',
    required: true,
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
      { label: '保密', value: 'secret' },
    ],
    colSpan: 2,
  },
  {
    name: 'password',
    type: 'password',
    label: '密码',
    placeholder: '设置密码',
    required: true,
    prefixIcon: Lock,
    colSpan: 1,
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: '确认密码',
    placeholder: '再次输入密码',
    required: true,
    prefixIcon: Lock,
    colSpan: 1,
  },
  {
    name: 'verifyCode',
    type: 'otp',
    label: '邮箱验证码',
    placeholder: '输入6位验证码',
    required: true,
    otpConfig: { length: 6 },
    colSpan: 1,
  },
  {
    name: 'pin',
    type: 'pin',
    label: '安全PIN码',
    placeholder: '设置4位PIN码',
    required: true,
    otpConfig: { length: 4 },
    colSpan: 1,
  },
  {
    name: 'age',
    type: 'number',
    label: '年龄',
    placeholder: '请输入年龄',
    required: true,
    colSpan: 1,
  },
  {
    name: 'experience',
    type: 'slider',
    label: '工作年限',
    sliderConfig: { min: 0, max: 50, step: 1 },
    colSpan: 1,
  },
  {
    name: 'skills',
    type: 'multi-select',
    label: '技能标签',
    placeholder: '请选择技能',
    required: true,
    options: [
      { label: 'JavaScript', value: 'js' },
      { label: 'TypeScript', value: 'ts' },
      { label: 'Vue.js', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Node.js', value: 'node' },
      { label: 'Python', value: 'python' },
      { label: 'Go', value: 'go' },
      { label: 'Rust', value: 'rust' },
    ],
    colSpan: 1,
  },
  {
    name: 'interests',
    type: 'tags',
    label: '兴趣爱好',
    placeholder: '输入兴趣后按回车',
    colSpan: 1,
  },
  {
    name: 'notifications',
    type: 'switch',
    label: '接收消息通知',
    colSpan: 1,
  },
  {
    name: 'newsletter',
    type: 'switch',
    label: '订阅邮件列表',
    colSpan: 1,
  },
  {
    name: 'agreeTerms',
    type: 'checkbox',
    label: '我已阅读并同意服务条款和隐私政策',
    colSpan: 2,
  },
]

const handleAdvancedSubmit = async (values: AdvancedForm) => {
  advancedLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1500))
  toast.success('表单提交成功', {
    description: `用户名: ${values.username}`,
  })
  advancedLoading.value = false
}

// ============ 联动表单配置 ============
const conditionalSchema = z.object({
  userType: z.string().min(1, '请选择用户类型'),
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
  studentId: z.string().optional(),
  school: z.string().optional(),
  vipLevel: z.string().min(1, '请选择VIP等级'),
  discount: z.number().optional(),
})

const conditionalFields: FormFieldConfig<ConditionalForm>[] = [
  {
    name: 'userType',
    type: 'select',
    label: '用户类型',
    placeholder: '请选择用户类型',
    required: true,
    options: [
      { label: '企业员工', value: 'employee' },
      { label: '学生', value: 'student' },
      { label: '自由职业', value: 'freelancer' },
    ],
    colSpan: 2,
  },
  {
    name: 'companyName',
    type: 'text',
    label: '公司名称',
    placeholder: '请输入公司名称',
    conditions: [
      { field: 'userType', value: 'employee', action: 'show' },
    ],
    colSpan: 1,
  },
  {
    name: 'jobTitle',
    type: 'text',
    label: '职位',
    placeholder: '请输入职位',
    conditions: [
      { field: 'userType', value: 'employee', action: 'show' },
    ],
    colSpan: 1,
  },
  {
    name: 'school',
    type: 'text',
    label: '学校名称',
    placeholder: '请输入学校名称',
    conditions: [
      { field: 'userType', value: 'student', action: 'show' },
    ],
    colSpan: 1,
  },
  {
    name: 'studentId',
    type: 'text',
    label: '学号',
    placeholder: '请输入学号',
    conditions: [
      { field: 'userType', value: 'student', action: 'show' },
    ],
    colSpan: 1,
  },
  {
    name: 'vipLevel',
    type: 'select',
    label: 'VIP等级',
    placeholder: '请选择VIP等级',
    required: true,
    options: [
      { label: '普通会员', value: 'normal' },
      { label: '银卡会员', value: 'silver' },
      { label: '金卡会员', value: 'gold' },
      { label: '钻石会员', value: 'diamond' },
    ],
    colSpan: 1,
  },
  {
    name: 'discount',
    type: 'slider',
    label: '折扣比例',
    sliderConfig: { min: 0, max: 100, step: 5 },
    conditions: [
      {
        field: 'vipLevel',
        value: (val: string) => ['gold', 'diamond'].includes(val),
        action: 'show',
      },
    ],
    colSpan: 1,
  },
]

const handleConditionalSubmit = async (values: ConditionalForm) => {
  conditionalLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1500))
  toast.success('联动表单提交成功')
  conditionalLoading.value = false
}

// ============ 新功能表单配置 ============
const newFeaturesSchema = z.object({
  themeColor: z.string().default('#3b82f6'),
  satisfaction: z.number().min(0).max(5).default(0),
  description: z.string().min(10, '描述至少10个字符').max(500, '描述最多500个字符'),
})

const newFeaturesFields: FormFieldConfig<NewFeaturesForm>[] = [
  {
    name: 'themeColor',
    type: 'color',
    label: '主题颜色',
    description: '选择您喜欢的主题颜色',
  },
  {
    name: 'satisfaction',
    type: 'rating',
    label: '满意度评分',
    description: '请对我们的产品进行评分',
  },
  {
    name: 'description',
    type: 'rich-text',
    label: '详细描述',
    placeholder: '请输入详细描述...',
    description: '支持富文本编辑',
  },
]

const handleNewFeaturesSubmit = async (values: NewFeaturesForm) => {
  newFeaturesLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1500))
  toast.success('新功能表单提交成功', {
    description: `颜色: ${values.themeColor}, 评分: ${values.satisfaction}`,
  })
  newFeaturesLoading.value = false
}

// ============ AutoForm 演示配置 ============
import { zodToFieldConfig } from '@/components/smart-form'

const autoFormSchema = z.object({
  name: z.string().min(2, '姓名至少2个字符').max(50, '姓名最多50个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  age: z.number().min(18, '年龄必须大于18岁').max(120, '年龄必须小于120岁'),
  role: z.enum(['admin', 'user', 'guest']),
  bio: z.string().max(200, '简介最多200个字符').optional(),
})

const autoFormFields = zodToFieldConfig<AutoFormDemo>(autoFormSchema, {
  labels: {
    name: '姓名',
    email: '邮箱',
    age: '年龄',
    role: '角色',
    bio: '个人简介',
  },
  placeholders: {
    name: '请输入姓名',
    email: 'example@email.com',
    bio: '请输入个人简介（可选）',
  },
})

const handleAutoFormSubmit = async (values: AutoFormDemo) => {
  autoFormLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1500))
  toast.success('AutoForm 提交成功', {
    description: `姓名: ${values.name}, 角色: ${values.role}`,
  })
  autoFormLoading.value = false
}

// 代码示例
const codeExample = `const fields: FormFieldConfig<FormType>[] = [
  {
    name: 'userType',
    type: 'select',
    label: '用户类型',
    options: [
      { label: '企业员工', value: 'employee' },
      { label: '学生', value: 'student' },
    ],
  },
  {
    name: 'companyName',
    type: 'text',
    label: '公司名称',
    // 字段联动：当 userType 为 employee 时显示
    conditions: [
      { field: 'userType', value: 'employee', action: 'show' },
    ],
  },
]`

// 支持的字段类型
const fieldTypes = [
  { name: 'text', desc: '文本输入', component: 'Input' },
  { name: 'email', desc: '邮箱输入', component: 'Input' },
  { name: 'password', desc: '密码输入', component: 'Input' },
  { name: 'number', desc: '数字输入', component: 'Input' },
  { name: 'textarea', desc: '多行文本', component: 'Textarea' },
  { name: 'select', desc: '下拉选择', component: 'Select' },
  { name: 'multi-select', desc: '多选下拉', component: 'Select' },
  { name: 'combobox', desc: '组合框', component: 'Combobox' },
  { name: 'checkbox', desc: '复选框', component: 'Checkbox' },
  { name: 'switch', desc: '开关', component: 'Switch' },
  { name: 'radio', desc: '单选框', component: 'RadioGroup' },
  { name: 'date', desc: '日期选择', component: 'Calendar' },
  { name: 'date-range', desc: '日期范围', component: 'RangeCalendar' },
  { name: 'datetime', desc: '日期时间', component: 'Input' },
  { name: 'time', desc: '时间选择', component: 'Input' },
  { name: 'slider', desc: '滑块', component: 'Slider' },
  { name: 'tags', desc: '标签输入', component: 'TagsInput' },
  { name: 'otp', desc: '验证码', component: 'InputOTP' },
  { name: 'pin', desc: 'PIN码', component: 'InputOTP' },
  { name: 'toggle-group', desc: '切换按钮组', component: 'ToggleGroup' },
  { name: 'file', desc: '文件上传', component: 'Input' },
  { name: 'color', desc: '颜色选择', component: 'ColorPicker', isNew: true },
  { name: 'rating', desc: '评分', component: 'Rating', isNew: true },
  { name: 'rich-text', desc: '富文本', component: 'RichText', isNew: true },
  { name: 'custom', desc: '自定义组件', component: 'Custom' },
]
</script>

<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold flex items-center gap-2">
          <FormInput class="w-8 h-8 text-primary" />
          SmartForm 功能演示
        </h1>
        <p class="text-muted-foreground mt-2">
          基于 shadcn-vue + VeeValidate + Zod 的通用表单组件，支持 20+ 种字段类型
        </p>
      </div>
      <Badge variant="secondary" class="text-sm">
        <Sparkles class="w-3 h-3 mr-1" />
        新功能
      </Badge>
    </div>

    <Separator />

    <!-- 特性介绍 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card class="bg-primary/5 border-primary/20">
        <CardContent class="pt-6">
          <div class="flex items-center gap-2 text-primary font-semibold">
            <CheckCircle2 class="w-5 h-5" />
            20+ 字段类型
          </div>
          <p class="text-sm text-muted-foreground mt-2">
            支持文本、日期、滑块、OTP、标签等丰富组件
          </p>
        </CardContent>
      </Card>
      <Card class="bg-primary/5 border-primary/20">
        <CardContent class="pt-6">
          <div class="flex items-center gap-2 text-primary font-semibold">
            <CheckCircle2 class="w-5 h-5" />
            字段联动
          </div>
          <p class="text-sm text-muted-foreground mt-2">
            支持显示/隐藏/禁用/设值等联动操作
          </p>
        </CardContent>
      </Card>
      <Card class="bg-primary/5 border-primary/20">
        <CardContent class="pt-6">
          <div class="flex items-center gap-2 text-primary font-semibold">
            <CheckCircle2 class="w-5 h-5" />
            表单分组
          </div>
          <p class="text-sm text-muted-foreground mt-2">
            支持折叠分组，更好的表单组织
          </p>
        </CardContent>
      </Card>
      <Card class="bg-primary/5 border-primary/20">
        <CardContent class="pt-6">
          <div class="flex items-center gap-2 text-primary font-semibold">
            <CheckCircle2 class="w-5 h-5" />
            完整验证
          </div>
          <p class="text-sm text-muted-foreground mt-2">
            集成 Zod 验证，支持交叉验证
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- 表单演示 Tabs -->
    <Tabs default-value="login" class="w-full">
      <TabsList class="grid w-full grid-cols-4 lg:w-[500px]">
        <TabsTrigger value="login">登录表单</TabsTrigger>
        <TabsTrigger value="advanced">高级表单</TabsTrigger>
        <TabsTrigger value="conditional">联动表单</TabsTrigger>
        <TabsTrigger value="new-features">
          <Sparkles class="w-3 h-3 mr-1" />
          新功能
        </TabsTrigger>
      </TabsList>

      <!-- 登录表单演示 -->
      <TabsContent value="login">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card class="border-primary/20 shadow-sm">
            <CardHeader class="bg-primary/5 border-b border-primary/10">
              <CardTitle class="flex items-center gap-2">
                <Mail class="w-5 h-5 text-primary" />
                简单登录表单
              </CardTitle>
              <CardDescription>
                基础的邮箱密码登录，包含记住我选项
              </CardDescription>
            </CardHeader>
            <CardContent class="pt-6">
              <SmartForm
                ref="loginFormRef"
                :fields="loginFields"
                :validation-schema="loginSchema"
                :initial-values="{ email: '', password: '', rememberMe: false }"
                submit-text="立即登录"
                :submit-loading="loginLoading"
                show-reset
                reset-text="清空"
                @submit="handleLogin"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>使用说明</CardTitle>
              <CardDescription>
                登录表单代码示例
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre class="text-xs bg-muted p-4 rounded-lg overflow-x-auto"><code>{{ codeExample }}</code></pre>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- 高级表单演示 -->
      <TabsContent value="advanced">
        <Card>
          <CardHeader class="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
            <CardTitle class="flex items-center gap-2">
              <SlidersHorizontal class="w-5 h-5 text-primary" />
              高级表单演示
            </CardTitle>
            <CardDescription>
              展示表单分组、滑块、OTP、标签输入、多选等高级功能
            </CardDescription>
          </CardHeader>
          <CardContent class="pt-6">
            <SmartForm
              ref="advancedFormRef"
              :fields="advancedFields"
              :groups="advancedGroups"
              :validation-schema="advancedSchema"
              layout="grid"
              :grid-cols="2"
              submit-text="提交表单"
              :submit-loading="advancedLoading"
              show-reset
              reset-text="重置"
              @submit="handleAdvancedSubmit"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 联动表单演示 -->
      <TabsContent value="conditional">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader class="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-b">
              <CardTitle class="flex items-center gap-2">
                <ToggleLeft class="w-5 h-5 text-orange-500" />
                字段联动演示
              </CardTitle>
              <CardDescription>
                根据用户类型显示不同的字段，VIP等级控制折扣滑块显示
              </CardDescription>
            </CardHeader>
            <CardContent class="pt-6">
              <SmartForm
                ref="conditionalFormRef"
                :fields="conditionalFields"
                :validation-schema="conditionalSchema"
                :initial-values="{
                  userType: '',
                  companyName: '',
                  jobTitle: '',
                  studentId: '',
                  school: '',
                  vipLevel: 'normal',
                  discount: 0,
                }"
                layout="grid"
                :grid-cols="2"
                submit-text="提交"
                :submit-loading="conditionalLoading"
                show-reset
                @submit="handleConditionalSubmit"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>联动配置说明</CardTitle>
              <CardDescription>
                字段联动通过 conditions 配置实现
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="p-4 bg-muted rounded-lg">
                <h4 class="font-medium mb-2">支持的操作类型：</h4>
                <ul class="space-y-1 text-sm text-muted-foreground">
                  <li><code class="bg-background px-1 rounded">show</code> - 满足条件时显示字段</li>
                  <li><code class="bg-background px-1 rounded">hide</code> - 满足条件时隐藏字段</li>
                  <li><code class="bg-background px-1 rounded">enable</code> - 满足条件时启用字段</li>
                  <li><code class="bg-background px-1 rounded">disable</code> - 满足条件时禁用字段</li>
                  <li><code class="bg-background px-1 rounded">setValue</code> - 满足条件时设置字段值</li>
                </ul>
              </div>
              <div class="p-4 bg-muted rounded-lg">
                <h4 class="font-medium mb-2">条件值类型：</h4>
                <ul class="space-y-1 text-sm text-muted-foreground">
                  <li>• 固定值：直接比较</li>
                  <li>• 函数：自定义判断逻辑</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- 新功能演示 -->
      <TabsContent value="new-features">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 新组件演示 -->
          <Card class="border-primary/20 shadow-sm">
            <CardHeader class="bg-primary/5 border-b border-primary/10">
              <CardTitle class="flex items-center gap-2">
                <Sparkles class="w-5 h-5 text-primary" />
                新组件演示
              </CardTitle>
              <CardDescription>
                颜色选择器、评分、富文本编辑器
              </CardDescription>
            </CardHeader>
            <CardContent class="pt-6">
              <SmartForm
                ref="newFeaturesFormRef"
                :fields="newFeaturesFields"
                :validation-schema="newFeaturesSchema"
                submit-text="提交"
                :submit-loading="newFeaturesLoading"
                show-reset
                @submit="handleNewFeaturesSubmit"
              />
            </CardContent>
          </Card>

          <!-- AutoForm 演示 -->
          <Card class="border-primary/20 shadow-sm">
            <CardHeader class="bg-primary/5 border-b border-primary/10">
              <CardTitle class="flex items-center gap-2">
                <Sparkles class="w-5 h-5 text-primary" />
                AutoForm 自动生成
              </CardTitle>
              <CardDescription>
                基于 Zod Schema 自动生成表单配置
              </CardDescription>
            </CardHeader>
            <CardContent class="pt-6">
              <SmartForm
                ref="autoFormRef"
                :fields="autoFormFields"
                :validation-schema="autoFormSchema"
                submit-text="提交"
                :submit-loading="autoFormLoading"
                show-reset
                @submit="handleAutoFormSubmit"
              />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>

    <!-- 支持的字段类型 -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Tags class="w-5 h-5" />
          支持的字段类型
        </CardTitle>
        <CardDescription>
          SmartForm 内置支持以下 20 种字段类型，全部基于 shadcn-vue 组件
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <div
            v-for="type in fieldTypes"
            :key="type.name"
            class="flex flex-col p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors relative"
          >
            <div class="flex items-center gap-2">
              <code class="text-sm font-semibold text-primary">{{ type.name }}</code>
              <Badge
                v-if="type.isNew"
                variant="default"
                class="text-[10px] px-1 py-0 h-4 bg-primary text-primary-foreground"
              >
                NEW
              </Badge>
            </div>
            <span class="text-xs text-muted-foreground mt-1">{{ type.desc }}</span>
            <span class="text-xs text-muted-foreground/60">{{ type.component }}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
