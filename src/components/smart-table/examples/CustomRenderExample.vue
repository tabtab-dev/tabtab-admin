<script setup lang="ts">
import { ref, h } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Star,
  TrendingUp,
  TrendingDown,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Activity,
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
 * 列配置 - 展示各种自定义渲染方式
 */
const columns: SmartTableColumn<Employee>[] = [
  // 1. 头像 + 姓名组合渲染
  {
    key: 'name',
    title: '员工信息',
    accessorKey: 'name',
    width: 200,
    cell: ({ row, value }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(Avatar, { class: 'h-10 w-10' }, () => [
          h(AvatarImage, { src: row.avatar, alt: value as string }),
          h(AvatarFallback, {}, () => (value as string).slice(0, 1)),
        ]),
        h('div', { class: 'flex flex-col' }, [
          h('span', { class: 'font-medium text-sm' }, value as string),
          h('span', { class: 'text-xs text-muted-foreground' }, row.position),
        ]),
      ])
    },
  },

  // 2. 联系方式 - 带图标的渲染
  {
    key: 'contact',
    title: '联系方式',
    accessorKey: 'email',
    width: 180,
    cell: ({ row }) => {
      return h('div', { class: 'flex flex-col gap-1' }, [
        h('div', { class: 'flex items-center gap-1.5 text-xs' }, [
          h(Mail, { class: 'h-3 w-3 text-muted-foreground' }),
          h('span', { class: 'text-muted-foreground truncate max-w-[140px]' }, row.email),
        ]),
        h('div', { class: 'flex items-center gap-1.5 text-xs' }, [
          h(Phone, { class: 'h-3 w-3 text-muted-foreground' }),
          h('span', { class: 'text-muted-foreground' }, row.phone),
        ]),
      ])
    },
  },

  // 3. 部门 - Badge 标签渲染
  {
    key: 'department',
    title: '部门',
    accessorKey: 'department',
    width: 100,
    cell: ({ value }) => {
      const deptColors: Record<string, string> = {
        '技术部': 'bg-blue-100 text-blue-800 border-blue-200',
        '产品部': 'bg-green-100 text-green-800 border-green-200',
        '设计部': 'bg-purple-100 text-purple-800 border-purple-200',
        '销售部': 'bg-orange-100 text-orange-800 border-orange-200',
      }
      return h(Badge, {
        variant: 'outline',
        class: `text-xs ${deptColors[value as string] || 'bg-gray-100'}`,
      }, () => value as string)
    },
  },

  // 4. 薪资 - 格式化货币渲染
  {
    key: 'salary',
    title: '薪资',
    accessorKey: 'salary',
    sortable: true,
    width: 120,
    align: 'right',
    cell: ({ value }) => {
      const salary = value as number
      return h('div', { class: 'flex items-center justify-end gap-1' }, [
        h(DollarSign, { class: 'h-3.5 w-3.5 text-muted-foreground' }),
        h('span', { class: 'font-medium' }, salary.toLocaleString()),
      ])
    },
  },

  // 5. 绩效 - 进度条 + 评分渲染
  {
    key: 'performance',
    title: '绩效评分',
    accessorKey: 'performance',
    sortable: true,
    width: 140,
    cell: ({ value }) => {
      const score = value as number
      let color = 'bg-green-500'
      if (score < 80) color = 'bg-yellow-500'
      if (score < 60) color = 'bg-red-500'

      return h('div', { class: 'flex flex-col gap-1.5' }, [
        h('div', { class: 'flex items-center justify-between' }, [
          h('div', { class: 'flex items-center gap-1' }, [
            h(Star, { class: 'h-3 w-3 text-yellow-500 fill-yellow-500' }),
            h('span', { class: 'text-sm font-medium' }, score),
          ]),
          h('span', { class: 'text-xs text-muted-foreground' }, [
            score >= 90 ? '优秀' : score >= 80 ? '良好' : score >= 60 ? '合格' : '待改进',
          ]),
        ]),
        h('div', { class: 'h-1.5 w-full bg-muted rounded-full overflow-hidden' }, [
          h('div', {
            class: `h-full ${color} transition-all`,
            style: { width: `${score}%` },
          }),
        ]),
      ])
    },
  },

  // 6. 状态 - 带图标的状态渲染
  {
    key: 'status',
    title: '状态',
    accessorKey: 'status',
    sortable: true,
    width: 100,
    align: 'center',
    cell: ({ value }) => {
      const statusConfig: Record<string, { label: string; icon: any; class: string }> = {
        'active': {
          label: '在职',
          icon: Activity,
          class: 'text-green-600 bg-green-50 border-green-200',
        },
        'on_leave': {
          label: '休假',
          icon: Calendar,
          class: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        },
        'resigned': {
          label: '离职',
          icon: MapPin,
          class: 'text-red-600 bg-red-50 border-red-200',
        },
      }
      const config = statusConfig[value as string]
      return h(Badge, {
        variant: 'outline',
        class: `text-xs flex items-center gap-1 justify-center ${config.class}`,
      }, () => [
        h(config.icon, { class: 'h-3 w-3' }),
        config.label,
      ])
    },
  },

  // 7. 技能标签 - 多标签渲染
  {
    key: 'skills',
    title: '技能标签',
    accessorKey: 'skills',
    width: 200,
    cell: ({ value }) => {
      const skills = value as string[]
      return h('div', { class: 'flex flex-wrap gap-1' },
        skills.slice(0, 3).map(skill =>
          h(Badge, {
            variant: 'secondary',
            class: 'text-[10px] px-1.5 py-0',
          }, () => skill)
        ).concat(skills.length > 3
          ? [h(Badge, { variant: 'outline', class: 'text-[10px] px-1.5 py-0' }, () => `+${skills.length - 3}`)]
          : []
        )
      )
    },
  },

  // 8. 入职时间 - 带 Tooltip 的渲染
  {
    key: 'joinDate',
    title: '入职时间',
    accessorKey: 'joinDate',
    sortable: true,
    width: 120,
    cell: ({ value, row }) => {
      const joinDate = new Date(value as string)
      const now = new Date()
      const years = now.getFullYear() - joinDate.getFullYear()

      return h(TooltipProvider, {}, () =>
        h(Tooltip, {}, () => [
          h(TooltipTrigger, { asChild: true }, () =>
            h('div', { class: 'flex items-center gap-1.5 cursor-help' }, [
              h(Calendar, { class: 'h-3.5 w-3.5 text-muted-foreground' }),
              h('span', { class: 'text-sm' }, value as string),
            ])
          ),
          h(TooltipContent, {}, () =>
            h('div', { class: 'text-xs' }, [
              h('p', {}, `入职日期: ${value}`),
              h('p', { class: 'text-muted-foreground mt-1' }, `工龄: ${years} 年`),
              h('p', { class: 'text-muted-foreground' }, `直属上级: ${row.manager}`),
            ])
          ),
        ])
      )
    },
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
</script>

<template>
  <div class="space-y-4 p-6">
    <div>
      <h2 class="text-2xl font-bold">自定义列渲染示例</h2>
      <p class="text-muted-foreground mt-1">
        展示各种自定义列渲染方式：头像组合、图标+文本、进度条、Badge标签、Tooltip等
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
    </SmartTable>
  </div>
</template>
