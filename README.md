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
  <a href="#-预览">预览</a> •
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
| **UI 组件** | [shadcn-vue](https://www.shadcn-vue.com/) · [Reka UI](https://reka-ui.com/) · [antdv-next](https://www.antdv.com/) |
| **状态管理** | [Pinia](https://pinia.vuejs.org/) · pinia-plugin-persistedstate |
| **路由方案** | [Vue Router 4](https://router.vuejs.org/) |
| **国际化** | [Vue I18n](https://vue-i18n.intlify.dev/) |
| **工具库** | [VueUse](https://vueuse.org/) |
| **表单验证** | [VeeValidate](https://vee-validate.logaretm.com/) · [Zod](https://zod.dev/) |
| **数据表格** | [TanStack Table](https://tanstack.com/table) |
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
import