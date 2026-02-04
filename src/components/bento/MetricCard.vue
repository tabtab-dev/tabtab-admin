<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MetricCardData } from '@/types/bento';

defineProps<MetricCardData>();
</script>

<template>
  <Card class="hover:shadow-md transition-shadow">
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium text-muted-foreground">
        {{ title }}
      </CardTitle>
      <component v-if="icon" :is="icon" class="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold">{{ value }}</div>
      <div v-if="change !== undefined" class="flex items-center text-xs mt-1">
        <span :class="change >= 0 ? 'text-green-500' : 'text-red-500'">
          {{ change >= 0 ? '+' : '' }}{{ change }}%
        </span>
        <span class="text-muted-foreground ml-1">较上月</span>
      </div>
      <p v-if="description" class="text-xs text-muted-foreground mt-2">
        {{ description }}
      </p>
    </CardContent>
  </Card>
</template>
