<script setup lang="ts">
/**
 * TStatusBadgeDemo - TStatusBadge 组件演示页面
 *
 * @description 展示 TStatusBadge 状态徽章组件的各种使用场景和配置方式
 */
import { TStatusBadge } from '@/components/business/TStatusBadge'
import type { TStatusBadgeExpose, BadgeVariant, BadgeSize, StatusType } from '@/components/business/TStatusBadge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Tag, Space } from 'antdv-next'
import { Activity, CheckCircle, XCircle, AlertTriangle, Info, Clock, Shield, Ban } from 'lucide-vue-next'

/**
 * 组件引用
 */
const badgeRef = ref<TStatusBadgeExpose>()

/**
 * 预设状态
 */
const presetStatuses: { status: StatusType; label: string }[] = [
  { status: 'active', label: '启用' },
  { status: 'inactive', label: '禁用' },
  { status: 'success', label: '成功' },
  { status: 'error', label: '失败' },
  { status: 'warning', label: '警告' },
  { status: 'info', label: '信息' },
  { status: 'processing', label: '处理中' },
  { status: 'pending', label: '待处理' },
  { status: 'completed', label: '已完成' },
  { status: 'online', label: '在线' },
  { status: 'offline', label: '离线' },
  { status: 'approved', label: '已通过' },
  { status: 'rejected', label: '已拒绝' },
  { status: 'reviewing', label: '审核中' }
]

/**
 * 布尔值状态
 */
const boolValue = ref(true)

/**
 * 自定义状态映射
 */
const customStatusMap = {
  draft: { text: '草稿', color: 'default' as const },
  published: { text: '已发布', color: 'success' as const },
  archived: { text: '已归档', color: 'warning' as const }
}

/**
 * 自定义状态值
 */
const customStatus = ref('draft')

/**
 * 切换布尔值
 */
function toggleBool() {
  boolValue.value = !boolValue.value
}

/**
 * 切换自定义状态
 */
function cycleCustomStatus() {
  const statuses = ['draft', 'published', 'archived']
  const currentIndex = statuses.indexOf(customStatus.value)
  const nextIndex = (currentIndex + 1) % statuses.length
  customStatus.value = statuses[nextIndex]
}
</script>

<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">TStatusBadge 组件演示</h1>
        <p class="text-muted-foreground mt-2">
          基于 antdv-next 和 lucide-vue-next 封装的状态徽章组件
        </p>
      </div>
      <Badge variant="secondary" class="text-sm">
        <Activity class="w-3 h-3 mr-1" />
        TStatusBadge
      </Badge>
    </div>

    <!-- 标签页 -->
    <Tabs default-value="basic" class="w-full">
      <TabsList class="grid w-full grid-cols-5 lg:w-[500px]">
        <TabsTrigger value="basic">基础用法</TabsTrigger>
        <TabsTrigger value="variant">变体样式</TabsTrigger>
        <TabsTrigger value="size">尺寸设置</TabsTrigger>
        <TabsTrigger value="custom">自定义</TabsTrigger>
        <TabsTrigger value="advanced">高级功能</TabsTrigger>
      </TabsList>

      <!-- 基础用法 -->
      <TabsContent value="basic" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>预设状态</CardTitle>
            <CardDescription>
              组件内置了多种常用状态，自动映射为对应的颜色和文本
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-3">
              <div
                v-for="item in presetStatuses"
                :key="item.status"
                class="flex items-center gap-2 p-2 border rounded-lg"
              >
                <TStatusBadge :status="item.status" />
                <span class="text-xs text-muted-foreground">{{ item.status }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>布尔值状态</CardTitle>
            <CardDescription>
              支持布尔值作为状态，true 显示为"是"（绿色），false 显示为"否"（灰色）
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <button
                class="px-3 py-1.5 text-sm border rounded-md hover:bg-muted transition-colors"
                @click="toggleBool"
              >
                切换状态
              </button>
            </div>
            <div class="flex gap-4">
              <div class="flex items-center gap-2">
                <TStatusBadge :status="boolValue" />
                <span class="text-sm text-muted-foreground">当前值: {{ boolValue }}</span>
              </div>
              <div class="flex items-center gap-2">
                <TStatusBadge :status="!boolValue" />
                <span class="text-sm text-muted-foreground">取反值: {{ !boolValue }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>自定义文本和颜色</CardTitle>
            <CardDescription>
              可以直接设置 text 和 color 属性覆盖默认映射
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-3">
              <TStatusBadge status="custom" text="自定义文本" color="blue" />
              <TStatusBadge status="custom" text="成功状态" color="success" />
              <TStatusBadge status="custom" text="警告状态" color="warning" />
              <TStatusBadge status="custom" text="错误状态" color="error" />
              <TStatusBadge status="custom" text="处理中" color="processing" />
              <TStatusBadge status="custom" text="默认状态" color="default" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 变体样式 -->
      <TabsContent value="variant" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>变体样式</CardTitle>
            <CardDescription>
              支持 4 种变体：soft（柔和）、solid（实心）、outline（描边）、dot（圆点）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <!-- Soft 变体 -->
              <div>
                <h4 class="text-sm font-medium mb-3">Soft（柔和）- 默认</h4>
                <div class="flex flex-wrap gap-3">
                  <TStatusBadge status="success" variant="soft" />
                  <TStatusBadge status="error" variant="soft" />
                  <TStatusBadge status="warning" variant="soft" />
                  <TStatusBadge status="info" variant="soft" />
                  <TStatusBadge status="default" variant="soft" />
                </div>
              </div>

              <!-- Solid 变体 -->
              <div>
                <h4 class="text-sm font-medium mb-3">Solid（实心）</h4>
                <div class="flex flex-wrap gap-3">
                  <TStatusBadge status="success" variant="solid" />
                  <TStatusBadge status="error" variant="solid" />
                  <TStatusBadge status="warning" variant="solid" />
                  <TStatusBadge status="info" variant="solid" />
                  <TStatusBadge status="default" variant="solid" />
                </div>
              </div>

              <!-- Outline 变体 -->
              <div>
                <h4 class="text-sm font-medium mb-3">Outline（描边）</h4>
                <div class="flex flex-wrap gap-3">
                  <TStatusBadge status="success" variant="outline" />
                  <TStatusBadge status="error" variant="outline" />
                  <TStatusBadge status="warning" variant="outline" />
                  <TStatusBadge status="info" variant="outline" />
                  <TStatusBadge status="default" variant="outline" />
                </div>
              </div>

              <!-- Dot 变体 -->
              <div>
                <h4 class="text-sm font-medium mb-3">Dot（圆点）</h4>
                <div class="flex flex-wrap gap-3">
                  <TStatusBadge status="success" variant="dot" />
                  <TStatusBadge status="error" variant="dot" />
                  <TStatusBadge status="warning" variant="dot" />
                  <TStatusBadge status="info" variant="dot" />
                  <TStatusBadge status="processing" variant="dot" />
                  <TStatusBadge status="pending" variant="dot" />
                  <TStatusBadge status="default" variant="dot" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dot 变体动画</CardTitle>
            <CardDescription>
              processing 和 pending 状态的圆点带有脉冲动画效果
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-4">
              <div class="flex items-center gap-2">
                <TStatusBadge status="processing" variant="dot" />
                <span class="text-sm text-muted-foreground">处理中（动画）</span>
              </div>
              <div class="flex items-center gap-2">
                <TStatusBadge status="pending" variant="dot" />
                <span class="text-sm text-muted-foreground">待处理（动画）</span>
              </div>
              <div class="flex items-center gap-2">
                <TStatusBadge status="success" variant="dot" />
                <span class="text-sm text-muted-foreground">成功（无动画）</span>
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
          <CardContent>
            <div class="space-y-6">
              <!-- Small -->
              <div>
                <h4 class="text-sm font-medium mb-3">Small（小）</h4>
                <div class="flex flex-wrap gap-3">
                  <TStatusBadge status="success" size="sm" />
                  <TStatusBadge status="error" size="sm" />
                  <TStatusBadge status="warning" size="sm" />
                  <TStatusBadge status="info" size="sm" />
                </div>
              </div>

              <!-- Default -->
              <div>
                <h4 class="text-sm font-medium mb-3">Default（默认）</h4>
                <div class="flex flex-wrap gap-3">
                  <TStatusBadge status="success" size="default" />
                  <TStatusBadge status="error" size="default" />
                  <TStatusBadge status="warning" size="default" />
                  <TStatusBadge status="info" size="default" />
                </div>
              </div>

              <!-- Large -->
              <div>
                <h4 class="text-sm font-medium mb-3">Large（大）</h4>
                <div class="flex flex-wrap gap-3">
                  <TStatusBadge status="success" size="lg" />
                  <TStatusBadge status="error" size="lg" />
                  <TStatusBadge status="warning" size="lg" />
                  <TStatusBadge status="info" size="lg" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>不同变体的尺寸对比</CardTitle>
            <CardDescription>
              同一尺寸在不同变体下的视觉效果
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <span class="text-sm text-muted-foreground w-16">Small</span>
                <TStatusBadge status="success" size="sm" variant="soft" />
                <TStatusBadge status="success" size="sm" variant="solid" />
                <TStatusBadge status="success" size="sm" variant="outline" />
                <TStatusBadge status="success" size="sm" variant="dot" />
              </div>
              <div class="flex items-center gap-4">
                <span class="text-sm text-muted-foreground w-16">Default</span>
                <TStatusBadge status="success" size="default" variant="soft" />
                <TStatusBadge status="success" size="default" variant="solid" />
                <TStatusBadge status="success" size="default" variant="outline" />
                <TStatusBadge status="success" size="default" variant="dot" />
              </div>
              <div class="flex items-center gap-4">
                <span class="text-sm text-muted-foreground w-16">Large</span>
                <TStatusBadge status="success" size="lg" variant="soft" />
                <TStatusBadge status="success" size="lg" variant="solid" />
                <TStatusBadge status="success" size="lg" variant="outline" />
                <TStatusBadge status="success" size="lg" variant="dot" />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 自定义 -->
      <TabsContent value="custom" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>自定义状态映射</CardTitle>
            <CardDescription>
              使用 status-map 属性自定义状态到文本和颜色的映射
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <button
                class="px-3 py-1.5 text-sm border rounded-md hover:bg-muted transition-colors"
                @click="cycleCustomStatus"
              >
                切换状态
              </button>
            </div>
            <div class="flex items-center gap-4">
              <TStatusBadge
                :status="customStatus"
                :status-map="customStatusMap"
              />
              <span class="text-sm text-muted-foreground">
                当前状态值: {{ customStatus }}
              </span>
            </div>
            <div class="p-4 bg-muted rounded-lg">
              <pre class="text-xs text-muted-foreground">const customStatusMap = {
  draft: { text: '草稿', color: 'default' },
  published: { text: '已发布', color: 'success' },
  archived: { text: '已归档', color: 'warning' }
}</pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>显示圆点</CardTitle>
            <CardDescription>
              使用 show-dot 属性在非 dot 变体上显示圆点指示器
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-4">
              <div class="flex items-center gap-2">
                <TStatusBadge status="success" show-dot />
                <span class="text-sm text-muted-foreground">带圆点</span>
              </div>
              <div class="flex items-center gap-2">
                <TStatusBadge status="processing" show-dot />
                <span class="text-sm text-muted-foreground">处理中（动画）</span>
              </div>
              <div class="flex items-center gap-2">
                <TStatusBadge status="warning" show-dot variant="outline" />
                <span class="text-sm text-muted-foreground">描边 + 圆点</span>
              </div>
              <div class="flex items-center gap-2">
                <TStatusBadge status="error" show-dot variant="solid" />
                <span class="text-sm text-muted-foreground">实心 + 圆点</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>实际应用场景</CardTitle>
            <CardDescription>
              在表格、列表中展示状态
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-muted">
                  <tr>
                    <th class="text-left p-3 font-medium">用户</th>
                    <th class="text-left p-3 font-medium">状态</th>
                    <th class="text-left p-3 font-medium">审核</th>
                    <th class="text-left p-3 font-medium">在线</th>
                  </tr>
                </thead>
                <tbody class="divide-y">
                  <tr>
                    <td class="p-3">张三</td>
                    <td class="p-3"><TStatusBadge status="active" size="sm" /></td>
                    <td class="p-3"><TStatusBadge status="approved" size="sm" variant="outline" /></td>
                    <td class="p-3"><TStatusBadge status="online" size="sm" variant="dot" /></td>
                  </tr>
                  <tr>
                    <td class="p-3">李四</td>
                    <td class="p-3"><TStatusBadge status="inactive" size="sm" /></td>
                    <td class="p-3"><TStatusBadge status="reviewing" size="sm" variant="outline" /></td>
                    <td class="p-3"><TStatusBadge status="offline" size="sm" variant="dot" /></td>
                  </tr>
                  <tr>
                    <td class="p-3">王五</td>
                    <td class="p-3"><TStatusBadge status="active" size="sm" /></td>
                    <td class="p-3"><TStatusBadge status="rejected" size="sm" variant="outline" /></td>
                    <td class="p-3"><TStatusBadge status="busy" size="sm" variant="dot" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 高级功能 -->
      <TabsContent value="advanced" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>可点击状态</CardTitle>
            <CardDescription>
              设置 clickable 属性使徽章可点击，点击时触发 click 事件
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-4">
              <TStatusBadge
                status="warning"
                :clickable="true"
                @click="() => window.alert('点击了警告状态')"
              />
              <TStatusBadge
                status="error"
                :clickable="true"
                variant="outline"
                @click="() => window.alert('点击了错误状态')"
              />
              <TStatusBadge
                status="processing"
                :clickable="true"
                variant="dot"
                @click="() => window.alert('点击了处理中状态')"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>组件特性</CardTitle>
            <CardDescription>
              TStatusBadge 组件的主要特性
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">14+ 预设状态</h4>
                <p class="text-sm text-muted-foreground">
                  内置 active、success、error、warning、processing 等常用状态
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">4 种变体</h4>
                <p class="text-sm text-muted-foreground">
                  soft、solid、outline、dot 适应不同场景
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">3 种尺寸</h4>
                <p class="text-sm text-muted-foreground">
                  sm、default、lg 适应不同布局
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">布尔值支持</h4>
                <p class="text-sm text-muted-foreground">
                  支持 true/false 作为状态值
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">自定义映射</h4>
                <p class="text-sm text-muted-foreground">
                  通过 status-map 自定义状态映射
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">脉冲动画</h4>
                <p class="text-sm text-muted-foreground">
                  processing 和 pending 状态带有脉冲动画
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
