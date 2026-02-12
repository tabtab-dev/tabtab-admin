<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { message } from 'antdv-next';
import { TPageHeader } from '@/components/business';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/stores/global/auth';
import { authApi } from '@/api';
import {
  Save,
  User,
  Mail,
  Upload,
  Lock,
  Loader2,
  Building,
  Briefcase,
  MapPin,
  FileText,
  Shield,
  Calendar
} from 'lucide-vue-next';

const authStore = useAuthStore();

/** 表单验证错误 */
const formErrors = reactive<Record<string, string>>({});

/** 个人资料表单 */
const profileForm = reactive({
  name: '',
  email: '',
  phone: '',
  avatar: '',
  address: '',
  department: '',
  position: '',
  bio: '',
});

/** 加载状态 */
const loadingStates = reactive({
  profile: false,
  avatar: false,
  password: false,
});

/** 密码修改弹窗 */
const passwordDialog = reactive({
  open: false,
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

/** 密码错误 */
const passwordErrors = reactive<Record<string, string>>({});

/** 头像文件输入引用 */
const avatarInputRef = ref<HTMLInputElement | null>(null);

/**
 * 初始化表单数据
 */
const initProfileForm = () => {
  const user = authStore.user;
  if (user) {
    profileForm.name = user.name || '';
    profileForm.email = user.email || '';
    profileForm.phone = user.phone || '';
    profileForm.avatar = user.avatar || '';
    profileForm.address = user.address || '';
    profileForm.department = user.department || '';
    profileForm.position = user.position || '';
    profileForm.bio = user.bio || '';
  }
};

/**
 * 验证个人资料表单
 */
const validateProfileForm = (): boolean => {
  formErrors.name = '';
  formErrors.phone = '';
  formErrors.email = '';

  let isValid = true;

  if (!profileForm.name.trim()) {
    formErrors.name = '请输入姓名';
    isValid = false;
  } else if (profileForm.name.length < 2 || profileForm.name.length > 20) {
    formErrors.name = '姓名长度应在 2-20 个字符之间';
    isValid = false;
  }

  if (profileForm.phone && !/^1[3-9]\d{9}$/.test(profileForm.phone)) {
    formErrors.phone = '请输入有效的手机号码';
    isValid = false;
  }

  if (profileForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
    formErrors.email = '请输入有效的邮箱地址';
    isValid = false;
  }

  return isValid;
};

/**
 * 保存个人资料
 */
const handleSaveProfile = async () => {
  if (!validateProfileForm()) {
    return;
  }

  loadingStates.profile = true;
  try {
    const updatedUser = await authApi.updateProfile({
      name: profileForm.name,
      phone: profileForm.phone,
      address: profileForm.address,
      department: profileForm.department,
      position: profileForm.position,
      bio: profileForm.bio,
      avatar: profileForm.avatar,
    });

    // 更新 store 中的用户信息
    authStore.user = { ...authStore.user, ...updatedUser };

    message.success('个人资料保存成功');
  } catch (error) {
    console.error('保存个人资料失败:', error);
    message.error('保存失败，请稍后重试');
  } finally {
    loadingStates.profile = false;
  }
};

/**
 * 触发头像上传
 */
const handleAvatarClick = () => {
  avatarInputRef.value?.click();
};

/**
 * 处理头像文件选择
 */
const handleAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    message.error('请选择图片文件');
    return;
  }

  // 验证文件大小（最大 2MB）
  if (file.size > 2 * 1024 * 1024) {
    message.error('图片大小不能超过 2MB');
    return;
  }

  loadingStates.avatar = true;
  try {
    const { avatarUrl } = await authApi.uploadAvatar(file);
    profileForm.avatar = avatarUrl;

    // 同时更新用户资料
    await authApi.updateProfile({ avatar: avatarUrl });

    // 更新 store
    if (authStore.user) {
      authStore.user.avatar = avatarUrl;
    }

    message.success('头像上传成功');
  } catch (error) {
    console.error('上传头像失败:', error);
    message.error('上传失败，请稍后重试');
  } finally {
    loadingStates.avatar = false;
    // 清空 input 值，允许重复选择同一文件
    if (avatarInputRef.value) {
      avatarInputRef.value.value = '';
    }
  }
};

/**
 * 打开修改密码弹窗
 */
const handleOpenPasswordDialog = () => {
  passwordDialog.open = true;
  passwordDialog.oldPassword = '';
  passwordDialog.newPassword = '';
  passwordDialog.confirmPassword = '';
  passwordErrors.oldPassword = '';
  passwordErrors.newPassword = '';
  passwordErrors.confirmPassword = '';
};

/**
 * 验证密码表单
 */
const validatePasswordForm = (): boolean => {
  passwordErrors.oldPassword = '';
  passwordErrors.newPassword = '';
  passwordErrors.confirmPassword = '';

  let isValid = true;

  if (!passwordDialog.oldPassword) {
    passwordErrors.oldPassword = '请输入当前密码';
    isValid = false;
  }

  if (!passwordDialog.newPassword) {
    passwordErrors.newPassword = '请输入新密码';
    isValid = false;
  } else if (passwordDialog.newPassword.length < 6) {
    passwordErrors.newPassword = '密码长度至少为 6 位';
    isValid = false;
  }

  if (!passwordDialog.confirmPassword) {
    passwordErrors.confirmPassword = '请确认新密码';
    isValid = false;
  } else if (passwordDialog.newPassword !== passwordDialog.confirmPassword) {
    passwordErrors.confirmPassword = '两次输入的密码不一致';
    isValid = false;
  }

  return isValid;
};

/**
 * 修改密码
 */
const handleChangePassword = async () => {
  if (!validatePasswordForm()) {
    return;
  }

  loadingStates.password = true;
  try {
    await authApi.changePassword({
      oldPassword: passwordDialog.oldPassword,
      newPassword: passwordDialog.newPassword,
    });

    message.success('密码修改成功');
    passwordDialog.open = false;
  } catch (error) {
    console.error('修改密码失败:', error);
    message.error('修改密码失败，请检查当前密码是否正确');
  } finally {
    loadingStates.password = false;
  }
};

/** 获取用户首字母 */
const userInitials = computed(() => {
  return profileForm.name?.charAt(0).toUpperCase() || 'U';
});

/** 格式化日期 */
const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('zh-CN');
};

onMounted(() => {
  initProfileForm();
});
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <TPageHeader
      title="个人资料"
      subtitle="管理您的个人信息和账户安全"
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧：个人资料编辑 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 基本信息卡片 -->
        <Card class="bg-muted/40 border border-border/50 rounded-xl">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <User class="h-5 w-5" />
              基本信息
            </CardTitle>
            <CardDescription>更新您的个人信息</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- 头像上传 -->
            <div class="flex items-center gap-4">
              <div class="relative">
                <Avatar class="h-24 w-24">
                  <AvatarImage v-if="profileForm.avatar" :src="profileForm.avatar" />
                  <AvatarFallback class="text-3xl bg-primary text-primary-foreground">
                    {{ userInitials }}
                  </AvatarFallback>
                </Avatar>
                <button
                  v-if="loadingStates.avatar"
                  class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"
                >
                  <Loader2 class="h-8 w-8 text-white animate-spin" />
                </button>
              </div>
              <div>
                <input
                  ref="avatarInputRef"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarChange"
                />
                <Button
                  variant="outline"
                  :disabled="loadingStates.avatar"
                  @click="handleAvatarClick"
                >
                  <Upload class="h-4 w-4 mr-2" />
                  更换头像
                </Button>
                <p class="text-xs text-muted-foreground mt-2">
                  支持 JPG、PNG 格式，文件大小不超过 2MB
                </p>
              </div>
            </div>

            <Separator />

            <!-- 基本信息表单 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- 姓名 -->
              <div class="space-y-2">
                <Label for="name">
                  姓名
                  <span class="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  v-model="profileForm.name"
                  :class="{ 'border-destructive': formErrors.name }"
                  placeholder="请输入姓名"
                />
                <p v-if="formErrors.name" class="text-xs text-destructive">{{ formErrors.name }}</p>
              </div>

              <!-- 邮箱 -->
              <div class="space-y-2">
                <Label for="email">邮箱</Label>
                <Input
                  id="email"
                  v-model="profileForm.email"
                  type="email"
                  disabled
                />
                <p class="text-xs text-muted-foreground">邮箱不可修改</p>
              </div>

              <!-- 电话 -->
              <div class="space-y-2">
                <Label for="phone">电话</Label>
                <Input
                  id="phone"
                  v-model="profileForm.phone"
                  type="tel"
                  :class="{ 'border-destructive': formErrors.phone }"
                  placeholder="请输入手机号码"
                />
                <p v-if="formErrors.phone" class="text-xs text-destructive">{{ formErrors.phone }}</p>
              </div>

              <!-- 部门 -->
              <div class="space-y-2">
                <Label for="department">
                  <Building class="h-3.5 w-3.5 inline mr-1" />
                  部门
                </Label>
                <Input
                  id="department"
                  v-model="profileForm.department"
                  placeholder="请输入部门"
                />
              </div>

              <!-- 职位 -->
              <div class="space-y-2">
                <Label for="position">
                  <Briefcase class="h-3.5 w-3.5 inline mr-1" />
                  职位
                </Label>
                <Input
                  id="position"
                  v-model="profileForm.position"
                  placeholder="请输入职位"
                />
              </div>

              <!-- 地址 -->
              <div class="space-y-2">
                <Label for="address">
                  <MapPin class="h-3.5 w-3.5 inline mr-1" />
                  地址
                </Label>
                <Input
                  id="address"
                  v-model="profileForm.address"
                  placeholder="请输入地址"
                />
              </div>
            </div>

            <!-- 个人简介 -->
            <div class="space-y-2">
              <Label for="bio">
                <FileText class="h-3.5 w-3.5 inline mr-1" />
                个人简介
              </Label>
              <textarea
                id="bio"
                v-model="profileForm.bio"
                rows="4"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="请输入个人简介"
              />
            </div>

            <div class="flex justify-end">
              <Button
                @click="handleSaveProfile"
                :disabled="loadingStates.profile"
              >
                <Loader2 v-if="loadingStates.profile" class="h-4 w-4 mr-2 animate-spin" />
                <Save v-else class="h-4 w-4 mr-2" />
                {{ loadingStates.profile ? '保存中...' : '保存更改' }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 右侧：账户信息 -->
      <div class="space-y-6">
        <!-- 账户信息卡片 -->
        <Card class="bg-muted/40 border border-border/50 rounded-xl">
          <CardHeader>
            <CardTitle>账户信息</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center gap-3 text-sm">
              <Mail class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-xs text-muted-foreground">邮箱</p>
                <p>{{ authStore.user?.email }}</p>
              </div>
            </div>
            <Separator />
            <div class="flex items-center gap-3 text-sm">
              <Shield class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-xs text-muted-foreground">角色</p>
                <p>{{ authStore.user?.role }}</p>
              </div>
            </div>
            <Separator />
            <div class="flex items-center gap-3 text-sm">
              <User class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-xs text-muted-foreground">状态</p>
                <p>{{ authStore.user?.status === 'active' ? '正常' : '停用' }}</p>
              </div>
            </div>
            <Separator />
            <div class="flex items-center gap-3 text-sm">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-xs text-muted-foreground">注册时间</p>
                <p>{{ formatDate(authStore.user?.createdAt) }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 安全设置卡片 -->
        <Card class="bg-muted/40 border border-border/50 rounded-xl">
          <CardHeader>
            <CardTitle>安全设置</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <Button
              variant="outline"
              class="w-full"
              @click="handleOpenPasswordDialog"
            >
              <Lock class="h-4 w-4 mr-2" />
              修改密码
            </Button>
          </CardContent>
        </Card>

        <!-- 危险区域卡片 -->
        <Card class="bg-muted/40 border border-border/50 rounded-xl border-destructive/50">
          <CardHeader>
            <CardTitle class="text-destructive">危险区域</CardTitle>
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

    <!-- 修改密码弹窗 -->
    <Dialog v-model:open="passwordDialog.open">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Lock class="h-5 w-5" />
            修改密码
          </DialogTitle>
          <DialogDescription>
            请输入当前密码和新密码来修改您的登录密码
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="oldPassword">
              当前密码
              <span class="text-destructive">*</span>
            </Label>
            <Input
              id="oldPassword"
              v-model="passwordDialog.oldPassword"
              type="password"
              :class="{ 'border-destructive': passwordErrors.oldPassword }"
              placeholder="请输入当前密码"
            />
            <p v-if="passwordErrors.oldPassword" class="text-xs text-destructive">
              {{ passwordErrors.oldPassword }}
            </p>
          </div>
          <div class="space-y-2">
            <Label for="newPassword">
              新密码
              <span class="text-destructive">*</span>
            </Label>
            <Input
              id="newPassword"
              v-model="passwordDialog.newPassword"
              type="password"
              :class="{ 'border-destructive': passwordErrors.newPassword }"
              placeholder="请输入新密码（至少6位）"
            />
            <p v-if="passwordErrors.newPassword" class="text-xs text-destructive">
              {{ passwordErrors.newPassword }}
            </p>
          </div>
          <div class="space-y-2">
            <Label for="confirmPassword">
              确认新密码
              <span class="text-destructive">*</span>
            </Label>
            <Input
              id="confirmPassword"
              v-model="passwordDialog.confirmPassword"
              type="password"
              :class="{ 'border-destructive': passwordErrors.confirmPassword }"
              placeholder="请再次输入新密码"
            />
            <p v-if="passwordErrors.confirmPassword" class="text-xs text-destructive">
              {{ passwordErrors.confirmPassword }}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="passwordDialog.open = false">
            取消
          </Button>
          <Button
            @click="handleChangePassword"
            :disabled="loadingStates.password"
          >
            <Loader2 v-if="loadingStates.password" class="h-4 w-4 mr-2 animate-spin" />
            {{ loadingStates.password ? '修改中...' : '确认修改' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
