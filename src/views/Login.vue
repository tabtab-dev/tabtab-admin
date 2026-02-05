<script setup lang="ts">
import { ref, h } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TForm } from '@/components/data/TForm';
import type { FormSchema, TFormExpose } from '@/components/data/TForm';
import { useAuthStore } from '@/stores/global/auth';
import { useThemeStore } from '@/stores/global/theme';
import {
  Shield,
  ArrowRight,
  Zap,
  BarChart3,
  Users,
  Layers,
  Sparkles,
  CheckCircle2,
  Sun,
  Moon,
  Mail,
  Lock
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();

/**
 * 表单引用
 */
const formRef = ref<TFormExpose>();

/**
 * 表单数据
 */
const formData = ref({
  email: '',
  password: '',
  rememberMe: false
});

/**
 * 登录加载状态
 */
const isLoading = ref(false);

/**
 * 错误提示信息
 */
const errorMessage = ref('');

/**
 * 登录表单 Schema 配置
 */
const loginSchema: FormSchema = {
  layout: 'vertical',
  fields: [
    {
      name: 'email',
      type: 'input',
      label: '邮箱地址',
      placeholder: 'admin@example.com',
      rules: [
        { required: true, message: '请输入邮箱地址' },
        { type: 'email', message: '请输入有效的邮箱地址' }
      ],
      props: {
        size: 'large',
        prefix: h(Mail, { class: 'w-4 h-4 text-muted-foreground' }),
        autocomplete: 'username'
      }
    },
    {
      name: 'password',
      type: 'password',
      label: '密码',
      placeholder: '••••••••',
      rules: [
        { required: true, message: '请输入密码' }
      ],
      props: {
        size: 'large',
        prefix: h(Lock, { class: 'w-4 h-4 text-muted-foreground' }),
        autocomplete: 'current-password'
      }
    }
  ],
  actions: {
    showSubmit: false,
    showReset: false
  }
};

/**
 * 处理登录表单提交
 * @param values - 表单值
 */
const handleLogin = async (values: Record<string, any>) => {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    const success = await authStore.login(values.email, values.password);
    if (success) {
      router.push('/');
    } else {
      errorMessage.value = '登录失败，请检查账户信息';
    }
  } catch (error) {
    errorMessage.value = '登录过程中发生错误，请稍后重试';
  } finally {
    isLoading.value = false;
  }
};

/**
 * 处理表单提交失败
 * @param errorInfo - 错误信息
 */
const handleFinishFailed = (errorInfo: any) => {
  if (errorInfo?.errorFields?.length > 0) {
    errorMessage.value = errorInfo.errorFields[0].errors[0] || '请检查表单填写是否正确';
  }
};

/**
 * 处理登录按钮点击
 * @description 触发表单验证，验证通过后自动触发 submit 事件
 */
const handleLoginClick = async () => {
  errorMessage.value = '';
  await formRef.value?.validate();
  await handleLogin(formData.value);
};

/**
 * 特性列表数据
 */
const features = [
  { icon: BarChart3, text: '实时数据分析' },
  { icon: Users, text: '团队协作管理' },
  { icon: Layers, text: '模块化架构' },
  { icon: Zap, text: '高性能体验' },
];
</script>

<template>
  <div class="relative min-h-screen w-full flex bg-background overflow-hidden">
    <!-- 左侧品牌展示区 -->
    <div class="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
      <!-- 动态背景层 -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70">
        <!-- 动态光晕效果 -->
        <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        <div class="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <!-- 网格装饰 -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <!-- 内容区 -->
      <div class="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <Shield class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-bold text-white tracking-tight">TABTAB</span>
        </div>

        <!-- 主文案 -->
        <div class="space-y-8">
          <div class="space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm">
              <Sparkles class="w-4 h-4" />
              <span>全新版本 1.0 现已发布</span>
            </div>
            <h1 class="text-4xl xl:text-5xl font-bold text-white leading-tight">
              智能化<br />
              <span class="text-white/80">后台管理系统</span>
            </h1>
            <p class="text-lg text-white/70 max-w-md leading-relaxed">
              融合现代设计理念与强大功能，为您的团队提供高效、直观的数据管理体验。
            </p>
          </div>

          <!-- 特性列表 -->
          <div class="grid grid-cols-2 gap-4 max-w-md">
            <div
              v-for="(feature, index) in features"
              :key="index"
              class="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10">
                <component :is="feature.icon" class="w-4 h-4 text-white" />
              </div>
              <span class="text-sm text-white/90 font-medium">{{ feature.text }}</span>
            </div>
          </div>
        </div>

        <!-- 底部信息 -->
        <div class="flex items-center gap-6 text-white/50 text-sm">
          <span>© 2026 TABTAB</span>
          <span class="w-1 h-1 rounded-full bg-white/30" />
          <a href="#" class="hover:text-white/80 transition-colors">隐私政策</a>
          <a href="#" class="hover:text-white/80 transition-colors">服务条款</a>
        </div>
      </div>
    </div>

    <!-- 右侧登录表单区 -->
    <div class="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12 relative">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
        <div class="absolute bottom-20 left-20 w-48 h-48 bg-accent/5 rounded-full blur-[60px]" />
      </div>

      <!-- 主题切换按钮 -->
      <div class="absolute top-6 right-6 z-20">
        <Button
          variant="ghost"
          size="icon"
          @click="themeStore.toggleMode"
          class="h-10 w-10 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm hover:bg-background hover:shadow-md transition-all duration-200"
          :title="themeStore.currentMode === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
        >
          <Sun v-if="themeStore.currentMode === 'dark'" class="h-5 w-5 text-foreground" />
          <Moon v-else class="h-5 w-5 text-foreground" />
        </Button>
      </div>

      <div class="relative z-10 w-full max-w-[400px] space-y-8">
        <!-- 移动端 Logo -->
        <div class="lg:hidden flex flex-col items-center gap-3 mb-8">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
            <Shield class="w-6 h-6 text-primary-foreground" />
          </div>
          <span class="text-xl font-bold text-foreground">TABTAB Admin</span>
        </div>

        <!-- 登录表单标题 -->
        <div class="space-y-2">
          <h2 class="text-2xl font-bold text-foreground">欢迎回来</h2>
          <p class="text-muted-foreground">请输入您的账户信息以继续</p>
        </div>

        <!-- 错误提示 -->
        <div
          v-if="errorMessage"
          class="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20"
        >
          <div class="w-1 h-1 rounded-full bg-destructive" />
          {{ errorMessage }}
        </div>

        <!-- TForm 登录表单 -->
        <TForm
          ref="formRef"
          v-model="formData"
          :schema="loginSchema"
          :loading="isLoading"
          @submit="handleLogin"
          @finish-failed="handleFinishFailed"
        />

        <!-- 记住我和忘记密码 -->
        <div class="flex items-center justify-between -mt-2">
          <div class="flex items-center space-x-2">
            <Checkbox
              id="remember"
              v-model:checked="formData.rememberMe"
              :disabled="isLoading"
            />
            <label
              for="remember"
              class="text-sm text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
            >
              记住我
            </label>
          </div>
          <a
            href="#"
            class="text-xs text-muted-foreground hover:text-primary transition-colors"
            @click.prevent
          >
            忘记密码？
          </a>
        </div>

        <!-- 登录按钮 -->
        <Button
          class="w-full h-12 font-medium text-base transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
          :disabled="isLoading"
          @click="handleLoginClick"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
            <svg
              class="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            登录中...
          </span>
          <span v-else class="flex items-center gap-2">
            立即登录
            <ArrowRight class="w-4 h-4" />
          </span>
        </Button>

        <!-- 演示账户 -->
        <div class="p-4 rounded-xl bg-muted/50 border border-border/50">
          <div class="flex items-center gap-2 mb-2">
            <CheckCircle2 class="w-4 h-4 text-primary" />
            <span class="text-sm font-medium text-foreground">演示账户</span>
          </div>
          <p class="text-xs text-muted-foreground">
            邮箱: <span class="text-foreground font-medium">admin@example.com</span>
            <br />
            密码: <span class="text-foreground font-medium">任意密码</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
