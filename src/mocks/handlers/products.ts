import { faker } from '@faker-js/faker'
/**
 * 产品模块 MSW handlers
 * @description 产品管理相关接口
 */
import { delay, http, HttpResponse } from 'msw'

const categories = ['电子产品', '配件', '家居', '服饰', '食品']
const statuses = ['active', 'inactive']

function generateProducts() {
  const list = []
  for (let i = 0; i < 50; i++) {
    list.push({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      sku: `SKU-${faker.string.numeric(6)}`,
      category: faker.helpers.arrayElement(categories),
      price: faker.number.float({ min: 10, max: 2000, fractionDigits: 2 }),
      stock: faker.number.int({ min: 0, max: 500 }),
      status: faker.helpers.arrayElement(statuses),
      description: faker.lorem.sentence({ min: 10, max: 30 }),
      createdAt: faker.date.past().toISOString().split('T')[0],
    })
  }
  return list
}

let productsData = generateProducts()

export const productHandlers = [
  http.get('/mock-api/products', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 10
    const search = url.searchParams.get('search')
    const status = url.searchParams.get('status')

    let filteredData = [...productsData]

    if (search) {
      const lowerSearch = search.toLowerCase()
      filteredData = filteredData.filter(
        p =>
          p.name.toLowerCase().includes(lowerSearch)
          || p.sku.toLowerCase().includes(lowerSearch)
          || p.category.toLowerCase().includes(lowerSearch),
      )
    }

    if (status) {
      filteredData = filteredData.filter(p => p.status === status)
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

  http.get('/mock-api/products/:id', async ({ params }) => {
    await delay(200)
    const product = productsData.find(p => p.id === params.id)
    if (!product) {
      return HttpResponse.json({ code: 404, data: null, message: '产品不存在' })
    }
    return HttpResponse.json({ code: 200, data: product, message: 'success' })
  }),

  http.post('/mock-api/products', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const newProduct = {
      id: faker.string.uuid(),
      name: body.name || '新产品',
      sku: body.sku || `SKU-${Date.now()}`,
      category: body.category || '未分类',
      price: Number(body.price || 0),
      stock: Number(body.stock || 0),
      status: body.status || 'active',
      description: body.description || '',
      createdAt: new Date().toISOString().split('T')[0],
    }

    productsData.unshift(newProduct)
    return HttpResponse.json({ code: 200, data: newProduct, message: 'success' })
  }),

  http.put('/mock-api/products/:id', async ({ params, request }) => {
    await delay(300)
    const index = productsData.findIndex(p => p.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '产品不存在' })
    }

    const body = (await request.json()) as Record<string, unknown>
    productsData[index] = { ...productsData[index], ...body }
    return HttpResponse.json({ code: 200, data: productsData[index], message: 'success' })
  }),

  http.delete('/mock-api/products/:id', async ({ params }) => {
    await delay(200)
    const index = productsData.findIndex(p => p.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '产品不存在' })
    }

    productsData.splice(index, 1)
    return HttpResponse.json({ code: 200, data: { id: params.id }, message: 'success' })
  }),

  http.post('/mock-api/products/batch-delete', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as { ids?: string[] }
    const ids = body.ids || []
    const initialLength = productsData.length
    productsData = productsData.filter(p => !ids.includes(p.id))

    return HttpResponse.json({
      code: 200,
      data: { deleted: initialLength - productsData.length, ids },
      message: 'success',
    })
  }),
]
