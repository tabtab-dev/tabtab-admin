/**
 * 用户菜单项数据
 */
export interface UserMenuItem {
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 图标名称 */
  icon: string;
  /** 点击处理函数 */
  onClick: () => void;
  /** 是否显示 */
  visible?: boolean;
  /** 主题色 */
  variant?: 'default' | 'primary' | 'danger';
}

/**
 * 用户信息数据
 */
export interface UserInfo {
  /** 用户名 */
  name: string;
  /** 用户邮箱 */
  email: string;
  /** 用户头像 */
  avatar?: string;
  /** 用户角色 */
  role?: string;
}
