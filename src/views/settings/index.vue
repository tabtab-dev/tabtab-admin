<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'antdv-next';
import { TPageHeader } from '@/components/business';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useThemeStore } from '@/stores/global/theme';
import {
  Save,
  Bell,
  Shield,
  Palette,
  Database,
  Loader2,
} from 'lucide-vue-next';

const themeStore = useThemeStore();

/** 外观模式选项配置 */
const modeOptions = [
  { value: 'light' as const, label: '浅色', icon: '☀️' },
  { value: 'dark' as const, label: '深色', icon: '🌙' },
] as const;

/** 通知设置 */
const notificationSettings = ref({
  emailNotifications: true,
  pushNotifications: false,
  orderUpdates: true,
  marketingEmails: false
});

/** 安全设置 */
const securitySettings = ref({
  twoFactorAuth: false,
  loginAlerts: true,
  sessionTimeout: 30
});

/** 系统设置 */
const systemSettings = ref({
  siteName: '管理后台',
  siteUrl: 'https://admin.example.com',
  defaultLanguage: 'zh-CN',
  timezone: 'Asia/Shanghai'
});

/** 加载状态 */
const loadingStates = reactive({
  notifications: false,
  security: false,
  system: false,
});

/**
 * 保存通知设置
 */
const handleSaveNotifications = async () => {
  loadingStates.notifications = true;
  try {
    // TODO: 调用通知设置 API
    await new Promise(resolve => setTimeout(resolve, 500));
    message.success('通知设置保存成功');
  } catch (error) {
    console.error('保存通知设置失败:', error);
    message.error('保存失败，请稍后重试');
  } finally {
    loadingStates.notifications = false;
  }
};

/**
 * 保存安全设置
 */
const handleSaveSecurity = async () => {
  loadingStates.security = true;
  try {
    // TODO: 调用安全设置 API
    await new Promise(resolve => setTimeout(resolve, 500));
    message.success('安全设置保存成功');
  } catch (error) {
    console.error('保存安全设置失败:', error);
    message.error('保存失败，请稍后重试');
  } finally {
    loadingStates.security = false;
  }
};

/**
 * 保存系统配置
 */
const handleSaveSystem = async () => {
  loadingStates.system = true;
  try {
    // TODO: 调用系统配置 API
    await new Promise(resolve => setTimeout(resolve, 500));
    message.success('系统配置保存成功');
  } catch (error) {
    console.error('保存系统配置失败:', error);
    message.error('保存失败，请稍后重试');
  } finally {
    loadingStates.system = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <TPageHeader
      title="系统设置"
      subtitle="管理系统配置和偏好设置"
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <!-- 通知设置卡片 -->
        <Card class="bg-muted/40 border border-border/50 rounded-xl">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Bell class="h-5 w-5" />
              通知设置
            </CardTitle>
            <CardDescription>管理您的通知偏好</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">邮件通知</p>
                <p class="text-sm text-muted-foreground">接收重要更新的邮件通知</p>
              </div>
              <Switch v-model:checked="notificationSettings.emailNotifications" />
            </div>
            <Separator />
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">推送通知</p>
                <p class="text-sm text-muted-foreground">在浏览器中接收推送通知</p>
              </div>
              <Switch v-model:checked="notificationSettings.pushNotifications" />
            </div>
            <Separator />
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">订单更新</p>
                <p class="text-sm text-muted-foreground">订单状态变更时通知</p>
              </div>
              <Switch v-model:checked="notificationSettings.orderUpdates" />
            </div>
            <Separator />
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">营销邮件</p>
                <p class="text-sm text-muted-foreground">接收产品更新和促销信息</p>
              </div>
              <Switch v-model:checked="notificationSettings.marketingEmails" />
            </div>
            <div class="flex justify-end">
              <Button
                @click="handleSaveNotifications"
                :disabled="loadingStates.notifications"
              >
                <Loader2 v-if="loadingStates.notifications" class="h-4 w-4 mr-2 animate-spin" />
                <Save v-else class="h-4 w-4 mr-2" />
                {{ loadingStates.notifications ? '保存中...' : '保存更改' }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- 安全设置卡片 -->
        <Card class="bg-muted/40 border border-border/50 rounded-xl">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Shield class="h-5 w-5" />
              安全设置
            </CardTitle>
            <CardDescription>管理账户安全选项</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">双因素认证</p>
                <p class="text-sm text-muted-foreground">为账户添加额外的安全层</p>
              </div>
              <Switch v-model:checked="securitySettings.twoFactorAuth" />
            </div>
            <Separator />
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">登录提醒</p>
                <p class="text-sm text-muted-foreground">新设备登录时发送通知</p>
              </div>
              <Switch v-model:checked="securitySettings.loginAlerts" />
            </div>
            <Separator />
            <div class="space-y-2">
              <Label for="timeout">会话超时 (分钟)</Label>
              <Input
                id="timeout"
                v-model.number="securitySettings.sessionTimeout"
                type="number"
                min="5"
                max="120"
              />
              <p class="text-xs text-muted-foreground">自动登出前的空闲时间</p>
            </div>
            <div class="flex justify-end">
              <Button
                @click="handleSaveSecurity"
                :disabled="loadingStates.security"
              >
                <Loader2 v-if="loadingStates.security" class="h-4 w-4 mr-2 animate-spin" />
                <Save v-else class="h-4 w-4 mr-2" />
                {{ loadingStates.security ? '保存中...' : '保存更改' }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- 系统配置卡片 -->
        <Card class="bg-muted/40 border border-border/50 rounded-xl">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Database class="h-5 w-5" />
              系统配置
            </CardTitle>
            <CardDescription>管理系统全局设置</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="siteName">站点名称</Label>
                <Input id="siteName" v-model="systemSettings.siteName" />
              </div>
              <div class="space-y-2">
                <Label for="siteUrl">站点 URL</Label>
                <Input id="siteUrl" v-model="systemSettings.siteUrl" type="url" />
              </div>
              <div class="space-y-2">
                <Label for="language">默认语言</Label>
                <select
                  id="language"
                  v-model="systemSettings.defaultLanguage"
                  class="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="en-US">English</option>
                  <option value="ja-JP">日本語</option>
                </select>
              </div>
              <div class="space-y-2">
                <Label for="timezone">时区</Label>
                <select
                  id="timezone"
                  v-model="systemSettings.timezone"
                  class="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="Asia/Shanghai">Asia/Shanghai</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                </select>
              </div>
            </div>
            <div class="flex justify-end">
              <Button
                @click="handleSaveSystem"
                :disabled="loadingStates.system"
              >
                <Loader2 v-if="loadingStates.system" class="h-4 w-4 mr-2 animate-spin" />
                <Save v-else class="h-4 w-4 mr-2" />
                {{ loadingStates.system ? '保存中...' : '保存更改' }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 右侧边栏 -->
      <div class="space-y-6">
        <!-- 主题设置卡片 -->
        <Card class="bg-muted/40 border border-border/50 rounded-xl">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Palette class="h-5 w-5" />
              主题设置
            </CardTitle>
            <CardDescription>自定义界面外观</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- 外观模式 -->
            <div class="space-y-2">
              <Label class="text-sm text-muted-foreground">外观模式</Label>
              <div class="grid grid-cols-2 gap-3">
                <Button
                  v-for="mode in modeOptions"
                  :key="mode.value"
                  :variant="themeStore.currentMode === mode.value ? 'default' : 'outline'"
                  @click="themeStore.setMode(mode.value)"
                  class="h-16 flex flex-col gap-1"
                >
                  <span class="text-xl">{{ mode.icon }}</span>
                  <span class="text-xs">{{ mode.label }}</span>
                </Button>
              </div>
            </div>
            <Separator />
            <!-- 主题配色 -->
            <div class="space-y-2">
              <Label class="text-sm text-muted-foreground">主题配色</Label>
              <div class="grid grid-cols-5 gap-2">
                <button
                  v-for="theme in themeStore.availableThemes"
                  :key="theme.key"
                  class="group flex flex-col items-center gap-1 p-2 rounded-lg border transition-all duration-200"
                  :class="themeStore.currentTheme === theme.key ? 'border-primary bg-primary/10 ring-1 ring-primary/30' : 'border-border hover:border-primary/50'"
                  @click="themeStore.setTheme(theme.key)"
                >
                  <div
                    class="w-5 h-5 rounded-full transition-transform duration-200 group-hover:scale-110"
                    :style="{ backgroundColor: theme.primaryColor }"
                  />
                  <span
                    class="text-xs"
                    :class="themeStore.currentTheme === theme.key ? 'text-primary font-medium' : 'text-muted-foreground'"
                  >
                    {{ theme.name }}
                  </span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
