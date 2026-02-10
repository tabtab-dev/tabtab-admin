<script setup lang="ts">
/**
 * TEmptyStateDemo - TEmptyState 组件演示页面
 *
 * @description 展示 TEmptyState 空状态组件的各种使用场景和配置方式
 */
import { TEmptyState } from '@/components/business/TEmptyState'
import type { TEmptyStateExpose, EmptyType, EmptySize } from '@/components/business/TEmptyState'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Inbox, Plus, Search, Database, AlertCircle, WifiOff, Lock } from 'lucide-vue-next'

/**
 * 组件引用
 */
const emptyRef = ref<TEmptyStateExpose>()

/**
 * 预设类型
 */
const presetTypes: { type: EmptyType; label: string; description: string }[] = [
  { type: 'default', label: '默认', description: '通用空状态' },
  { type: 'search', label: '搜索', description: '搜索结果为空' },
  { type: 'data', label: '数据', description: '暂无数据' },
  { type: 'error', label: '错误', description: '加载出错' },
  { type: 'network', label: '网络', description: '网络异常' },
  { type: 'permission', label: '权限', description: '无权限访问' }
]

/**
 * 当前选中的预设类型
 */
const currentType = ref<EmptyType>('default')

/**
 * 处理操作点击
 */
function handleAction() {
  alert('点击了操作按钮')
}

/**
 * 触发操作
 */
function triggerAction() {
  emptyRef.value?.triggerAction()
}
</script>

<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">TEmptyState 组件演示</h1>
        <p class="text-muted-foreground mt-2">
          统一的空状态展示组件，支持多种预设类型和自定义配置
        </p>
      </div>
      <Badge variant="secondary" class="text-sm">
        <Inbox class="w-3 h-3 mr-1" />
        TEmptyState
      </Badge>
    </div>

    <!-- 标签页 -->
    <Tabs default-value="basic" class="w-full">
      <TabsList class="grid w-full grid-cols-5 lg:w-[500px]">
        <TabsTrigger value="basic">基础用法</TabsTrigger>
        <TabsTrigger value="type">预设类型</TabsTrigger>
        <TabsTrigger value="size">尺寸设置</TabsTrigger>
        <TabsTrigger value="custom">自定义</TabsTrigger>
        <TabsTrigger value="advanced">高级功能</TabsTrigger>
      </TabsList>

      <!-- 基础用法 -->
      <TabsContent value="basic" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>基础空状态</CardTitle>
            <CardDescription>
              最简单的使用方式，显示默认图标和文本
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg bg-background">
              <TEmptyState />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>自定义标题和描述</CardTitle>
            <CardDescription>
              通过 title 和 description 属性自定义文本内容
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg bg-background">
              <TEmptyState
                title="暂无订单"
                description="您还没有任何订单，去逛逛吧"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>带操作按钮</CardTitle>
            <CardDescription>
              添加 action 属性显示操作按钮
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg bg-background">
              <TEmptyState
                title="暂无数据"
                description="点击下方按钮添加您的第一条数据"
                :action="{
                  text: '添加数据',
                  type: 'primary',
                  iconName: 'Plus',
                  onClick: handleAction
                }"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 预设类型 -->
      <TabsContent value="type" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>预设类型</CardTitle>
            <CardDescription>
              支持 6 种预设类型：default、search、data、error、network、permission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="item in presetTypes"
                  :key="item.type"
                  class="px-3 py-1.5 text-sm border rounded-md transition-colors"
                  :class="currentType === item.type ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
                  @click="currentType = item.type"
                >
                  {{ item.label }}
                </button>
              </div>
              <div class="border rounded-lg bg-background">
                <TEmptyState :type="currentType" />
              </div>
              <p class="text-sm text-muted-foreground">
                当前类型: {{ presetTypes.find(t => t.type === currentType)?.label }} - {{ presetTypes.find(t => t.type === currentType)?.description }}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>各类型展示</CardTitle>
            <CardDescription>
              所有预设类型的并排对比
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="item in presetTypes"
                :key="item.type"
                class="border rounded-lg overflow-hidden"
              >
                <div class="bg-muted px-3 py-2 text-sm font-medium">
                  {{ item.label }}
                </div>
                <TEmptyState :type="item.type" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>带操作按钮的类型</CardTitle>
            <CardDescription>
              不同类型配合操作按钮的使用场景
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="border rounded-lg bg-background">
                <TEmptyState
                  type="search"
                  title="未找到相关结果"
                  description="请尝试调整搜索条件或更换关键词"
                  :action="{
                    text: '清除搜索',
                    type: 'default',
                    onClick: handleAction
                  }"
                />
              </div>
              <div class="border rounded-lg bg-background">
                <TEmptyState
                  type="data"
                  title="暂无数据"
                  description="开始添加您的第一条数据吧"
                  :action="{
                    text: '立即添加',
                    type: 'primary',
                    iconName: 'Plus',
                    onClick: handleAction
                  }"
                />
              </div>
              <div class="border rounded-lg bg-background">
                <TEmptyState
                  type="network"
                  title="网络异常"
                  description="请检查网络连接后重试"
                  :action="{
                    text: '重新加载',
                    type: 'primary',
                    onClick: handleAction
                  }"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 尺寸设置 -->
      <TabsContent value="size" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>尺寸设置</CardTitle>
            <CardDescription>
              支持三种尺寸：small、default、large
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="border rounded-lg bg-background">
              <TEmptyState
                type="data"
                title="小型空状态"
                description="适用于紧凑布局"
                size="sm"
              />
            </div>
            <div class="border rounded-lg bg-background">
              <TEmptyState
                type="data"
                title="默认空状态"
                description="适用于常规布局"
                size="default"
              />
            </div>
            <div class="border rounded-lg bg-background">
              <TEmptyState
                type="data"
                title="大型空状态"
                description="适用于全屏或突出展示"
                size="lg"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>不同尺寸的对比</CardTitle>
            <CardDescription>
              同一类型在不同尺寸下的视觉效果
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="border rounded-lg bg-background">
                <TEmptyState
                  type="search"
                  size="sm"
                  :action="{ text: '搜索', type: 'primary', onClick: handleAction }"
                />
              </div>
              <div class="border rounded-lg bg-background">
                <TEmptyState
                  type="search"
                  size="default"
                  :action="{ text: '搜索', type: 'primary', onClick: handleAction }"
                />
              </div>
              <div class="border rounded-lg bg-background">
                <TEmptyState
                  type="search"
                  size="lg"
                  :action="{ text: '搜索', type: 'primary', onClick: handleAction }"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 自定义 -->
      <TabsContent value="custom" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>自定义图标</CardTitle>
            <CardDescription>
              使用 icon 或 icon-name 属性自定义图标
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="border rounded-lg bg-background">
                <TEmptyState
                  title="自定义图标"
                  description="使用 Lucide 图标名称"
                  icon-name="Database"
                />
              </div>
              <div class="border rounded-lg bg-background">
                <TEmptyState
                  title="传入图标组件"
                  description="直接传入图标组件"
                  :icon="Lock"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>边框样式</CardTitle>
            <CardDescription>
              使用 bordered 属性添加边框
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="border rounded-lg bg-background">
                <TEmptyState
                  title="无边框"
                  description="默认无边框样式"
                  :bordered="false"
                />
              </div>
              <div class="bg-background">
                <TEmptyState
                  title="有边框"
                  description="添加边框样式"
                  :bordered="true"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>背景样式</CardTitle>
            <CardDescription>
              使用 show-background 属性控制背景显示
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="border rounded-lg bg-background">
                <TEmptyState
                  title="有背景"
                  description="默认显示浅灰色背景"
                  :show-background="true"
                />
              </div>
              <div class="border rounded-lg bg-background">
                <TEmptyState
                  title="无背景"
                  description="透明背景，更简洁"
                  :show-background="false"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>自定义内容</CardTitle>
            <CardDescription>
              使用默认插槽添加自定义内容
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg bg-background">
              <TEmptyState
                title="自定义内容"
                description="在空状态下方添加自定义内容"
              >
                <div class="flex flex-col items-center gap-2 mt-4">
                  <p class="text-sm text-muted-foreground">或者您可以：</p>
                  <div class="flex gap-2">
                    <Button variant="outline" size="sm">导入数据</Button>
                    <Button variant="outline" size="sm">查看示例</Button>
                  </div>
                </div>
              </TEmptyState>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 高级功能 -->
      <TabsContent value="advanced" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>方法调用</CardTitle>
            <CardDescription>
              通过 ref 调用组件暴露的方法
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <Button variant="outline" @click="triggerAction">
                触发操作
              </Button>
            </div>
            <div class="border rounded-lg bg-background">
              <TEmptyState
                ref="emptyRef"
                title="方法调用示例"
                description="点击上方按钮触发操作"
                :action="{
                  text: '操作按钮',
                  type: 'primary',
                  onClick: () => alert('操作被触发')
                }"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>实际应用场景</CardTitle>
            <CardDescription>
              不同场景下的空状态使用示例
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <!-- 搜索结果为空 -->
              <div class="border rounded-lg overflow-hidden">
                <div class="bg-muted px-4 py-2 text-sm font-medium border-b">
                  搜索结果
                </div>
                <TEmptyState
                  type="search"
                  title="未找到相关结果"
                  description="请尝试调整搜索条件"
                  size="sm"
                />
              </div>

              <!-- 表格数据为空 -->
              <div class="border rounded-lg overflow-hidden">
                <div class="bg-muted px-4 py-2 text-sm font-medium border-b">
                  用户列表
                </div>
                <TEmptyState
                  type="data"
                  title="暂无用户数据"
                  description="点击下方按钮添加第一个用户"
                  :action="{
                    text: '添加用户',
                    type: 'primary',
                    iconName: 'Plus',
                    onClick: handleAction
                  }"
                />
              </div>

              <!-- 网络错误 -->
              <div class="border rounded-lg overflow-hidden">
                <div class="bg-muted px-4 py-2 text-sm font-medium border-b">
                  数据加载
                </div>
                <TEmptyState
                  type="network"
                  title="网络连接失败"
                  description="请检查网络设置后重试"
                  :action="{
                    text: '重新加载',
                    type: 'primary',
                    onClick: handleAction
                  }"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>组件特性</CardTitle>
            <CardDescription>
              TEmptyState 组件的主要特性
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">6 种预设类型</h4>
                <p class="text-sm text-muted-foreground">
                  default、search、data、error、network、permission
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">3 种尺寸</h4>
                <p class="text-sm text-muted-foreground">
                  sm、default、lg 适应不同场景
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">自定义图标</h4>
                <p class="text-sm text-muted-foreground">
                  支持传入图标名称或组件
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">操作按钮</h4>
                <p class="text-sm text-muted-foreground">
                  支持添加操作按钮，引导用户行为
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">边框和背景</h4>
                <p class="text-sm text-muted-foreground">
                  可配置边框和背景样式
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">自定义内容</h4>
                <p class="text-sm text-muted-foreground">
                  支持默认插槽添加自定义内容
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
