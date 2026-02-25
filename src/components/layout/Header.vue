<script setup lang="ts">
import { Home } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/global/app'
import { useMenuStore } from '@/stores/global/menu'
import { useThemeStore } from '@/stores/global/theme'
import HeaderSearch from './HeaderSearch.vue'
import LanguageSwitch from './LanguageSwitch.vue'
import MenuSearchDialog from './MenuSearchDialog.vue'
import NotificationPanel from './NotificationPanel.vue'
import { PageBreadcrumbDropdown } from './PageBreadcrumbDropdown'
import ThemeDrawer from './ThemeDrawer.vue'
import ThemeToggle from './ThemeToggle.vue'
import { UserMenu } from './UserMenu'

/**
 * 组件属性
 */
defineProps<{
  /** 侧栏是否折叠 */
  sidebarCollapsed?: boolean
}>()

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const themeStore = useThemeStore()
const menuStore = useMenuStore()

const isThemeDrawerOpen = ref(false)
const isMenuSearchOpen = ref(false)

/**
 * 当前路由标题
 */
const currentRouteTitle = computed(() => {
  return menuStore.getRouteTitle(route.path)
})

/**
 * 跳转到首页
 */
function goToHome() {
  router.push('/')
}
</script>

<template>
  <header class="h-12 sm:h-14 border-b border-border/30 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 sticky top-0 z-50">
    <div class="flex items-center justify-between h-full px-2">
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <!-- 移动端菜单按钮 -->
        <Button
          variant="ghost"
          size="icon"
          class="lg:hidden hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-lg flex-shrink-0"
          @click="appStore.toggleMobileSidebar"
        >
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>

        <!-- 面包屑导航 - 下拉卡片模式 -->
        <template v-if="themeStore.layoutConfig.showBreadcrumb">
          <div class="hidden md:flex items-center min-w-0">
            <PageBreadcrumbDropdown />
          </div>
        </template>

        <!-- 面包屑隐藏时，显示页面标题 -->
        <div v-if="!themeStore.layoutConfig.showBreadcrumb" class="hidden md:flex items-center gap-2 min-w-0">
          <div
            class="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-primary/20 transition-colors"
            @click="goToHome"
          >
            <Home class="h-3.5 w-3.5 text-primary" />
          </div>
          <h1 class="text-sm font-semibold text-foreground truncate">
            {{ $t(currentRouteTitle) }}
          </h1>
        </div>

        <!-- 移动端页面标题 -->
        <h1 class="md:hidden text-xs sm:text-sm font-semibold text-foreground truncate">
          {{ $t(currentRouteTitle) }}
        </h1>
      </div>

      <div class="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
        <!-- 搜索框 -->
        <HeaderSearch v-model:expanded="isMenuSearchOpen" />

        <!-- 语言切换 -->
        <LanguageSwitch mode="dropdown" size="icon" variant="ghost" />

        <!-- 主题切换 -->
        <ThemeToggle />

        <!-- 主题设置抽屉 -->
        <ThemeDrawer v-model:open="isThemeDrawerOpen" />

        <!-- 通知面板 -->
        <NotificationPanel />

        <!-- 用户菜单 -->
        <UserMenu />
      </div>
    </div>

    <!-- 菜单搜索对话框 -->
    <MenuSearchDialog v-model:open="isMenuSearchOpen" />
  </header>
</template>
