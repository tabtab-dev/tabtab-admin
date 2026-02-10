/**
 * 面包屑子项数据（用于下拉菜单）
 */
export interface BreadcrumbChildItem {
  /** 标题 */
  title: string;
  /** 路径 */
  path: string;
  /** 图标名称 */
  icon?: string;
  /** 描述信息 */
  description: string;
  /** 是否选中 */
  isActive: boolean;
}

/**
 * 面包屑项数据
 */
export interface BreadcrumbItemData {
  /** 标题 */
  title: string;
  /** 路径 */
  path: string;
  /** 图标名称 */
  icon?: string;
  /** 是否可点击 */
  clickable: boolean;
  /** 是否是当前页面 */
  isCurrent: boolean;
  /** 子菜单项（用于下拉） */
  children?: BreadcrumbChildItem[];
}
