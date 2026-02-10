/**
 * TTable 组件
 *
 * @description 基于 antdv-next 的 JSON 配置化表格组件，样式与 shadcn-vue 主题对齐
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { TTable } from '@/components/data/TTable'
 * import type { TableSchema, TTableExpose } from '@/components/data/TTable'
 *
 * const tableRef = ref<TTableExpose>()
 * const tableData = ref([
 *   { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
 *   { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
 * ])
 *
 * const schema: TableSchema = {
 *   columns: [
 *     { title: 'ID', dataIndex: 'id', width: 80, align: 'center' },
 *     { title: '姓名', dataIndex: 'name', width: 120 },
 *     { title: '年龄', dataIndex: 'age', width: 100, sorter: true },
 *     { title: '邮箱', dataIndex: 'email', ellipsis: true }
 *   ],
 *   pagination: { pageSize: 10, show: true },
 *   rowSelection: { type: 'checkbox' },
 *   actions: [
 *     {
 *       text: '编辑',
 *       type: 'primary',
 *       onClick: (record) => console.log('编辑', record)
 *     },
 *     {
 *       text: '删除',
 *       type: 'danger',
 *       confirm: true,
 *       confirmText: '确定要删除吗？',
 *       onClick: (record) => console.log('删除', record)
 *     }
 *   ]
 * }
 *
 * const handleSelectChange = (keys: (string | number)[], rows: any[]) => {
 *   console.log('选中行:', keys, rows)
 * }
 * </script>
 *
 * <template>
 *   <TTable
 *     ref="tableRef"
 *     v-model:data="tableData"
 *     :schema="schema"
 *     @select-change="handleSelectChange"
 *   />
 * </template>
 * ```
 *
 * @example
 * // 使用自定义插槽
 * ```vue
 * <script setup lang="ts">
 * import { TTable } from '@/components/data/TTable'
 * import type { TableSchema } from '@/components/data/TTable'
 *
 * const schema: TableSchema = {
 *   columns: [
 *     { title: '状态', dataIndex: 'status', slot: 'status' },
 *     { title: '操作', key: 'action', slot: 'action' }
 *   ]
 * }
 *
 * const data = ref([
 *   { id: 1, name: '张三', status: 'active' }
 * ])
 * </script>
 *
 * <template>
 *   <TTable :schema="schema" :data="data">
 *     <!-- 自定义状态列 -->
 *     <template #status="{ text, record }">
 *       <a-tag :color="text === 'active' ? 'success' : 'default'">
 *         {{ text === 'active' ? '启用' : '禁用' }}
 *       </a-tag>
 *     </template>
 *
 *     <!-- 自定义操作列 -->
 *     <template #action="{ record, index }">
 *       <a-button type="link" @click="handleEdit(record)">编辑</a-button>
 *     </template>
 *   </TTable>
 * </template>
 * ```
 *
 * @example
 * // 展开行
 * ```vue
 * <script setup lang="ts">
 * import { TTable } from '@/components/data/TTable'
 * import type { TableSchema } from '@/components/data/TTable'
 *
 * const schema: TableSchema = {
 *   columns: [
 *     { title: '名称', dataIndex: 'name' }
 *   ],
 *   expandable: {
 *     expandedRowSlot: 'expandedRow'
 *   }
 * }
 * </script>
 *
 * <template>
 *   <TTable :schema="schema" :data="data">
 *     <template #expandedRow="{ record }">
 *       <div class="p-4">
 *         <p>详细信息: {{ record.description }}</p>
 *       </div>
 *     </template>
 *   </TTable>
 * </template>
 * ```
 *
 * @example
 * // 树形表格
 * ```vue
 * <script setup lang="ts">
 * import { TTable } from '@/components/data/TTable'
 * import type { TableSchema } from '@/components/data/TTable'
 *
 * const schema: TableSchema = {
 *   columns: [
 *     { title: '部门名称', dataIndex: 'name' },
 *     { title: '负责人', dataIndex: 'manager' },
 *     { title: '人数', dataIndex: 'count' }
 *   ],
 *   // 树形数据配置
 *   childrenColumnName: 'children',  // 子节点字段名（默认）
 *   indentSize: 20,                   // 层级缩进宽度（像素）
 *   rowSelection: {
 *     type: 'checkbox',
 *     checkStrictly: false  // false: 父子联动选择，true: 独立选择
 *   }
 * }
 *
 * const treeData = ref([
 *   {
 *     id: 1,
 *     name: '技术部',
 *     manager: '张三',
 *     count: 45,
 *     children: [
 *       { id: 11, name: '前端组', manager: '李四', count: 15 },
 *       { id: 12, name: '后端组', manager: '王五', count: 20 }
 *     ]
 *   },
 *   { id: 2, name: '产品部', manager: '赵六', count: 12 }
 * ])
 * </script>
 *
 * <template>
 *   <TTable :schema="schema" :data="treeData" />
 * </template>
 * ```
 */

// 导出组件
// @ts-ignore
export { default as TTable } from './TTable.vue'

// 导出主题配置
export {
  useTTableTheme,
  getTTableThemeConfig
} from './theme'
// 从共享主题导出颜色转换函数
export { oklchToHex } from '../theme-shared'

// 导出类型
export type {
  // 核心类型
  TableSchema,
  TableColumn,
  TableSize,
  AlignType,
  ColumnFilter,
  ColumnSorter,
  RowSelectionConfig,
  RowSelectionType,
  PaginationConfig,
  ScrollConfig,
  TableAction,
  // 组件类型
  TTableProps,
  TTableExpose,
  TTableEmits,
  TableState,
  // 新增类型
  TableRecord,
  TableSorter,
  TablePagination,
  TableFilters,
  TableFilterValue,
  ExpandableConfig,
  SummaryConfig
} from './types'
