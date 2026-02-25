/**
 * 业务实体类型定义
 * 绑定之前的修复，
 */

export * from './base'
export * from './category'
export * from './menu'
export * from './organization'
export * from './user'
export * from './warehouse'

export interface Category {
  id: string
  name: string
  code?: string
  description?: string
  icon?: string
  parentId?: string
  level?: number
  sort?: number
  sortOrder: number
  status: CategoryStatus
  productCount?: number
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export interface Warehouse {
  id: string
  name: string
  code: string
  location: string
  manager: string
  capacity: number
  usedCapacity: number
  status: WarehouseStatus
  createdAt: string
  updatedAt: string
}

export interface Menu {
  id: string
  name: string
  title: string
  path: string
  component: string
  icon: string
  parentId: string | null
  sort: number
  status: MenuStatus
  hidden: boolean
  keepAlive: boolean
  external: boolean
  permission: string
  type: MenuType
  createdAt: string
  children?: Menu[]
}

export interface Organization {
  id: string
  name: string
  code: string
  parentId: string | null
  leader: string
  memberCount: number
  sort: number
  status: OrganizationStatus
  description: string
  createdAt: string
  children?: Organization[]
}
