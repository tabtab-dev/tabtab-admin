<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2, Package, TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-vue-next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const searchQuery = ref('');

const products = ref([
  {
    id: 'SKU-001',
    name: '高级无线耳机',
    category: '电子产品',
    price: 299.00,
    stock: 45,
    status: 'active',
    sales: 128
  },
  {
    id: 'SKU-002',
    name: '智能手表 Pro',
    category: '电子产品',
    price: 599.00,
    stock: 23,
    status: 'active',
    sales: 87
  },
  {
    id: 'SKU-003',
    name: '便携式充电宝',
    category: '配件',
    price: 49.00,
    stock: 156,
    status: 'active',
    sales: 342
  },
  {
    id: 'SKU-004',
    name: '蓝牙音箱',
    category: '音频设备',
    price: 129.00,
    stock: 8,
    status: 'low-stock',
    sales: 56
  },
  {
    id: 'SKU-005',
    name: 'USB-C 数据线',
    category: '配件',
    price: 19.00,
    stock: 0,
    status: 'out-of-stock',
    sales: 421
  }
]);

const statusConfig = {
  'active': { label: '在售', class: 'bg-green-500/10 text-green-500 border-green-500/20' },
  'low-stock': { label: '库存不足', class: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  'out-of-stock': { label: '缺货', class: 'bg-red-500/10 text-red-500 border-red-500/20' }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">商品管理</h1>
        <p class="text-muted-foreground mt-1">管理商品库存和价格</p>
      </div>
      <Button>
        <Plus class="h-4 w-4 mr-2" />
        添加商品
      </Button>
    </div>

    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>商品列表</CardTitle>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              placeholder="搜索商品..."
              class="pl-9 w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border">
          <table class="w-full">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="text-left p-4 font-medium">商品信息</th>
                <th class="text-left p-4 font-medium">分类</th>
                <th class="text-left p-4 font-medium">价格</th>
                <th class="text-left p-4 font-medium">库存</th>
                <th class="text-left p-4 font-medium">销量</th>
                <th class="text-left p-4 font-medium">状态</th>
                <th class="text-right p-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="product in products"
                :key="product.id"
                class="border-b hover:bg-muted/50 transition-colors"
              >
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Package class="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p class="font-medium">{{ product.name }}</p>
                      <p class="text-sm text-muted-foreground">{{ product.id }}</p>
                    </div>
                  </div>
                </td>
                <td class="p-4">{{ product.category }}</td>
                <td class="p-4 font-medium">${{ product.price.toFixed(2) }}</td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ product.stock }}</span>
                    <component
                      :is="product.stock < 10 ? TrendingDown : TrendingUp"
                      class="h-4 w-4"
                      :class="product.stock < 10 ? 'text-red-500' : 'text-green-500'"
                    />
                  </div>
                </td>
                <td class="p-4">{{ product.sales }}</td>
                <td class="p-4">
                  <Badge :class="statusConfig[product.status].class" variant="outline">
                    {{ statusConfig[product.status].label }}
                  </Badge>
                </td>
                <td class="p-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit class="h-4 w-4 mr-2" />
                        编辑商品
                      </DropdownMenuItem>
                      <DropdownMenuItem class="text-red-500">
                        <Trash2 class="h-4 w-4 mr-2" />
                        删除商品
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="7" class="p-8 text-center text-muted-foreground">
                  未找到商品
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
