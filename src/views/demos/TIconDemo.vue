<script setup lang="ts">
/**
 * TIconDemo - TIcon 图标选择器组件演示页面
 *
 * @description 展示 TIcon 图标选择器组件的各种使用场景和配置方式
 */
import { ref, computed } from 'vue'
import { TIcon } from '@/components/business/TIcon'
import type { TIconExpose } from '@/components/business/TIcon'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ICON_CATEGORIES } from '@/components/business/TIcon'
import * as icons from 'lucide-vue-next'

/**
 * 基础用法示例
 */
const basicIcon = ref('')

/**
 * 不同尺寸示例
 */
const smIcon = ref('Smile')
const defaultIcon = ref('Heart')
const lgIcon = ref('Star')

/**
 * 禁用状态示例
 */
const disabledIcon = ref('Settings')

/**
 * 无清空按钮示例
 */
const noClearIcon = ref('Check')

/**
 * 分类筛选示例
 */
const filteredIcon = ref('')
const selectedCategories = ref(['shapes', 'system'])

/**
 * 排除分类示例
 */
const excludedIcon = ref('')
const excludedCategories = ref(['users', 'media'])

/**
 * 自定义配置示例
 */
const customIcon = ref('')
const customColumns = ref(6)
const customWidth = ref(600)
const customHeight = ref(400)

/**
 * 组件引用
 */
const iconRef = ref<TIconExpose>()

/**
 * 获取分类名称
 */
function getCategoryName(key: string): string {
  const category = ICON_CATEGORIES.find(cat => cat.key === key)
  return category?.name || key
}

/**
 * 获取图标组件
 */
function getIconComponent(name: string) {
  return (icons as Record<string, unknown>)[name] as typeof icons.Smile | null
}

/**
 * 处理图标变化
 */
function handleIconChange(iconName: string, example: string) {
  console.log(`[${example}] 选中图标:`, iconName)
}

/**
 * 处理清空
 */
function handleClear(example: string) {
  console.log(`[${example}] 清空图标`)
}

/**
 * 打开选择器
 */
function openPicker() {
  iconRef.value?.open()
}

/**
 * 清空选择
 */
function clearPicker() {
  iconRef.value?.clear()
}

/**
 * 获取当前值
 */
function getCurrentValue() {
  const value = iconRef.value?.getValue()
  console.log('当前值:', value)
  alert(`当前选中的图标: ${value || '无'}`)
}

/**
 * 代码示例
 */
const codeExamples = {
  basic: `<TIcon v-model="icon" placeholder="请选择图标" />`,
  
  size: `<!-- 小尺寸 -->
<TIcon v-model="smIcon" size="sm" />

<!-- 默认尺寸 -->
<TIcon v-model="defaultIcon" size="default" />

<!-- 大尺寸 -->
<TIcon v-model="lgIcon" size="lg" />`,

  disabled: `<TIcon v-model="icon" disabled />`,

  noClear: `<TIcon v-model="icon" :show-clear="false" />`,

  filter: `<!-- 只显示指定分类 -->
<TIcon 
  v-model="icon" 
  :categories="['shapes', 'system']" 
/>`,

  exclude: `<!-- 排除指定分类 -->
<TIcon 
  v-model="icon" 
  :exclude-categories="['users', 'media']" 
/>`,

  custom: `<!-- 自定义弹窗配置 -->
<TIcon 
  v-model="icon"
  :columns="6"
  :popup-width="600"
  :popup-height="400"
/>`,

  events: `<TIcon 
  v-model="icon"
  @change="handleChange"
  @clear="handleClear"
/>`,

  ref: `<!-- 模板 -->
<TIcon ref="iconRef" v-model="icon" />

<!-- 脚本 -->
const iconRef = ref<TIconExpose>()

// 打开选择器
iconRef.value?.open()

// 清空选择
iconRef.value?.clear()

// 获取当前值
const value = iconRef.value?.getValue()`
}
</script>

<template>
  <div class="t-icon-demo container mx-auto p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">TIcon 图标选择器</h1>
        <p class="text-muted-foreground mt-1">
          基于 lucide-vue-next 的图标选择器组件，支持图标浏览、搜索和选择
        </p>
      </div>
      <div class="flex gap-2">
        <Badge variant="secondary">Vue 3</Badge>
        <Badge variant="secondary">TypeScript</Badge>
        <Badge variant="secondary">Lucide</Badge>
      </div>
    </div>

    <Tabs default-value="basic" class="w-full">
      <TabsList class="grid w-full grid-cols-5 lg:w-[600px]">
        <TabsTrigger value="basic">基础用法</TabsTrigger>
        <TabsTrigger value="config">配置选项</TabsTrigger>
        <TabsTrigger value="filter">分类筛选</TabsTrigger>
        <TabsTrigger value="methods">方法调用</TabsTrigger>
        <TabsTrigger value="code">代码示例</TabsTrigger>
      </TabsList>

      <!-- 基础用法 -->
      <TabsContent value="basic" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>基础用法</CardTitle>
            <CardDescription>
              最简单的使用方式，通过 v-model 绑定选中的图标名称
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-4 max-w-md">
              <div class="space-y-2">
                <label class="text-sm font-medium">选择图标</label>
                <TIcon 
                  v-model="basicIcon" 
                  placeholder="请选择图标"
                  @change="(name) => handleIconChange(name, '基础')"
                  @clear="() => handleClear('基础')"
                />
              </div>
              
              <div class="p-4 bg-muted rounded-lg">
                <p class="text-sm text-muted-foreground mb-2">当前选中:</p>
                <div v-if="basicIcon" class="flex items-center gap-2">
                  <component 
                    :is="getIconComponent(basicIcon)" 
                    class="h-6 w-6 text-primary"
                  />
                  <span class="font-medium">{{ basicIcon }}</span>
                </div>
                <p v-else class="text-sm text-muted-foreground">未选择图标</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>尺寸设置</CardTitle>
            <CardDescription>
              支持三种尺寸：small、default、large
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-6 max-w-md">
              <div class="space-y-2">
                <label class="text-sm font-medium">小尺寸 (sm)</label>
                <TIcon v-model="smIcon" size="sm" />
              </div>
              
              <div class="space-y-2">
                <label class="text-sm font-medium">默认尺寸 (default)</label>
                <TIcon v-model="defaultIcon" size="default" />
              </div>
              
              <div class="space-y-2">
                <label class="text-sm font-medium">大尺寸 (lg)</label>
                <TIcon v-model="lgIcon" size="lg" />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 配置选项 -->
      <TabsContent value="config" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>禁用状态</CardTitle>
            <CardDescription>
              设置 disabled 属性可以禁用组件
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="max-w-md">
              <TIcon v-model="disabledIcon" disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>隐藏清空按钮</CardTitle>
            <CardDescription>
              设置 show-clear 为 false 可以隐藏清空按钮
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="max-w-md">
              <TIcon v-model="noClearIcon" :show-clear="false" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>自定义弹窗配置</CardTitle>
            <CardDescription>
              可以自定义弹窗的宽度、高度和每行显示的图标数量
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-4 max-w-md">
              <div class="grid grid-cols-3 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium">列数</label>
                  <input 
                    v-model.number="customColumns" 
                    type="number" 
                    min="4" 
                    max="12"
                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium">宽度</label>
                  <input
                    v-model.number="customWidth"
                    type="number"
                    min="400"
                    max="1000"
                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium">高度</label>
                  <input
                    v-model.number="customHeight"
                    type="number"
                    min="300"
                    max="700"
                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  />
                </div>
              </div>
              
              <TIcon 
                v-model="customIcon"
                :columns="customColumns"
                :popup-width="customWidth"
                :popup-height="customHeight"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 分类筛选 -->
      <TabsContent value="filter" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>指定显示分类</CardTitle>
            <CardDescription>
              通过 categories 属性指定只显示某些分类的图标
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="max-w-md space-y-4">
              <div class="flex flex-wrap gap-2">
                <Badge 
                  v-for="cat in ICON_CATEGORIES" 
                  :key="cat.key"
                  :variant="selectedCategories.includes(cat.key) ? 'default' : 'outline'"
                  class="cursor-pointer"
                  @click="selectedCategories = selectedCategories.includes(cat.key) 
                    ? selectedCategories.filter(c => c !== cat.key)
                    : [...selectedCategories, cat.key]"
                >
                  {{ cat.name }}
                </Badge>
              </div>
              
              <TIcon 
                v-model="filteredIcon"
                :categories="selectedCategories"
                placeholder="只显示选中的分类"
              />
              
              <p class="text-sm text-muted-foreground">
                当前显示分类: {{ selectedCategories.map(getCategoryName).join('、') || '全部' }}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>排除分类</CardTitle>
            <CardDescription>
              通过 exclude-categories 属性排除某些分类的图标
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="max-w-md space-y-4">
              <div class="flex flex-wrap gap-2">
                <Badge 
                  v-for="cat in ICON_CATEGORIES" 
                  :key="cat.key"
                  :variant="excludedCategories.includes(cat.key) ? 'destructive' : 'outline'"
                  class="cursor-pointer"
                  @click="excludedCategories = excludedCategories.includes(cat.key) 
                    ? excludedCategories.filter(c => c !== cat.key)
                    : [...excludedCategories, cat.key]"
                >
                  {{ cat.name }}
                </Badge>
              </div>
              
              <TIcon 
                v-model="excludedIcon"
                :exclude-categories="excludedCategories"
                placeholder="排除选中的分类"
              />
              
              <p class="text-sm text-muted-foreground">
                已排除分类: {{ excludedCategories.map(getCategoryName).join('、') || '无' }}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>图标分类列表</CardTitle>
            <CardDescription>
              所有可用的图标分类
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div 
                v-for="category in ICON_CATEGORIES" 
                :key="category.key"
                class="p-3 border rounded-lg"
              >
                <h4 class="font-medium text-sm">{{ category.name }}</h4>
                <p class="text-xs text-muted-foreground mt-1">
                  {{ category.icons.length }} 个图标
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 方法调用 -->
      <TabsContent value="methods" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>组件方法</CardTitle>
            <CardDescription>
              通过 ref 可以调用组件暴露的方法
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-4 max-w-md">
              <TIcon ref="iconRef" v-model="basicIcon" />
              
              <div class="flex gap-2">
                <Button variant="outline" @click="openPicker">
                  打开选择器
                </Button>
                <Button variant="outline" @click="clearPicker">
                  清空选择
                </Button>
                <Button variant="outline" @click="getCurrentValue">
                  获取当前值
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>事件监听</CardTitle>
            <CardDescription>
              组件支持 change 和 clear 事件
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="max-w-md space-y-4">
              <TIcon 
                v-model="basicIcon"
                @change="(name) => handleIconChange(name, '事件')"
                @clear="() => handleClear('事件')"
              />
              <p class="text-sm text-muted-foreground">
                打开浏览器控制台查看事件输出
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 代码示例 -->
      <TabsContent value="code" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>基础用法</CardTitle>
          </CardHeader>
          <CardContent>
            <pre class="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code>{{ codeExamples.basic }}</code></pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>尺寸设置</CardTitle>
          </CardHeader>
          <CardContent>
            <pre class="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code>{{ codeExamples.size }}</code></pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>禁用与清空</CardTitle>
          </CardHeader>
          <CardContent>
            <pre class="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code>{{ codeExamples.disabled }}

{{ codeExamples.noClear }}</code></pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>分类筛选</CardTitle>
          </CardHeader>
          <CardContent>
            <pre class="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code>{{ codeExamples.filter }}

{{ codeExamples.exclude }}</code></pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>自定义配置</CardTitle>
          </CardHeader>
          <CardContent>
            <pre class="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code>{{ codeExamples.custom }}</code></pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>事件监听</CardTitle>
          </CardHeader>
          <CardContent>
            <pre class="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code>{{ codeExamples.events }}</code></pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>方法调用</CardTitle>
          </CardHeader>
          <CardContent>
            <pre class="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code>{{ codeExamples.ref }}</code></pre>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

<style scoped>
.t-icon-demo {
  min-height: calc(100vh - 4rem);
}

pre code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
</style>
