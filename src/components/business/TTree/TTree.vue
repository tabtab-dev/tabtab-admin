<script setup lang="ts">
/**
 * TTree - 树形控件组件
 *
 * @description 封装 antdv Tree 组件，提供搜索、工具栏、统计等功能
 * @example
 * 基础用法：
 *   <TTree
 *     v-model="checkedKeys"
 *     :tree-data="treeData"
 *     checkable
 *   />
 *
 * 带搜索和工具栏：
 *   <TTree
 *     v-model="checkedKeys"
 *     :tree-data="treeData"
 *     checkable
 *     search
 *     toolbar
 *     statistics
 *   />
 *
 * 自定义字段映射：
 *   <TTree
 *     v-model="checkedKeys"
 *     :tree-data="permissionList"
 *     :field-names="{ key: 'id', title: 'name', children: 'children' }"
 *     checkable
 *   />
 */
import { computed, ref, watch, useTemplateRef } from 'vue'
import { Tree, Input, Button, Tooltip } from 'antdv-next'
import { Search, ChevronDown, ChevronRight, CheckSquare, Square, X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type {
  TTreeProps,
  TTreeEmits,
  TTreeExpose,
  TreeNode,
  TreeToolbarConfig,
  TreeSearchConfig,
  TreeStatisticsConfig
} from './types'

defineOptions({
  name: 'TTree'
})

const props = withDefaults(defineProps<TTreeProps>(), {
  checkable: false,
  checkStrictly: false,
  defaultExpandAll: false,
  autoExpandParent: true,
  disabled: false,
  selectable: true,
  multiple: false,
  showLine: false,
  showIcon: false,
  blockNode: false,
  virtual: true,
  search: false,
  toolbar: false,
  statistics: false
})

const emit = defineEmits<TTreeEmits>()

const treeRef = useTemplateRef('treeRef')

const internalCheckedKeys = ref<(string | number)[]>(props.modelValue || [])
const internalHalfCheckedKeys = ref<(string | number)[]>(props.halfCheckedKeys || [])
const internalExpandedKeys = ref<(string | number)[]>(props.expandedKeys || [])
const internalSelectedKeys = ref<(string | number)[]>(props.selectedKeys || [])
const searchValue = ref('')

watch(() => props.modelValue, (val) => {
  internalCheckedKeys.value = val || []
})

watch(() => props.halfCheckedKeys, (val) => {
  internalHalfCheckedKeys.value = val || []
})

watch(() => props.expandedKeys, (val) => {
  internalExpandedKeys.value = val || []
})

watch(() => props.selectedKeys, (val) => {
  internalSelectedKeys.value = val || []
})

const searchConfig = computed<TreeSearchConfig>(() => {
  if (typeof props.search === 'boolean') {
    return { enabled: props.search, placeholder: '搜索...', highlight: true }
  }
  return { enabled: true, placeholder: '搜索...', highlight: true, ...props.search }
})

const toolbarConfig = computed<TreeToolbarConfig>(() => {
  if (typeof props.toolbar === 'boolean') {
    return {
      showExpandAll: true,
      showCollapseAll: true,
      showSelectAll: props.checkable,
      showClearSelection: props.checkable,
      expandAllText: '展开全部',
      collapseAllText: '折叠全部',
      selectAllText: '全选',
      clearSelectionText: '清空'
    }
  }
  return {
    showExpandAll: true,
    showCollapseAll: true,
    showSelectAll: props.checkable,
    showClearSelection: props.checkable,
    expandAllText: '展开全部',
    collapseAllText: '折叠全部',
    selectAllText: '全选',
    clearSelectionText: '清空',
    ...props.toolbar
  }
})

const statisticsConfig = computed<TreeStatisticsConfig>(() => {
  if (typeof props.statistics === 'boolean') {
    return {
      enabled: props.statistics,
      label: '已选择',
      unit: '项',
      showHalfChecked: !props.checkStrictly
    }
  }
  return {
    enabled: true,
    label: '已选择',
    unit: '项',
    showHalfChecked: !props.checkStrictly,
    ...props.statistics
  }
})

const fieldNames = computed(() => {
  return {
    title: props.fieldNames?.title || 'title',
    key: props.fieldNames?.key || 'key',
    children: props.fieldNames?.children || 'children',
    disabled: props.fieldNames?.disabled || 'disabled',
    isLeaf: props.fieldNames?.isLeaf || 'isLeaf'
  }
})

const normalizedTreeData = computed<TreeNode[]>(() => {
  return normalizeTreeData(props.treeData)
})

function normalizeTreeData(data: any[]): TreeNode[] {
  if (!data || !Array.isArray(data)) return []

  return data.map(item => {
    const normalized: TreeNode = {
      key: item[fieldNames.value.key] ?? item.key,
      title: item[fieldNames.value.title] ?? item.title,
      disabled: item[fieldNames.value.disabled] ?? item.disabled,
      isLeaf: item[fieldNames.value.isLeaf] ?? item.isLeaf
    }

    const children = item[fieldNames.value.children] ?? item.children
    if (children && children.length > 0) {
      normalized.children = normalizeTreeData(children)
    }

    return { ...item, ...normalized }
  })
}

const filteredTreeData = computed<TreeNode[]>(() => {
  if (!searchValue.value || !searchConfig.value.enabled) {
    return normalizedTreeData.value
  }
  return filterTreeData(normalizedTreeData.value, searchValue.value)
})

function filterTreeData(data: TreeNode[], keyword: string): TreeNode[] {
  const result: TreeNode[] = []

  for (const node of data) {
    const title = String(node.title || '')
    const isMatch = searchConfig.value.filter
      ? searchConfig.value.filter(node, keyword)
      : title.toLowerCase().includes(keyword.toLowerCase())

    const children = node.children ? filterTreeData(node.children, keyword) : []

    if (isMatch || children.length > 0) {
      result.push({
        ...node,
        children: children.length > 0 ? children : node.children
      })
    }
  }

  return result
}

const allNodeKeys = computed<(string | number)[]>(() => {
  const keys: (string | number)[] = []
  const collect = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      keys.push(node.key)
      if (node.children && node.children.length > 0) {
        collect(node.children)
      }
    }
  }
  collect(normalizedTreeData.value)
  return keys
})

const allParentKeys = computed<(string | number)[]>(() => {
  const keys: (string | number)[] = []
  const collect = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        keys.push(node.key)
        collect(node.children)
      }
    }
  }
  collect(normalizedTreeData.value)
  return keys
})

const selectedCount = computed(() => {
  return internalCheckedKeys.value.length
})

const halfCheckedCount = computed(() => {
  return internalHalfCheckedKeys.value.length
})

function handleCheck(checkedKeys: any, info: any) {
  if (props.checkStrictly) {
    internalCheckedKeys.value = checkedKeys.checked || checkedKeys
    internalHalfCheckedKeys.value = checkedKeys.halfChecked || []
  } else {
    internalCheckedKeys.value = checkedKeys as (string | number)[]
    internalHalfCheckedKeys.value = info.halfCheckedKeys || []
  }

  emit('update:modelValue', internalCheckedKeys.value)
  emit('update:halfCheckedKeys', internalHalfCheckedKeys.value)

  emit('check', {
    checkedKeys: internalCheckedKeys.value,
    halfCheckedKeys: internalHalfCheckedKeys.value,
    checked: info.checked,
    checkedNodes: info.checkedNodes || [],
    node: info.node,
    event: info.event
  })
}

function handleExpand(expandedKeys: (string | number)[], info: any) {
  internalExpandedKeys.value = expandedKeys
  emit('update:expandedKeys', expandedKeys)
  emit('expand', {
    expandedKeys,
    expanded: info.expanded,
    node: info.node
  })
}

function handleSelect(selectedKeys: (string | number)[], info: any) {
  internalSelectedKeys.value = selectedKeys
  emit('update:selectedKeys', selectedKeys)
  emit('select', {
    selectedKeys,
    selected: info.selected,
    selectedNodes: info.selectedNodes || [],
    node: info.node,
    event: info.event
  })
}

function handleSearch(value: string) {
  searchValue.value = value
  emit('search', value)

  if (value && props.autoExpandParent) {
    const matchedKeys = getMatchedKeys(normalizedTreeData.value, value)
    internalExpandedKeys.value = matchedKeys
    emit('update:expandedKeys', matchedKeys)
  }
}

function getMatchedKeys(data: TreeNode[], keyword: string): (string | number)[] {
  const keys: (string | number)[] = []
  const collect = (nodes: TreeNode[], parentKeys: (string | number)[] = []) => {
    for (const node of nodes) {
      const title = String(node.title || '')
      const isMatch = title.toLowerCase().includes(keyword.toLowerCase())

      if (isMatch && parentKeys.length > 0) {
        keys.push(...parentKeys)
      }

      if (node.children && node.children.length > 0) {
        collect(node.children, [...parentKeys, node.key])
      }
    }
  }
  collect(data)
  return [...new Set(keys)]
}

function expandAll() {
  internalExpandedKeys.value = allParentKeys.value
  emit('update:expandedKeys', internalExpandedKeys.value)
}

function collapseAll() {
  internalExpandedKeys.value = []
  emit('update:expandedKeys', [])
}

function selectAll() {
  if (!props.checkable) return
  internalCheckedKeys.value = [...allNodeKeys.value]
  emit('update:modelValue', internalCheckedKeys.value)
}

function clearSelection() {
  internalCheckedKeys.value = []
  internalHalfCheckedKeys.value = []
  emit('update:modelValue', [])
  emit('update:halfCheckedKeys', [])
}

function getCheckedKeys(): (string | number)[] {
  return [...internalCheckedKeys.value]
}

function setCheckedKeys(keys: (string | number)[]) {
  internalCheckedKeys.value = keys
  emit('update:modelValue', keys)
}

function getHalfCheckedKeys(): (string | number)[] {
  return [...internalHalfCheckedKeys.value]
}

function getExpandedKeys(): (string | number)[] {
  return [...internalExpandedKeys.value]
}

function setExpandedKeys(keys: (string | number)[]) {
  internalExpandedKeys.value = keys
  emit('update:expandedKeys', keys)
}

function getSelectedKeys(): (string | number)[] {
  return [...internalSelectedKeys.value]
}

function setSelectedKeys(keys: (string | number)[]) {
  internalSelectedKeys.value = keys
  emit('update:selectedKeys', keys)
}

function scrollTo(key: string | number) {
  treeRef.value?.scrollTo({ key: String(key) })
}

function getAllNodes(): TreeNode[] {
  const nodes: TreeNode[] = []
  const collect = (items: TreeNode[]) => {
    for (const item of items) {
      nodes.push(item)
      if (item.children) {
        collect(item.children)
      }
    }
  }
  collect(normalizedTreeData.value)
  return nodes
}

function getCheckedNodes(): TreeNode[] {
  const checkedKeysSet = new Set(internalCheckedKeys.value)
  return getAllNodes().filter(node => checkedKeysSet.has(node.key))
}

function refresh() {
  searchValue.value = ''
}

defineExpose<TTreeExpose>({
  getCheckedKeys,
  setCheckedKeys,
  getHalfCheckedKeys,
  getExpandedKeys,
  setExpandedKeys,
  getSelectedKeys,
  setSelectedKeys,
  expandAll,
  collapseAll,
  selectAll,
  clearSelection,
  scrollTo,
  getAllNodes,
  getCheckedNodes,
  refresh
})
</script>

<template>
  <div class="t-tree-wrapper">
    <!-- 搜索栏 -->
    <div v-if="searchConfig.enabled" class="t-tree-search mb-3">
      <Input
        v-model:value="searchValue"
        :placeholder="searchConfig.placeholder"
        allow-clear
        @change="(e: Event) => handleSearch((e.target as HTMLInputElement).value)"
      >
        <template #prefix>
          <Search class="w-4 h-4 text-muted-foreground" />
        </template>
      </Input>
    </div>

    <!-- 工具栏 -->
    <div
      v-if="toolbar && (toolbarConfig.showExpandAll || toolbarConfig.showCollapseAll || toolbarConfig.showSelectAll || toolbarConfig.showClearSelection)"
      class="t-tree-toolbar flex items-center flex-wrap gap-1 mb-3 pb-3 border-b"
    >
      <Button
        v-if="toolbarConfig.showExpandAll"
        type="text"
        size="small"
        class="t-tree-toolbar-btn"
        @click="expandAll"
      >
        <ChevronDown class="w-3.5 h-3.5" />
        <span>{{ toolbarConfig.expandAllText }}</span>
      </Button>
      <Button
        v-if="toolbarConfig.showCollapseAll"
        type="text"
        size="small"
        class="t-tree-toolbar-btn"
        @click="collapseAll"
      >
        <ChevronRight class="w-3.5 h-3.5" />
        <span>{{ toolbarConfig.collapseAllText }}</span>
      </Button>
      <div v-if="checkable && (toolbarConfig.showSelectAll || toolbarConfig.showClearSelection)" class="w-px h-4 bg-border" />
      <Button
        v-if="checkable && toolbarConfig.showSelectAll"
        type="text"
        size="small"
        class="t-tree-toolbar-btn"
        @click="selectAll"
      >
        <CheckSquare class="w-3.5 h-3.5" />
        <span>{{ toolbarConfig.selectAllText }}</span>
      </Button>
      <Button
        v-if="checkable && toolbarConfig.showClearSelection"
        type="text"
        size="small"
        class="t-tree-toolbar-btn"
        @click="clearSelection"
      >
        <Square class="w-3.5 h-3.5" />
        <span>{{ toolbarConfig.clearSelectionText }}</span>
      </Button>
    </div>

    <!-- 树组件 -->
    <div class="t-tree-container">
      <Tree
        ref="treeRef"
        v-model:checked-keys="internalCheckedKeys"
        v-model:expanded-keys="internalExpandedKeys"
        v-model:selected-keys="internalSelectedKeys"
        :tree-data="filteredTreeData"
        :checkable="checkable"
        :check-strictly="checkStrictly"
        :default-expand-all="defaultExpandAll"
        :auto-expand-parent="autoExpandParent"
        :disabled="disabled"
        :selectable="selectable"
        :multiple="multiple"
        :show-line="showLine"
        :show-icon="showIcon"
        :block-node="blockNode"
        :height="height"
        :virtual="virtual"
        :draggable="draggable"
        :load-data="loadData"
        :root-style="rootStyle"
        :field-names="{ title: 'title', key: 'key', children: 'children' }"
        @check="handleCheck"
        @expand="handleExpand"
        @select="handleSelect"
      >
        <template v-if="$slots.titleRender" #titleRender="nodeData">
          <slot name="titleRender" :node="nodeData" />
        </template>
        <template v-if="$slots.icon" #icon="nodeData">
          <slot name="icon" :node="nodeData" />
        </template>
        <template v-if="$slots.switcherIcon" #switcherIcon="nodeData">
          <slot name="switcherIcon" :node="nodeData" />
        </template>
      </Tree>
    </div>

    <!-- 统计信息 -->
    <div
      v-if="statisticsConfig.enabled && checkable"
      class="t-tree-statistics flex items-center justify-between px-3 py-2 mt-3 bg-muted/30 rounded-lg"
    >
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground">{{ statisticsConfig.label }}</span>
        <Tooltip
          v-if="statisticsConfig.showHalfChecked && halfCheckedCount > 0"
          :title="`包含 ${halfCheckedCount} 个半选父节点`"
        >
          <span class="text-xs text-muted-foreground cursor-help">(?)</span>
        </Tooltip>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-lg font-semibold text-primary">{{ selectedCount }}</span>
        <span class="text-sm text-muted-foreground">{{ statisticsConfig.unit }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.t-tree-wrapper {
  display: flex;
  flex-direction: column;
}

.t-tree-container {
  flex: 1;
  overflow: auto;
}

.t-tree-search :deep(.ant-input-affix-wrapper) {
  border-radius: 0.5rem;
}

.t-tree-toolbar {
  min-width: 0;
}

.t-tree-toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: hsl(var(--muted-foreground));
  padding: 0.125rem 0.375rem;
  height: auto;
  font-size: 0.75rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.t-tree-toolbar-btn:hover {
  color: hsl(var(--foreground));
  background: hsl(var(--accent));
}

.t-tree-toolbar-btn :deep(.anticon) {
  font-size: 0.875rem;
}
</style>
