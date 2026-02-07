<script setup lang="ts">
/**
 * TDrawerDemo - TDrawer 组件演示页面
 *
 * @description 展示 TDrawer 抽屉组件的各种使用场景和配置方式
 */
import { ref } from 'vue'
import { TDrawer, TForm, TTable } from '@/components/business'
import type { TDrawerExpose, FormSchema, TableSchema, DrawerPlacement } from '@/components/business'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PanelRight, LayoutTemplate, Table2, FormInput, ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-vue-next'

/**
 * Drawer 引用
 */
const drawerRef = ref<TDrawerExpose>()

/**
 * 基础抽屉状态
 */
const basicOpen = ref(false)

/**
 * 方向抽屉状态
 */
const placementOpen = ref(false)
const currentPlacement = ref<DrawerPlacement>('right')

/**
 * 表单抽屉状态
 */
const formOpen = ref(false)
const formRef = ref()
const formData = ref({
  name: '',
  email: '',
  role: 'viewer'
})

/**
 * 表单 Schema
 */
const formSchema: FormSchema = {
  layout: 'vertical',
  fields: [
    {
      name: 'name',
      type: 'input',
      label: '姓名',
      placeholder: '请输入姓名',
      rules: [{ required: true, message: '姓名不能为空' }]
    },
    {
      name: 'email',
      type: 'input',
      label: '邮箱',
      placeholder: '请输入邮箱',
      rules: [
        { required: true, message: '邮箱不能为空' },
        { type: 'email', message: '邮箱格式不正确' }
      ]
    },
    {
      name: 'role',
      type: 'select',
      label: '角色',
      options: [
        { label: '管理员', value: 'admin' },
        { label: '编辑', value: 'editor' },
        { label: '访客', value: 'viewer' }
      ]
    }
  ],
  actions: {
    showSubmit: false,
    showReset: false
  }
}

/**
 * 表格抽屉状态
 */
const tableOpen = ref(false)

/**
 * 表格 Schema
 */
const tableSchema: TableSchema = {
  columns: [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '姓名', dataIndex: 'name', width: 120 },
    { title: '邮箱', dataIndex: 'email' },
    { title: '角色', dataIndex: 'role', width: 100 }
  ],
  pagination: { pageSize: 5, show: true }
}

/**
 * 表格数据
 */
const tableData = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: '编辑' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: '访客' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: '编辑' },
  { id: 5, name: '孙七', email: 'sunqi@example.com', role: '访客' }
])

/**
 * 不同尺寸抽屉状态
 */
const sizeOpen = ref(false)
const currentSize = ref<'default' | 'large' | number>('default')

/**
 * 可调整大小抽屉状态
 */
const resizableOpen = ref(false)
const resizableSize = ref(378)

/**
 * 处理抽屉大小调整
 * @param size - 新的尺寸
 */
function handleResize(size: number) {
  resizableSize.value = size
}

/**
 * 自定义底部抽屉状态
 */
const customFooterOpen = ref(false)

/**
 * 打开指定方向的抽屉
 * @param placement - 抽屉方向
 */
function openPlacementDrawer(placement: DrawerPlacement) {
  currentPlacement.value = placement
  placementOpen.value = true
}

/**
 * 打开指定尺寸的抽屉
 * @param size - 抽屉尺寸
 */
function openSizeDrawer(size: 'default' | 'large' | number) {
  currentSize.value = size
  sizeOpen.value = true
}

/**
 * 处理表单提交
 */
async function handleFormSubmit() {
  try {
    const values = await formRef.value?.validate()
    console.log('表单提交:', values)
    formOpen.value = false
  } catch (error) {
    console.log('表单验证失败:', error)
  }
}

/**
 * 通过 ref 打开抽屉
 */
function openDrawerByRef() {
  drawerRef.value?.open()
}

/**
 * 通过 ref 关闭抽屉
 */
function closeDrawerByRef() {
  drawerRef.value?.close()
}
</script>

<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">TDrawer 组件演示</h1>
        <p class="text-muted-foreground mt-2">
          基于 antdv-next 封装的抽屉组件，支持多种使用场景
        </p>
      </div>
      <Badge variant="secondary" class="text-sm">
        <PanelRight class="w-3 h-3 mr-1" />
        TDrawer
      </Badge>
    </div>

    <!-- 标签页 -->
    <Tabs default-value="basic" class="w-full">
      <TabsList class="grid w-full grid-cols-4 lg:w-[600px]">
        <TabsTrigger value="basic">
          <LayoutTemplate class="w-4 h-4 mr-2" />
          基础用法
        </TabsTrigger>
        <TabsTrigger value="form">
          <FormInput class="w-4 h-4 mr-2" />
          表单抽屉
        </TabsTrigger>
        <TabsTrigger value="table">
          <Table2 class="w-4 h-4 mr-2" />
          表格抽屉
        </TabsTrigger>
        <TabsTrigger value="advanced">
          <PanelRight class="w-4 h-4 mr-2" />
          高级功能
        </TabsTrigger>
      </TabsList>

      <!-- 基础用法 -->
      <TabsContent value="basic" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>基础抽屉</CardTitle>
            <CardDescription>
              最简单的抽屉使用方式，通过 v-model:open 控制显隐
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <Button @click="basicOpen = true">打开基础抽屉</Button>

            <TDrawer
              v-model:open="basicOpen"
              title="基础抽屉"
              @close="basicOpen = false"
            >
              <p>这是一个基础的抽屉示例。</p>
              <p class="text-muted-foreground mt-2">
                支持自定义内容，可以是文本、表单、表格等任意内容。
              </p>
            </TDrawer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>不同方向</CardTitle>
            <CardDescription>
              抽屉可以从四个方向滑出：左、右、上、下
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <Button variant="outline" @click="openPlacementDrawer('left')">
                <ArrowLeft class="w-4 h-4 mr-1" />
                左侧
              </Button>
              <Button variant="outline" @click="openPlacementDrawer('right')">
                <ArrowRight class="w-4 h-4 mr-1" />
                右侧
              </Button>
              <Button variant="outline" @click="openPlacementDrawer('top')">
                <ArrowUp class="w-4 h-4 mr-1" />
                顶部
              </Button>
              <Button variant="outline" @click="openPlacementDrawer('bottom')">
                <ArrowDown class="w-4 h-4 mr-1" />
                底部
              </Button>
            </div>

            <TDrawer
              v-model:open="placementOpen"
              title="方向演示"
              :placement="currentPlacement"
              @close="placementOpen = false"
            >
              <p>当前方向: {{ currentPlacement }}</p>
              <p class="text-muted-foreground mt-2">
                抽屉可以从四个方向滑出，适应不同的使用场景。
              </p>
            </TDrawer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>通过 Ref 控制</CardTitle>
            <CardDescription>
              使用 ref 获取组件实例，通过方法控制抽屉
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <Button @click="openDrawerByRef">打开抽屉</Button>
              <Button variant="outline" @click="closeDrawerByRef">关闭抽屉</Button>
            </div>

            <TDrawer
              ref="drawerRef"
              title="Ref 控制抽屉"
              :footer="null"
            >
              <p>这个抽屉通过 ref 方法控制打开和关闭。</p>
              <p class="text-muted-foreground mt-2">
                适用于需要在父组件中程序化控制抽屉的场景。
              </p>
            </TDrawer>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 表单抽屉 -->
      <TabsContent value="form" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>TForm + TDrawer</CardTitle>
            <CardDescription>
              在抽屉中使用 TForm 组件，按钮放在抽屉底部
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <Button @click="formOpen = true">打开表单抽屉</Button>

            <TDrawer
              v-model:open="formOpen"
              title="编辑用户信息"
              size="large"
            >
              <TForm
                ref="formRef"
                v-model="formData"
                :schema="formSchema"
              />

              <template #footer>
                <div class="flex justify-end gap-2">
                  <Button variant="outline" @click="formOpen = false">
                    取消
                  </Button>
                  <Button @click="handleFormSubmit">
                    保存
                  </Button>
                </div>
              </template>
            </TDrawer>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 表格抽屉 -->
      <TabsContent value="table" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>TTable + TDrawer</CardTitle>
            <CardDescription>
              在抽屉中使用 TTable 组件，实现数据选择功能
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <Button @click="tableOpen = true">打开表格抽屉</Button>

            <TDrawer
              v-model:open="tableOpen"
              title="选择用户"
              size="large"
              @close="tableOpen = false"
            >
              <TTable :schema="tableSchema" :data="tableData" />
            </TDrawer>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 高级功能 -->
      <TabsContent value="advanced" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>不同尺寸</CardTitle>
            <CardDescription>
              支持预设尺寸（default、large）和自定义数字
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <Button variant="outline" @click="openSizeDrawer('default')">默认 (378px)</Button>
              <Button variant="outline" @click="openSizeDrawer('large')">大号 (736px)</Button>
              <Button variant="outline" @click="openSizeDrawer(500)">自定义 (500px)</Button>
            </div>

            <TDrawer
              v-model:open="sizeOpen"
              title="尺寸演示"
              :size="currentSize"
              @close="sizeOpen = false"
            >
              <p>当前尺寸: {{ currentSize }}</p>
              <p class="text-muted-foreground mt-2">
                根据内容多少选择合适的抽屉尺寸。
              </p>
            </TDrawer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>可调整大小</CardTitle>
            <CardDescription>
              支持拖拽调整抽屉大小
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <Button @click="resizableOpen = true">打开可调整大小抽屉</Button>

            <TDrawer
              v-model:open="resizableOpen"
              title="可调整大小"
              :size="resizableSize"
              :resizable="{
                onResize: handleResize,
              }"
              @close="resizableOpen = false"
            >
              <p>这个抽屉可以通过拖拽边缘调整大小。</p>
              <p class="text-muted-foreground mt-2">
                适用于内容长度不确定的场景。
              </p>
              <p class="text-muted-foreground mt-2">
                当前宽度: {{ resizableSize }}px
              </p>
            </TDrawer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>自定义底部</CardTitle>
            <CardDescription>
              使用 footer 插槽自定义底部按钮
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <Button @click="customFooterOpen = true">打开自定义底部抽屉</Button>

            <TDrawer
              v-model:open="customFooterOpen"
              title="自定义底部"
            >
              <p>这个抽屉使用自定义底部按钮。</p>

              <template #footer>
                <div class="flex justify-end gap-2">
                  <Button variant="outline" @click="customFooterOpen = false">
                    取消
                  </Button>
                  <Button variant="destructive" @click="customFooterOpen = false">
                    删除
                  </Button>
                  <Button @click="customFooterOpen = false">
                    保存
                  </Button>
                </div>
              </template>
            </TDrawer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>组件特性</CardTitle>
            <CardDescription>
              TDrawer 组件的主要特性
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul class="space-y-2 list-disc list-inside text-muted-foreground">
              <li>基于 antdv-next Drawer 封装，保持一致的 API</li>
              <li>支持 v-model:open 双向绑定</li>
              <li>支持 ref 获取实例，通过方法控制抽屉</li>
              <li>与 TForm、TTable 组件完美兼容</li>
              <li>样式与 shadcn-vue 主题对齐</li>
              <li>支持 4 个方向（top/right/bottom/left）</li>
              <li>支持预设尺寸和自定义数字</li>
              <li>支持可拖拽调整大小</li>
              <li>支持多层抽屉推开效果</li>
              <li>完整的 TypeScript 类型支持</li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
