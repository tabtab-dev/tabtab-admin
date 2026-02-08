<script setup lang="ts">
/**
 * TModalDemo - TModal 组件演示页面
 *
 * @description 展示 TModal 对话框组件的各种使用场景和配置方式
 */
import { TModal, TForm, TTable } from '@/components/business'
import type { TModalExpose, FormSchema, TableSchema } from '@/components/business'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, LayoutTemplate, Table2, FormInput } from 'lucide-vue-next'

/**
 * Modal 引用
 */
const modalRef = ref<TModalExpose>()

/**
 * 基础弹窗状态
 */
const basicOpen = ref(false)

/**
 * 表单弹窗状态
 */
const formOpen = ref(false)
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
  ]
}

/**
 * 表格弹窗状态
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
 * 异步弹窗状态
 */
const asyncOpen = ref(false)
const confirmLoading = ref(false)

/**
 * 自定义底部弹窗状态
 */
const customFooterOpen = ref(false)

/**
 * 居中弹窗状态
 */
const centeredOpen = ref(false)

/**
 * 不同宽度弹窗状态
 */
const widthOpen = ref(false)
const modalWidth = ref(520)

/**
 * 处理表单提交
 * @param values - 表单值
 */
function handleFormSubmit(values: any) {
  console.log('表单提交:', values)
  formOpen.value = false
}

/**
 * 处理异步确认
 */
async function handleAsyncOk() {
  confirmLoading.value = true
  // 模拟异步操作
  await new Promise(resolve => setTimeout(resolve, 2000))
  confirmLoading.value = false
  asyncOpen.value = false
}

/**
 * 打开指定宽度的弹窗
 * @param width - 弹窗宽度
 */
function openWidthModal(width: number) {
  modalWidth.value = width
  widthOpen.value = true
}

/**
 * 通过 ref 打开弹窗
 */
function openModalByRef() {
  modalRef.value?.open()
}

/**
 * 通过 ref 关闭弹窗
 */
function closeModalByRef() {
  modalRef.value?.close()
}
</script>

<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">TModal 组件演示</h1>
        <p class="text-muted-foreground mt-2">
          基于 antdv-next 封装的对话框组件，支持多种使用场景
        </p>
      </div>
      <Badge variant="secondary" class="text-sm">
        <MessageSquare class="w-3 h-3 mr-1" />
        TModal
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
          表单弹窗
        </TabsTrigger>
        <TabsTrigger value="table">
          <Table2 class="w-4 h-4 mr-2" />
          表格弹窗
        </TabsTrigger>
        <TabsTrigger value="advanced">
          <MessageSquare class="w-4 h-4 mr-2" />
          高级功能
        </TabsTrigger>
      </TabsList>

      <!-- 基础用法 -->
      <TabsContent value="basic" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>基础弹窗</CardTitle>
            <CardDescription>
              最简单的弹窗使用方式，通过 v-model:open 控制显隐
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <Button @click="basicOpen = true">打开基础弹窗</Button>

            <TModal
              v-model:open="basicOpen"
              title="基础弹窗"
              @ok="basicOpen = false"
            >
              <p>这是一个基础的对话框示例。</p>
              <p class="text-muted-foreground mt-2">
                支持自定义内容，可以是文本、表单、表格等任意内容。
              </p>
            </TModal>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>通过 Ref 控制</CardTitle>
            <CardDescription>
              使用 ref 获取组件实例，通过方法控制弹窗
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <Button @click="openModalByRef">打开弹窗</Button>
              <Button variant="outline" @click="closeModalByRef">关闭弹窗</Button>
            </div>

            <TModal
              ref="modalRef"
              title="Ref 控制弹窗"
              :footer="null"
            >
              <p>这个弹窗通过 ref 方法控制打开和关闭。</p>
              <p class="text-muted-foreground mt-2">
                适用于需要在父组件中程序化控制弹窗的场景。
              </p>
            </TModal>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>不同宽度</CardTitle>
            <CardDescription>
              支持自定义弹窗宽度，适应不同内容
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <Button variant="outline" @click="openWidthModal(400)">窄弹窗 (400px)</Button>
              <Button variant="outline" @click="openWidthModal(600)">中等弹窗 (600px)</Button>
              <Button variant="outline" @click="openWidthModal(800)">宽弹窗 (800px)</Button>
            </div>

            <TModal
              v-model:open="widthOpen"
              title="自定义宽度"
              :width="modalWidth"
            >
              <p>当前弹窗宽度: {{ modalWidth }}px</p>
              <p class="text-muted-foreground mt-2">
                根据内容多少选择合适的弹窗宽度。
              </p>
            </TModal>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 表单弹窗 -->
      <TabsContent value="form" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>TForm + TModal</CardTitle>
            <CardDescription>
              在弹窗中使用 TForm 组件，实现表单编辑功能
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <Button @click="formOpen = true">打开表单弹窗</Button>

            <TModal
              v-model:open="formOpen"
              title="编辑用户信息"
              :footer="null"
            >
              <TForm
                v-model="formData"
                :schema="formSchema"
                @submit="handleFormSubmit"
              />
            </TModal>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>异步提交</CardTitle>
            <CardDescription>
              表单提交时显示 loading 状态，防止重复提交
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <Button @click="asyncOpen = true">打开异步弹窗</Button>

            <TModal
              v-model:open="asyncOpen"
              title="异步操作"
              :confirm-loading="confirmLoading"
              @ok="handleAsyncOk"
            >
              <p>点击确定按钮会模拟异步操作，持续 2 秒。</p>
              <p class="text-muted-foreground mt-2">
                异步操作期间，确定按钮会显示 loading 状态。
              </p>
            </TModal>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 表格弹窗 -->
      <TabsContent value="table" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>TTable + TModal</CardTitle>
            <CardDescription>
              在弹窗中使用 TTable 组件，实现数据选择功能
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <Button @click="tableOpen = true">打开表格弹窗</Button>

            <TModal
              v-model:open="tableOpen"
              title="选择用户"
              width="700"
              @ok="tableOpen = false"
            >
              <TTable :schema="tableSchema" :data="tableData" />
            </TModal>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 高级功能 -->
      <TabsContent value="advanced" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>垂直居中</CardTitle>
            <CardDescription>
              弹窗在屏幕垂直方向居中显示
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <Button @click="centeredOpen = true">打开居中弹窗</Button>

            <TModal
              v-model:open="centeredOpen"
              title="居中弹窗"
              centered
              @ok="centeredOpen = false"
            >
              <p>这个弹窗在屏幕垂直方向居中显示。</p>
              <p class="text-muted-foreground mt-2">
                适用于需要突出显示的重要信息。
              </p>
            </TModal>
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
            <Button @click="customFooterOpen = true">打开自定义底部弹窗</Button>

            <TModal
              v-model:open="customFooterOpen"
              title="自定义底部"
            >
              <p>这个弹窗使用自定义底部按钮。</p>

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
            </TModal>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>组件特性</CardTitle>
            <CardDescription>
              TModal 组件的主要特性
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul class="space-y-2 list-disc list-inside text-muted-foreground">
              <li>基于 antdv-next Modal 封装，保持一致的 API</li>
              <li>支持 v-model:open 双向绑定</li>
              <li>支持 ref 获取实例，通过方法控制弹窗</li>
              <li>与 TForm、TTable 组件完美兼容</li>
              <li>样式与 shadcn-vue 主题对齐</li>
              <li>支持自定义宽度、位置、底部按钮</li>
              <li>支持异步操作 loading 状态</li>
              <li>完整的 TypeScript 类型支持</li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
