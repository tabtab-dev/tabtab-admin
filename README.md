# TabTab Admin

🎨 一个简洁现代的后台管理系统模板，基于 Vue 3 生态构建

## 技术栈

- **框架**: [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **样式**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI 组件**: [shadcn-vue](https://www.shadcn-vue.com/) + [Reka UI](https://reka-ui.com/) + [antdv-next](https://www.antdv.com/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **路由**: [Vue Router 4](https://router.vuejs.org/)
- **国际化**: [Vue I18n](https://vue-i18n.intlify.dev/)
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
- 🌍 **国际化支持** - 完整的中英文双语切换 (Vue I18n)
- 🎨 **主题定制** - 外观模式、配色、布局、字体等详细设置
- 🔔 **通知系统** - 消息通知中心
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🧭 **侧边栏导航** - 可折叠的响应式侧边栏菜单
- ✅ **表单验证** - 强大的表单验证和类型安全
- 📊 **数据表格** - 功能丰富的数据展示和排序
- 🎯 **TypeScript** - 完整的类型支持
- 📦 **JSON 配置化组件** - TTable/TForm/TModal/TDrawer 低代码组件

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
│   ├── data/       # JSON 配置化组件 (TTable/TForm/TModal/TDrawer)
│   └── ui/         # UI 组件库
├── i18n/           # 国际化配置
│   ├── locales/    # 语言包
│   │   ├── zh-CN/  # 中文语言包
│   │   └── en-US/  # 英文语言包
│   └── index.ts    # i18n 配置
├── layouts/         # 布局组件
├── lib/            # 工具函数
├── router/         # 路由配置
├── stores/         # Pinia 状态管理
├── types/          # TypeScript 类型定义
└── views/          # 页面视图
```

## 组件库

### TTable - JSON 配置化表格

基于 antdv-next 的 JSON Schema 配置化表格组件，支持行选择、分页、排序、筛选、展开行、操作列等功能。

```vue
<script setup lang="ts">
import { TTable } from '@/components/data/TTable'
import type { TableSchema } from '@/components/data/TTable'

const schema: TableSchema = {
  columns: [
    { title: '姓名', dataIndex: 'name' },
    { title: '状态', dataIndex: 'status', slot: 'status' }
  ],
  actions: [
    { text: '编辑', type: 'primary', onClick: (row) => edit(row) },
    { text: '删除', type: 'danger', confirm: true, onClick: (row) => del(row) }
  ],
  rowSelection: { type: 'checkbox' }
}
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

基于 antdv-next 的 JSON Schema 配置化表单组件，支持 36+ 种字段类型、表单验证、字段联动、搜索表单模式。

```vue
<script setup lang="ts">
import { TForm } from '@/components/data/TForm'
import type { FormSchema } from '@/components/data/TForm'

const schema: FormSchema = {
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

const onSubmit = (values: any) => console.log(values)
</script>

<template>
  <TForm :schema="schema" @submit="onSubmit" />
</template>
```

### TModal - JSON 配置化对话框

基于 antdv-next 的对话框组件，支持表单、表格等内容嵌入，可通过 ref 方法控制。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TModal } from '@/components/data/TModal'

const open = ref(false)
const onSubmit = () => open.value = false
</script>

<template>
  <TModal v-model:open="open" title="编辑" @ok="onSubmit">
    <p>内容</p>
  </TModal>
</template>
```

### TDrawer - JSON 配置化抽屉

基于 antdv-next 的抽屉组件，支持四个方向弹出，可与表单、表格结合使用。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TDrawer } from '@/components/data/TDrawer'

const open = ref(false)
</script>

<template>
  <TDrawer v-model:open="open" title="详情" placement="right">
    <p>内容</p>
  </TDrawer>
</template>
```

> 完整 API 文档请查看组件源码：`src/components/data/`

## 开发计划

- [x] 基础布局和导航
- [x] 主题系统
- [x] 仪表板页面
- [x] 用户管理
- [x] TTable 组件
- [x] TForm 组件
- [x] TModal 组件
- [x] TDrawer 组件
- [x] 国际化 (i18n) 支持
- [x] 通知系统
- [ ] 权限控制 (RBAC)
- [ ] 更多数据可视化组件

## 许可证

[MIT](LICENSE)
