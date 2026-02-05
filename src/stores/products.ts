import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'low-stock' | 'out-of-stock';
  sales: number;
  description?: string;
  createdAt: string;
}

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([
    {
      id: '1',
      sku: 'SKU-001',
      name: '高级无线耳机',
      category: '电子产品',
      price: 299.00,
      stock: 45,
      status: 'active',
      sales: 128,
      description: '降噪无线耳机，续航30小时',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      sku: 'SKU-002',
      name: '智能手表 Pro',
      category: '电子产品',
      price: 599.00,
      stock: 23,
      status: 'active',
      sales: 87,
      description: '健康监测，运动追踪',
      createdAt: '2024-01-18'
    },
    {
      id: '3',
      sku: 'SKU-003',
      name: '便携式充电宝',
      category: '配件',
      price: 49.00,
      stock: 156,
      status: 'active',
      sales: 342,
      description: '20000mAh大容量',
      createdAt: '2024-01-20'
    },
    {
      id: '4',
      sku: 'SKU-004',
      name: '蓝牙音箱',
      category: '音频设备',
      price: 129.00,
      stock: 8,
      status: 'low-stock',
      sales: 56,
      description: '360度环绕音效',
      createdAt: '2024-01-22'
    },
    {
      id: '5',
      sku: 'SKU-005',
      name: 'USB-C 数据线',
      category: '配件',
      price: 19.00,
      stock: 0,
      status: 'out-of-stock',
      sales: 421,
      description: '快充数据线，1.5米',
      createdAt: '2024-01-25'
    }
  ]);

  const isLoading = ref(false);
  const searchQuery = ref('');
  const categoryFilter = ref('');
  const statusFilter = ref('');
  const currentPage = ref(1);
  const pageSize = ref(10);

  // 分类列表
  const categories = computed(() => {
    const cats = new Set(products.value.map(p => p.category));
    return Array.from(cats);
  });

  // 统计
  const statistics = computed(() => {
    const total = products.value.length;
    const active = products.value.filter(p => p.status === 'active').length;
    const lowStock = products.value.filter(p => p.status === 'low-stock').length;
    const outOfStock = products.value.filter(p => p.status === 'out-of-stock').length;
    const totalSales = products.value.reduce((sum, p) => sum + p.sales, 0);
    const totalStock = products.value.reduce((sum, p) => sum + p.stock, 0);

    return {
      total,
      active,
      lowStock,
      outOfStock,
      totalSales,
      totalStock
    };
  });

  // 过滤后的商品
  const filteredProducts = computed(() => {
    let result = products.value;

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    if (categoryFilter.value) {
      result = result.filter(product => product.category === categoryFilter.value);
    }

    if (statusFilter.value) {
      result = result.filter(product => product.status === statusFilter.value);
    }

    return result;
  });

  // 分页商品
  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredProducts.value.slice(start, end);
  });

  const totalPages = computed(() => {
    return Math.ceil(filteredProducts.value.length / pageSize.value);
  });

  // 添加商品
  const addProduct = (product: Omit<Product, 'id' | 'sku' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      sku: `SKU-${String(products.value.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0] || ''
    };
    products.value.unshift(newProduct);
  };

  // 更新商品
  const updateProduct = (id: string, updates: Partial<Product>) => {
    const index = products.value.findIndex(p => p.id === id);
    if (index !== -1) {
      products.value[index] = { ...products.value[index]!, ...updates } as Product;
    }
  };

  // 删除商品
  const deleteProduct = (id: string) => {
    products.value = products.value.filter(p => p.id !== id);
  };

  // 批量删除
  const batchDeleteProducts = (ids: string[]) => {
    products.value = products.value.filter(p => !ids.includes(p.id));
  };

  // 获取商品
  const getProductById = (id: string) => {
    return products.value.find(p => p.id === id);
  };

  // 更新库存
  const updateStock = (id: string, stock: number) => {
    const product = getProductById(id);
    if (product) {
      product.stock = stock;
      // 自动更新状态
      if (stock === 0) {
        product.status = 'out-of-stock';
      } else if (stock < 10) {
        product.status = 'low-stock';
      } else {
        product.status = 'active';
      }
    }
  };

  return {
    products,
    categories,
    isLoading,
    searchQuery,
    categoryFilter,
    statusFilter,
    currentPage,
    pageSize,
    statistics,
    filteredProducts,
    paginatedProducts,
    totalPages,
    addProduct,
    updateProduct,
    deleteProduct,
    batchDeleteProducts,
    getProductById,
    updateStock
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductsStore, import.meta.hot));
}
