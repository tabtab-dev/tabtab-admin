import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';

export interface Order {
  id: string;
  orderNo: string;
  customer: string;
  email: string;
  phone: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
  items: number;
  address: string;
  note?: string;
}

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([
    {
      id: '1',
      orderNo: 'ORD-2024-001',
      customer: '张三',
      email: 'zhangsan@example.com',
      phone: '13800138001',
      total: 299.00,
      status: 'completed',
      date: '2024-02-01',
      items: 3,
      address: '北京市朝阳区xxx街道',
      note: '请尽快发货'
    },
    {
      id: '2',
      orderNo: 'ORD-2024-002',
      customer: '李四',
      email: 'lisi@example.com',
      phone: '13800138002',
      total: 599.00,
      status: 'pending',
      date: '2024-02-02',
      items: 5,
      address: '上海市浦东新区xxx路'
    },
    {
      id: '3',
      orderNo: 'ORD-2024-003',
      customer: '王五',
      email: 'wangwu@example.com',
      phone: '13800138003',
      total: 199.00,
      status: 'processing',
      date: '2024-02-02',
      items: 2,
      address: '广州市天河区xxx街'
    },
    {
      id: '4',
      orderNo: 'ORD-2024-004',
      customer: '赵六',
      email: 'zhaoliu@example.com',
      phone: '13800138004',
      total: 899.00,
      status: 'cancelled',
      date: '2024-02-01',
      items: 8,
      address: '深圳市南山区xxx大道',
      note: '客户取消订单'
    },
    {
      id: '5',
      orderNo: 'ORD-2024-005',
      customer: '孙七',
      email: 'sunqi@example.com',
      phone: '13800138005',
      total: 449.00,
      status: 'completed',
      date: '2024-02-03',
      items: 4,
      address: '杭州市西湖区xxx路'
    }
  ]);

  const isLoading = ref(false);
  const searchQuery = ref('');
  const statusFilter = ref('');
  const currentPage = ref(1);
  const pageSize = ref(10);

  // 统计
  const statistics = computed(() => {
    const total = orders.value.length;
    const pending = orders.value.filter(o => o.status === 'pending').length;
    const processing = orders.value.filter(o => o.status === 'processing').length;
    const completed = orders.value.filter(o => o.status === 'completed').length;
    const cancelled = orders.value.filter(o => o.status === 'cancelled').length;
    const totalAmount = orders.value
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    return {
      total,
      pending,
      processing,
      completed,
      cancelled,
      totalAmount
    };
  });

  // 过滤后的订单
  const filteredOrders = computed(() => {
    let result = orders.value;

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        order =>
          order.orderNo.toLowerCase().includes(query) ||
          order.customer.toLowerCase().includes(query) ||
          order.email.toLowerCase().includes(query) ||
          order.phone.includes(query)
      );
    }

    if (statusFilter.value) {
      result = result.filter(order => order.status === statusFilter.value);
    }

    return result;
  });

  // 分页订单
  const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredOrders.value.slice(start, end);
  });

  const totalPages = computed(() => {
    return Math.ceil(filteredOrders.value.length / pageSize.value);
  });

  // 添加订单
  const addOrder = (order: Omit<Order, 'id' | 'orderNo' | 'date'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      orderNo: `ORD-2024-${String(orders.value.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0]
    };
    orders.value.unshift(newOrder);
  };

  // 更新订单
  const updateOrder = (id: string, updates: Partial<Order>) => {
    const index = orders.value.findIndex(o => o.id === id);
    if (index !== -1) {
      orders.value[index] = { ...orders.value[index]!, ...updates } as Order;
    }
  };

  // 删除订单
  const deleteOrder = (id: string) => {
    orders.value = orders.value.filter(o => o.id !== id);
  };

  // 批量删除
  const batchDeleteOrders = (ids: string[]) => {
    orders.value = orders.value.filter(o => !ids.includes(o.id));
  };

  // 获取订单
  const getOrderById = (id: string) => {
    return orders.value.find(o => o.id === id);
  };

  // 更新订单状态
  const updateOrderStatus = (id: string, status: Order['status']) => {
    const order = getOrderById(id);
    if (order) {
      order.status = status;
    }
  };

  return {
    orders,
    isLoading,
    searchQuery,
    statusFilter,
    currentPage,
    pageSize,
    statistics,
    filteredOrders,
    paginatedOrders,
    totalPages,
    addOrder,
    updateOrder,
    deleteOrder,
    batchDeleteOrders,
    getOrderById,
    updateOrderStatus
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOrdersStore, import.meta.hot));
}
