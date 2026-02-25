import Mock from 'mockjs'
/**
 * 库存管理模块 MSW handlers
 * @description 仓库和库存管理相关接口
 */
import { delay, http, HttpResponse } from 'msw'

const warehousesData = [
  {
    id: '1',
    name: '北京仓库',
    code: 'WH-BJ-001',
    location: '北京市朝阳区',
    manager: '张三',
    phone: '13800138001',
    capacity: 10000,
    usedCapacity: 6500,
    productCount: 128,
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: '上海仓库',
    code: 'WH-SH-001',
    location: '上海市浦东新区',
    manager: '李四',
    phone: '13800138002',
    capacity: 8000,
    usedCapacity: 4200,
    productCount: 86,
    status: 'active',
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    name: '广州仓库',
    code: 'WH-GZ-001',
    location: '广州市天河区',
    manager: '王五',
    phone: '13800138003',
    capacity: 6000,
    usedCapacity: 2800,
    productCount: 52,
    status: 'active',
    createdAt: '2024-01-03',
  },
]

const stockData = Mock.mock({
  'list|50': [
    {
      id: '@id',
      productId: 'p-@integer(1, 20)',
      productName: '@ctitle(4, 8)',
      sku: 'SKU-@string("number", 6)',
      warehouseId: '@pick(["1", "2", "3"])',
      quantity: '@integer(10, 500)',
      minStock: '@integer(10, 100)',
      createdAt: '@date("yyyy-MM-dd")',
    },
  ],
}).list

export const inventoryHandlers = [
  http.get('/mock-api/warehouses', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 10
    const search = url.searchParams.get('search')
    const status = url.searchParams.get('status')

    let filteredData = [...warehousesData]

    if (search) {
      const lowerSearch = search.toLowerCase()
      filteredData = filteredData.filter(
        w =>
          w.name.toLowerCase().includes(lowerSearch)
          || w.code.toLowerCase().includes(lowerSearch),
      )
    }

    if (status) {
      filteredData = filteredData.filter(w => w.status === status)
    }

    const total = filteredData.length
    const start = (page - 1) * pageSize
    const list = filteredData.slice(start, start + pageSize)

    return HttpResponse.json({
      code: 200,
      data: { list, total, page, pageSize },
      message: 'success',
    })
  }),

  http.get('/mock-api/warehouses/:id', async ({ params }) => {
    await delay(200)
    const warehouse = warehousesData.find(w => w.id === params.id)
    if (!warehouse) {
      return HttpResponse.json({ code: 404, data: null, message: '仓库不存在' })
    }
    return HttpResponse.json({ code: 200, data: warehouse, message: 'success' })
  }),

  http.post('/mock-api/warehouses', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const newWarehouse = {
      id: String(Date.now()),
      name: body.name as string,
      code: (body.code as string) || `WH-${Date.now()}`,
      location: body.location as string,
      manager: body.manager as string,
      phone: body.phone as string,
      capacity: (body.capacity as number) || 5000,
      usedCapacity: (body.usedCapacity as number) || 0,
      productCount: (body.productCount as number) || 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    }

    warehousesData.push(newWarehouse)
    return HttpResponse.json({ code: 200, data: newWarehouse, message: 'success' })
  }),

  http.put('/mock-api/warehouses/:id', async ({ params, request }) => {
    await delay(300)
    const index = warehousesData.findIndex(w => w.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '仓库不存在' })
    }

    const body = (await request.json()) as Record<string, unknown>
    warehousesData[index] = { ...warehousesData[index], ...body } as typeof warehousesData[0]
    return HttpResponse.json({ code: 200, data: warehousesData[index], message: 'success' })
  }),

  http.delete('/mock-api/warehouses/:id', async ({ params }) => {
    await delay(200)
    const index = warehousesData.findIndex(w => w.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '仓库不存在' })
    }

    warehousesData.splice(index, 1)
    return HttpResponse.json({ code: 200, data: null, message: 'success' })
  }),

  http.get('/mock-api/stock', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 10
    const search = url.searchParams.get('search')
    const warehouseId = url.searchParams.get('warehouseId')

    let filteredData = [...stockData]

    if (search) {
      const lowerSearch = search.toLowerCase()
      filteredData = filteredData.filter(
        (s: any) =>
          s.productName.toLowerCase().includes(lowerSearch)
          || s.sku.toLowerCase().includes(lowerSearch),
      )
    }

    if (warehouseId) {
      filteredData = filteredData.filter((s: any) => s.warehouseId === warehouseId)
    }

    const total = filteredData.length
    const start = (page - 1) * pageSize
    const list = filteredData.slice(start, start + pageSize)

    return HttpResponse.json({
      code: 200,
      data: { list, total, page, pageSize },
      message: 'success',
    })
  }),

  http.patch('/mock-api/stock/:id', async ({ params, request }) => {
    await delay(200)
    const index = stockData.findIndex((s: any) => s.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '库存记录不存在' })
    }

    const body = (await request.json()) as { quantity?: number };
    (stockData[index] as any).quantity = body.quantity
    return HttpResponse.json({ code: 200, data: stockData[index], message: 'success' })
  }),
]
