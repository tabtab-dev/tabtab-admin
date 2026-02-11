<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TForm } from '@/components/business/TForm';
import type { FormSchema, TFormExpose } from '@/components/business/TForm';
import { useAuthFlow } from '@/composables/useAuthFlow';
import { useThemeStore } from '@/stores/global/theme';
import Logo from '@/components/layout/Logo.vue';
import {
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
  Lock,
  Loader2
} from 'lucide-vue-next';

const router = useRouter();
const { login, isLoading: authLoading } = useAuthFlow();
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
 * 登录加载状态 - 从 useAuthFlow 获取
 */
const isLoading = authLoading;

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

  const result = await login({
    email: values.email,
    password: values.password
  });

  if (result.success) {
    router.push('/');
  } else {
    errorMessage.value = result.error || '登录失败，请检查账户信息';
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
      <!-- 动态背景层 - 使用主题主色 -->
      <div 
        class="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/75 transition-colors duration-500"
        :style="{ 
          background: `linear-gradient(135deg, ${themeStore.currentColors?.primary || 'oklch(0.205 0 0)'} 0%, ${themeStore.currentColors?.primary || 'oklch(0.205 0 0)'}ee 50%, ${themeStore.currentColors?.primary || 'oklch(0.205 0 0)'}cc 100%)`
        }"
      >
        <!-- 动态光晕效果 -->
        <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        <div class="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <!-- 网格装饰 -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <!-- 内容区 -->
      <div class="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
        <!-- Logo -->
        <div class="flex items-center gap-3 animate-fade-in">
          <div 
            class="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg"
            :style="{ borderRadius: `calc(var(--radius) * 1.5)` }"
          >
            <Logo :size="40" />
          </div>
          <span class="text-xl font-bold text-white tracking-tight">TABTAB</span>
        </div>

        <!-- 主文案 -->
        <div class="space-y-8 animate-fade-in-up">
          <div class="space-y-4">
            <div 
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm"
              :style="{ borderRadius: `calc(var(--radius) * 2)` }"
            >
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
              class="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
              :style="{ borderRadius: `calc(var(--radius) * 1.5)` }"
              :class="`animate-fade-in-up animation-delay-${index + 1}`"
            >
              <div 
                class="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10"
                :style="{ borderRadius: `calc(var(--radius))` }"
              >
                <component :is="feature.icon" class="w-4 h-4 text-white" />
              </div>
              <span class="text-sm text-white/90 font-medium">{{ feature.text }}</span>
            </div>
          </div>
        </div>

        <!-- 底部信息 -->
        <div class="flex items-center gap-6 text-white/50 text-sm animate-fade-in">
          <span>© 2026 TABTAB</span>
          <span class="w-1 h-1 rounded-full bg-white/30" />
          <a href="#" class="hover:text-white/80 transition-colors">隐私政策</a>
          <a href="#" class="hover:text-white/80 transition-colors">服务条款</a>
        </div>
      </div>
    </div>

    <!-- 右侧登录表单区 -->
    <div class="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12 relative">
      <!-- 背景装饰 - 使用主题色 -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          class="absolute top-20 right-20 w-64 h-64 rounded-full blur-[80px] opacity-50 transition-colors duration-500"
          :style="{ backgroundColor: themeStore.currentColors?.primary || 'oklch(0.205 0 0)' }"
        />
        <div 
          class="absolute bottom-20 left-20 w-48 h-48 rounded-full blur-[60px] opacity-30 transition-colors duration-500"
          :style="{ backgroundColor: themeStore.currentColors?.accent || themeStore.currentColors?.primary || 'oklch(0.205 0 0)' }"
        />
      </div>

      <!-- 主题切换按钮 -->
      <div class="absolute top-6 right-6 z-20">
        <Button
          variant="ghost"
          size="icon"
          @click="themeStore.toggleMode"
          class="h-10 w-10 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background transition-all duration-200 shadow-sm"
          :style="{ borderRadius: `calc(var(--radius) * 1.5)` }"
          :title="themeStore.currentMode === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
        >
          <Sun v-if="themeStore.currentMode === 'dark'" class="h-5 w-5 text-foreground" />
          <Moon v-else class="h-5 w-5 text-foreground" />
        </Button>
      </div>

      <div class="relative z-10 w-full max-w-[400px] space-y-6">
        <!-- 移动端 Logo -->
        <div class="lg:hidden flex flex-col items-center gap-3 mb-8 animate-fade-in">
          <div 
            class="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg"
            :style="{ borderRadius: `calc(var(--radius) * 1.5)` }"
          >
            <Logo :size="48" />
          </div>
          <span class="text-xl font-bold text-foreground">TABTAB Admin</span>
        </div>

        <!-- 登录表单标题 -->
        <div class="space-y-2 animate-fade-in-up">
          <h2 class="text-2xl font-bold text-foreground">欢迎回来</h2>
          <p class="text-muted-foreground">请输入您的账户信息以继续</p>
        </div>

        <!-- 错误提示 -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="errorMessage"
            class="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20"
            :style="{ borderRadius: `calc(var(--radius))` }"
          >
            <div class="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
            {{ errorMessage }}
          </div>
        </Transition>

        <!-- TForm 登录表单 -->
        <div class="animate-fade-in-up animation-delay-1">
          <TForm
            ref="formRef"
            v-model="formData"
            :schema="loginSchema"
            :loading="isLoading"
            @submit="handleLogin"
            @finish-failed="handleFinishFailed"
          />
        </div>

        <!-- 记住我和忘记密码 -->
        <div class="flex items-center justify-between animate-fade-in-up animation-delay-2">
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
            class="text-sm text-muted-foreground hover:text-primary transition-colors"
            @click.prevent
          >
            忘记密码？
          </a>
        </div>

        <!-- 登录按钮 -->
        <Button
          class="w-full h-11 font-medium text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up animation-delay-2"
          :disabled="isLoading"
          :style="{ borderRadius: `calc(var(--radius))` }"
          @click="handleLoginClick"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
            <Loader2 class="animate-spin h-4 w-4" />
            登录中...
          </span>
          <span v-else class="flex items-center gap-2">
            立即登录
            <ArrowRight class="w-4 h-4" />
          </span>
        </Button>

        <!-- 演示账户 -->
        <div 
          class="p-4 bg-muted/50 border border-border/50 animate-fade-in-up animation-delay-3"
          :style="{ borderRadius: `calc(var(--radius) * 1.5)` }"
        >
          <div class="flex items-center gap-2 mb-2">
            <CheckCircle2 class="w-4 h-4 text-primary" />
            <span class="text-sm font-medium text-foreground">演示账户</span>
          </div>
          <p class="text-xs text-muted-foreground leading-relaxed">
            邮箱: <span class="text-foreground font-medium">admin@example.com</span>
            <br />
            密码: <span class="text-foreground font-medium">任意密码</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 入场动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.animation-delay-1 {
  animation-delay: 0.1s;
}

.animation-delay-2 {
  animation-delay: 0.2s;
}

.animation-delay-3 {
  animation-delay: 0.3s;
}

/* 减少动画偏好 */
.reduce-motion .animate-fade-in,
.reduce-motion .animate-fade-in-up {
  animation: none;
  opacity: 1;
  transform: none;
}

/* 光晕脉冲动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.15;
  }
}

.animate-pulse {
  animation: pulse 4s ease-in-out infinite;
}
</style>
