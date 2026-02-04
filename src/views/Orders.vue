<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Package, CheckCircle, XCircle, Clock } from 'lucide-vue-next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const searchQuery = ref('');
const statusFilter = ref('all');

const orders = ref([
  {
    id: 'ORD-001',
    customer: '张三',
    email: 'zhangsan@example.com',
    total: 299.00,
    status: 'completed',
    date: '2024-02-01',
    items: 3
  },
  {
    id: 'ORD-002',
    customer: '李四',
    email: 'lisi@example.com',
    total: 599.00,
    status: 'pending',
    date: '2024-02-02',
    items: 5
  },
  {
    id: 'ORD-003',
    customer: '王五',
    email: 'wangwu@example.com',
    total: 199.00,
    status: 'processing',
    date: '2024-02-02',
    items: 2
  },
  {
    id: 'ORD-004',
    customer: '赵六',
    email: 'zhaoliu@example.com',
    total: 899.00,
    status: 'cancelled',
    date: '2024-02-01',
    items: 8
  },
  {
    id: 'ORD-005',
    customer: '孙七',
    email: 'sunqi@example.com',
    total: 449.00,
    status: 'completed',
    date: '2024-02-03',
    items: 4
  }
]);

const statusConfig = {
  completed: { label: '已完成', icon: CheckCircle, class: 'bg-green-500/10 text-green-500 border-green-500/20' },
  pending: { label: '待处理', icon: Clock, class: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  processing: { label: '处理中', icon: Package, class: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  cancelled: { label: '已取消', icon: XCircle, class: 'bg-red-500/10 text-red-500 border-red-500/20' }
};

const filteredOrders = ref(orders.value);
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">订单管理</h1>
        <p class="text-muted-foreground mt-1">查看和管理所有订单</p>
      </div>
      <Button>
        <Package class="h-4 w-4 mr-2" />
        导出订单
      </Button>
    </div>

    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>订单列表</CardTitle>
          <div class="flex items-center gap-2">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                v-model="searchQuery"
                placeholder="搜索订单..."
                class="pl-9 w-64"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border">
          <table class="w-full">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="text-left p-4 font-medium">订单号</th>
                <th class="text-left p-4 font-medium">客户</th>
                <th class="text-left p-4 font-medium">商品数量</th>
                <th class="text-left p-4 font-medium">金额</th>
                <th class="text-left p-4 font-medium">状态</th>
                <th class="text-left p-4 font-medium">日期</th>
                <th class="text-right p-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in filteredOrders"
                :key="order.id"
                class="border-b hover:bg-muted/50 transition-colors"
              >
                <td class="p-4 font-medium">{{ order.id }}</td>
                <td class="p-4">
                  <div>
                    <p class="font-medium">{{ order.customer }}</p>
                    <p class="text-sm text-muted-foreground">{{ order.email }}</p>
                  </div>
                </td>
                <td class="p-4">{{ order.items }} 件</td>
                <td class="p-4 font-medium">${{ order.total.toFixed(2) }}</td>
                <td class="p-4">
                  <Badge :class="statusConfig[order.status].class" variant="outline" class="flex items-center gap-1 w-fit">
                    <component :is="statusConfig[order.status].icon" class="h-3 w-3" />
                    {{ statusConfig[order.status].label }}
                  </Badge>
                </td>
                <td class="p-4 text-muted-foreground">{{ order.date }}</td>
                <td class="p-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye class="h-4 w-4 mr-2" />
                        查看详情
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit class="h-4 w-4 mr-2" />
                        编辑订单
                      </DropdownMenuItem>
                      <DropdownMenuItem class="text-red-500">
                        <Trash2 class="h-4 w-4 mr-2" />
                        删除订单
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
              <tr v-if="filteredOrders.length === 0">
                <td colspan="7" class="p-8 text-center text-muted-foreground">
                  未找到订单
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
