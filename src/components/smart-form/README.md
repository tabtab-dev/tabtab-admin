# SmartForm 通用表单组件

基于 `shadcn-vue` + `VeeValidate` + `Zod` 封装的通用表单组件，简化表单开发流程。

## 特性

- 🎯 **声明式配置** - 通过配置对象定义表单，无需编写大量模板代码
- 🔒 **内置验证** - 集成 Zod 验证，支持字段级和表单级验证
- 🎨 **丰富字段类型** - 支持 text、email、password、number、textarea、select、checkbox、switch、radio、date 等
- 📐 **灵活布局** - 支持垂直、水平、网格布局
- 🔧 **高度可扩展** - 支持自定义组件和渲染函数
- ♿ **无障碍支持** - 完整的 ARIA 属性和键盘导航

## 安装

组件已内置在项目中，直接从 `@/components/smart-form` 导入即可。

```ts
import { SmartForm } from '@/components/smart-form'
import type { FormFieldConfig } from '@/components/smart-form'
```

## 基础用法

### 1. 简单登录表单

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { SmartForm } from '@/components/smart-form'
import type { FormFieldConfig } from '@/components/smart-form'
import { Mail, Lock } from 'lucide-vue-next'

interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

// 定义验证规则
const loginSchema = z.object({
  email: z.string().min(1, '请输入邮箱').email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少6位'),
  rememberMe: z.boolean().default(false),
})

// 定义字段配置
const fields: FormFieldConfig<LoginForm>[] = [
  {
    name: 'email',
    type: 'email',
    label: '邮箱',
    placeholder: '请输入邮箱',
    required: true,
    prefixIcon: Mail,
  },
  {
    name: 'password',
    type: 'password',
    label: '密码',
    placeholder: '请输入密码',
    required: true,
    prefixIcon: Lock,
  },
  {
    name: 'rememberMe',
    type: 'checkbox',
    label: '记住我',
  },
]

const handleSubmit = (values: LoginForm) => {
  console.log('登录信息:', values)
}
</script>

<template>
  <SmartForm
    :fields="fields"
    :validation-schema="loginSchema"
    submit-text="登录"
    @submit="handleSubmit"
  />
</template>
```

### 2. 网格布局表单

```vue
<script setup lang="ts">
const userFields: FormFieldConfig<UserForm>[] = [
  { name: 'username', type: 'text', label: '用户名', colSpan: 1 },
  { name: 'email', type: 'email', label: '邮箱', colSpan: 1 },
  { name: 'bio', type: 'textarea', label: '简介', colSpan: 2 },
]
</script>

<template>
  <SmartForm
    :fields="userFields"
    layout="grid"
    :grid-cols="2"
    submit-text="保存"
  />
</template>
```

## 字段类型

| 类型 | 说明 | 使用的 shadcn-vue 组件 | 额外配置 |
|------|------|------------------------|----------|
| `text` | 文本输入 | Input | - |
| `email` | 邮箱输入 | Input | - |
| `password` | 密码输入（带显示切换） | Input + Button | - |
| `number` | 数字输入 | Input | - |
| `textarea` | 多行文本 | Textarea | - |
| `select` | 下拉选择 | Select | `options` |
| `checkbox` | 复选框 | Checkbox | - |
| `switch` | 开关 | Switch | - |
| `radio` | 单选框 | RadioGroup | `options` |
| `date` | 日期选择 | Popover + Calendar | - |
| `datetime` | 日期时间选择 | Input(type="datetime-local") | - |
| `time` | 时间选择 | Input(type="time") | - |
| `file` | 文件上传 | Input(type="file") | - |
| `custom` | 自定义组件 | - | `component` |

### 日期选择器

`date` 类型使用 shadcn-vue 的 **Popover + Calendar** 组件组合，提供优雅的日期选择体验：

- 点击按钮弹出日历选择器
- 支持中文本地化显示
- 选择后自动关闭弹窗
- 日期格式化为 `yyyy-MM-dd`

## 字段配置 (FormFieldConfig)

```ts
interface FormFieldConfig<T> {
  name: string           // 字段名（对应数据对象的 key）
  type: FieldType        // 字段类型
  label?: string         // 标签文本
  placeholder?: string   // 占位符
  description?: string   // 描述文字
  required?: boolean     // 是否必填（显示红色星号）
  disabled?: boolean     // 是否禁用
  readonly?: boolean     // 是否只读
  options?: SelectOption[] // 选择器选项（select/radio）
  component?: Component  // 自定义组件（type='custom' 时使用）
  componentProps?: object // 传递给自定义组件的属性
  prefixIcon?: Component // 输入框前置图标
  suffixIcon?: Component // 输入框后置图标
  colSpan?: number       // 网格布局中的列数
  defaultValue?: any     // 默认值
  render?: Function      // 自定义渲染函数
}
```

## 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `fields` | `FormFieldConfig[]` | 必填 | 字段配置数组 |
| `validationSchema` | `ZodSchema` | - | Zod 验证模式 |
| `initialValues` | `object` | - | 表单初始值 |
| `validateOnBlur` | `boolean` | `true` | 失去焦点时验证 |
| `validateOnChange` | `boolean` | `false` | 值改变时验证 |
| `layout` | `'vertical' \| 'horizontal' \| 'grid'` | `'vertical'` | 表单布局 |
| `gridCols` | `number` | `2` | 网格列数 |
| `showLabels` | `boolean` | `true` | 是否显示标签 |
| `showDescriptions` | `boolean` | `true` | 是否显示描述 |
| `submitText` | `string` | `'提交'` | 提交按钮文本 |
| `resetText` | `string` | `'重置'` | 重置按钮文本 |
| `showReset` | `boolean` | `false` | 是否显示重置按钮 |
| `submitLoading` | `boolean` | `false` | 提交按钮加载状态 |
| `submitDisabled` | `boolean` | `false` | 是否禁用提交按钮 |
| `renderActions` | `Function` | - | 自定义操作按钮渲染 |

## 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `@submit` | `(values: T)` | 表单验证通过后提交 |
| `@change` | `(values: Partial<T>)` | 表单值变化 |
| `@error` | `(errors: Record<string, string>)` | 表单验证失败 |

## 方法 (通过 ref 调用)

```vue
<script setup>
const formRef = ref(null)

// 提交表单
formRef.value?.submit()

// 重置表单
formRef.value?.reset()

// 验证表单
const isValid = await formRef.value?.validate()

// 设置字段值
formRef.value?.setFieldValue('email', 'test@example.com')

// 获取字段值
const email = formRef.value?.getFieldValue('email')

// 设置多个字段值
formRef.value?.setValues({ email: 'test@example.com', name: '张三' })
</script>

<template>
  <SmartForm ref="formRef" :fields="fields" />
</template>
```

## 高级用法

### 自定义渲染

```ts
const fields: FormFieldConfig<FormType>[] = [
  {
    name: 'customField',
    type: 'custom',
    label: '自定义字段',
    render: ({ field, form }) => {
      return h(MyCustomComponent, {
        modelValue: field.value,
        'onUpdate:modelValue': field.onChange,
      })
    },
  },
]
```

### 自定义操作按钮

```vue
<template>
  <SmartForm
    :fields="fields"
    :render-actions="({ isSubmitting, isValid, handleSubmit, handleReset }) => {
      return h('div', { class: 'flex gap-2' }, [
        h(Button, { type: 'submit', loading: isSubmitting }, () => '保存'),
        h(Button, { variant: 'outline', onClick: handleReset }, () => '取消'),
      ])
    }"
  />
</template>
```

## 完整示例

查看 `examples` 目录下的示例文件：

- `LoginExample.vue` - 登录表单示例
- `UserFormExample.vue` - 用户创建表单示例（网格布局）

## 与原始方式对比

### 原始方式（繁琐）

```vue
<template>
  <Form :validation-schema="schema" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>邮箱</FormLabel>
        <FormControl>
          <Input type="email" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <!-- 重复 N 次... -->
  </Form>
</template>
```

### SmartForm 方式（简洁）

```vue
<template>
  <SmartForm
    :fields="[
      { name: 'email', type: 'email', label: '邮箱' },
      // 更多字段...
    ]"
    :validation-schema="schema"
    @submit="onSubmit"
  />
</template>
```
