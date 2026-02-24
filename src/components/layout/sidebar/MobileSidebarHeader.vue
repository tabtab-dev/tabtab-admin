<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/global/auth';
import Logo from '../Logo.vue';

/**
 * 用户 store
 */
const authStore = useAuthStore();

/**
 * 用户姓名首字母
 */
const userInitials = computed(() => {
  return authStore.user?.name?.charAt(0).toUpperCase() || 'U';
});
</script>

<template>
  <div class="relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/5 to-transparent"></div>
    <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
    
    <div class="relative p-4 border-b border-border/50">
      <!-- Logo 区域 -->
      <div class="flex items-center gap-3 mb-4">
        <Logo :size="40" :collapsed="false" />
        <div>
          <span class="text-base font-bold tracking-tight block">TabTab Admin</span>
          <span class="text-xs text-muted-foreground">管理系统</span>
        </div>
      </div>
      
      <!-- 用户信息卡片 -->
      <div class="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/50">
        <Avatar class="h-10 w-10 ring-2 ring-background">
          <AvatarImage v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
          <AvatarFallback class="bg-primary/10 text-primary text-sm font-semibold">
            {{ userInitials }}
          </AvatarFallback>
        </Avatar>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ authStore.user?.name || '用户' }}</p>
          <p class="text-xs text-muted-foreground truncate">{{ authStore.user?.email || 'user@example.com' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
