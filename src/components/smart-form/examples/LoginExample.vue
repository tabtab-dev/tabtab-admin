<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { Mail, Lock, ArrowRight } from 'lucide-vue-next'
import { SmartForm } from '@/components/smart-form'
import type { FormFieldConfig } from '@/components/smart-form'
import { useAuthStore } from '@/stores/auth'

/**
 * 登录表单数据类型
 */
interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref<InstanceType<typeof SmartForm<LoginForm>> | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')

/**
 * 登录表单验证 Schema
 */
const loginSchema = z.object({
  email: z.string().min(1, '请输入邮箱地址').email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码').min(6, '密码至少6位字符'),
  rememberMe: z.boolean().default(false),
})

/**
 * 登录表单字段配置
 */
const loginFields: FormFieldConfig<LoginForm>[] = [
  {
    name: 'email',
    type: 'email',
    label: '邮箱地址',
    placeholder: 'admin@example.com',
    required: true,
    prefixIcon: Mail,
  },
  {
    name: 'password',
    type: 'password',
    label: '密码',
    placeholder: '••••••••',
    required: true,
    prefixIcon: Lock,
  },
  {
    name: 'rememberMe',
    type: 'checkbox',
    label: '记住我',
  },
]

/**
 * 处理登录提交
 */
const handleLogin = async (values: LoginForm) => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const success = await authStore.login(values.email, values.password)
    if (success) {
      router.push('/')
    } else {
      errorMessage.value = '登录失败，请检查账户信息'
    }
  } catch (error) {
    errorMessage.value = '登录过程中发生错误，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

/**
 * 自定义操作按钮渲染
 */
const renderActions = ({ isSubmitting, isValid, handleSubmit }: {
  isSubmitting: boolean
  isValid: boolean
  handleSubmit: () => void
}) => {
  return (
    <button
      type="submit"
      disabled={!isValid || isLoading.value}
      class="w-full h-12 font-medium text-base transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 bg-primary text-primary-foreground rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading.value || isSubmitting ? (
        <>
          <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          登录中...
        </>
      ) : (
        <>
          立即登录
          <ArrowRight class="w-4 h-4" />
        </>
      )}
    </button>
  )
}
</script>

<template>
  <div class="w-full max-w-[400px] space-y-8">
    <!-- 标题 -->
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

    <!-- 智能表单 -->
    <SmartForm
      ref="formRef"
      :fields="loginFields"
      :validation-schema="loginSchema"
      :initial-values="{ email: '', password: '', rememberMe: false }"
      submit-text="立即登录"
      :submit-loading="isLoading"
      :render-actions="renderActions"
      @submit="handleLogin"
    />

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
</template>
