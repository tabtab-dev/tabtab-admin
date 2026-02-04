<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { SmartForm } from '@/components/smart-form'
import type { FormFieldConfig, EnhancedFieldCondition, ConditionGroup } from '@/components/smart-form'

/**
 * 条件表单数据类型
 */
interface ConditionalForm {
  userType: 'individual' | 'company'
  companyName: string
  companyTaxId: string
  personName: string
  personIdCard: string
  contactPhone: string
  contactEmail: string
  hasWebsite: boolean
  websiteUrl: string
  age: number
  needsGuardian: boolean
  guardianName: string
}

const formRef = ref<InstanceType<typeof SmartForm<ConditionalForm>> | null>(null)

/**
 * 表单验证 Schema
 */
const formSchema = z.object({
  userType: z.enum(['individual', 'company']),
  companyName: z.string().optional(),
  companyTaxId: z.string().optional(),
  personName: z.string().optional(),
  personIdCard: z.string().optional(),
  contactPhone: z.string().min(1, '请输入联系电话'),
  contactEmail: z.string().email('请输入有效的邮箱'),
  hasWebsite: z.boolean().default(false),
  websiteUrl: z.string().optional(),
  age: z.number().min(0).max(150),
  needsGuardian: z.boolean().default(false),
  guardianName: z.string().optional(),
})

/**
 * 使用新版增强条件 - 企业用户显示企业字段
 */
const companyCondition: EnhancedFieldCondition<ConditionalForm> = {
  field: 'userType',
  operator: 'eq',
  value: 'company',
  action: 'show',
}

/**
 * 使用新版增强条件 - 个人用户显示个人字段
 */
const personCondition: EnhancedFieldCondition<ConditionalForm> = {
  field: 'userType',
  operator: 'eq',
  value: 'individual',
  action: 'show',
}

/**
 * 使用条件组 - 有网站时显示网址字段
 */
const websiteConditionGroup: ConditionGroup<ConditionalForm> = {
  logic: 'AND',
  conditions: [
    {
      field: 'hasWebsite',
      operator: 'eq',
      value: true,
      action: 'show',
    },
  ],
  action: 'show',
}

/**
 * 使用条件组 - 未成年人需要监护人（AND 条件示例）
 */
const guardianCondition: ConditionGroup<ConditionalForm> = {
  logic: 'AND',
  conditions: [
    {
      field: 'age',
      operator: 'lt',
      value: 18,
      action: 'show',
    },
  ],
  action: 'show',
}

/**
 * 使用条件自动设置值 - 根据年龄自动设置是否需要监护人
 */
const autoSetGuardianCondition: EnhancedFieldCondition<ConditionalForm> = {
  field: 'age',
  operator: 'lt',
  value: 18,
  action: 'setValue',
  targetValue: true,
}

/**
 * 表单字段配置
 */
const formFields: FormFieldConfig<ConditionalForm>[] = [
  {
    name: 'userType',
    type: 'radio',
    label: '用户类型',
    required: true,
    options: [
      { label: '个人用户', value: 'individual' },
      { label: '企业用户', value: 'company' },
    ],
  },
  // 企业字段 - 使用新版条件
  {
    name: 'companyName',
    type: 'text',
    label: '企业名称',
    placeholder: '请输入企业全称',
    conditions: [companyCondition],
  },
  {
    name: 'companyTaxId',
    type: 'text',
    label: '统一社会信用代码',
    placeholder: '请输入税号',
    conditions: [companyCondition],
  },
  // 个人字段 - 使用新版条件
  {
    name: 'personName',
    type: 'text',
    label: '姓名',
    placeholder: '请输入真实姓名',
    conditions: [personCondition],
  },
  {
    name: 'personIdCard',
    type: 'text',
    label: '身份证号',
    placeholder: '请输入18位身份证号',
    conditions: [personCondition],
  },
  // 年龄字段 - 用于演示数值条件
  {
    name: 'age',
    type: 'number',
    label: '年龄',
    placeholder: '请输入年龄',
    required: true,
    conditions: [
      autoSetGuardianCondition,
    ],
  },
  // 监护人字段 - 使用条件组
  {
    name: 'needsGuardian',
    type: 'checkbox',
    label: '需要监护人',
    conditions: [guardianCondition],
  },
  {
    name: 'guardianName',
    type: 'text',
    label: '监护人姓名',
    placeholder: '请输入监护人姓名',
    conditions: [
      {
        logic: 'AND',
        conditions: [
          { field: 'age', operator: 'lt', value: 18, action: 'show' },
          { field: 'needsGuardian', operator: 'eq', value: true, action: 'show' },
        ],
        action: 'show',
      } as ConditionGroup<ConditionalForm>,
    ],
  },
  // 联系信息
  {
    name: 'contactPhone',
    type: 'text',
    label: '联系电话',
    placeholder: '请输入手机号',
    required: true,
  },
  {
    name: 'contactEmail',
    type: 'email',
    label: '联系邮箱',
    placeholder: 'example@email.com',
    required: true,
  },
  // 网站信息 - 使用条件组
  {
    name: 'hasWebsite',
    type: 'switch',
    label: '是否有官方网站',
  },
  {
    name: 'websiteUrl',
    type: 'text',
    label: '网站地址',
    placeholder: 'https://www.example.com',
    conditions: [websiteConditionGroup],
  },
]

/**
 * 表单分组配置
 */
const formGroups = [
  {
    title: '基本信息',
    description: '请选择用户类型并填写相应信息',
    fields: ['userType', 'companyName', 'companyTaxId', 'personName', 'personIdCard'],
    collapsible: true,
    defaultExpanded: true,
  },
  {
    title: '年龄与监护',
    description: '未成年人需要填写监护人信息',
    fields: ['age', 'needsGuardian', 'guardianName'],
    collapsible: true,
    defaultExpanded: true,
  },
  {
    title: '联系信息',
    description: '请填写有效的联系方式',
    fields: ['contactPhone', 'contactEmail', 'hasWebsite', 'websiteUrl'],
    collapsible: true,
    defaultExpanded: false,
  },
]

/**
 * 处理表单提交
 */
const handleSubmit = async (values: ConditionalForm) => {
  console.log('提交的数据:', values)
  alert('表单提交成功！请查看控制台输出')
}

/**
 * 处理表单值变化
 */
const handleChange = (values: Partial<ConditionalForm>) => {
  console.log('表单值变化:', values)
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">条件联动表单示例</h1>
      <p class="text-muted-foreground">
        演示增强的条件联动功能，包括条件操作符、条件组（AND/OR）、自动设值等
      </p>
    </div>

    <div class="bg-card rounded-lg border p-6">
      <SmartForm
        ref="formRef"
        :fields="formFields"
        :groups="formGroups"
        :validation-schema="formSchema"
        submit-text="提交注册"
        show-reset
        reset-text="重置"
        @submit="handleSubmit"
        @change="handleChange"
      />
    </div>

    <!-- 功能说明 -->
    <div class="mt-8 space-y-4">
      <h2 class="text-lg font-semibold">功能特性</h2>
      <ul class="list-disc list-inside space-y-2 text-muted-foreground">
        <li>
          <strong>条件操作符</strong>: 支持 eq、neq、gt、gte、lt、lte、contains、startsWith、endsWith、in
        </li>
        <li>
          <strong>条件组</strong>: 支持 AND/OR 逻辑组合多个条件
        </li>
        <li>
          <strong>自动设值</strong>: 满足条件时自动设置字段值
        </li>
        <li>
          <strong>分组折叠</strong>: 使用 Accordion 实现可折叠的分组
        </li>
        <li>
          <strong>防抖优化</strong>: 表单变更事件使用防抖处理，减少不必要的触发
        </li>
      </ul>
    </div>
  </div>
</template>
