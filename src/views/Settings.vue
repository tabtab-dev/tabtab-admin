<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/global/auth';
import { useThemeStore } from '@/stores/global/theme';
import { Save, Bell, Shield, Palette, Database, User, Mail } from 'lucide-vue-next';

const authStore = useAuthStore();
const themeStore = useThemeStore();

const profileForm = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  phone: '',
  avatar: ''
});

const notificationSettings = ref({
  emailNotifications: true,
  pushNotifications: false,
  orderUpdates: true,
  marketingEmails: false
});

const securitySettings = ref({
  twoFactorAuth: false,
  loginAlerts: true,
  sessionTimeout: 30
});

const systemSettings = ref({
  siteName: '管理后台',
  siteUrl: 'https://admin.example.com',
  defaultLanguage: 'zh-CN',
  timezone: 'Asia/Shanghai'
});

const isLoading = ref(false);

const handleSaveProfile = async () => {
  isLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 500));
  isLoading.value = false;
};

const handleSaveNotifications = async () => {
  isLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 500));
  isLoading.value = false;
};

const handleSaveSecurity = async () => {
  isLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 500));
  isLoading.value = false;
};

const handleSaveSystem = async () => {
  isLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 500));
  isLoading.value = false;
};
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">系统设置</h1>
      <p class="text-muted-foreground mt-1.5 text-sm">管理账户和系统配置</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <User class="h-5 w-5" />
              个人资料
            </CardTitle>
            <CardDescription>更新您的个人信息</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center gap-4">
              <Avatar class="h-20 w-20">
                <AvatarImage v-if="profileForm.avatar" :src="profileForm.avatar" />
                <AvatarFallback class="text-2xl">{{ profileForm.name?.charAt(0) || 'U' }}</AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">更换头像</Button>
                <p class="text-xs text-muted-foreground mt-2">推荐尺寸: 200x200px</p>
              </div>
            </div>
            <Separator />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="name">姓名</Label>
                <Input id="name" v-model="profileForm.name" />
              </div>
              <div class="space-y-2">
                <Label for="email">邮箱</Label>
                <Input id="email" v-model="profileForm.email" type="email" />
              </div>
              <div class="space-y-2">
                <Label for="phone">电话</Label>
                <Input id="phone" v-model="profileForm.phone" type="tel" />
              </div>
            </div>
            <div class="flex justify-end">
              <Button @click="handleSaveProfile" :disabled="isLoading">
                <Save class="h-4 w-4 mr-2" />
                {{ isLoading ? '保存中...' : '保存更改' }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
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
              <Button @click="handleSaveNotifications" :disabled="isLoading">
                <Save class="h-4 w-4 mr-2" />
                {{ isLoading ? '保存中...' : '保存更改' }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
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
              <Input id="timeout" v-model.number="securitySettings.sessionTimeout" type="number" />
              <p class="text-xs text-muted-foreground">自动登出前的空闲时间</p>
            </div>
            <div class="flex justify-end">
              <Button @click="handleSaveSecurity" :disabled="isLoading">
                <Save class="h-4 w-4 mr-2" />
                {{ isLoading ? '保存中...' : '保存更改' }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
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
              <Button @click="handleSaveSystem" :disabled="isLoading">
                <Save class="h-4 w-4 mr-2" />
                {{ isLoading ? '保存中...' : '保存更改' }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="space-y-6">
        <Card>
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
                  :variant="themeStore.currentMode === 'light' ? 'default' : 'outline'"
                  @click="themeStore.setMode('light')"
                  class="h-16 flex flex-col gap-1"
                >
                  <span class="text-xl">☀️</span>
                  <span class="text-xs">浅色</span>
                </Button>
                <Button
                  :variant="themeStore.currentMode === 'dark' ? 'default' : 'outline'"
                  @click="themeStore.setMode('dark')"
                  class="h-16 flex flex-col gap-1"
                >
                  <span class="text-xl">🌙</span>
                  <span class="text-xs">深色</span>
                </Button>
              </div>
            </div>
            <Separator />
            <!-- 主题配色 -->
            <div class="space-y-2">
              <Label class="text-sm text-muted-foreground">主题配色</Label>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="theme in themeStore.availableThemes"
                  :key="theme.key"
                  class="group flex flex-col items-center gap-1 p-2 rounded-lg border transition-all duration-200 hover:shadow-sm"
                  :class="themeStore.currentTheme === theme.key ? 'border-primary bg-primary/10 ring-1 ring-primary/30' : 'border-border hover:border-primary/50'"
                  @click="themeStore.setTheme(theme.key)"
                >
                  <div
                    class="w-5 h-5 rounded-full transition-transform duration-200 group-hover:scale-110"
                    :class="{
                      'bg-neutral-500': theme.key === 'default',
                      'bg-blue-500': theme.key === 'blue',
                      'bg-emerald-500': theme.key === 'green',
                      'bg-purple-500': theme.key === 'purple',
                      'bg-orange-500': theme.key === 'orange',
                      'bg-red-500': theme.key === 'red',
                      'bg-pink-500': theme.key === 'pink',
                      'bg-teal-500': theme.key === 'teal',
                      'bg-indigo-500': theme.key === 'indigo',
                      'bg-yellow-500': theme.key === 'yellow',
                      'bg-cyan-500': theme.key === 'cyan',
                      'bg-amber-500': theme.key === 'amber',
                    }"
                  />
                  <span class="text-xs" :class="themeStore.currentTheme === theme.key ? 'text-primary font-medium' : 'text-muted-foreground'">{{ theme.name }}</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>账户信息</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="flex items-center gap-3 text-sm">
              <Mail class="h-4 w-4 text-muted-foreground" />
              <span>{{ authStore.user?.email }}</span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <Shield class="h-4 w-4 text-muted-foreground" />
              <span>角色: {{ authStore.user?.role }}</span>
            </div>
            <Separator />
            <Button variant="outline" class="w-full">
              修改密码
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>危险区域</CardTitle>
            <CardDescription>不可逆的操作</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" class="w-full">
              删除账户
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
