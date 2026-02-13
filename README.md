<div align="center">

# TabTab Admin

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5+-4FC08D?style=flat-square&logo=vue.js&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-5.7+-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-Rolldown-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/pnpm-10.29+-F69220?style=flat-square&logo=pnpm&logoColor=white" alt="pnpm" />
</p>

<p align="center">
  一款基于 Vue 3 生态构建的现代化后台管理系统模板
</p>

<p align="center">
  <a href="https://demo.tabtab.dev" target="_blank">在线演示</a> •
  <a href="#-功能特性">功能</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-项目结构">结构</a> •
  <a href="#-组件库">组件</a>
</p>

</div>

---

## ✨ 预览

<table>
  <tr>
    <td width="50%">
      <img src="./public/1.png" alt="仪表板" />
      <p align="center">仪表板</p>
    </td>
    <td width="50%">
      <img src="./public/2.png" alt="用户管理" />
      <p align="center">用户管理</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="./public/3.png" alt="订单管理" />
      <p align="center">订单管理</p>
    </td>
    <td width="50%">
      <img src="./public/4.png" alt="数据分析" />
      <p align="center">数据分析</p>
    </td>
  </tr>
</table>

## 🚀 技术栈

| 类别 | 技术 |
|------|------|
| **核心框架** | [Vue 3](https://vuejs.org/) · [TypeScript](https://www.typescriptlang.org/) |
| **构建工具** | [Vite](https://vitejs.dev/) (Rolldown) |
| **样式方案** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **UI 组件** | [shadcn-vue](https://www.shadcn-vue.com/) · [Reka UI](https://reka-ui.com/) · [antdv-next](https://antdv-next.com/) |
| **状态管理** | [Pinia](https://pinia.vuejs.org/) · pinia-plugin-persistedstate |
| **路由方案** | [Vue Router 4](https://router.vuejs.org/) |
| **国际化** | [Vue I18n](https://vue-i18n.intlify.dev/) |
| **工具库** | [VueUse](https://vueuse.org/) |
| **表单验证** | [Antdv-next Form](https://antdv-next.com/)|
| **数据表格** | [Antdv-next Table](https://antdv-next.com/)|
| **HTTP 请求** | [Alova](https://alova.js.org/) · Axios |
| **通知组件** | [vue-sonner](https://vue-sonner.vercel.app/) |
| **测试框架** | [Vitest](https://vitest.dev/) |

## 🎯 功能特性

- **🎨 Bento 风格仪表板** — 现代化的网格布局设计
- **🌓 主题系统** — 支持暗黑/明亮模式切换，支持自定义配色
- **🌍 国际化支持** — 完整的中英文双语切换 (Vue I18n)
- **🎨 主题定制** — 外观模式、配色、布局、字体等详细设置
- **🔔 通知中心** — 基于 vue-sonner 的消息通知系统
- **📱 响应式设计** — 完美适配桌面和移动设备
- **🧭 智能导航** — 可折叠的响应式侧边栏菜单
- **🏷️ 标签栏管理** — 多标签页管理，支持页面缓存和快捷操作
- **✅ 表单验证** — 强大的表单验证和类型安全
- **📊 数据表格** — 功能丰富的数据展示、排序和筛选
- **📦 JSON 配置化组件** — TTable/TForm/TModal/TDrawer 低代码组件
- **🔐 RBAC 权限控制** — 基于角色的权限管理系统
- **🛡️ 错误边界** — 组件级错误捕获和处理
- **🔧 Mock 服务** — 内置 Mock 数据服务，支持独立开发和测试

## 📋 环境要求

- **Node.js**: `>= 18.0.0`
- **pnpm**: `>= 10.29.1`

## 🚦 快速开始

### 1. 安装 pnpm（如尚未安装）

```bash
npm install -g pnpm
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发服务器

```bash
pnpm dev
```

### 4. 构建生产版本

```bash
pnpm build
```

### 5. 预览生产构建

```bash
pnpm preview
```

### 6. 类型检查

```bash
pnpm typecheck
```

### 7. 运行测试

```bash
# 交互式测试模式
pnpm test

# 单次运行测试
pnpm test:run

# 生成测试覆盖率报告
pnpm test:coverage

# 启动 Vitest UI
pnpm test:ui
```

## 📁 项目结构

```
src/
├── api/                    # API 接口模块
│   ├── client/            # HTTP 客户端配置
│   ├── modules/           # 业务 API 模块
│   ├── index.ts           # API 导出
│   └── types.ts           # API 类型定义
├── assets/                # 静态资源
│   └── css/              # 全局样式
├── components/            # 组件
│   ├── bento/            # Bento 风格布局组件
│   ├── business/         # 业务组件 (TTable/TForm/TModal/TDrawer)
│   ├── Icon/             # 图标组件
│   ├── layout/           # 布局组件
│   └── ui/               # UI 组件库 (shadcn-vue)
├── composables/           # 可复用组合式函数
├── config/               # 配置文件
├── constants/            # 常量定义
├── i18n/                 # 国际化配置
├── layouts/              # 布局组件
├── lib/                  # 工具函数
├── router/               # 路由配置
├── stores/               # Pinia 状态管理
├── views/                # 页面视图
├── test/                 # 测试配置
├── types/                # TypeScript 类型定义
├── App.vue               # 根组件
└── main.ts               # 入口文件

mock/                     # Mock 服务
public/                   # 公共资源
```

## 🧩 组件库

### TTable — JSON 配置化表格

基于 antdv-next 的 JSON Schema 配置化表格组件，支持行选择、分页、排序、筛选、展开行、操作列等功能。

```vue
<script setup lang="ts">
import { TTable } from '@/components/business/TTable'
import type { TableSchema } from '@/components/business/TTable'

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

### TForm — JSON 配置化表单

基于 antdv-next 的 JSON Schema 配置化表单组件，支持 36+ 种字段类型、表单验证、字段联动、搜索表单模式。

```vue
<script setup lang="ts">
import { TForm } from '@/components/business/TForm'
import type { FormSchema } from '@/components/business/TForm'

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

### TModal — JSON 配置化对话框

基于 antdv-next 的对话框组件，支持表单、表格等内容嵌入，可通过 ref 方法控制。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TModal } from '@/components/business/TModal'

const open = ref(false)
const onSubmit = () => open.value = false
</script>

<template>
  <TModal v-model:open="open" title="编辑" @ok="onSubmit">
    <p>内容</p>
  </TModal>
</template>
```

### TDrawer — JSON 配置化抽屉

基于 antdv-next 的抽屉组件，支持四个方向弹出，可与表单、表格结合使用。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TDrawer } from '@/components/business/TDrawer'

const open = ref(false)
</script>

<template>
  <TDrawer v-model:open="open" title="详情" placement="right">
    <p>内容</p>
  </TDrawer>
</template>
```

> 📖 完整 API 文档请查看组件源码：`src/components/business/`

## 🔧 Composables

项目提供了一系列可复用的组合式函数：

```typescript
// 权限检查
import { usePermission } from '@/composables/usePermission'
const { hasPermission, hasRole } = usePermission()

// 表格数据管理
import { useTableData } from '@/composables/useTableData'
const { data, loading, pagination, fetchData } = useTableData(apiFn)

// 表单数据处理
import { useFormData } from '@/composables/useFormData'
const { formData, resetForm, submitForm } = useFormData(schema)

// 加载状态
import { useLoading } from '@/composables/useLoading'
const { loading, withLoading } = useLoading()

// 请求封装
import { useRequest } from '@/composables/useRequest'
const { data, loading, error, run } = useRequest(apiFn)
```

## 🛣️ 路由架构

项目采用动态路由架构，支持从后端获取菜单并动态生成路由：

- **静态路由**: 登录页、404 页面等固定路由
- **动态路由**: 从后端菜单数据动态生成的业务路由
- **路由守卫**: 认证检查、权限验证、菜单加载
- **懒加载**: 所有页面组件使用动态导入，优化首屏性能

```typescript
// 路由配置示例
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false, titleKey: 'pages.login.title' }
  },
  {
    path: '/',
    name: 'Root',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { requiresAuth: true, titleKey: 'menu.dashboard' }
      }
    ]
  }
]
```

## 🔐 权限系统

基于 RBAC（基于角色的访问控制）的权限管理系统：

- **角色管理**: 定义角色及其权限集合
- **权限指令**: `v-permission` 指令控制按钮级权限
- **路由权限**: 页面访问权限控制
- **菜单权限**: 动态菜单根据权限过滤

```vue
<!-- 权限指令示例 -->
<template>
  <button v-permission="'user:create'">创建用户</button>
  <button v-permission="['user:edit', 'user:admin']">编辑</button>
</template>
```

## 🔌 Mock 服务

项目内置了完整的 Mock 服务，基于自定义 Mock 服务器实现，支持在开发环境中模拟后端 API 响应。

### 支持的 Mock 功能

- 用户认证（登录、登出、获取用户信息）
- 用户管理（CRUD 操作）
- 角色管理
- 组织管理
- 菜单管理
- 订单管理
- 商品管理
- 分类管理
- 库存管理

### Mock 文件结构

```
mock/
├── data/              # Mock 数据定义
├── routes/            # Mock 路由配置
└── server.ts          # Mock 服务器入口
```

## 📡 API 架构

项目采用模块化的 API 架构，使用 Alova 作为请求库，配合 Axios 适配器。

### 特性

- **模块化设计**: 按业务模块组织 API
- **请求拦截器**: 统一的请求/响应处理
- **Mock 支持**: 开发环境自动启用 Mock
- **类型安全**: 完整的 TypeScript 类型支持
- **请求管理**: 支持请求取消和重复请求处理

### 使用示例

```typescript
import { authApi } from '@/api'

// 登录
const { data } = await authApi.login({
  username: 'admin',
  password: '123456'
})

// 获取用户信息
const userInfo = await authApi.getUserInfo()
```

## 📌 开发计划

- [x] 基础布局和导航
- [x] 主题系统
- [x] 仪表板页面
- [x] 用户管理
- [x] TTable 组件 — JSON 配置化表格
- [x] TForm 组件 — JSON 配置化表单
- [x] TModal 组件 — JSON 配置化对话框
- [x] TDrawer 组件 — JSON 配置化抽屉
- [x] TIcon 组件 — 图标组件与选择器
- [x] TPageHeader 组件 — 页面头部
- [x] TDataCard 组件 — 数据卡片
- [x] TStatusBadge 组件 — 状态徽章
- [x] TEmptyState 组件 — 空状态展示
- [x] TBatchActions 组件 — 批量操作栏
- [x] 国际化 (i18n) 支持
- [x] 通知系统
- [x] Mock 服务
- [x] 测试框架 (Vitest)
- [x] RBAC 权限控制
- [x] 标签栏 (TabBar)
- [x] 错误边界处理
- [ ] 更多数据可视化组件
- [ ] 工作流设计器
- [ ] 代码生成器

## 📄 许可证

[MIT](LICENSE) © TabTab Admin
