import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  manager: string;
  phone: string;
  status: 'active' | 'inactive';
  productCount: number;
  capacity: number;
  usedCapacity: number;
}

export interface StockItem {
  id: string;
  productName: string;
  sku: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  reserved: number;
  available: number;
  minStock: number;
  maxStock: number;
  lastUpdated: string;
}

export const useInventoryStore = defineStore('inventory', () => {
  // 仓库数据
  const warehouses = ref<Warehouse[]>([
    {
      id: '1',
      name: '北京仓库',
      code: 'BJ-001',
      location: '北京市朝阳区',
      manager: '张三',
      phone: '13800138001',
      status: 'active',
      productCount: 156,
      capacity: 10000,
      usedCapacity: 6500
    },
    {
      id: '2',
      name: '上海仓库',
      code: 'SH-001',
      location: '上海市浦东新区',
      manager: '李四',
      phone: '13800138002',
      status: 'active',
      productCount: 128,
      capacity: 8000,
      usedCapacity: 4800
    },
    {
      id: '3',
      name: '广州仓库',
      code: 'GZ-001',
      location: '广州市天河区',
      manager: '王五',
      phone: '13800138003',
      status: 'inactive',
      productCount: 0,
      capacity: 5000,
      usedCapacity: 0
    }
  ]);

  // 库存数据
  const stockItems = ref<StockItem[]>([
    {
      id: '1',
      productName: '高级无线耳机',
      sku: 'SKU-001',
      warehouseId: '1',
      warehouseName: '北京仓库',
      quantity: 45,
      reserved: 5,
      available: 40,
      minStock: 10,
      maxStock: 100,
      lastUpdated: '2024-02-01'
    },
    {
      id: '2',
      productName: '智能手表 Pro',
      sku: 'SKU-002',
      warehouseId: '1',
      warehouseName: '北京仓库',
      quantity: 23,
      reserved: 3,
      available: 20,
      minStock: 15,
      maxStock: 80,
      lastUpdated: '2024-02-01'
    },
    {
      id: '3',
      productName: '便携式充电宝',
      sku: 'SKU-003',
      warehouseId: '2',
      warehouseName: '上海仓库',
      quantity: 156,
      reserved: 20,
      available: 136,
      minStock: 50,
      maxStock: 300,
      lastUpdated: '2024-02-02'
    }
  ]);

  const searchQuery = ref('');
  const warehouseFilter = ref('');
  const statusFilter = ref('');

  // 统计
  const statistics = computed(() => {
    const totalWarehouses = warehouses.value.length;
    const activeWarehouses = warehouses.value.filter(w => w.status === 'active').length;
    const totalProducts = stockItems.value.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockItems = stockItems.value.filter(item => item.available <= item.minStock).length;

    return {
      totalWarehouses,
      activeWarehouses,
      totalProducts,
      lowStockItems
    };
  });

  // 过滤后的库存
  const filteredStock = computed(() => {
    let result = stockItems.value;

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        item =>
          item.productName.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query)
      );
    }

    if (warehouseFilter.value) {
      result = result.filter(item => item.warehouseId === warehouseFilter.value);
    }

    return result;
  });

  // 过滤后的仓库
  const filteredWarehouses = computed(() => {
    if (!searchQuery.value) return warehouses.value;
    const query = searchQuery.value.toLowerCase();
    return warehouses.value.filter(
      w =>
        w.name.toLowerCase().includes(query) ||
        w.code.toLowerCase().includes(query) ||
        w.location.toLowerCase().includes(query)
    );
  });

  // 添加仓库
  const addWarehouse = (warehouse: Omit<Warehouse, 'id' | 'productCount' | 'usedCapacity'>) => {
    const newWarehouse: Warehouse = {
      ...warehouse,
      id: Date.now().toString(),
      productCount: 0,
      usedCapacity: 0
    };
    warehouses.value.push(newWarehouse);
  };

  // 更新仓库
  const updateWarehouse = (id: string, updates: Partial<Warehouse>) => {
    const index = warehouses.value.findIndex(w => w.id === id);
    if (index !== -1) {
      warehouses.value[index] = { ...warehouses.value[index]!, ...updates } as Warehouse;
    }
  };

  // 删除仓库
  const deleteWarehouse = (id: string) => {
    warehouses.value = warehouses.value.filter(w => w.id !== id);
  };

  return {
    warehouses,
    stockItems,
    searchQuery,
    warehouseFilter,
    statusFilter,
    statistics,
    filteredStock,
    filteredWarehouses,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useInventoryStore, import.meta.hot));
}
