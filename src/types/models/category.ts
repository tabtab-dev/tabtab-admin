/**
 * 分类和标签相关类型定义
 */

export interface Category {
  id: string;
  name: string;
  code: string;
  level: 1 | 2;
  parentId?: string;
  parentName?: string;
  sort: number;
  status: 'active' | 'inactive';
  productCount: number;
  description?: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  productCount: number;
  createdAt: string;
}
