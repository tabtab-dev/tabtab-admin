<script setup lang="ts">
/**
 * TDataCardDemo - TDataCard 组件演示页面
 *
 * @description 展示 TDataCard 统计卡片组件的各种使用场景和配置方式
 */
import { TDataCard } from '@/components/business/TDataCard'
import type { TDataCardExpose, CardColor, CardSize, TrendDirection } from '@/components/business/TDataCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, DollarSign, ShoppingCart, TrendingUp, Eye, MousePointer } from 'lucide-vue-next'

/**
 * 组件引用
 */
const cardRef = ref<TDataCardExpose>()

/**
 * 加载状态
 */
const loading = ref(false)

/**
 * 颜色选项
 */
const colorOptions: { label: string; value: CardColor; icon: string }[] = [
  { label: '默认', value: 'default', icon: 'Users' },
  { label: '蓝色', value: 'blue', icon: 'Users' },
  { label: '绿色', value: 'green', icon: 'DollarSign' },
  { label: '红色', value: 'red', icon: 'ShoppingCart' },
  { label: '黄色', value: 'yellow', icon: 'TrendingUp' },
  { label: '紫色', value: 'purple', icon: 'Eye' },
  { label: '橙色', value: 'orange', icon: 'MousePointer' }
]

/**
 * 切换加载状态
 */
function toggleLoading() {
  loading.value = !loading.value
}

/**
 * 获取图标组件
 */
function getIconComponent(iconName: string) {
  const icons: Record<string, any> = {
    Users,
    DollarSign,
    ShoppingCart,
    TrendingUp,
    Eye,
    MousePointer
  }
  return icons[iconName]
}
</script>

<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">TDataCard 组件演示</h1>
        <p class="text-muted-foreground mt-2">
          基于 antdv-next 和 lucide-vue-next 封装的统计卡片组件
        </p>
      </div>
      <Badge variant="secondary" class="text-sm">
        <TrendingUp class="w-3 h-3 mr-1" />
        TDataCard
      </Badge>
    </div>

    <!-- 标签页 -->
    <Tabs default-value="basic" class="w-full">
      <TabsList class="grid w-full grid-cols-5 lg:w-[500px]">
        <TabsTrigger value="basic">基础用法</TabsTrigger>
        <TabsTrigger value="trend">趋势展示</TabsTrigger>
        <TabsTrigger value="color">颜色主题</TabsTrigger>
        <TabsTrigger value="size">尺寸设置</TabsTrigger>
        <TabsTrigger value="advanced">高级功能</TabsTrigger>
      </TabsList>

      <!-- 基础用法 -->
      <TabsContent value="basic" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>基础卡片</CardTitle>
            <CardDescription>
              最简单的卡片使用方式，展示标题、数值和图标
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <TDataCard
                title="总用户"
                :value="1234"
                icon-name="Users"
                color="blue"
              />
              <TDataCard
                title="销售额"
                :value="56789"
                prefix="¥"
                icon-name="DollarSign"
                color="green"
              />
              <TDataCard
                title="订单数"
                :value="856"
                icon-name="ShoppingCart"
                color="red"
              />
              <TDataCard
                title="访问量"
                :value="45231"
                icon-name="Eye"
                color="purple"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>前缀和后缀</CardTitle>
            <CardDescription>
              支持添加前缀（如货币符号）和后缀（如百分比、单位）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TDataCard
                title="总收入"
                :value="128500"
                prefix="¥"
                icon-name="DollarSign"
                color="green"
              />
              <TDataCard
                title="增长率"
                :value="23.5"
                suffix="%"
                icon-name="TrendingUp"
                color="blue"
              />
              <TDataCard
                title="活跃用户"
                :value="89.2"
                suffix="%"
                description="占注册用户比例"
                icon-name="Users"
                color="purple"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>描述文本</CardTitle>
            <CardDescription>
              可以添加描述文本提供额外信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TDataCard
                title="本月销售"
                :value="45200"
                prefix="¥"
                description="较上月增长 12%"
                icon-name="DollarSign"
                color="green"
              />
              <TDataCard
                title="待处理订单"
                :value="23"
                description="需要尽快处理"
                icon-name="ShoppingCart"
                color="orange"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 趋势展示 -->
      <TabsContent value="trend" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>趋势指示器</CardTitle>
            <CardDescription>
              支持显示上升、下降和平稳趋势
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TDataCard
                title="活跃用户"
                :value="1234"
                :trend="{ value: 12.5, direction: 'up', text: '较上周' }"
                icon-name="Users"
                color="green"
              />
              <TDataCard
                title="跳出率"
                :value="23.8"
                suffix="%"
                :trend="{ value: 5.2, direction: 'down', text: '较上周' }"
                icon-name="TrendingUp"
                color="red"
              />
              <TDataCard
                title="平均停留"
                :value="5.2"
                suffix="分钟"
                :trend="{ value: 0, direction: 'neutral', text: '较上周' }"
                icon-name="Eye"
                color="blue"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>趋势方向</CardTitle>
            <CardDescription>
              三种趋势方向：上升（绿色）、下降（红色）、持平（灰色）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TDataCard
                title="上升趋势"
                :value="1000"
                :trend="{ value: 15.3, direction: 'up' }"
                icon-name="TrendingUp"
                color="green"
              />
              <TDataCard
                title="下降趋势"
                :value="800"
                :trend="{ value: 8.5, direction: 'down' }"
                icon-name="TrendingUp"
                color="red"
              />
              <TDataCard
                title="持平趋势"
                :value="500"
                :trend="{ value: 0, direction: 'neutral' }"
                icon-name="TrendingUp"
                color="blue"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 颜色主题 -->
      <TabsContent value="color" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>颜色主题</CardTitle>
            <CardDescription>
              支持 7 种颜色主题：default、blue、green、red、yellow、purple、orange
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <TDataCard
                v-for="option in colorOptions"
                :key="option.value"
                :title="option.label"
                :value="1234"
                :icon="getIconComponent(option.icon)"
                :color="option.value"
              />
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
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TDataCard
                title="小尺寸"
                :value="1234"
                size="sm"
                icon-name="Users"
                color="blue"
              />
              <TDataCard
                title="默认尺寸"
                :value="1234"
                size="default"
                icon-name="Users"
                color="blue"
              />
              <TDataCard
                title="大尺寸"
                :value="1234"
                size="lg"
                icon-name="Users"
                color="blue"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>尺寸对比</CardTitle>
            <CardDescription>
              不同尺寸在相同内容下的对比效果
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <TDataCard
                title="小型卡片"
                :value="8888"
                :trend="{ value: 12.5, direction: 'up' }"
                description="适用于紧凑布局"
                size="sm"
                icon-name="DollarSign"
                color="green"
              />
              <TDataCard
                title="默认卡片"
                :value="8888"
                :trend="{ value: 12.5, direction: 'up' }"
                description="适用于常规布局"
                size="default"
                icon-name="DollarSign"
                color="green"
              />
              <TDataCard
                title="大型卡片"
                :value="8888"
                :trend="{ value: 12.5, direction: 'up' }"
                description="适用于突出展示"
                size="lg"
                icon-name="DollarSign"
                color="green"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 高级功能 -->
      <TabsContent value="advanced" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>加载状态</CardTitle>
            <CardDescription>
              显示加载动画，适用于数据加载中的场景
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <Button variant="outline" @click="toggleLoading">
                {{ loading ? '停止加载' : '开始加载' }}
              </Button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TDataCard
                title="加载中"
                :value="1234"
                :loading="loading"
                icon-name="Users"
                color="blue"
              />
              <TDataCard
                title="销售额"
                :value="56789"
                prefix="¥"
                :loading="loading"
                icon-name="DollarSign"
                color="green"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>可点击卡片</CardTitle>
            <CardDescription>
              设置 clickable 属性使卡片可点击，点击时有视觉反馈
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TDataCard
                title="点击查看详情"
                :value="1234"
                :clickable="true"
                icon-name="Users"
                color="blue"
                @click="() => alert('点击了用户卡片')"
              />
              <TDataCard
                title="点击查看报表"
                :value="56789"
                prefix="¥"
                :clickable="true"
                icon-name="DollarSign"
                color="green"
                @click="() => alert('点击了销售卡片')"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>无边框样式</CardTitle>
            <CardDescription>
              设置 :bordered="false" 移除边框
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
              <TDataCard
                title="有边框"
                :value="1234"
                :bordered="true"
                icon-name="Users"
                color="blue"
              />
              <TDataCard
                title="无边框"
                :value="5678"
                :bordered="false"
                icon-name="DollarSign"
                color="green"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>组件特性</CardTitle>
            <CardDescription>
              TDataCard 组件的主要特性
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">7 种颜色主题</h4>
                <p class="text-sm text-muted-foreground">
                  支持 blue、green、red、yellow、purple、orange、default
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">3 种尺寸</h4>
                <p class="text-sm text-muted-foreground">
                  sm、default、lg 适应不同场景
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">趋势指示</h4>
                <p class="text-sm text-muted-foreground">
                  支持上升、下降、持平三种趋势
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">前缀/后缀</h4>
                <p class="text-sm text-muted-foreground">
                  支持添加货币符号、百分比等单位
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">加载状态</h4>
                <p class="text-sm text-muted-foreground">
                  内置加载动画，提升用户体验
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">可点击</h4>
                <p class="text-sm text-muted-foreground">
                  支持点击交互，带有悬停效果
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
