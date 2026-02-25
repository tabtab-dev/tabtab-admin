<script setup lang="ts">
import { LogOut, Settings, User } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppStore } from '@/stores/global/app'
import { useAuthStore } from '@/stores/global/auth'

const { t } = useI18n()

/**
 * 用户 store
 */
const authStore = useAuthStore()
const appStore = useAppStore()

/**
 * 路由实例
 */
const router = useRouter()

/**
 * 用户姓名首字母
 */
const userInitials = computed(() => {
  return authStore.user?.name?.charAt(0).toUpperCase() || 'U'
})

/**
 * 用户菜单打开状态
 */
const isUserMenuOpen = ref(false)

/**
 * 处理导航到个人资料
 */
function handleGoToProfile() {
  appStore.setMobileSidebar(false)
  router.push('/profile')
}

/**
 * 处理导航到设置
 */
function handleGoToSettings() {
  appStore.setMobileSidebar(false)
  router.push('/settings')
}

/**
 * 处理退出登录
 */
async function handleLogout() {
  appStore.setMobileSidebar(false)
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="p-4 border-t border-border/40 bg-muted/20">
    <!-- 用户菜单下拉 -->
    <DropdownMenu v-model:open="isUserMenuOpen">
      <DropdownMenuTrigger as-child>
        <button
          class="group flex items-center gap-2.5 min-w-0 w-full rounded-xl p-2 hover:bg-muted/60 transition-all duration-200"
        >
          <!-- 用户头像 -->
          <div class="relative flex-shrink-0">
            <Avatar class="h-9 w-9 ring-2 ring-primary/20 transition-all duration-200 group-hover:ring-primary/40">
              <AvatarImage v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
              <AvatarFallback class="bg-primary/10 text-primary text-sm font-semibold">
                {{ userInitials }}
              </AvatarFallback>
            </Avatar>
            <!-- 在线状态指示点 -->
            <span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
          </div>
          <!-- 用户信息 -->
          <div class="flex flex-col min-w-0 flex-1 text-left">
            <span class="text-sm font-medium truncate group-hover:text-primary transition-colors duration-200">
              {{ authStore.user?.name || '用户' }}
            </span>
            <span class="text-[11px] text-muted-foreground truncate">
              {{ authStore.user?.email || 'user@example.com' }}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" class="w-56" :side-offset="8">
        <div class="px-2 py-1.5">
          <p class="text-xs font-medium text-muted-foreground">
            {{ t('common.sidebar.signedInAs') }}
          </p>
          <p class="text-sm font-semibold truncate">
            {{ authStore.user?.email || 'user@example.com' }}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="gap-2 cursor-pointer" @click="handleGoToProfile">
          <User class="h-4 w-4" />
          <span>{{ t('common.sidebar.profile') }}</span>
        </DropdownMenuItem>
        <DropdownMenuItem class="gap-2 cursor-pointer" @click="handleGoToSettings">
          <Settings class="h-4 w-4" />
          <span>{{ t('common.sidebar.settings') }}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="gap-2 cursor-pointer text-destructive focus:text-destructive" @click="handleLogout">
          <LogOut class="h-4 w-4" />
          <span>{{ t('common.sidebar.logout') }}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
