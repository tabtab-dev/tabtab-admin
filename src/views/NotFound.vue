<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-vue-next';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
    <Card class="w-full max-w-md text-center">
      <CardHeader>
        <div class="text-6xl mb-4">🔍</div>
        <CardTitle class="text-2xl">404 - 页面未找到</CardTitle>
        <CardDescription>抱歉，您访问的页面不存在</CardDescription>
      </CardHeader>
      <CardContent class="space-y-3">
        <p class="text-muted-foreground">
          请检查 URL 是否正确，或返回首页继续浏览。
        </p>
        <div class="flex gap-2 justify-center">
          <Button variant="outline" @click="goBack">
            <ArrowLeft class="h-4 w-4 mr-2" />
            返回
          </Button>
          <Button @click="goHome">
            <Home class="h-4 w-4 mr-2" />
            首页
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
