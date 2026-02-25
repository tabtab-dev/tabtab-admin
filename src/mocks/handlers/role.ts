/**
 * 角色模块 MSW handlers
 * @description 角色管理相关接口
 */
import { delay, http, HttpResponse } from 'msw'

const rolesData = [
  {
    id: '1',
    name: '超级管理员',
    code: 'super_admin',
    description: '系统最高权限，拥有所有功能访问权限',
    userCount: 2,
    permissions: ['*'],
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: '系统管理员',
    code: 'system_admin',
    description: '系统管理权限，可管理用户、角色、菜单等',
    userCount: 3,
    permissions: [
      'dashboard:view',
      'system:user:view',
      'system:user:create',
      'system:user:update',
      'system:user:delete',
      'system:organization:view',
      'system:organization:create',
      'system:organization:update',
      'system:organization:delete',
      'system:role:view',
      'system:role:create',
      'system:role:update',
      'system:role:delete',
      'system:role:permission',
      'system:menu:view',
      'system:menu:create',
      'system:menu:update',
      'system:menu:delete',
    ],
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    name: '运营管理员',
    code: 'operation_admin',
    description: '运营管理权限，可管理商品、订单等',
    userCount: 8,
    permissions: [
      'dashboard:view',
      'products:view',
      'products:create',
      'products:update',
      'products:delete',
      'orders:view',
      'orders:create',
      'orders:update',
      'orders:delete',
    ],
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: '4',
    name: '普通用户',
    code: 'user',
    description: '普通用户权限，仅可查看',
    userCount: 50,
    permissions: ['dashboard:view', 'products:view', 'orders:view'],
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: '5',
    name: '访客',
    code: 'guest',
    description: '访客权限，受限访问',
    userCount: 10,
    permissions: ['dashboard:view'],
    status: 'inactive',
    createdAt: '2024-01-01',
  },
]

export const roleHandlers = [
  http.get('/mock-api/roles', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 10
    const search = url.searchParams.get('search')
    const status = url.searchParams.get('status')

    let filteredData = [...rolesData]

    if (search) {
      const lowerSearch = search.toLowerCase()
      filteredData = filteredData.filter(
        r =>
          r.name.toLowerCase().includes(lowerSearch)
          || r.code.toLowerCase().includes(lowerSearch),
      )
    }

    if (status) {
      filteredData = filteredData.filter(r => r.status === status)
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

  http.get('/mock-api/roles/all', async () => {
    await delay(200)
    return HttpResponse.json({
      code: 200,
      data: rolesData.map(r => ({ id: r.id, name: r.name, code: r.code })),
      message: 'success',
    })
  }),

  http.get('/mock-api/roles/:id', async ({ params }) => {
    await delay(200)
    const role = rolesData.find(r => r.id === params.id)
    if (!role) {
      return HttpResponse.json({ code: 404, data: null, message: '角色不存在' })
    }
    return HttpResponse.json({ code: 200, data: role, message: 'success' })
  }),

  http.post('/mock-api/roles', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const newRole = {
      id: String(Date.now()),
      name: body.name as string,
      code: body.code as string,
      description: (body.description as string) || '',
      userCount: 0,
      permissions: (body.permissions as string[]) || [],
      status: (body.status as string) || 'active',
      createdAt: new Date().toISOString().split('T')[0],
    }

    rolesData.unshift(newRole)
    return HttpResponse.json({ code: 200, data: newRole, message: 'success' })
  }),

  http.put('/mock-api/roles/:id', async ({ params, request }) => {
    await delay(300)
    const index = rolesData.findIndex(r => r.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '角色不存在' })
    }

    const body = (await request.json()) as Record<string, unknown>
    rolesData[index] = { ...rolesData[index], ...body } as typeof rolesData[0]
    return HttpResponse.json({ code: 200, data: rolesData[index], message: 'success' })
  }),

  http.delete('/mock-api/roles/:id', async ({ params }) => {
    await delay(200)
    const index = rolesData.findIndex(r => r.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '角色不存在' })
    }

    if (rolesData[index].userCount > 0) {
      return HttpResponse.json({ code: 400, data: null, message: '该角色下存在用户，无法删除' })
    }

    rolesData.splice(index, 1)
    return HttpResponse.json({ code: 200, data: null, message: 'success' })
  }),

  http.put('/mock-api/roles/:id/permissions', async ({ params, request }) => {
    await delay(300)
    const index = rolesData.findIndex(r => r.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '角色不存在' })
    }

    const body = (await request.json()) as { permissions?: string[] }
    rolesData[index].permissions = body.permissions || []
    return HttpResponse.json({ code: 200, data: rolesData[index], message: 'success' })
  }),
]
