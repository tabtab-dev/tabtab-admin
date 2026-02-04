<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Star,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Users,
  Activity,
  MapPin,
} from 'lucide-vue-next'
import { SmartTable } from '@/components/smart-table'
import type { SmartTableColumn } from '@/components/smart-table'

/**
 * 员工数据类型
 */
interface Employee {
  id: string
  name: string
  avatar: string
  email: string
  phone: string
  department: string
  position: string
  salary: number
  performance: number
  status: 'active' | 'on_leave' | 'resigned'
  joinDate: string
  skills: string[]
  manager: string
}

/**
 * 表格数据
 */
const tableData = ref<Employee[]>([
  {
    id: '1',
    name: '张三',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    email: 'zhangsan@company.com',
    phone: '13800138001',
    department: '技术部',
    position: '高级工程师',
    salary: 25000,
    performance: 92,
    status: 'active',
    joinDate: '2020-03-15',
    skills: ['Vue', 'TypeScript', 'Node.js'],
    manager: '李总监',
  },
  {
    id: '2',
    name: '李四',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    email: 'lisi@company.com',
    phone: '13800138002',
    department: '产品部',
    position: '产品经理',
    salary: 22000,
    performance: 88,
    status: 'active',
    joinDate: '2019-06-20',
    skills: ['产品设计', '数据分析', '项目管理'],
    manager: '王总监',
  },
  {
    id: '3',
    name: '王五',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    email: 'wangwu@company.com',
    phone: '13800138003',
    department: '设计部',
    position: 'UI设计师',
    salary: 18000,
    performance: 75,
    status: 'on_leave',
    joinDate: '2021-01-10',
    skills: ['Figma', 'Sketch', 'Photoshop'],
    manager: '赵总监',
  },
  {
    id: '4',
    name: '赵六',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    email: 'zhaoliu@company.com',
    phone: '13800138004',
    department: '技术部',
    position: '前端开发',
    salary: 20000,
    performance: 85,
    status: 'active',
    joinDate: '2021-08-15',
    skills: ['React', 'JavaScript', 'CSS'],
    manager: '李总监',
  },
  {
    id: '5',
    name: '钱七',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    email: 'qianqi@company.com',
    phone: '13800138005',
    department: '销售部',
    position: '销售经理',
    salary: 28000,
    performance: 95,
    status: 'active',
    joinDate: '2018-11-01',
    skills: ['客户管理', '谈判技巧', '市场分析'],
    manager: '孙总监',
  },
])

/**
 * 分页配置
 */
const pagination = ref({
  pageIndex: 1,
  pageSize: 5,
  total: 5,
  pageSizeOptions: [5, 10, 20],
  show: true,
})

/**
 * 列配置 - 只配置基础信息，不配置 cell 函数
 */
const columns: SmartTableColumn<Employee>[] = [
  {
    key: 'name',
    title: '员工信息',
    accessorKey: 'name',
    width: 200,
  },
  {
    key: 'contact',
    title: '联系方式',
    accessorKey: 'email',
    width: 180,
  },
  {
    key: 'department',
    title: '部门',
    accessorKey: 'department',
    width: 100,
  },
  {
    key: 'salary',
    title: '薪资',
    accessorKey: 'salary',
    sortable: true,
    width: 120,
    align: 'right',
  },
  {
    key: 'performance',
    title: '绩效评分',
    accessorKey: 'performance',
    sortable: true,
    width: 140,
  },
  {
    key: 'status',
    title: '状态',
    accessorKey: 'status',
    sortable: true,
    width: 100,
    align: 'center',
  },
  {
    key: 'skills',
    title: '技能标签',
    accessorKey: 'skills',
    width: 200,
  },
  {
    key: 'joinDate',
    title: '入职时间',
    accessorKey: 'joinDate',
    sortable: true,
    width: 120,
  },
]

/**
 * 加载状态
 */
const loading = ref(false)

/**
 * 处理分页变化
 */
function handlePageChange(newPagination: any) {
  pagination.value.pageIndex = newPagination.pageIndex + 1
  pagination.value.pageSize = newPagination.pageSize
}

/**
 * 处理排序变化
 */
function handleSortChange(sorting: any) {
  console.log('排序变化:', sorting)
}

/**
 * 处理刷新
 */
function handleRefresh() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

/**
 * 获取部门颜色
 */
function getDeptColor(dept: string) {
  const colors: Record<string, string> = {
    '技术部': 'bg-blue-100 text-blue-800 border-blue-200',
    '产品部': 'bg-green-100 text-green-800 border-green-200',
    '设计部': 'bg-purple-100 text-purple-800 border-purple-200',
    '销售部': 'bg-orange-100 text-orange-800 border-orange-200',
  }
  return colors[dept] || 'bg-gray-100'
}

/**
 * 获取状态配置
 */
function getStatusConfig(status: string) {
  const configs: Record<string, { label: string; class: string }> = {
    'active': { label: '在职', class: 'text-green-600 bg-green-50 border-green-200' },
    'on_leave': { label: '休假', class: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    'resigned': { label: '离职', class: 'text-red-600 bg-red-50 border-red-200' },
  }
  return configs[status] || { label: status, class: '' }
}

/**
 * 获取绩效颜色
 */
function getPerformanceColor(score: number) {
  if (score >= 90) return 'bg-green-500'
  if (score >= 80) return 'bg-blue-500'
  if (score >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

/**
 * 获取绩效等级
 */
function getPerformanceLevel(score: number) {
  if (score >= 90) return '优秀'
  if (score >= 80) return '良好'
  if (score >= 60) return '合格'
  return '待改进'
}

/**
 * 计算工龄
 */
function getWorkYears(joinDate: string) {
  const join = new Date(joinDate)
  const now = new Date()
  return now.getFullYear() - join.getFullYear()
}
</script>

<template>
  <div class="space-y-4 p-6">
    <div>
      <h2 class="text-2xl font-bold">插槽渲染示例</h2>
      <p class="text-muted-foreground mt-1">
        使用 Vue 模板插槽（slot）自定义列渲染，无需使用 h() 函数
      </p>
    </div>

    <!-- 表格 -->
    <SmartTable
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
      :selectable="true"
      stripe
      @page-change="handlePageChange"
      @sort-change="handleSortChange"
      @refresh="handleRefresh"
    >
      <!-- 工具栏 -->
      <template #toolbar>
        <Button size="sm">
          <Users class="h-4 w-4 mr-1" />
          新增员工
        </Button>
      </template>

      <!-- 员工信息列 - 使用 cell-name 插槽 -->
      <template #cell-name="{ row, value }">
        <div class="flex items-center gap-3">
          <Avatar class="h-10 w-10">
            <AvatarImage :src="row.avatar" :alt="value" />
            <AvatarFallback>{{ value.slice(0, 1) }}</AvatarFallback>
          </Avatar>
          <div class="flex flex-col">
            <span class="font-medium text-sm">{{ value }}</span>
            <span class="text-xs text-muted-foreground">{{ row.position }}</span>
          </div>
        </div>
      </template>

      <!-- 联系方式列 - 使用 cell-contact 插槽 -->
      <template #cell-contact="{ row }">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-1.5 text-xs">
            <Mail class="h-3 w-3 text-muted-foreground" />
            <span class="text-muted-foreground truncate max-w-[140px]">{{ row.email }}</span>
          </div>
          <div class="flex items-center gap-1.5 text-xs">
            <Phone class="h-3 w-3 text-muted-foreground" />
            <span class="text-muted-foreground">{{ row.phone }}</span>
          </div>
        </div>
      </template>

      <!-- 部门列 - 使用 cell-department 插槽 -->
      <template #cell-department="{ value }">
        <Badge variant="outline" :class="`text-xs ${getDeptColor(value)}`">
          {{ value }}
        </Badge>
      </template>

      <!-- 薪资列 - 使用 cell-salary 插槽 -->
      <template #cell-salary="{ value }">
        <div class="flex items-center justify-end gap-1">
          <DollarSign class="h-3.5 w-3.5 text-muted-foreground" />
          <span class="font-medium">{{ value.toLocaleString() }}</span>
        </div>
      </template>

      <!-- 绩效评分列 - 使用 cell-performance 插槽 -->
      <template #cell-performance="{ value }">
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1">
              <Star class="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <span class="text-sm font-medium">{{ value }}</span>
            </div>
            <span class="text-xs text-muted-foreground">
              {{ getPerformanceLevel(value) }}
            </span>
          </div>
          <div class="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              class="h-full transition-all"
              :class="getPerformanceColor(value)"
              :style="{ width: `${value}%` }"
            />
          </div>
        </div>
      </template>

      <!-- 状态列 - 使用 cell-status 插槽 -->
      <template #cell-status="{ value }">
        <Badge
          variant="outline"
          :class="`text-xs flex items-center gap-1 justify-center ${getStatusConfig(value).class}`"
        >
          <Activity class="h-3 w-3" />
          {{ getStatusConfig(value).label }}
        </Badge>
      </template>

      <!-- 技能标签列 - 使用 cell-skills 插槽 -->
      <template #cell-skills="{ value }">
        <div class="flex flex-wrap gap-1">
          <Badge
            v-for="skill in value.slice(0, 3)"
            :key="skill"
            variant="secondary"
            class="text-[10px] px-1.5 py-0"
          >
            {{ skill }}
          </Badge>
          <Badge
            v-if="value.length > 3"
            variant="outline"
            class="text-[10px] px-1.5 py-0"
          >
            +{{ value.length - 3 }}
          </Badge>
        </div>
      </template>

      <!-- 入职时间列 - 使用 cell-joinDate 插槽 -->
      <template #cell-joinDate="{ value, row }">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <div class="flex items-center gap-1.5 cursor-help">
                <Calendar class="h-3.5 w-3.5 text-muted-foreground" />
                <span class="text-sm">{{ value }}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div class="text-xs">
                <p>入职日期: {{ value }}</p>
                <p class="text-muted-foreground mt-1">工龄: {{ getWorkYears(value) }} 年</p>
                <p class="text-muted-foreground">直属上级: {{ row.manager }}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </template>
    </SmartTable>
  </div>
</template>
