<script setup lang="ts">
/**
 * TPageHeaderDemo - TPageHeader 组件演示页面
 *
 * @description 展示 TPageHeader 页面头部组件的各种使用场景和配置方式
 */
import { TPageHeader } from '@/components/business/TPageHeader'
import type { TPageHeaderExpose, PageAction, BreadcrumbItem } from '@/components/business/TPageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Heading1, Plus, Download, Settings, Trash2, ArrowLeft } from 'lucide-vue-next'

/**
 * 组件引用
 */
const headerRef = ref<TPageHeaderExpose>()

/**
 * 基础操作按钮
 */
const basicActions: PageAction[] = [
  { text: '添加用户', type: 'primary', iconName: 'Plus', onClick: () => alert('点击添加') }
]

/**
 * 多个操作按钮
 */
const multipleActions: PageAction[] = [
  { text: '添加用户', type: 'primary', iconName: 'Plus', onClick: () => alert('点击添加') },
  { text: '导出数据', type: 'default', iconName: 'Download', onClick: () => alert('点击导出') },
  { text: '设置', type: 'ghost', iconName: 'Settings', onClick: () => alert('点击设置') }
]

/**
 * 带危险操作
 */
const dangerActions: PageAction[] = [
  { text: '添加用户', type: 'primary', iconName: 'Plus', onClick: () => alert('点击添加') },
  { text: '批量删除', type: 'danger', iconName: 'Trash2', onClick: () => alert('点击删除') }
]

/**
 * 面包屑导航
 */
const breadcrumbs: BreadcrumbItem[] = [
  { title: '首页', path: '/' },
  { title: '系统管理', path: '/system' },
  { title: '用户管理', path: '/system/user' },
  { title: '用户详情' }
]

/**
 * 带点击事件的面包屑
 */
const clickableBreadcrumbs: BreadcrumbItem[] = [
  { title: '首页', path: '/', clickable: true },
  { title: '产品中心', path: '/products', clickable: true },
  { title: '产品详情', clickable: false }
]

/**
 * 处理面包屑点击
 */
function handleBreadcrumbClick(item: BreadcrumbItem, index: number) {
  console.log('面包屑点击:', item, index)
}

/**
 * 处理返回
 */
function handleBack() {
  alert('点击了返回按钮')
}
</script>

<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">TPageHeader 组件演示</h1>
        <p class="text-muted-foreground mt-2">
          统一的页面头部组件，包含标题、副标题、面包屑、操作按钮等
        </p>
      </div>
      <Badge variant="secondary" class="text-sm">
        <Heading1 class="w-3 h-3 mr-1" />
        TPageHeader
      </Badge>
    </div>

    <!-- 标签页 -->
    <Tabs default-value="basic" class="w-full">
      <TabsList class="grid w-full grid-cols-4 lg:w-[400px]">
        <TabsTrigger value="basic">基础用法</TabsTrigger>
        <TabsTrigger value="breadcrumb">面包屑</TabsTrigger>
        <TabsTrigger value="actions">操作按钮</TabsTrigger>
        <TabsTrigger value="advanced">高级功能</TabsTrigger>
      </TabsList>

      <!-- 基础用法 -->
      <TabsContent value="basic" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>基础标题</CardTitle>
            <CardDescription>
              最简单的使用方式，只显示标题
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg p-6 bg-background">
              <TPageHeader title="页面标题" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>带副标题</CardTitle>
            <CardDescription>
              添加 subtitle 属性显示副标题
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg p-6 bg-background">
              <TPageHeader
                title="用户管理"
                subtitle="管理系统用户账号和权限分配"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>长标题处理</CardTitle>
            <CardDescription>
              标题过长时的显示效果
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg p-6 bg-background max-w-md">
              <TPageHeader
                title="这是一个非常长的页面标题，用于测试长文本的显示效果"
                subtitle="副标题也会跟随标题一起显示"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 面包屑 -->
      <TabsContent value="breadcrumb" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>带面包屑导航</CardTitle>
            <CardDescription>
              使用 breadcrumbs 属性添加面包屑导航
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg p-6 bg-background">
              <TPageHeader
                title="用户详情"
                subtitle="查看用户详细信息和操作记录"
                :breadcrumbs="breadcrumbs"
                @breadcrumb-click="handleBreadcrumbClick"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>带返回按钮</CardTitle>
            <CardDescription>
              使用 show-back 属性显示返回按钮
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg p-6 bg-background">
              <TPageHeader
                title="返回示例"
                subtitle="点击返回按钮可以返回上一页"
                show-back
                :on-back="handleBack"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>面包屑 + 返回按钮</CardTitle>
            <CardDescription>
              同时使用面包屑和返回按钮
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg p-6 bg-background">
              <TPageHeader
                title="编辑用户"
                subtitle="修改用户信息和权限"
                :breadcrumbs="breadcrumbs"
                show-back
                @breadcrumb-click="handleBreadcrumbClick"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>不可点击的面包屑</CardTitle>
            <CardDescription>
              设置 clickable: false 禁用面包屑点击
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg p-6 bg-background">
              <TPageHeader
                title="产品详情"
                subtitle="部分面包屑不可点击"
                :breadcrumbs="clickableBreadcrumbs"
                @breadcrumb-click="handleBreadcrumbClick"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 操作按钮 -->
      <TabsContent value="actions" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>单个操作按钮</CardTitle>
            <CardDescription>
              添加一个主要操作按钮
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg p-6 bg-background">
              <TPageHeader
                title="用户管理"
                subtitle="管理系统用户"
                :actions="basicActions"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>多个操作按钮</CardTitle>
            <CardDescription>
              添加多个不同类型的操作按钮
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg p-6 bg-background">
              <TPageHeader
                title="数据管理"
                subtitle="管理系统数据"
                :actions="multipleActions"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>带危险操作</CardTitle>
            <CardDescription>
              添加危险类型的操作按钮（红色）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg p-6 bg-background">
              <TPageHeader
                title="内容管理"
                subtitle="管理系统内容"
                :actions="dangerActions"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>完整示例</CardTitle>
            <CardDescription>
              面包屑 + 返回按钮 + 副标题 + 多个操作
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg p-6 bg-background">
              <TPageHeader
                title="订单详情"
                subtitle="查看订单详细信息和物流状态"
                :breadcrumbs="[
                  { title: '首页', path: '/' },
                  { title: '订单管理', path: '/orders' },
                  { title: '订单 #2024001' }
                ]"
                show-back
                :actions="[
                  { text: '打印订单', type: 'default', onClick: () => alert('打印') },
                  { text: '发货', type: 'primary', onClick: () => alert('发货') },
                  { text: '取消订单', type: 'danger', onClick: () => alert('取消') }
                ]"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 高级功能 -->
      <TabsContent value="advanced" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>粘性定位</CardTitle>
            <CardDescription>
              设置 sticky 属性使头部在滚动时固定在顶部
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg bg-background overflow-hidden">
              <div class="h-48 overflow-y-auto">
                <TPageHeader
                  title="粘性头部示例"
                  subtitle="向下滚动查看粘性效果"
                  :actions="basicActions"
                  sticky
                  :sticky-offset="0"
                />
                <div class="p-6 space-y-4">
                  <p v-for="i in 10" :key="i" class="text-muted-foreground">
                    这是页面内容 {{ i }}，用于演示粘性头部效果。继续向下滚动，头部会固定在顶部。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>额外内容插槽</CardTitle>
            <CardDescription>
              使用 extra 插槽添加额外内容
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg p-6 bg-background">
              <TPageHeader
                title="带额外内容"
                subtitle="在头部下方添加自定义内容"
                show-extra
              >
                <template #extra>
                  <div class="flex items-center gap-4 p-3 bg-muted rounded-lg">
                    <div class="flex items-center gap-2">
                      <span class="text-sm text-muted-foreground">状态:</span>
                      <Badge variant="default">进行中</Badge>
                    </div>
                    <Separator orientation="vertical" class="h-4" />
                    <div class="flex items-center gap-2">
                      <span class="text-sm text-muted-foreground">负责人:</span>
                      <span class="text-sm">张三</span>
                    </div>
                    <Separator orientation="vertical" class="h-4" />
                    <div class="flex items-center gap-2">
                      <span class="text-sm text-muted-foreground">截止日期:</span>
                      <span class="text-sm">2024-12-31</span>
                    </div>
                  </div>
                </template>
              </TPageHeader>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>响应式布局</CardTitle>
            <CardDescription>
              在小屏幕下自动调整布局
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div class="border rounded-lg p-6 bg-background">
                <p class="text-xs text-muted-foreground mb-2">桌面端布局</p>
                <TPageHeader
                  title="桌面端标题"
                  subtitle="操作按钮在右侧"
                  :actions="multipleActions"
                />
              </div>
              <div class="border rounded-lg p-6 bg-background max-w-xs">
                <p class="text-xs text-muted-foreground mb-2">移动端布局（模拟）</p>
                <TPageHeader
                  title="移动端标题"
                  subtitle="操作按钮在下方"
                  :actions="basicActions"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>组件特性</CardTitle>
            <CardDescription>
              TPageHeader 组件的主要特性
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">面包屑导航</h4>
                <p class="text-sm text-muted-foreground">
                  支持多级面包屑，可配置点击行为
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">返回按钮</h4>
                <p class="text-sm text-muted-foreground">
                  内置返回按钮，支持自定义返回逻辑
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">操作按钮</h4>
                <p class="text-sm text-muted-foreground">
                  支持多种按钮类型：primary、default、danger、ghost、link
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">粘性定位</h4>
                <p class="text-sm text-muted-foreground">
                  支持 sticky 定位，滚动时固定在顶部
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">响应式布局</h4>
                <p class="text-sm text-muted-foreground">
                  自动适应不同屏幕尺寸
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">额外内容</h4>
                <p class="text-sm text-muted-foreground">
                  支持 extra 插槽添加自定义内容
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
