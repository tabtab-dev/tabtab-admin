<script setup lang="ts">
import type { SidebarConfig } from './config'
import type { MenuItem } from '@/types/menu'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useMenuUtils } from '@/layouts/composables/useMenuUtils'
import { useAppStore } from '@/stores/global/app'
import MobileSidebarFooter from './MobileSidebarFooter.vue'
import MobileSidebarHeader from './MobileSidebarHeader.vue'
import SidebarItem from './SidebarItem.vue'
import SidebarSubMenu from './SidebarSubMenu.vue'

/**
 * 组件属性
 */
interface Props {
  /** 侧栏配置 */
  config: SidebarConfig
  /** 展开的子菜单 keys */
  expandedKeys: Set<string>
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

/**
 * 组件事件
 */
interface Emits {
  /** 切换子菜单 */
  (e: 'toggle-sub-menu', key: string): void
  /** 导航 */
  (e: 'navigate', path: string): void
}

const route = useRoute()
const appStore = useAppStore()
const { isActive } = useMenuUtils()

/**
 * 监听路由变化，移动端自动关闭侧边栏
 */
watch(() => route.path, () => {
  appStore.setMobileSidebar(false)
})

/**
 * 处理导航
 */
function handleNavigate(path: string): void {
  emit('navigate', path)
  appStore.setMobileSidebar(false)
}

/**
 * 切换子菜单
 */
function handleToggleSubMenu(key: string): void {
  emit('toggle-sub-menu', key)
}

/**
 * 判断是否有子菜单
 */
function hasChildren(item: MenuItem): boolean {
  return !!item.children && item.children.length > 0
}

/**
 * 判断是否展开
 */
function isExpanded(key: string): boolean {
  return props.expandedKeys.has(key)
}
</script>

<template>
  <div class="lg:hidden flex flex-1 min-w-0">
    <Sheet
      :open="appStore.mobileSidebarOpen"
      @update:open="appStore.setMobileSidebar"
    >
      <SheetContent
        side="left"
        class="w-[280px] p-0"
      >
        <div class="flex flex-col h-full bg-background">
          <!-- 头部区域 -->
          <MobileSidebarHeader />

          <!-- 菜单列表 -->
          <ScrollArea class="flex-1 h-0">
            <nav
              class="p-3 space-y-1"
              role="menubar"
              aria-label="主导航"
            >
              <template v-for="item in config.menus" :key="item.key">
                <SidebarSubMenu
                  v-if="hasChildren(item)"
                  :item="item"
                  :collapsed="false"
                  :active="isActive(item.path)"
                  :expanded="isExpanded(item.key)"
                  @toggle="handleToggleSubMenu(item.key)"
                  @navigate="handleNavigate"
                />
                <SidebarItem
                  v-else
                  :item="item"
                  :collapsed="false"
                  :active="isActive(item.path)"
                  @navigate="handleNavigate"
                />
              </template>
            </nav>
          </ScrollArea>

          <!-- 底部区域 -->
          <MobileSidebarFooter />
        </div>
      </SheetContent>
    </Sheet>

    <!-- 移动端内容区域 -->
    <main class="flex-1 min-w-0 bg-background">
      <slot />
    </main>
  </div>
</template>
