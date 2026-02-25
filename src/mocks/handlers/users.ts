import { faker } from '@faker-js/faker'
/**
 * 用户模块 MSW handlers
 * @description 用户增删改查等接口
 */
import { delay, http, HttpResponse } from 'msw'

function generateMockUsers() {
  const users = [
    {
      id: '1',
      name: '管理员',
      email: 'admin@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      role: 'admin',
      status: 'active',
      phone: '13800138000',
      address: '北京市朝阳区',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: '张三',
      email: 'zhangsan@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
      role: 'editor',
      status: 'active',
      phone: '13800138001',
      address: '上海市浦东新区',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    },
    {
      id: '3',
      name: '李四',
      email: 'lisi@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
      role: 'viewer',
      status: 'inactive',
      phone: '13800138002',
      address: '广州市天河区',
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z',
    },
    {
      id: '4',
      name: '王五',
      email: 'wangwu@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
      role: 'editor',
      status: 'active',
      phone: '13800138003',
      address: '深圳市南山区',
      createdAt: '2024-02-15T00:00:00Z',
      updatedAt: '2024-02-15T00:00:00Z',
    },
    {
      id: '5',
      name: '赵六',
      email: 'zhaoliu@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu',
      role: 'viewer',
      status: 'active',
      phone: '13800138004',
      address: '杭州市西湖区',
      createdAt: '2024-03-01T00:00:00Z',
      updatedAt: '2024-03-01T00:00:00Z',
    },
  ]

  for (let i = 6; i <= 50; i++) {
    users.push({
      id: String(i),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
      role: faker.helpers.arrayElement(['admin', 'editor', 'viewer']),
      status: faker.helpers.arrayElement(['active', 'inactive']),
      phone: faker.string.numeric(11),
      address: `${faker.location.city()}${faker.location.street()}`,
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    })
  }

  return users
}

let usersData = generateMockUsers()

export const usersHandlers = [
  http.get('/mock-api/users', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 10
    const search = url.searchParams.get('search')
    const role = url.searchParams.get('role')
    const status = url.searchParams.get('status')

    let filteredUsers = [...usersData]

    if (search) {
      const lowerSearch = search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        u =>
          u.name.toLowerCase().includes(lowerSearch)
          || u.email.toLowerCase().includes(lowerSearch),
      )
    }

    if (role) {
      filteredUsers = filteredUsers.filter(u => u.role === role)
    }

    if (status) {
      filteredUsers = filteredUsers.filter(u => u.status === status)
    }

    const total = filteredUsers.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const list = filteredUsers.slice(start, start + pageSize)

    return HttpResponse.json({
      code: 200,
      data: { list, total, page, pageSize, totalPages },
      message: 'success',
    })
  }),

  http.get('/mock-api/users/:id', async ({ params }) => {
    await delay(200)
    const user = usersData.find(u => u.id === params.id)
    if (!user) {
      return HttpResponse.json({ code: 404, data: null, message: '用户不存在' })
    }
    return HttpResponse.json({ code: 200, data: user, message: 'success' })
  }),

  http.post('/mock-api/users', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>

    if (!body.name || !body.email) {
      return HttpResponse.json({ code: 400, data: null, message: '用户名和邮箱不能为空' })
    }

    const newUser = {
      id: String(Date.now()),
      name: body.name as string,
      email: body.email as string,
      avatar: (body.avatar as string) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      role: (body.role as string) || 'viewer',
      status: (body.status as string) || 'active',
      phone: body.phone as string,
      address: body.address as string,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    usersData.unshift(newUser)
    return HttpResponse.json({ code: 201, data: newUser, message: 'success' })
  }),

  http.put('/mock-api/users/:id', async ({ params, request }) => {
    await delay(300)
    const index = usersData.findIndex(u => u.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '用户不存在' })
    }

    const body = (await request.json()) as Record<string, unknown>
    usersData[index] = {
      ...usersData[index],
      ...body,
      updatedAt: new Date().toISOString(),
    } as typeof usersData[0]

    return HttpResponse.json({ code: 200, data: usersData[index], message: 'success' })
  }),

  http.delete('/mock-api/users/:id', async ({ params }) => {
    await delay(200)
    const index = usersData.findIndex(u => u.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '用户不存在' })
    }

    usersData.splice(index, 1)
    return HttpResponse.json({ code: 200, data: null, message: 'success' })
  }),

  http.post('/mock-api/users/batch-delete', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as { ids?: string[] }
    const ids = body.ids || []
    if (!Array.isArray(ids) || ids.length === 0) {
      return HttpResponse.json({ code: 400, data: null, message: '请选择要删除的用户' })
    }

    const initialLength = usersData.length
    usersData = usersData.filter(u => !ids.includes(u.id))

    return HttpResponse.json({
      code: 200,
      data: { deletedCount: initialLength - usersData.length },
      message: 'success',
    })
  }),

  http.patch('/mock-api/users/:id/status', async ({ params, request }) => {
    await delay(200)
    const body = (await request.json()) as { status?: string }
    const { status } = body
    if (!status || !['active', 'inactive'].includes(status)) {
      return HttpResponse.json({ code: 400, data: null, message: '无效的状态值' })
    }

    const index = usersData.findIndex(u => u.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '用户不存在' })
    }

    usersData[index].status = status
    usersData[index].updatedAt = new Date().toISOString()

    return HttpResponse.json({ code: 200, data: usersData[index], message: 'success' })
  }),
]
