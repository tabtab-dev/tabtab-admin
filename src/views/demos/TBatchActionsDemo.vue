<script setup lang="ts">
/**
 * TBatchActionsDemo - TBatchActions 组件演示页面
 *
 * @description 展示 TBatchActions 批量操作栏组件的各种使用场景和配置方式
 */
import { TBatchActions } from '@/components/business/TBatchActions'
import { TTable } from '@/components/business/TTable'
import type { TBatchActionsExpose, BatchAction } from '@/components/business/TBatchActions'
import type { TableSchema } from '@/components/business/TTable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, Download, Share2, Archive, CheckSquare, Square, Layers } from 'lucide-vue-next'

/**
 * 消息提示函数
 */
const showMessage = (msg: string) => {
  // eslint-disable-next-line no-alert
  window.alert(msg)
}

/**
 * 组件引用
 */
const batchRef = ref<TBatchActionsExpose>()

/**
 * 选中数量
 */
const selectedCount = ref(0)

/**
 * 总数
 */
const totalCount = ref(100)

/**
 * 模拟数据
 */
const tableData = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员', status: 'active' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: '编辑', status: 'active' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: '访客', status: 'inactive' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: '编辑', status: 'active' },
  { id: 5, name: '孙七', email: 'sunqi@example.com', role: '访客', status: 'inactive' }
])

/**
 * 选中的行
 */
const selectedRows = ref<number[]>([])

/**
 * 表格 Schema
 */
const tableSchema: TableSchema = {
  columns: [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '姓名', dataIndex: 'name', width: 120 },
    { title: '邮箱', dataIndex: 'email' },
    { title: '角色', dataIndex: 'role', width: 100 },
    { title: '状态', dataIndex: 'status', width: 100 }
  ],
  pagination: false
}

/**
 * 基础操作按钮
 */
const basicActions: BatchAction[] = [
  { text: '批量删除', type: 'danger', iconName: 'Trash2', onClick: () => showMessage('批量删除') }
]

/**
 * 多个操作按钮
 */
const multipleActions: BatchAction[] = [
  { text: '批量删除', type: 'danger', iconName: 'Trash2', onClick: () => showMessage('批量删除') },
  { text: '批量导出', type: 'default', iconName: 'Download', onClick: () => showMessage('批量导出') },
  { text: '批量分享', type: 'default', iconName: 'Share2', onClick: () => showMessage('批量分享') }
]

/**
 * 带确认的操作
 */
const confirmActions: BatchAction[] = [
  {
    text: '批量删除',
    type: 'danger',
    iconName: 'Trash2',
    confirm: true,
    confirmText: '确定要删除选中的数据吗？删除后不可恢复。',
    onClick: () => showMessage('确认删除')
  },
  {
    text: '批量归档',
    type: 'default',
    iconName: 'Archive',
    confirm: true,
    confirmTitle: '确认归档',
    confirmText: '归档后数据将移至归档文件夹。',
    onClick: () => showMessage('确认归档')
  }
]

/**
 * 切换选中状态
 */
function toggleSelection(id: number) {
  const index = selectedRows.value.indexOf(id)
  if (index > -1) {
    selectedRows.value.splice(index, 1)
  } else {
    selectedRows.value.push(id)
  }
  selectedCount.value = selectedRows.value.length
}

/**
 * 全选/取消全选
 */
function toggleSelectAll() {
  if (selectedRows.value.length === tableData.value.length) {
    selectedRows.value = []
  } else {
    selectedRows.value = tableData.value.map(item => item.id)
  }
  selectedCount.value = selectedRows.value.length
}

/**
 * 处理清除选择
 */
function handleClear() {
  selectedRows.value = []
  selectedCount.value = 0
}

/**
 * 模拟添加选中
 */
function addSelection() {
  selectedCount.value = Math.min(selectedCount.value + 5, totalCount.value)
}

/**
 * 模拟减少选中
 */
function removeSelection() {
  selectedCount.value = Math.max(selectedCount.value - 5, 0)
}
</script>

<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">TBatchActions 组件演示</h1>
        <p class="text-muted-foreground mt-2">
          表格/列表批量操作栏，显示选中数量和操作按钮
        </p>
      </div>
      <Badge variant="secondary" class="text-sm">
        <Layers class="w-3 h-3 mr-1" />
        TBatchActions
      </Badge>
    </div>

    <!-- 标签页 -->
    <Tabs default-value="basic" class="w-full">
      <TabsList class="grid w-full grid-cols-4 lg:w-[400px]">
        <TabsTrigger value="basic">基础用法</TabsTrigger>
        <TabsTrigger value="actions">操作按钮</TabsTrigger>
        <TabsTrigger value="confirm">确认对话框</TabsTrigger>
        <TabsTrigger value="advanced">高级功能</TabsTrigger>
      </TabsList>

      <!-- 基础用法 -->
      <TabsContent value="basic" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>基础用法</CardTitle>
            <CardDescription>
              显示选中数量和清除按钮
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <Button variant="outline" size="sm" @click="addSelection">
                增加选中 (+5)
              </Button>
              <Button variant="outline" size="sm" @click="removeSelection">
                减少选中 (-5)
              </Button>
            </div>
            <TBatchActions
              :count="selectedCount"
              @clear="selectedCount = 0"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>显示总数</CardTitle>
            <CardDescription>
              使用 total 属性显示总数信息
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <Button variant="outline" size="sm" @click="addSelection">
                增加选中 (+5)
              </Button>
              <Button variant="outline" size="sm" @click="removeSelection">
                减少选中 (-5)
              </Button>
            </div>
            <TBatchActions
              :count="selectedCount"
              :total="totalCount"
              @clear="selectedCount = 0"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>自定义项目名</CardTitle>
            <CardDescription>
              使用 item-name 属性自定义项目单位名称
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <Button variant="outline" size="sm" @click="addSelection">
                增加选中 (+5)
              </Button>
              <Button variant="outline" size="sm" @click="removeSelection">
                减少选中 (-5)
              </Button>
            </div>
            <TBatchActions
              :count="selectedCount"
              :total="totalCount"
              item-name="条"
              @clear="selectedCount = 0"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 操作按钮 -->
      <TabsContent value="actions" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>单个操作按钮</CardTitle>
            <CardDescription>
              添加一个批量操作按钮
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <Button variant="outline" size="sm" @click="addSelection">
                增加选中 (+5)
              </Button>
              <Button variant="outline" size="sm" @click="removeSelection">
                减少选中 (-5)
              </Button>
            </div>
            <TBatchActions
              :count="selectedCount"
              :actions="basicActions"
              @clear="selectedCount = 0"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>多个操作按钮</CardTitle>
            <CardDescription>
              添加多个不同类型的操作按钮
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <Button variant="outline" size="sm" @click="addSelection">
                增加选中 (+5)
              </Button>
              <Button variant="outline" size="sm" @click="removeSelection">
                减少选中 (-5)
              </Button>
            </div>
            <TBatchActions
              :count="selectedCount"
              :actions="multipleActions"
              @clear="selectedCount = 0"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>隐藏清除按钮</CardTitle>
            <CardDescription>
              使用 :show-clear="false" 隐藏清除按钮
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <Button variant="outline" size="sm" @click="addSelection">
                增加选中 (+5)
              </Button>
              <Button variant="outline" size="sm" @click="removeSelection">
                减少选中 (-5)
              </Button>
            </div>
            <TBatchActions
              :count="selectedCount"
              :actions="multipleActions"
              :show-clear="false"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>自定义清除文本</CardTitle>
            <CardDescription>
              使用 clear-text 属性自定义清除按钮文本
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <Button variant="outline" size="sm" @click="addSelection">
                增加选中 (+5)
              </Button>
              <Button variant="outline" size="sm" @click="removeSelection">
                减少选中 (-5)
              </Button>
            </div>
            <TBatchActions
              :count="selectedCount"
              :actions="basicActions"
              clear-text="取消选择"
              @clear="selectedCount = 0"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 确认对话框 -->
      <TabsContent value="confirm" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>带确认的操作</CardTitle>
            <CardDescription>
              设置 confirm: true 在操作前显示确认对话框
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <Button variant="outline" size="sm" @click="addSelection">
                增加选中 (+5)
              </Button>
              <Button variant="outline" size="sm" @click="removeSelection">
                减少选中 (-5)
              </Button>
            </div>
            <TBatchActions
              :count="selectedCount"
              :actions="confirmActions"
              @clear="selectedCount = 0"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>确认对话框配置</CardTitle>
            <CardDescription>
              使用 confirmTitle 和 confirmText 自定义确认对话框内容
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="p-4 bg-muted rounded-lg">
              <pre class="text-xs text-muted-foreground">{
  text: '批量删除',
  type: 'danger',
  iconName: 'Trash2',
  confirm: true,
  confirmTitle: '确认删除',  // 自定义标题
  confirmText: '确定要删除选中的数据吗？删除后不可恢复。',
  onClick: () => {}
}</pre>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 高级功能 -->
      <TabsContent value="advanced" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>与表格结合使用</CardTitle>
            <CardDescription>
              在真实表格场景中使用批量操作栏
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- 批量操作栏 -->
            <TBatchActions
              :count="selectedRows.length"
              :total="tableData.length"
              item-name="条"
              :actions="[
                { text: '删除', type: 'danger', iconName: 'Trash2', onClick: () => showMessage('删除选中') },
                { text: '导出', type: 'default', iconName: 'Download', onClick: () => showMessage('导出选中') }
              ]"
              @clear="handleClear"
            />

            <!-- 表格 -->
            <div class="border rounded-lg overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-muted">
                  <tr>
                    <th class="p-3 w-12">
                      <button @click="toggleSelectAll">
                        <component
                          :is="selectedRows.length === tableData.length ? CheckSquare : Square"
                          class="w-4 h-4"
                        />
                      </button>
                    </th>
                    <th class="p-3 text-left font-medium">ID</th>
                    <th class="p-3 text-left font-medium">姓名</th>
                    <th class="p-3 text-left font-medium">邮箱</th>
                    <th class="p-3 text-left font-medium">角色</th>
                    <th class="p-3 text-left font-medium">状态</th>
                  </tr>
                </thead>
                <tbody class="divide-y">
                  <tr
                    v-for="item in tableData"
                    :key="item.id"
                    :class="selectedRows.includes(item.id) ? 'bg-primary/5' : ''"
                  >
                    <td class="p-3">
                      <button @click="toggleSelection(item.id)">
                        <component
                          :is="selectedRows.includes(item.id) ? CheckSquare : Square"
                          class="w-4 h-4"
                        />
                      </button>
                    </td>
                    <td class="p-3">{{ item.id }}</td>
                    <td class="p-3">{{ item.name }}</td>
                    <td class="p-3">{{ item.email }}</td>
                    <td class="p-3">{{ item.role }}</td>
                    <td class="p-3">{{ item.status }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 选中信息 -->
            <div class="p-3 bg-muted rounded-lg">
              <p class="text-sm text-muted-foreground">
                已选中: {{ selectedRows.join(', ') || '无' }}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>粘性定位</CardTitle>
            <CardDescription>
              设置 sticky 属性使操作栏在滚动时固定在顶部
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg bg-background overflow-hidden">
              <div class="h-48 overflow-y-auto">
                <TBatchActions
                  :count="selectedCount"
                  :actions="multipleActions"
                  sticky
                  :sticky-offset="0"
                  @clear="selectedCount = 0"
                />
                <div class="p-6 space-y-4">
                  <p v-for="i in 10" :key="i" class="text-muted-foreground">
                    这是表格内容 {{ i }}，向下滚动查看粘性效果。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>方法调用</CardTitle>
            <CardDescription>
              通过 ref 调用组件暴露的方法
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <Button variant="outline" size="sm" @click="addSelection">
                增加选中
              </Button>
              <Button variant="outline" size="sm" @click="batchRef?.clearSelection">
                调用 clearSelection
              </Button>
            </div>
            <TBatchActions
              ref="batchRef"
              :count="selectedCount"
              :actions="basicActions"
              @clear="selectedCount = 0"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>组件特性</CardTitle>
            <CardDescription>
              TBatchActions 组件的主要特性
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">选中计数</h4>
                <p class="text-sm text-muted-foreground">
                  显示当前选中的项目数量
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">批量操作</h4>
                <p class="text-sm text-muted-foreground">
                  支持多个操作按钮，可配置类型和图标
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">确认对话框</h4>
                <p class="text-sm text-muted-foreground">
                  危险操作前显示确认对话框
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">清除选择</h4>
                <p class="text-sm text-muted-foreground">
                  一键清除所有选择
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">粘性定位</h4>
                <p class="text-sm text-muted-foreground">
                  支持 sticky 定位，滚动时固定
                </p>
              </div>
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">显示总数</h4>
                <p class="text-sm text-muted-foreground">
                  可选显示总数信息
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
