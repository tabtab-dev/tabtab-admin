<script setup lang="ts">
/**
 * PermissionDemo - 权限控制演示页面
 *
 * @description 展示 RBAC 权限控制的各种使用方式，包括指令、组合式函数等
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { usePermission } from '@/composables'
import { USER_PERMISSIONS, PRODUCT_PERMISSIONS, ORDER_PERMISSIONS } from '@/constants'
import { useAuthStore } from '@/stores/global/auth'
import { Shield, User, Package, ShoppingCart, Info, CheckCircle, XCircle } from 'lucide-vue-next'

/**
 * 权限控制组合式函数
 */
const {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  isAdmin,
  isAuthenticated,
} = usePermission()

/**
 * Auth Store
 */
const authStore = useAuthStore()

/**
 * 当前用户信息
 */
const currentUser = computed(() => authStore.user)

/**
 * 用户权限列表
 */
const userPermissions = computed(() => authStore.user?.permissions || [])

/**
 * 权限检查结果示例 - 使用计算属性实现响应式
 */
const permissionCheckList = [
  { name: '用户创建权限 (user:create)', code: USER_PERMISSIONS.CREATE },
  { name: '用户更新权限 (user:update)', code: USER_PERMISSIONS.UPDATE },
  { name: '用户删除权限 (user:delete)', code: USER_PERMISSIONS.DELETE },
  { name: '产品创建权限 (product:create)', code: PRODUCT_PERMISSIONS.CREATE },
  { name: '订单审核权限 (order:audit)', code: ORDER_PERMISSIONS.AUDIT },
]

// 为每个权限创建响应式的计算属性
const permissionChecks = permissionCheckList.map(item => ({
  name: item.name,
  code: item.code,
  hasPermission: computed(() => authStore.user?.permissions.includes('*') || authStore.user?.permissions.includes(item.code) || false),
}))

/**
 * 组合权限检查示例 - 使用计算属性实现响应式
 */
const canCreateUser = computed(() => authStore.user?.permissions.includes('*') || authStore.user?.permissions.includes(USER_PERMISSIONS.CREATE) || false)
const canUpdateUser = computed(() => authStore.user?.permissions.includes('*') || authStore.user?.permissions.includes(USER_PERMISSIONS.UPDATE) || false)
const canDeleteUser = computed(() => authStore.user?.permissions.includes('*') || authStore.user?.permissions.includes(USER_PERMISSIONS.DELETE) || false)

const combinedChecks = [
  {
    name: '拥有任意用户权限（创建/更新/删除）',
    result: computed(() => canCreateUser.value || canUpdateUser.value || canDeleteUser.value),
    description: 'hasAnyPermission([user:create, user:update, user:delete])',
  },
  {
    name: '同时拥有用户创建和更新权限',
    result: computed(() => canCreateUser.value && canUpdateUser.value),
    description: 'hasAllPermissions([user:create, user:update])',
  },
  {
    name: '是管理员角色',
    result: computed(() => authStore.user?.role === 'admin'),
    description: "hasRole('admin')",
  },
  {
    name: '是管理员（计算属性）',
    result: isAdmin,
    description: 'isAdmin.value',
  },
]

/**
 * 模拟切换用户权限和角色（用于演示）
 */
const mockRoles = [
  { label: '管理员（全部权限）', role: 'admin', permissions: ['*'] },
  { label: '编辑者（读写权限）', role: 'editor', permissions: ['user:read', 'user:update', 'product:read', 'product:update', 'order:read', 'order:update'] },
  { label: '访客（只读权限）', role: 'viewer', permissions: ['user:read', 'product:read', 'order:read'] },
  { label: '无权限', role: 'guest', permissions: [] },
]

/**
 * 切换角色和权限
 */
const switchRole = (roleData: { role: string; permissions: string[] }) => {
  if (authStore.user) {
    authStore.user.role = roleData.role
    authStore.user.permissions = roleData.permissions
  }
}
</script>

<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">权限控制演示 (RBAC Demo)</h1>
      <p class="text-muted-foreground">
        本页面展示如何使用 v-permission 指令和 usePermission 组合式函数进行权限控制
      </p>
    </div>

    <!-- 当前用户信息 -->
    <Alert>
      <Info class="h-4 w-4" />
      <AlertTitle>当前用户信息</AlertTitle>
      <AlertDescription>
        <div class="mt-2 space-y-1 text-sm">
          <p><strong>角色:</strong> {{ currentUser?.role || '未登录' }}</p>
          <p><strong>权限列表:</strong> {{ userPermissions.join(', ') || '无' }}</p>
          <p><strong>是否认证:</strong> {{ isAuthenticated ? '是' : '否' }}</p>
        </div>
      </AlertDescription>
    </Alert>

    <!-- 权限切换（仅用于演示） -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Shield class="h-5 w-5" />
          模拟权限切换（演示用）
        </CardTitle>
        <CardDescription>点击切换不同角色的权限，观察下方按钮和组件的变化</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="mock in mockRoles"
            :key="mock.label"
            variant="outline"
            size="sm"
            @click="switchRole(mock)"
          >
            {{ mock.label }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <Tabs defaultValue="directive" class="w-full">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="directive">指令方式 (v-permission)</TabsTrigger>
        <TabsTrigger value="composable">组合式函数 (usePermission)</TabsTrigger>
        <TabsTrigger value="role">角色控制 (v-role)</TabsTrigger>
      </TabsList>

      <!-- 指令方式 -->
      <TabsContent value="directive" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>v-permission 指令示例</CardTitle>
            <CardDescription>使用 v-permission 指令控制按钮和元素的显示/隐藏</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- 单个权限 -->
            <div class="space-y-2">
              <h4 class="text-sm font-semibold">1. 单个权限检查</h4>
              <div class="flex flex-wrap gap-2">
                <Button v-permission="USER_PERMISSIONS.CREATE">
                  <User class="h-4 w-4 mr-2" />
                  创建用户
                </Button>
                <Button v-permission="USER_PERMISSIONS.UPDATE" variant="secondary">
                  <User class="h-4 w-4 mr-2" />
                  编辑用户
                </Button>
                <Button v-permission="USER_PERMISSIONS.DELETE" variant="destructive">
                  <User class="h-4 w-4 mr-2" />
                  删除用户
                </Button>
              </div>
              <p class="text-xs text-muted-foreground">
                代码: v-permission="USER_PERMISSIONS.CREATE"
              </p>
            </div>

            <Separator />

            <!-- 多个权限（任一） -->
            <div class="space-y-2">
              <h4 class="text-sm font-semibold">2. 多个权限 - 任一通过 (v-permission:any)</h4>
              <div class="flex flex-wrap gap-2">
                <Button v-permission:any="[USER_PERMISSIONS.CREATE, USER_PERMISSIONS.UPDATE]">
                  用户管理（创建或编辑）
                </Button>
                <Button v-permission:any="[PRODUCT_PERMISSIONS.CREATE, PRODUCT_PERMISSIONS.UPDATE]" variant="secondary">
                  <Package class="h-4 w-4 mr-2" />
                  产品管理
                </Button>
              </div>
              <p class="text-xs text-muted-foreground">
                代码: v-permission:any="[USER_PERMISSIONS.CREATE, USER_PERMISSIONS.UPDATE]"
              </p>
            </div>

            <Separator />

            <!-- 多个权限（全部） -->
            <div class="space-y-2">
              <h4 class="text-sm font-semibold">3. 多个权限 - 全部通过 (v-permission:all)</h4>
              <div class="flex flex-wrap gap-2">
                <Button v-permission:all="[USER_PERMISSIONS.CREATE, USER_PERMISSIONS.UPDATE, USER_PERMISSIONS.DELETE]">
                  完整用户管理（需全部权限）
                </Button>
              </div>
              <p class="text-xs text-muted-foreground">
                代码: v-permission:all="[USER_PERMISSIONS.CREATE, USER_PERMISSIONS.UPDATE, USER_PERMISSIONS.DELETE]"
              </p>
            </div>

            <Separator />

            <!-- 禁用模式 -->
            <div class="space-y-2">
              <h4 class="text-sm font-semibold">4. 禁用模式 (v-permission.disabled)</h4>
              <div class="flex flex-wrap gap-2">
                <Button v-permission.disabled="USER_PERMISSIONS.DELETE" variant="destructive">
                  删除（无权限时禁用）
                </Button>
                <Button v-permission.disabled="ORDER_PERMISSIONS.AUDIT" variant="secondary">
                  <ShoppingCart class="h-4 w-4 mr-2" />
                  审核订单
                </Button>
              </div>
              <p class="text-xs text-muted-foreground">
                代码: v-permission.disabled="USER_PERMISSIONS.DELETE" - 无权限时按钮禁用而非隐藏
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 组合式函数方式 -->
      <TabsContent value="composable" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>usePermission 组合式函数示例</CardTitle>
            <CardDescription>在 script setup 中使用组合式函数进行权限检查</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- 单个权限检查 -->
            <div class="space-y-2">
              <h4 class="text-sm font-semibold">单个权限检查结果</h4>
              <div class="grid gap-2">
                <div
                  v-for="check in permissionChecks"
                  :key="check.code"
                  class="flex items-center justify-between p-2 rounded border"
                >
                  <span class="text-sm">{{ check.name }}</span>
                  <Badge :variant="check.hasPermission.value ? 'default' : 'secondary'">
                    <CheckCircle v-if="check.hasPermission.value" class="h-3 w-3 mr-1" />
                    <XCircle v-else class="h-3 w-3 mr-1" />
                    {{ check.hasPermission.value ? '有权限' : '无权限' }}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <!-- 组合权限检查 -->
            <div class="space-y-2">
              <h4 class="text-sm font-semibold">组合权限检查结果</h4>
              <div class="grid gap-2">
                <div
                  v-for="check in combinedChecks"
                  :key="check.name"
                  class="flex items-center justify-between p-2 rounded border"
                >
                  <div>
                    <p class="text-sm font-medium">{{ check.name }}</p>
                    <p class="text-xs text-muted-foreground">{{ check.description }}</p>
                  </div>
                  <Badge :variant="check.result.value ? 'default' : 'secondary'">
                    {{ check.result.value ? '通过' : '未通过' }}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <!-- 代码示例 -->
            <div class="space-y-2">
              <h4 class="text-sm font-semibold">使用示例代码</h4>
              <pre class="p-4 bg-muted rounded-lg text-xs overflow-x-auto"><code>// 在 script setup 中使用
const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission()

// 检查单个权限
const canCreate = hasPermission(USER_PERMISSIONS.CREATE)

// 检查任一权限
const canEdit = hasAnyPermission([USER_PERMISSIONS.CREATE, USER_PERMISSIONS.UPDATE])

// 检查全部权限
const canManage = hasAllPermissions([USER_PERMISSIONS.CREATE, USER_PERMISSIONS.UPDATE, USER_PERMISSIONS.DELETE])

// 在模板中使用
&lt;Button :disabled="!canCreate"&gt;创建&lt;/Button&gt;</code></pre>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 角色控制 -->
      <TabsContent value="role" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>v-role 角色控制示例</CardTitle>
            <CardDescription>使用 v-role 指令基于角色控制元素显示</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- 单个角色 -->
            <div class="space-y-2">
              <h4 class="text-sm font-semibold">1. 单个角色检查</h4>
              <div class="flex flex-wrap gap-2">
                <Button v-role="'admin'" variant="default">
                  <Shield class="h-4 w-4 mr-2" />
                  仅管理员可见
                </Button>
                <Button v-role="'editor'" variant="secondary">
                  仅编辑者可见
                </Button>
              </div>
              <p class="text-xs text-muted-foreground">
                代码: v-role="'admin'" - 仅 admin 角色可见
              </p>
            </div>

            <Separator />

            <!-- 多个角色（任一） -->
            <div class="space-y-2">
              <h4 class="text-sm font-semibold">2. 多个角色 - 任一通过 (v-role:any)</h4>
              <div class="flex flex-wrap gap-2">
                <Button v-role:any="['admin', 'editor']" variant="default">
                  <Shield class="h-4 w-4 mr-2" />
                  管理员或编辑者可见
                </Button>
              </div>
              <p class="text-xs text-muted-foreground">
                代码: v-role:any="['admin', 'editor']" - admin 或 editor 角色可见
              </p>
            </div>

            <Separator />

            <!-- 禁用模式 -->
            <div class="space-y-2">
              <h4 class="text-sm font-semibold">3. 角色禁用模式 (v-role.disabled)</h4>
              <div class="flex flex-wrap gap-2">
                <Button v-role.disabled="'admin'" variant="destructive">
                  管理员操作（无权限时禁用）
                </Button>
              </div>
              <p class="text-xs text-muted-foreground">
                代码: v-role.disabled="'admin'" - 非 admin 角色时按钮禁用
              </p>
            </div>

            <Separator />

            <!-- 当前角色信息 -->
            <div class="space-y-2">
              <h4 class="text-sm font-semibold">当前角色信息</h4>
              <div class="p-4 bg-muted rounded-lg">
                <p class="text-sm"><strong>当前角色:</strong> {{ currentUser?.role || '未登录' }}</p>
                <p class="text-sm"><strong>是否管理员:</strong> {{ isAdmin ? '是' : '否' }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <!-- 使用说明 -->
    <Card>
      <CardHeader>
        <CardTitle>使用说明</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <h4 class="font-semibold">指令方式 (模板中直接使用)</h4>
            <ul class="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>v-permission="'user:create'" - 单个权限</li>
              <li>v-permission:any="[...]" - 任一权限</li>
              <li>v-permission:all="[...]" - 全部权限</li>
              <li>v-permission.disabled="..." - 禁用模式</li>
              <li>v-role="'admin'" - 角色检查</li>
            </ul>
          </div>
          <div class="space-y-2">
            <h4 class="font-semibold">组合式函数方式 (script setup 中使用)</h4>
            <ul class="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>hasPermission(permission) - 检查单个权限</li>
              <li>hasAnyPermission([...]) - 任一权限通过</li>
              <li>hasAllPermissions([...]) - 全部权限通过</li>
              <li>hasRole(role) - 检查角色</li>
              <li>isAdmin - 是否管理员</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
