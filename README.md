# TabTab Admin

🎨 一个简洁现代的后台管理系统模板，基于 Vue 3 生态构建

## 技术栈

- **框架**: [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**: [Vite](https://vitejs.dev/) (Rolldown 版本)
- **样式**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI 组件**: [shadcn-vue](https://www.shadcn-vue.com/) + [Reka UI](https://reka-ui.com/) + [antdv-next](https://www.antdv.com/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/) + pinia-plugin-persistedstate
- **路由**: [Vue Router 4](https://router.vuejs.org/)
- **国际化**: [Vue I18n](https://vue-i18n.intlify.dev/)
- **工具库**: [VueUse](https://vueuse.org/)
- **表单验证**: [VeeValidate](https://vee-validate.logaretm.com/) + [Zod](https://zod.dev/)
- **数据表格**: [TanStack Table](https://tanstack.com/table)
- **HTTP 请求**: [Alova](https://alova.js.org/) + Axios
- **测试**: [Vitest](https://vitest.dev/)

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
- 🔧 **Mock 服务** - 内置 Mock 数据服务，支持独立开发和测试

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

### 类型检查

```bash
pnpm typecheck
```

### 运行测试

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

## 项目结构

```
src/
├── api/                 # API 接口模块
│   ├── client/         # HTTP 客户端配置
│   │   ├── index.ts    # Alova 实例配置
│   │   ├── interceptors.ts  # 请求/响应拦截器
│   │   ├── mock.ts     # Mock 适配器
│   │   └── requestManager.ts  # 请求管理
│   ├── modules/        # 业务 API 模块
│   │   ├── auth.ts     # 认证相关
│   │   ├── users.ts    # 用户管理
│   │   ├── orders.ts   # 订单管理
│   │   ├── products.ts # 商品管理
│   │   ├── categories.ts  # 分类管理
│   │   ├── inventory.ts   # 库存管理
│   │   └── menu.ts     # 菜单管理
│   ├── index.ts        # API 导出
│   └── types.ts        # API 类型定义
├── assets/             # 静态资源
│   └── css/           # 全局样式
│       ├── app.css    # 应用样式
│       └── theme.css  # 主题变量
├── components/         # 组件
│   ├── bento/         # Bento 风格布局组件
│   ├── business/      # 业务组件
│   │   ├── TDrawer/   # JSON 配置化抽屉
│   │   ├── TForm/     # JSON 配置化表单
│   │   ├── TModal/    # JSON 配置化对话框
│   │   └── TTable/    # JSON 配置化表格
│   ├── Icon/          # 图标组件
│   ├── layout/        # 布局组件
│   │   ├── sidebar/   # 侧边栏
│   │   ├── Header.vue # 顶部导航
│   │   ├── ThemeSettings.vue  # 主题设置
│   │   └── ...
│   └── ui/            # UI 组件库 (shadcn-vue)
├── composables/        # 可复用组合式函数
│   ├── useAuthFlow.ts  # 认证流程
│   ├── useFormData.ts  # 表单数据处理
│   ├── useLoading.ts   # 加载状态
│   ├── useRequest.ts   # 请求封装
│   ├── useTableData.ts # 表格数据
│   └── ...
├── config/            # 配置文件
│   ├── formConfig.ts  # 表单配置
│   └── tableConfig.ts # 表格配置
├── constants/         # 常量定义
│   ├── api.ts         # API 常量
│   └── common.ts      # 通用常量
├── i18n/              # 国际化配置
│   ├── locales/       # 语言包
│   │   ├── zh-CN/     # 中文语言包
│   │   └── en-US/     # 英文语言包
│   └── index.ts       # i18n 配置
├── layouts/           # 布局组件
│   ├── AdminLayout.vue    # 后台布局
│   ├── TabBar.vue         # 标签栏
│   └── composables/       # 布局相关组合式函数
├── lib/               # 工具函数
│   └── utils.ts       # 通用工具
├── router/            # 路由配置
│   ├── guards/        # 路由守卫
│   │   └── permissionGuard.ts  # 权限守卫
│   ├── index.ts       # 路由配置
│   └── routeMapping.ts    # 路由映射
├── stores/            # Pinia 状态管理
│   └── global/        # 全局状态
│       ├── app.ts     # 应用状态
│       ├── auth.ts    # 认证状态
│       ├── locale.ts  # 语言状态
│       ├── menu.ts    # 菜单状态
│       ├── tabbar.ts  # 标签栏状态
│       └── theme.ts   # 主题状态
├── test/              # 测试配置
│   └── setup.ts       # 测试环境配置
├── types/             # TypeScript 类型定义
│   ├── domain/        # 领域类型
│   ├── base.ts        # 基础类型
│   ├── bento.ts       # Bento 组件类型
│   └── common.ts      # 通用类型
├── App.vue            # 根组件
└── main.ts            # 入口文件

mock/                  # Mock 服务
├── data/              # Mock 数据
├── routes/            # Mock 路由
├── utils/             # Mock 工具
└── server.ts          # Mock 服务器

public/                # 公共资源
```

## 组件库

### TTable - JSON 配置化表格

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

### TForm - JSON 配置化表单

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

### TModal - JSON 配置化对话框

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

### TDrawer - JSON 配置化抽屉

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

> 完整 API 文档请查看组件源码：`src/components/business/`

## Mock 服务

项目内置了完整的 Mock 服务，基于自定义 Mock 服务器实现，支持在开发环境中模拟后端 API 响应。

### Mock 功能

- 用户认证（登录、登出、获取用户信息）
- 用户管理（CRUD 操作）
- 订单管理
- 商品管理
- 分类管理
- 菜单管理

### Mock 数据位置

```
mock/
├── data/              # Mock 数据定义
├── routes/            # Mock 路由配置
└── server.ts          # Mock 服务器入口
```

## API 架构

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
- [x] Mock 服务
- [x] 测试框架 (Vitest)
- [ ] 权限控制 (RBAC)
- [ ] 更多数据可视化组件

## 许可证

[MIT](LICENSE)
