import type { CSSProperties, Component } from 'vue'

/**
 * 树节点数据结构
 * @description 标准化的树节点数据格式
 */
export interface TreeNode {
  /** 节点唯一标识 */
  key: string | number
  /** 节点标题 */
  title: string
  /** 子节点 */
  children?: TreeNode[]
  /** 是否禁用 */
  disabled?: boolean
  /** 是否禁用复选框 */
  disableCheckbox?: boolean
  /** 是否可选 */
  selectable?: boolean
  /** 是否为叶子节点 */
  isLeaf?: boolean
  /** 自定义图标 */
  icon?: Component | string
  /** 其他自定义属性 */
  [key: string]: any
}

/**
 * 字段名映射配置
 * @description 用于将业务数据字段映射到 TreeNode 标准字段
 */
export interface FieldNamesConfig {
  /** 标题字段名 */
  title?: string
  /** 键名字段名 */
  key?: string
  /** 子节点字段名 */
  children?: string
  /** 禁用字段名 */
  disabled?: string
  /** 是否为叶子节点字段名 */
  isLeaf?: string
}

/**
 * 树节点事件信息
 */
export interface TreeNodeEvent {
  /** 节点数据 */
  node: TreeNode
  /** 原生事件 */
  event: Event
}

/**
 * 复选框事件信息
 */
export interface TreeCheckEvent {
  /** 选中的 keys */
  checkedKeys: (string | number)[]
  /** 半选的 keys */
  halfCheckedKeys: (string | number)[]
  /** 是否选中 */
  checked: boolean
  /** 选中的节点 */
  checkedNodes: TreeNode[]
  /** 当前节点 */
  node: TreeNode
  /** 原生事件 */
  event: Event
}

/**
 * 展开/折叠事件信息
 */
export interface TreeExpandEvent {
  /** 展开的 keys */
  expandedKeys: (string | number)[]
  /** 是否展开 */
  expanded: boolean
  /** 当前节点 */
  node: TreeNode
}

/**
 * 选择事件信息
 */
export interface TreeSelectEvent {
  /** 选中的 keys */
  selectedKeys: (string | number)[]
  /** 是否选中 */
  selected: boolean
  /** 选中的节点 */
  selectedNodes: TreeNode[]
  /** 当前节点 */
  node: TreeNode
  /** 原生事件 */
  event: Event
}

/**
 * 拖拽事件信息
 */
export interface TreeDragEvent {
  /** 当前节点 */
  node: TreeNode
  /** 拖拽的节点 */
  dragNode?: TreeNode
  /** 拖拽节点的 keys */
  dragNodesKeys?: (string | number)[]
  /** 放置位置 */
  dropPosition?: number
  /** 原生事件 */
  event: DragEvent
  /** 展开的 keys */
  expandedKeys?: (string | number)[]
}

/**
 * 工具栏配置
 */
export interface TreeToolbarConfig {
  /** 是否显示展开全部按钮 */
  showExpandAll?: boolean
  /** 是否显示折叠全部按钮 */
  showCollapseAll?: boolean
  /** 是否显示全选按钮 */
  showSelectAll?: boolean
  /** 是否显示清空选择按钮 */
  showClearSelection?: boolean
  /** 展开全部按钮文本 */
  expandAllText?: string
  /** 折叠全部按钮文本 */
  collapseAllText?: string
  /** 全选按钮文本 */
  selectAllText?: string
  /** 清空选择按钮文本 */
  clearSelectionText?: string
}

/**
 * 搜索配置
 */
export interface TreeSearchConfig {
  /** 是否启用搜索 */
  enabled?: boolean
  /** 搜索占位符 */
  placeholder?: string
  /** 搜索过滤函数 */
  filter?: (node: TreeNode, searchValue: string) => boolean
  /** 是否高亮匹配文本 */
  highlight?: boolean
}

/**
 * 统计配置
 */
export interface TreeStatisticsConfig {
  /** 是否显示统计 */
  enabled?: boolean
  /** 统计标签文本 */
  label?: string
  /** 单位文本 */
  unit?: string
  /** 是否显示半选节点数量 */
  showHalfChecked?: boolean
}

/**
 * TTree 组件 Props
 */
export interface TTreeProps {
  /** 树形数据 */
  treeData: TreeNode[]
  /** 选中的节点 keys（支持 v-model） */
  modelValue?: (string | number)[]
  /** 半选的节点 keys */
  halfCheckedKeys?: (string | number)[]
  /** 展开的节点 keys */
  expandedKeys?: (string | number)[]
  /** 选中的节点 keys（单选/多选节点本身） */
  selectedKeys?: (string | number)[]
  /** 字段名映射配置 */
  fieldNames?: FieldNamesConfig
  /** 是否显示复选框 */
  checkable?: boolean
  /** 父子节点是否联动 */
  checkStrictly?: boolean
  /** 是否默认展开所有节点 */
  defaultExpandAll?: boolean
  /** 是否默认展开父节点 */
  autoExpandParent?: boolean
  /** 是否禁用整棵树 */
  disabled?: boolean
  /** 是否可选中节点 */
  selectable?: boolean
  /** 是否支持多选 */
  multiple?: boolean
  /** 是否显示连接线 */
  showLine?: boolean | { showLeafIcon?: boolean | Component }
  /** 是否显示图标 */
  showIcon?: boolean
  /** 自定义展开/折叠图标 */
  switcherIcon?: Component
  /** 是否节点占据一行 */
  blockNode?: boolean
  /** 虚拟滚动高度 */
  height?: number
  /** 是否启用虚拟滚动 */
  virtual?: boolean
  /** 根元素样式 */
  rootStyle?: CSSProperties
  /** 搜索配置 */
  search?: boolean | TreeSearchConfig
  /** 工具栏配置 */
  toolbar?: boolean | TreeToolbarConfig
  /** 统计配置 */
  statistics?: boolean | TreeStatisticsConfig
  /** 是否可拖拽 */
  draggable?: boolean | ((node: TreeNode) => boolean)
  /** 异步加载数据 */
  loadData?: (node: TreeNode) => Promise<void>
  /** 自定义节点渲染 */
  titleRender?: (node: TreeNode) => any
}

/**
 * TTree 组件事件
 */
export interface TTreeEmits {
  /** 更新选中的节点 keys */
  (e: 'update:modelValue', value: (string | number)[]): void
  /** 更新半选的节点 keys */
  (e: 'update:halfCheckedKeys', value: (string | number)[]): void
  /** 更新展开的节点 keys */
  (e: 'update:expandedKeys', value: (string | number)[]): void
  /** 更新选中的节点 keys */
  (e: 'update:selectedKeys', value: (string | number)[]): void
  /** 点击复选框触发 */
  (e: 'check', event: TreeCheckEvent): void
  /** 展开/折叠节点时触发 */
  (e: 'expand', event: TreeExpandEvent): void
  /** 点击节点触发 */
  (e: 'select', event: TreeSelectEvent): void
  /** 右键点击节点触发 */
  (e: 'rightClick', event: TreeNodeEvent): void
  /** 拖拽开始 */
  (e: 'dragStart', event: TreeDragEvent): void
  /** 拖拽结束 */
  (e: 'dragEnd', event: TreeDragEvent): void
  /** 拖拽进入 */
  (e: 'dragEnter', event: TreeDragEvent): void
  /** 拖拽离开 */
  (e: 'dragLeave', event: TreeDragEvent): void
  /** 拖拽悬停 */
  (e: 'dragOver', event: TreeDragEvent): void
  /** 放置 */
  (e: 'drop', event: TreeDragEvent): void
  /** 搜索值变化 */
  (e: 'search', value: string): void
}

/**
 * TTree 组件暴露的方法
 */
export interface TTreeExpose {
  /** 获取选中的 keys */
  getCheckedKeys: () => (string | number)[]
  /** 设置选中的 keys */
  setCheckedKeys: (keys: (string | number)[]) => void
  /** 获取半选的 keys */
  getHalfCheckedKeys: () => (string | number)[]
  /** 获取展开的 keys */
  getExpandedKeys: () => (string | number)[]
  /** 设置展开的 keys */
  setExpandedKeys: (keys: (string | number)[]) => void
  /** 获取选中的节点 keys（节点本身） */
  getSelectedKeys: () => (string | number)[]
  /** 设置选中的节点 keys */
  setSelectedKeys: (keys: (string | number)[]) => void
  /** 展开所有节点 */
  expandAll: () => void
  /** 折叠所有节点 */
  collapseAll: () => void
  /** 全选（仅 checkable 模式） */
  selectAll: () => void
  /** 清空选择 */
  clearSelection: () => void
  /** 滚动到指定节点 */
  scrollTo: (key: string | number) => void
  /** 获取所有节点数据 */
  getAllNodes: () => TreeNode[]
  /** 获取选中的节点数据 */
  getCheckedNodes: () => TreeNode[]
  /** 刷新树数据 */
  refresh: () => void
}
