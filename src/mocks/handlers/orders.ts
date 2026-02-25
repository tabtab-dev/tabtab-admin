import { faker } from '@faker-js/faker'
/**
 * 订单模块 MSW handlers
 * @description 订单管理相关接口
 */
import { delay, http, HttpResponse } from 'msw'

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

function generateOrders() {
  const list = []
  for (let i = 0; i < 50; i++) {
    list.push({
      id: faker.string.uuid(),
      orderNo: `ORD-${faker.date.past().toISOString().replace(/[-:T]/g, '').slice(0, 14)}`,
      customer: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.string.numeric(11),
      address: `${faker.location.city()}${faker.location.street()}`,
      items: faker.number.int({ min: 1, max: 10 }),
      total: faker.number.float({ min: 50, max: 5000, fractionDigits: 2 }),
      status: faker.helpers.arrayElement(statuses),
      note: faker.lorem.sentence({ min: 5, max: 15 }),
      date: faker.date.past().toISOString().split('T')[0],
    })
  }
  return list
}

let ordersData = generateOrders()

export const orderHandlers = [
  http.get('/mock-api/orders', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 10
    const search = url.searchParams.get('search')
    const status = url.searchParams.get('status')

    let filteredData = [...ordersData]

    if (search) {
      const lowerSearch = search.toLowerCase()
      filteredData = filteredData.filter(
        o =>
          o.orderNo.toLowerCase().includes(lowerSearch)
          || o.customer.toLowerCase().includes(lowerSearch)
          || o.email.toLowerCase().includes(lowerSearch),
      )
    }

    if (status) {
      filteredData = filteredData.filter(o => o.status === status)
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

  http.get('/mock-api/orders/:id', async ({ params }) => {
    await delay(200)
    const order = ordersData.find(o => o.id === params.id)
    if (!order) {
      return HttpResponse.json({ code: 404, data: null, message: '订单不存在' })
    }
    return HttpResponse.json({ code: 200, data: order, message: 'success' })
  }),

  http.post('/mock-api/orders', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const newOrder = {
      id: faker.string.uuid(),
      orderNo: `ORD-${Date.now()}`,
      customer: body.customer || '新客户',
      email: body.email || '',
      phone: body.phone || '',
      address: body.address || '',
      items: Number(body.items || 1),
      total: Number(body.total || 0),
      status: body.status || 'pending',
      note: body.note || '',
      date: new Date().toISOString().split('T')[0],
    }

    ordersData.unshift(newOrder)
    return HttpResponse.json({ code: 200, data: newOrder, message: 'success' })
  }),

  http.put('/mock-api/orders/:id', async ({ params, request }) => {
    await delay(300)
    const index = ordersData.findIndex(o => o.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '订单不存在' })
    }

    const body = (await request.json()) as Record<string, unknown>
    ordersData[index] = { ...ordersData[index], ...body }
    return HttpResponse.json({ code: 200, data: ordersData[index], message: 'success' })
  }),

  http.delete('/mock-api/orders/:id', async ({ params }) => {
    await delay(200)
    const index = ordersData.findIndex(o => o.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '订单不存在' })
    }

    ordersData.splice(index, 1)
    return HttpResponse.json({ code: 200, data: { id: params.id }, message: 'success' })
  }),

  http.post('/mock-api/orders/batch-delete', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as { ids?: string[] }
    const ids = body.ids || []
    const initialLength = ordersData.length
    ordersData = ordersData.filter(o => !ids.includes(o.id))

    return HttpResponse.json({
      code: 200,
      data: { deleted: initialLength - ordersData.length, ids },
      message: 'success',
    })
  }),
]
