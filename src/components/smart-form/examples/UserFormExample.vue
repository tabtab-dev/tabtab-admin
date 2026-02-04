<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { SmartForm } from '@/components/smart-form'
import type { FormFieldConfig } from '@/components/smart-form'

/**
 * 用户表单数据类型
 */
interface UserForm {
  username: string
  email: string
  phone: string
  role: string
  department: string
  status: boolean
  bio: string
  gender: string
  birthDate: string
}

const formRef = ref<InstanceType<typeof SmartForm<UserForm>> | null>(null)
const isSubmitting = ref(false)

/**
 * 用户表单验证 Schema
 */
const userSchema = z.object({
  username: z.string().min(2, '用户名至少2位字符').max(20, '用户名最多20位字符'),
  email: z.string().min(1, '请输入邮箱').email('请输入有效的邮箱地址'),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码'),
  role: z.string().min(1, '请选择角色'),
  department: z.string().min(1, '请选择部门'),
  status: z.boolean().default(true),
  bio: z.string().max(200, '简介最多200字').optional(),
  gender: z.string().min(1, '请选择性别'),
  birthDate: z.string().optional(),
})

/**
 * 角色选项
 */
const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '编辑', value: 'editor' },
  { label: '访客', value: 'visitor' },
]

/**
 * 部门选项
 */
const departmentOptions = [
  { label: '技术部', value: 'tech' },
  { label: '产品部', value: 'product' },
  { label: '运营部', value: 'operation' },
  { label: '市场部', value: 'marketing' },
]

/**
 * 性别选项
 */
const genderOptions = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
  { label: '保密', value: 'secret' },
]

/**
 * 用户表单字段配置 - 使用网格布局
 */
const userFields: FormFieldConfig<UserForm>[] = [
  {
    name: 'username',
    type: 'text',
    label: '用户名',
    placeholder: '请输入用户名',
    required: true,
    colSpan: 1,
  },
  {
    name: 'email',
    type: 'email',
    label: '邮箱',
    placeholder: 'example@company.com',
    required: true,
    colSpan: 1,
  },
  {
    name: 'phone',
    type: 'text',
    label: '手机号',
    placeholder: '13800138000',
    required: true,
    colSpan: 1,
  },
  {
    name: 'birthDate',
    type: 'date',
    label: '出生日期',
    colSpan: 1,
  },
  {
    name: 'role',
    type: 'select',
    label: '角色',
    placeholder: '请选择角色',
    required: true,
    options: roleOptions,
    colSpan: 1,
  },
  {
    name: 'department',
    type: 'select',
    label: '部门',
    placeholder: '请选择部门',
    required: true,
    options: departmentOptions,
    colSpan: 1,
  },
  {
    name: 'gender',
    type: 'radio',
    label: '性别',
    required: true,
    options: genderOptions,
    colSpan: 2,
  },
  {
    name: 'status',
    type: 'switch',
    label: '启用账户',
    colSpan: 2,
  },
  {
    name: 'bio',
    type: 'textarea',
    label: '个人简介',
    placeholder: '请输入个人简介（最多200字）',
    description: '简单介绍一下自己',
    colSpan: 2,
  },
]

/**
 * 表单初始值
 */
const initialValues: Partial<UserForm> = {
  status: true,
  gender: 'secret',
}

/**
 * 处理表单提交
 */
const handleSubmit = async (values: UserForm) => {
  isSubmitting.value = true
  console.log('提交的数据:', values)

  // 模拟 API 调用
  await new Promise(resolve => setTimeout(resolve, 1500))

  alert('用户创建成功！')
  isSubmitting.value = false

  // 重置表单
  formRef.value?.reset()
}

/**
 * 处理表单错误
 */
const handleError = (errors: Record<string, string>) => {
  console.error('表单验证失败:', errors)
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">创建用户</h1>
      <p class="text-muted-foreground">填写以下信息创建新用户</p>
    </div>

    <div class="bg-card rounded-lg border p-6">
      <SmartForm
        ref="formRef"
        :fields="userFields"
        :validation-schema="userSchema"
        :initial-values="initialValues"
        layout="grid"
        :grid-cols="2"
        submit-text="创建用户"
        :submit-loading="isSubmitting"
        show-reset
        reset-text="清空"
        @submit="handleSubmit"
        @error="handleError"
      />
    </div>
  </div>
</template>
