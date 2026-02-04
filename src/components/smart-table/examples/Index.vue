<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  Table2,
  MousePointerClick,
  RefreshCw,
  ArrowRight,
} from 'lucide-vue-next'

const router = useRouter()

/**
 * 示例列表
 */
const examples = [
  {
    key: 'basic',
    title: '基础示例',
    description: '展示 SmartTable 的基础用法，包括分页、排序、选择、行点击等功能',
    icon: Table,
    path: '/examples/smart-table/basic',
  },
  {
    key: 'actions',
    title: '操作菜单示例',
    description: '展示表格的操作列功能，包括查看、编辑、复制、下载、删除等操作',
    icon: MousePointerClick,
    path: '/examples/smart-table/actions',
  },
  {
    key: 'async',
    title: '异步加载示例',
    description: '展示表格的异步数据加载、搜索、分页等功能',
    icon: RefreshCw,
    path: '/examples/smart-table/async',
  },
]

/**
 * 跳转到示例
 */
function goToExample(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="space-y-6 p-6">
    <div>
      <h1 class="text-3xl font-bold">SmartTable 组件示例</h1>
      <p class="text-muted-foreground mt-2">
        基于 shadcn-vue 和 TanStack Table 封装的通用表格组件，支持分页、排序、选择、操作菜单等功能
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card
        v-for="example in examples"
        :key="example.key"
        class="cursor-pointer transition-shadow hover:shadow-lg"
        @click="goToExample(example.path)"
      >
        <CardHeader>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <component :is="example.icon" class="h-6 w-6 text-primary" />
            </div>
            <CardTitle class="text-lg">{{ example.title }}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription class="text-sm leading-relaxed">
            {{ example.description }}
          </CardDescription>
          <div class="mt-4 flex items-center text-primary text-sm font-medium">
            查看示例
            <ArrowRight class="h-4 w-4 ml-1" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 功能特性 -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">功能特性</h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="p-4 bg-muted/50 rounded-lg">
          <h3 class="font-medium mb-2">分页功能</h3>
          <p class="text-sm text-muted-foreground">
            支持页码跳转、每页条数选择、分页信息显示
          </p>
        </div>
        <div class="p-4 bg-muted/50 rounded-lg">
          <h3 class="font-medium mb-2">排序功能</h3>
          <p class="text-sm text-muted-foreground">
            点击表头即可排序，支持多列排序配置
          </p>
        </div>
        <div class="p-4 bg-muted/50 rounded-lg">
          <h3 class="font-medium mb-2">行选择</h3>
          <p class="text-sm text-muted-foreground">
            支持多选/全选，可通过方法获取选中数据
          </p>
        </div>
        <div class="p-4 bg-muted/50 rounded-lg">
          <h3 class="font-medium mb-2">操作菜单</h3>
          <p class="text-sm text-muted-foreground">
            支持配置操作按钮，支持条件显示和禁用
          </p>
        </div>
        <div class="p-4 bg-muted/50 rounded-lg">
          <h3 class="font-medium mb-2">自定义渲染</h3>
          <p class="text-sm text-muted-foreground">
            支持自定义单元格和表头渲染
          </p>
        </div>
        <div class="p-4 bg-muted/50 rounded-lg">
          <h3 class="font-medium mb-2">加载状态</h3>
          <p class="text-sm text-muted-foreground">
            内置加载动画和刷新按钮
          </p>
        </div>
        <div class="p-4 bg-muted/50 rounded-lg">
          <h3 class="font-medium mb-2">斑马纹</h3>
          <p class="text-sm text-muted-foreground">
            可选的斑马纹样式，提升可读性
          </p>
        </div>
        <div class="p-4 bg-muted/50 rounded-lg">
          <h3 class="font-medium mb-2">TypeScript</h3>
          <p class="text-sm text-muted-foreground">
            完整的 TypeScript 类型支持
          </p>
        </div>
      </div>
    </div>

    <!-- 使用说明 -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">快速开始</h2>
      <div class="bg-muted/50 rounded-lg p-4">
        <pre class="text-sm overflow-x-auto"><code>&lt;script setup lang="ts"&gt;
import { SmartTable } from '@/components/smart-table'
import type { SmartTableColumn } from '@/components/smart-table'

const columns: SmartTableColumn[] = [
  { key: 'name', title: '姓名', accessorKey: 'name', sortable: true },
  { key: 'email', title: '邮箱', accessorKey: 'email' },
]

const data = ref([...])
const pagination = ref({ pageIndex: 1, pageSize: 10, total: 100 })
&lt;/script&gt;

&lt;template&gt;
  &lt;SmartTable
    :data="data"
    :columns="columns"
    :pagination="pagination"
  /&gt;
&lt;/template&gt;</code></pre>
      </div>
    </div>
  </div>
</template>
