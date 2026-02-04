<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  try {
    const success = await authStore.login(email.value, password.value);
    if (success) {
      router.push('/');
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1 text-center">
        <CardTitle class="text-2xl font-bold">管理后台</CardTitle>
        <CardDescription>输入您的账户信息登录</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="email">邮箱</Label>
          <Input
            id="email"
            v-model="email"
            type="email"
            placeholder="admin@example.com"
            :disabled="isLoading"
          />
        </div>
        <div class="space-y-2">
          <Label for="password">密码</Label>
          <Input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            :disabled="isLoading"
          />
        </div>
        <Button
          class="w-full"
          @click="handleLogin"
          :disabled="isLoading"
        >
          {{ isLoading ? '登录中...' : '登录' }}
        </Button>
        <p class="text-xs text-center text-muted-foreground">
          演示账户: admin@example.com / 任意密码
        </p>
      </CardContent>
    </Card>
  </div>
</template>
