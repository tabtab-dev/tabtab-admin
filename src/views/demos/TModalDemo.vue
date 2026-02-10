<script setup lang="ts">
/**
 * TModalDemo - TModal 组件演示页面
 *
 * @description 展示 TModal 对话框组件的各种使用场景和配置方式
 */
import { TModal, TForm, TTable } from '@/components/business'
import type { TModalExpose, TFormExpose, FormSchema, TableSchema } from '@/components/business'
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

// ==================== 表单弹窗 - 模式1：TModal 控制提交（推荐）====================

/**
 * 表单引用 - 用于 TModal 控制提交模式
 */
const formRefMode1 = ref<TFormExpose>()

/**
 * 表单弹窗状态 - 模式1
 */
const formMode1Open = ref(false)
const formMode1Data = ref({
  name: '',
  email: '',
  role: 'viewer'
})

/**
 * 表单 Schema - 模式1
 */
const formMode1Schema: FormSchema = {
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
 * 处理模式1表单提交
 * @param values - 表单值
 */
async function handleFormMode1Submit(values: any) {
  console.log('模式1 - TModal 控制提交:', values)
  // 模拟异步保存
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('保存成功')
  formMode1Open.value = false
}

// ==================== 表单弹窗 - 模式2：TForm 控制提交 ====================

/**
 * 表单弹窗状态 - 模式2
 */
const formMode2Open = ref(false)
const formMode2Data = ref({
  name: '',
  email: '',
  role: 'viewer'
})

/**
 * 表单 Schema - 模式2
 */
const formMode2Schema: FormSchema = {
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
 * 处理模式2表单提交
 * @param values - 表单值
 */
function handleFormMode2Submit(values: any) {
  console.log('模式2 - TForm 控制提交:', values)
  formMode2Open.value = false
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
 * 无底部弹窗状态
 */
const noFooterOpen = ref(false)

/**
 * 自定义底部内容弹窗状态
 */
const customFooterContentOpen = ref(false)

/**
 * 不同宽度弹窗状态
 */
const widthOpen = ref(false)
const modalWidth = ref(520)



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
              @ok="modalRef?.close()"
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
            <CardTitle>无底部区域</CardTitle>
            <CardDescription>
              设置 :footer="null" 隐藏底部按钮区域，不显示分割线
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <Button variant="outline" @click="noFooterOpen = true">打开无底部弹窗</Button>

            <TModal
              v-model:open="noFooterOpen"
              title="无底部区域"
              :footer="null"
            >
              <p>这个弹窗没有底部按钮区域，也不会显示 footer 分割线。</p>
              <p class="text-muted-foreground mt-2">
                适用于纯展示内容或自带提交按钮的表单场景。
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
        <!-- 模式1：TModal 控制提交（推荐） -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              模式1：TModal 控制提交
              <Badge variant="default" class="text-xs">推荐</Badge>
            </CardTitle>
            <CardDescription>
              TModal 显示底部按钮，通过 form-ref 关联 TForm，点击确定自动触发表单验证和提交
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <Button @click="formMode1Open = true">打开表单弹窗（模式1）</Button>

            <TModal
              v-model:open="formMode1Open"
              title="编辑用户信息"
              :form-ref="formRefMode1"
              ok-text="保存"
              @submit="handleFormMode1Submit"
            >
              <TForm
                ref="formRefMode1"
                v-model="formMode1Data"
                :schema="formMode1Schema"
                embedded
              />
            </TModal>

            <!-- 代码示例 -->
            <div class="p-3 bg-muted rounded-lg text-xs">
              <p class="font-medium mb-1">使用方式：</p>
              <pre class="text-muted-foreground overflow-x-auto">
&lt;TModal v-model:open="open" title="编辑" :form-ref="formRef" @submit="handleSubmit"&gt;
  &lt;TForm ref="formRef" v-model="formData" :schema="schema" embedded /&gt;
&lt;/TModal&gt;</pre>
            </div>
          </CardContent>
        </Card>

        <!-- 模式2：TForm 控制提交 -->
        <Card>
          <CardHeader>
            <CardTitle>模式2：TForm 控制提交</CardTitle>
            <CardDescription>
              TModal 隐藏底部（:show-footer="false"），由 TForm 内部控制提交，适合简单表单场景
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <Button variant="outline" @click="formMode2Open = true">打开表单弹窗（模式2）</Button>

            <TModal
              v-model:open="formMode2Open"
              title="编辑用户信息"
              :show-footer="false"
            >
              <TForm
                v-model="formMode2Data"
                :schema="formMode2Schema"
                @submit="handleFormMode2Submit"
              />
            </TModal>

            <!-- 代码示例 -->
            <div class="p-3 bg-muted rounded-lg text-xs">
              <p class="font-medium mb-1">使用方式：</p>
              <pre class="text-muted-foreground overflow-x-auto">
&lt;TModal v-model:open="open" title="编辑" :show-footer="false"&gt;
  &lt;TForm v-model="formData" :schema="schema" @submit="handleSubmit" /&gt;
&lt;/TModal&gt;</pre>
            </div>
          </CardContent>
        </Card>

        <!-- 两种模式对比 -->
        <Card>
          <CardHeader>
            <CardTitle>模式对比</CardTitle>
            <CardDescription>
              根据使用场景选择合适的集成方式
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 border rounded-lg border-primary/50 bg-primary/5">
                <h4 class="font-medium mb-2 text-primary flex items-center gap-2">
                  模式1：TModal 控制提交
                  <Badge variant="default" class="text-xs">推荐</Badge>
                </h4>
                <ul class="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>统一使用 TModal 的 confirmLoading 管理 loading</li>
                  <li>表单验证失败时保持弹窗打开</li>
                  <li>符合用户习惯（底部操作按钮）</li>
                  <li>适合异步提交场景</li>
                  <li>代码结构更清晰</li>
                </ul>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">模式2：TForm 控制提交</h4>
                <ul class="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>表单逻辑自包含</li>
                  <li>无需处理 form-ref 关联</li>
                  <li>适合简单快速编辑场景</li>
                  <li>loading 状态需单独处理</li>
                  <li>适合独立表单组件</li>
                </ul>
              </div>
            </div>
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

        <!-- showFooter 属性示例 -->
        <Card>
          <CardHeader>
            <CardTitle>showFooter 属性</CardTitle>
            <CardDescription>
              使用 showFooter 属性控制底部按钮的显示/隐藏
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <Button variant="outline" @click="noFooterOpen = true">无底部按钮</Button>
              <Button variant="outline" @click="customFooterContentOpen = true">自定义底部内容</Button>
            </div>

            <!-- 无底部按钮 -->
            <TModal
              v-model:open="noFooterOpen"
              title="无底部按钮"
              :show-footer="false"
            >
              <p>这个弹窗没有底部按钮区域。</p>
              <p class="text-muted-foreground mt-2">
                设置 :show-footer="false" 可隐藏底部按钮。
              </p>
            </TModal>

            <!-- 自定义底部内容 -->
            <TModal
              v-model:open="customFooterContentOpen"
              title="自定义底部内容"
            >
              <p>这个弹窗使用自定义底部内容。</p>

              <template #footer>
                <div class="flex justify-end gap-2">
                  <Button variant="outline" @click="customFooterContentOpen = false">
                    取消
                  </Button>
                  <Button variant="destructive" @click="customFooterContentOpen = false">
                    删除
                  </Button>
                  <Button @click="customFooterContentOpen = false">
                    保存
                  </Button>
                </div>
              </template>
            </TModal>

            <!-- 代码示例 -->
            <div class="p-3 bg-muted rounded-lg text-xs">
              <p class="font-medium mb-1">使用方式：</p>
              <pre class="text-muted-foreground overflow-x-auto">
<!-- 隐藏底部按钮 -->
&lt;TModal v-model:open="open" title="标题" :show-footer="false"&gt;
  &lt;p&gt;内容&lt;/p&gt;
&lt;/TModal&gt;

<!-- 自定义底部内容 -->
&lt;TModal v-model:open="open" title="标题"&gt;
  &lt;p&gt;内容&lt;/p&gt;
  &lt;template #footer&gt;
    &lt;Button @click="handleCancel"&gt;取消&lt;/Button&gt;
    &lt;Button type="primary" @click="handleOk"&gt;确定&lt;/Button&gt;
  &lt;/template&gt;
&lt;/TModal&gt;</pre>
            </div>
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
