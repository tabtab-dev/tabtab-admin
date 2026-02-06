/**
 * 中文 - 通用翻译
 * 按钮、标签、提示等
 */
export default {
  // 按钮
  confirm: '确认',
  cancel: '取消',
  save: '保存',
  submit: '提交',
  delete: '删除',
  edit: '编辑',
  create: '创建',
  add: '添加',
  search: '搜索',
  reset: '重置',
  close: '关闭',
  back: '返回',
  next: '下一步',
  previous: '上一步',
  loading: '加载中...',
  refresh: '刷新',
  export: '导出',
  import: '导入',
  download: '下载',
  upload: '上传',
  print: '打印',
  filter: '筛选',
  sort: '排序',
  more: '更多',
  view: '查看',
  detail: '详情',
  actions: '操作',
  expand: '展开',
  collapse: '收起',
  clear: '清空',
  status: '状态',

  // 提示
  success: '操作成功',
  error: '操作失败',
  warning: '警告',
  info: '提示',
  confirmTitle: '确认操作',
  confirmContent: '确定要执行此操作吗？',
  deleteConfirm: '确定要删除吗？此操作不可恢复',
  saveSuccess: '保存成功',
  saveError: '保存失败',
  deleteSuccess: '删除成功',
  deleteError: '删除失败',

  // 表单
  required: '必填',
  optional: '选填',
  pleaseSelect: '请选择',
  pleaseInput: '请输入',
  noData: '暂无数据',
  noResult: '无搜索结果',

  // 时间
  today: '今天',
  yesterday: '昨天',
  tomorrow: '明天',
  thisWeek: '本周',
  thisMonth: '本月',
  thisYear: '本年',

  // 分页
  total: '共 {total} 条',
  pageSize: '条/页',
  jumpTo: '跳至',
  page: '页',

  // 其他
  items: '个子菜单',

  // Header
  header: {
    search: '搜索...',
    searchShortcut: '搜索快捷键',
    notifications: '消息通知',
    markAllRead: '全部已读',
    viewAll: '查看全部通知',
    noNotifications: '暂无通知',
    profile: '个人资料',
    profileDesc: '查看和编辑个人信息',
    settings: '系统设置',
    settingsDesc: '配置系统偏好',
    logout: '退出登录',
    admin: '管理员',
    user: '用户',
    switchToLight: '切换到浅色模式',
    switchToDark: '切换到深色模式',
    themeSettings: '主题设置',
    themeSettingsDesc: '自定义您的界面外观和布局偏好',
  },

  // 面包屑
  breadcrumb: {
    home: '首页',
    ellipsis: '...',
  },

  // 主题设置
  theme: {
    appearance: '外观模式',
    light: '浅色',
    dark: '深色',
    color: '主题配色',
    layout: '布局设置',
    sidebarWidth: '侧边栏宽度',
    radius: '圆角大小',
    sidebarCollapsed: '默认折叠侧边栏',
    fontSize: '字体大小',
    small: '小',
    medium: '中',
    large: '大',
    animations: '动画效果',
    reset: '重置为默认设置',
    colors: {
      default: '默认',
      blue: '蓝色',
      green: '绿色',
      purple: '紫色',
      orange: '橙色',
      red: '红色',
      pink: '粉色',
      teal: '青绿',
      indigo: '靛蓝',
      yellow: '黄色',
      cyan: '青色',
      amber: '琥珀金',
    },
  },
} as const;
