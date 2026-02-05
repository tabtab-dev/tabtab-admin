# TabTab Admin

🎨 一个简洁现代的后台管理系统模板，基于 Vue 3 生态构建

## 技术栈

- **框架**: [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **样式**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI 组件**: [shadcn-vue](https://www.shadcn-vue.com/) + [Reka UI](https://reka-ui.com/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **路由**: [Vue Router 4](https://router.vuejs.org/)
- **工具库**: [VueUse](https://vueuse.org/)
- **表单验证**: [VeeValidate](https://vee-validate.logaretm.com/) + [Zod](https://zod.dev/)
- **数据表格**: [TanStack Table](https://tanstack.com/table)

## 预览

| 仪表板 | 用户管理 |
|--------|----------|
| ![预览图1](./public/1.png) | ![预览图2](./public/2.png) |

| 订单管理 | 数据分析 |
|----------|----------|
| ![预览图3](./public/3.png) | ![预览图4](./public/4.png) |

| 系统设置 |
|----------|
| ![预览图5](./public/5.png) |

## 功能特性

- ✨ **Bento 风格仪表板** - 现代化的网格布局设计
- 🌓 **主题切换** - 支持暗黑/明亮模式
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🧭 **侧边栏导航** - 可折叠的响应式侧边栏菜单
- ✅ **表单验证** - 强大的表单验证和类型安全
- 📊 **数据表格** - 功能丰富的数据展示和排序
- 🎯 **TypeScript** - 完整的类型支持
- 🎨 **主题定制** - 灵活的主题配置系统

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 组件
│   ├── bento/      # Bento 风格布局组件
│   └── ui/         # UI 组件库
├── layouts/         # 布局组件
├── lib/            # 工具函数
├── router/         # 路由配置
├── stores/         # Pinia 状态管理
├── types/          # TypeScript 类型定义
└── views/          # 页面视图
```

## 组件库

### TTable - JSON 配置化表格

基于 antdv-next 的 JSON Schema 配置化表格组件，样式与 shadcn-vue 主题对齐。

**特性：**
- JSON Schema 配置生成表格
- 支持行选择、分页、排序、筛选
- 展开行、操作列、固定列
- 虚拟列表、粘性表头

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| schema | `TableSchema` | - | 表格配置 |
| data | `any[]` | `[]` | 表格数据 |
| loading | `boolean` | `false` | 加载状态 |

**Events：**

| 事件名 | 说明 | 参数 |
|--------|------|------|
| change | 分页/排序/筛选变化 | `(pagination, filters, sorter)` |
| selectChange | 行选择变化 | `(selectedRowKeys, selectedRows)` |
| expand | 展开行变化 | `(expanded, record)` |

**Methods：**

```typescript
// 获取选中行
getSelectedRows(): any[]
// 设置选中行
setSelectedRows(keys: (string | number)[]): void
// 清空选中
clearSelection(): void
// 刷新表格
refresh(): void
// 展开/收起行
expandRow(record: any, expanded?: boolean): void
expandAllRows(): void
collapseAllRows(): void
```

**使用示例：**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TTable } from '@/components/data/TTable'
import type { TableSchema } from '@/components/data/TTable'

const schema: TableSchema = {
  columns: [
    { title: '姓名', dataIndex: 'name', width: 120 },
    { title: '邮箱', dataIndex: 'email', ellipsis: true },
    { title: '状态', dataIndex: 'status', slot: 'status' }
  ],
  actions: [
    { text: '编辑', type: 'primary', onClick: (row) => edit(row) },
    { text: '删除', type: 'danger', confirm: true, onClick: (row) => del(row) }
  ],
  rowSelection: { type: 'checkbox' },
  pagination: { pageSize: 10 }
}

const data = ref([])
</script>

<template>
  <TTable :schema="schema" :data="data">
    <template #status="{ text }">
      <span :class="text === 'active' ? 'text-green-500' : 'text-red-500'">
        {{ text }}
      </span>
    </template>
  </TTable>
</template>
```

### TForm - JSON 配置化表单

基于 antdv-next 的 JSON Schema 配置化表单组件，支持 36+ 种字段类型。

**特性：**
- JSON Schema 配置生成表单
- 36+ 种字段类型（input、select、date、upload 等）
- 表单验证、字段联动
- 搜索表单模式（支持折叠展开）

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| schema | `FormSchema` | - | 表单配置 |
| modelValue | `object` | `{}` | 表单数据 |
| loading | `boolean` | `false` | 加载状态 |

**Events：**

| 事件名 | 说明 | 参数 |
|--------|------|------|
| submit | 表单提交成功 | `(values)` |
| reset | 表单重置 | - |
| change | 字段值变化 | `(changedValues, allValues)` |

**Methods：**

```typescript
// 验证表单
validate(): Promise<Record<string, any>>
// 重置表单
resetFields(): void
// 清除验证
clearValidate(): void
// 获取/设置字段值
getFieldValue(name: NamePath): any
setFieldValue(name: NamePath, value: any): void
setFieldsValue(values: Record<string, any>): void
// 设置字段禁用/隐藏
setFieldDisabled(name: NamePath, disabled: boolean): void
setFieldHidden(name: NamePath, hidden: boolean): void
// 获取表单状态
getMeta(): FormMeta
isDirty(): boolean
isTouched(): boolean
isValid(): boolean
```

**使用示例：**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TForm } from '@/components/data/TForm'
import type { FormSchema, TFormExpose } from '@/components/data/TForm'

const formRef = ref<TFormExpose>()
const formData = ref({ name: '', status: 'active' })

const schema: FormSchema = {
  layout: 'horizontal',
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
  fields: [
    { name: 'name', type: 'input', label: '姓名', rules: [{ required: true }] },
    { 
      name: 'status', 
      type: 'select', 
      label: '状态',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    }
  ]
}

const onSubmit = (values: any) => {
  console.log('提交:', values)
}
</script>

<template>
  <TForm 
    ref="formRef" 
    v-model="formData" 
    :schema="schema" 
    @submit="onSubmit" 
  />
</template>
```

**搜索表单模式：**

```typescript
const schema: FormSchema = {
  fields: [
    { name: 'keyword', type: 'input', label: '关键词' },
    { name: 'status', type: 'select', label: '状态', options: [...] }
  ],
  searchConfig: {
    enabled: true,
    columns: 3,
    collapseThreshold: 2,
    onSearch: (values) => loadData(values),
    onReset: () => loadData({})
  }
}
```

## 开发计划

- [x] 基础布局和导航
- [x] 主题系统
- [x] 仪表板页面
- [x] 用户管理
- [x] TTable 组件
- [x] TForm 组件
- [ ] 权限控制
- [ ] 更多数据可视化组件

## 许可证

[MIT](LICENSE)
