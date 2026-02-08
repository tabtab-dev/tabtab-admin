<script setup lang="ts">
/**
 * TTableDemo - TTable 组件演示页面
 *
 * @description 展示 TTable 表格组件的各种使用场景和配置方式
 */
import { TTable } from '@/components/business/TTable'
import type { TableSchema, TTableExpose } from '@/components/business/TTable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tag, Space, Avatar, Switch } from 'antdv-next'

/**
 * 表格引用
 */
const tableRef = ref<TTableExpose>()

// ==================== 基础示例数据 ====================
const basicData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', status: 'active' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com', status: 'inactive' },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com', status: 'active' },
  { id: 4, name: '赵六', age: 35, email: 'zhaoliu@example.com', status: 'active' },
  { id: 5, name: '钱七', age: 22, email: 'qianqi@example.com', status: 'inactive' }
])

const basicSchema: TableSchema = {
  columns: [
    { title: 'ID', dataIndex: 'id', width: 80, align: 'center' },
    { title: '姓名', dataIndex: 'name', width: 120 },
    { title: '年龄', dataIndex: 'age', width: 100, sorter: true },
    { title: '邮箱', dataIndex: 'email', ellipsis: true }
  ],
  pagination: { pageSize: 5, show: true }
}

// ==================== 高级示例数据 ====================
const advancedData = ref([
  { id: 1, name: '张三', role: 'admin', department: '技术部', status: 'active', tags: ['前端', 'Vue'], createTime: '2024-01-15' },
  { id: 2, name: '李四', role: 'editor', department: '产品部', status: 'active', tags: ['产品', '设计'], createTime: '2024-02-20' },
  { id: 3, name: '王五', role: 'viewer', department: '运营部', status: 'inactive', tags: ['运营'], createTime: '2024-03-10' },
  { id: 4, name: '赵六', role: 'admin', department: '技术部', status: 'active', tags: ['后端', 'Java'], createTime: '2024-01-25' },
  { id: 5, name: '钱七', role: 'editor', department: '设计部', status: 'active', tags: ['UI', 'UX'], createTime: '2024-04-05' }
])

const advancedSchema: TableSchema = {
  columns: [
    { 
      title: '用户', 
      dataIndex: 'name', 
      width: 150,
      slot: 'user'
    },
    { 
      title: '角色', 
      dataIndex: 'role', 
      width: 120,
      filters: [
        { text: '管理员', value: 'admin' },
        { text: '编辑', value: 'editor' },
        { text: '查看者', value: 'viewer' }
      ]
    },
    { 
      title: '部门', 
      dataIndex: 'department', 
      width: 120 
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      width: 100,
      slot: 'status',
      filters: [
        { text: '启用', value: 'active' },
        { text: '禁用', value: 'inactive' }
      ]
    },
    { 
      title: '标签', 
      dataIndex: 'tags', 
      slot: 'tags'
    },
    { 
      title: '创建时间', 
      dataIndex: 'createTime', 
      width: 120,
      sorter: true
    }
  ],
  pagination: { pageSize: 5, show: true },
  rowSelection: { type: 'checkbox' },
  actions: [
    {
      text: '编辑',
      type: 'primary',
      onClick: (record) => alert(`编辑用户: ${record.name}`)
    },
    {
      text: '删除',
      type: 'danger',
      confirm: true,
      confirmText: '确定要删除该用户吗？',
      onClick: (record) => alert(`删除用户: ${record.name}`)
    }
  ],
  actionWidth: 180,        // 操作列宽
}

// ==================== 选择行示例数据 ====================
const selectionData = ref([
  { id: 1, name: '产品 A', price: 199, stock: 100, category: '电子产品' },
  { id: 2, name: '产品 B', price: 299, stock: 50, category: '电子产品' },
  { id: 3, name: '产品 C', price: 99, stock: 200, category: '配件' },
  { id: 4, name: '产品 D', price: 599, stock: 30, category: '电子产品' },
  { id: 5, name: '产品 E', price: 149, stock: 150, category: '配件' }
])

const selectionSchema: TableSchema = {
  columns: [
    { title: '产品名称', dataIndex: 'name', width: 150 },
    { title: '价格', dataIndex: 'price', width: 100, sorter: true },
    { title: '库存', dataIndex: 'stock', width: 100, sorter: true },
    { title: '分类', dataIndex: 'category', width: 120 }
  ],
  pagination: false,
  rowSelection: { type: 'checkbox' }
}

const selectedRowKeys = ref<(string | number)[]>([])
const selectedRows = ref<any[]>([])

function handleSelectChange(keys: (string | number)[], rows: any[]) {
  selectedRowKeys.value = keys
  selectedRows.value = rows
}

function handleBatchDelete() {
  if (selectedRowKeys.value.length === 0) {
    alert('请先选择要删除的数据')
    return
  }
  alert(`批量删除选中的 ${selectedRowKeys.value.length} 条数据`)
}

// ==================== 展开行示例数据 ====================
const expandData = ref([
  { 
    id: 1, 
    orderNo: 'ORD-2024-001', 
    customer: '张三', 
    amount: 2999, 
    status: 'completed',
    items: [
      { name: '笔记本电脑', price: 5999, quantity: 1 },
      { name: '鼠标', price: 99, quantity: 2 }
    ]
  },
  { 
    id: 2, 
    orderNo: 'ORD-2024-002', 
    customer: '李四', 
    amount: 199, 
    status: 'pending',
    items: [
      { name: '键盘', price: 199, quantity: 1 }
    ]
  },
  { 
    id: 3, 
    orderNo: 'ORD-2024-003', 
    customer: '王五', 
    amount: 899, 
    status: 'completed',
    items: [
      { name: '显示器', price: 899, quantity: 1 },
      { name: 'HDMI线', price: 49, quantity: 1 }
    ]
  }
])

const expandSchema: TableSchema = {
  columns: [
    { title: '订单号', dataIndex: 'orderNo', width: 150 },
    { title: '客户', dataIndex: 'customer', width: 120 },
    { title: '金额', dataIndex: 'amount', width: 100 },
    { title: '状态', dataIndex: 'status', width: 100, slot: 'orderStatus' }
  ],
  pagination: false,
  expandable: {
    expandedRowSlot: 'expandedRow'
  }
}

// ==================== 固定列示例数据 ====================
const fixedData = ref(Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  age: 20 + Math.floor(Math.random() * 20),
  email: `user${i + 1}@example.com`,
  phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
  address: `北京市朝阳区某某街道 ${i + 1} 号`,
  department: ['技术部', '产品部', '运营部', '设计部'][i % 4],
  status: i % 3 === 0 ? 'inactive' : 'active'
})))

const fixedSchema: TableSchema = {
  columns: [
    { title: 'ID', dataIndex: 'id', width: 80, fixed: 'left', align: 'center' },
    { title: '姓名', dataIndex: 'name', width: 120, fixed: 'left' },
    { title: '年龄', dataIndex: 'age', width: 80 },
    { title: '邮箱', dataIndex: 'email', width: 200, ellipsis: true },
    { title: '电话', dataIndex: 'phone', width: 150 },
    { title: '地址', dataIndex: 'address', width: 250, ellipsis: true },
    { title: '部门', dataIndex: 'department', width: 120 }
  ],
  pagination: { pageSize: 10, show: true },
  scroll: { x: 1200 },
  rowSelection: { type: 'checkbox', fixed: true },
  actions: [
    {
      text: '查看',
      type: 'primary',
      onClick: (record) => alert(`查看用户: ${record.name}`)
    },
    {
      text: '编辑',
      type: 'default',
      onClick: (record) => alert(`编辑用户: ${record.name}`)
    }
  ],
  actionFixed: 'right'
}

// ==================== 事件处理 ====================
function handleChange(
  pagination: { current: number; pageSize: number; total: number },
  filters: Record<string, (string | number | boolean)[] | null>,
  sorter: any
) {
  console.log('表格变化:', { pagination, filters, sorter })
}

function handleRowClick(record: any, index: number, _event: MouseEvent) {
  console.log('行点击:', record, index)
}

function handleExpand(expanded: boolean, record: any) {
  console.log('展开行:', expanded, record)
}

function clearSelection() {
  tableRef.value?.clearSelection()
}

// ==================== 树形表格示例数据 ====================
const treeData = ref([
  {
    id: 1,
    name: '技术部',
    manager: '张三',
    count: 45,
    budget: 500000,
    children: [
      {
        id: 11,
        name: '前端组',
        manager: '李四',
        count: 15,
        budget: 150000,
        children: [
          { id: 111, name: 'Web 前端', manager: '王五', count: 8, budget: 80000 },
          { id: 112, name: '移动端', manager: '赵六', count: 7, budget: 70000 }
        ]
      },
      {
        id: 12,
        name: '后端组',
        manager: '孙七',
        count: 20,
        budget: 200000,
        children: [
          { id: 121, name: 'Java 组', manager: '周八', count: 12, budget: 120000 },
          { id: 122, name: 'Go 组', manager: '吴九', count: 8, budget: 80000 }
        ]
      },
      { id: 13, name: '测试组', manager: '郑十', count: 10, budget: 100000 }
    ]
  },
  {
    id: 2,
    name: '产品部',
    manager: '钱十一',
    count: 12,
    budget: 120000,
    children: [
      { id: 21, name: '产品设计', manager: '冯十二', count: 6, budget: 60000 },
      { id: 22, name: '用户研究', manager: '陈十三', count: 6, budget: 60000 }
    ]
  },
  { id: 3, name: '运营部', manager: '褚十四', count: 20, budget: 200000 }
])

const checkStrictly = ref(false)

const treeSchema = computed<TableSchema>(() => ({
  columns: [
    { title: '部门名称', dataIndex: 'name', width: 200 },
    { title: '负责人', dataIndex: 'manager', width: 120 },
    { title: '人数', dataIndex: 'count', width: 100, align: 'center' },
    { 
      title: '预算', 
      dataIndex: 'budget', 
      width: 150,
      customRender: ({ text }) => `¥${text?.toLocaleString()}`
    }
  ],
  pagination: false,
  rowSelection: { 
    type: 'checkbox',
    checkStrictly: checkStrictly.value
  },
  indentSize: 20
}))

const treeSelectedKeys = ref<(string | number)[]>([])
const treeSelectedRows = ref<any[]>([])

function handleTreeSelectChange(keys: (string | number)[], rows: any[]) {
  treeSelectedKeys.value = keys
  treeSelectedRows.value = rows
}
</script>

<template>
  <div class="space-y-6 p-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-3xl font-bold">TTable 组件演示</h1>
      <p class="text-muted-foreground mt-1">
        基于 antdv-next 的 JSON 配置化表格组件
      </p>
    </div>

    <!-- 标签页切换不同示例 -->
    <Tabs default-value="basic" class="w-full">
      <TabsList class="grid w-full grid-cols-6">
        <TabsTrigger value="basic">基础用法</TabsTrigger>
        <TabsTrigger value="advanced">高级功能</TabsTrigger>
        <TabsTrigger value="selection">行选择</TabsTrigger>
        <TabsTrigger value="expand">展开行</TabsTrigger>
        <TabsTrigger value="fixed">固定列</TabsTrigger>
        <TabsTrigger value="tree">树形表格</TabsTrigger>
      </TabsList>

      <!-- 基础用法 -->
      <TabsContent value="basic">
        <Card>
          <CardHeader>
            <CardTitle>基础表格</CardTitle>
            <CardDescription>
              展示基本的表格数据和分页功能
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TTable
              v-model:data="basicData"
              :schema="basicSchema"
              @change="handleChange"
              @row-click="handleRowClick"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 高级功能 -->
      <TabsContent value="advanced">
        <Card>
          <CardHeader>
            <CardTitle>高级功能</CardTitle>
            <CardDescription>
              展示排序、筛选、行选择、操作列和自定义插槽
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TTable
              v-model:data="advancedData"
              :schema="advancedSchema"
              @change="handleChange"
              @select-change="handleSelectChange"
            >
              <!-- 自定义用户列 -->
              <template #user="slotProps">
                <Space>
                  <Avatar :style="{ backgroundColor: (slotProps as any).record.status === 'active' ? '#87d068' : '#ccc' }">
                    {{ (slotProps as any).text.charAt(0) }}
                  </Avatar>
                  <span>{{ (slotProps as any).text }}</span>
                </Space>
              </template>

              <!-- 自定义状态列 -->
              <template #status="slotProps">
                <Badge :variant="(slotProps as any).text === 'active' ? 'default' : 'secondary'">
                  {{ (slotProps as any).text === 'active' ? '启用' : '禁用' }}
                </Badge>
              </template>

              <!-- 自定义标签列 -->
              <template #tags="slotProps">
                <Space>
                  <Tag v-for="tag in (slotProps as any).text" :key="tag" color="blue">{{ tag }}</Tag>
                </Space>
              </template>
            </TTable>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 行选择 -->
      <TabsContent value="selection">
        <Card>
          <CardHeader>
            <CardTitle>行选择</CardTitle>
            <CardDescription>
              展示多选功能和批量操作
            </CardDescription>
          </CardHeader>
          <CardContent>
            <!-- 批量操作按钮 -->
            <div class="mb-4 flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                :disabled="selectedRowKeys.length === 0"
                @click="handleBatchDelete"
              >
                批量删除 ({{ selectedRowKeys.length }})
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                @click="clearSelection"
              >
                清空选择
              </Button>
            </div>

            <TTable
              ref="tableRef"
              v-model:data="selectionData"
              :schema="selectionSchema"
              @select-change="handleSelectChange"
            />

            <!-- 选中数据展示 -->
            <div class="mt-4 p-4 bg-muted rounded-lg">
              <h4 class="text-sm font-medium mb-2">已选中的数据：</h4>
              <pre class="text-xs text-muted-foreground">{{ JSON.stringify(selectedRowKeys, null, 2) }}</pre>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 展开行 -->
      <TabsContent value="expand">
        <Card>
          <CardHeader>
            <CardTitle>展开行</CardTitle>
            <CardDescription>
              展示可展开行显示详细信息的功能
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TTable
              v-model:data="expandData"
              :schema="expandSchema"
              @expand="handleExpand"
            >
              <!-- 自定义订单状态 -->
              <template #orderStatus="slotProps">
                <Tag :color="(slotProps as any).text === 'completed' ? 'success' : 'warning'">
                  {{ (slotProps as any).text === 'completed' ? '已完成' : '待处理' }}
                </Tag>
              </template>

              <!-- 展开行内容 -->
              <template #expandedRow="{ record }">
                <div class="p-4 bg-muted/50">
                  <h4 class="font-medium mb-2">订单明细</h4>
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-b">
                        <th class="text-left py-2">商品名称</th>
                        <th class="text-right py-2">单价</th>
                        <th class="text-right py-2">数量</th>
                        <th class="text-right py-2">小计</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in record.items" :key="item.name" class="border-b">
                        <td class="py-2">{{ item.name }}</td>
                        <td class="text-right py-2">¥{{ item.price }}</td>
                        <td class="text-right py-2">{{ item.quantity }}</td>
                        <td class="text-right py-2">¥{{ item.price * item.quantity }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </TTable>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 固定列 -->
      <TabsContent value="fixed">
        <Card>
          <CardHeader>
            <CardTitle>固定列</CardTitle>
            <CardDescription>
              展示固定左右列和横向滚动功能
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TTable
              v-model:data="fixedData"
              :schema="fixedSchema"
              @change="handleChange"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 树形表格 -->
      <TabsContent value="tree">
        <Card>
          <CardHeader>
            <CardTitle>树形表格</CardTitle>
            <CardDescription>
              展示树形层级数据结构，支持父子节点选择联动
            </CardDescription>
          </CardHeader>
          <CardContent>
            <!-- 控制选项 -->
            <div class="mb-4 flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium">严格独立选择:</span>
                <Switch v-model:checked="checkStrictly" size="small" />
                <span class="text-xs text-muted-foreground">
                  {{ checkStrictly ? '父子节点选择互不影响' : '选择父节点自动选中子节点' }}
                </span>
              </div>
            </div>

            <TTable
              v-model:data="treeData"
              :schema="treeSchema"
              @select-change="handleTreeSelectChange"
            />

            <!-- 选中数据展示 -->
            <div class="mt-4 p-4 bg-muted rounded-lg">
              <h4 class="text-sm font-medium mb-2">已选中的部门（{{ treeSelectedKeys.length }} 个）:</h4>
              <div class="flex flex-wrap gap-2">
                <Badge v-for="key in treeSelectedKeys" :key="key" variant="secondary">
                  ID: {{ key }}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <!-- 特性说明 -->
    <Card>
      <CardHeader>
        <CardTitle>组件特性</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">JSON 配置驱动</h4>
            <p class="text-sm text-muted-foreground">
              通过 Schema 配置表格结构，无需编写大量模板代码
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">丰富的列配置</h4>
            <p class="text-sm text-muted-foreground">
              支持排序、筛选、固定列、自定义渲染等功能
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">行选择</h4>
            <p class="text-sm text-muted-foreground">
              支持单选/多选，提供完整的选中状态管理
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">操作列</h4>
            <p class="text-sm text-muted-foreground">
              内置操作按钮配置，支持确认对话框
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">展开行</h4>
            <p class="text-sm text-muted-foreground">
              支持展开行显示详细信息，支持自定义渲染
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">树形数据</h4>
            <p class="text-sm text-muted-foreground">
              支持树形层级数据展示，支持父子节点选择联动
            </p>
          </div>
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">主题对齐</h4>
            <p class="text-sm text-muted-foreground">
              样式与 shadcn-vue 主题保持一致
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
