/**
 * 组织架构模块 Mock 接口
 * @description 组织架构管理相关接口
 */
import Mock from 'mockjs';
import type { MockMethod } from 'vite-plugin-mock';

// 组织架构数据
let organizationData = [
  {
    id: '1',
    name: '总公司',
    code: 'HQ',
    parentId: null,
    leader: '张总',
    memberCount: 150,
    sort: 1,
    status: 'active',
    description: '公司总部',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: '技术部',
    code: 'TECH',
    parentId: '1',
    leader: '李经理',
    memberCount: 50,
    sort: 1,
    status: 'active',
    description: '负责技术研发',
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    name: '产品部',
    code: 'PRODUCT',
    parentId: '1',
    leader: '王经理',
    memberCount: 20,
    sort: 2,
    status: 'active',
    description: '负责产品设计',
    createdAt: '2024-01-02',
  },
  {
    id: '4',
    name: '市场部',
    code: 'MARKET',
    parentId: '1',
    leader: '赵经理',
    memberCount: 30,
    sort: 3,
    status: 'active',
    description: '负责市场推广',
    createdAt: '2024-01-03',
  },
  {
    id: '5',
    name: '前端组',
    code: 'FE',
    parentId: '2',
    leader: '陈组长',
    memberCount: 15,
    sort: 1,
    status: 'active',
    description: '前端开发团队',
    createdAt: '2024-01-04',
  },
  {
    id: '6',
    name: '后端组',
    code: 'BE',
    parentId: '2',
    leader: '刘组长',
    memberCount: 20,
    sort: 2,
    status: 'active',
    description: '后端开发团队',
    createdAt: '2024-01-04',
  },
];

export default [
  // 获取组织架构列表
  {
    url: '/mock-api/organizations',
    method: 'get',
    response: ({ query }) => {
      const { search, status } = query;

      let filteredData = [...organizationData];

      if (search) {
        const lowerSearch = search.toLowerCase();
        filteredData = filteredData.filter(
          o =>
            o.name.toLowerCase().includes(lowerSearch) ||
            o.code.toLowerCase().includes(lowerSearch)
        );
      }

      if (status) {
        filteredData = filteredData.filter(o => o.status === status);
      }

      return {
        code: 200,
        data: { list: filteredData, total: filteredData.length, page: 1, pageSize: 100 },
        message: 'success',
      };
    },
  },
  // 获取组织架构详情
  {
    url: '/mock-api/organizations/:id',
    method: 'get',
    response: ({ query }) => {
      const org = organizationData.find(o => o.id === query.id);
      if (!org) {
        return { code: 404, data: null, message: '组织不存在' };
      }
      return { code: 200, data: org, message: 'success' };
    },
  },
  // 创建组织
  {
    url: '/mock-api/organizations',
    method: 'post',
    response: ({ body }) => {
      const newOrg = {
        id: String(Date.now()),
        name: body.name,
        code: body.code,
        parentId: body.parentId || null,
        leader: body.leader || '',
        memberCount: 0,
        sort: body.sort || 0,
        status: body.status || 'active',
        description: body.description || '',
        createdAt: new Date().toISOString().split('T')[0],
      };

      organizationData.push(newOrg);
      return { code: 200, data: newOrg, message: 'success' };
    },
  },
  // 更新组织
  {
    url: '/mock-api/organizations/:id',
    method: 'put',
    response: ({ query, body }) => {
      const index = organizationData.findIndex(o => o.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '组织不存在' };
      }

      organizationData[index] = { ...organizationData[index], ...body };
      return { code: 200, data: organizationData[index], message: 'success' };
    },
  },
  // 删除组织
  {
    url: '/mock-api/organizations/:id',
    method: 'delete',
    response: ({ query }) => {
      const index = organizationData.findIndex(o => o.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '组织不存在' };
      }

      // 检查是否有子组织
      const hasChildren = organizationData.some(o => o.parentId === query.id);
      if (hasChildren) {
        return { code: 400, data: null, message: '该组织下存在子组织，无法删除' };
      }

      organizationData.splice(index, 1);
      return { code: 200, data: null, message: 'success' };
    },
  },
  // 更新组织状态
  {
    url: '/mock-api/organizations/:id/status',
    method: 'patch',
    response: ({ query, body }) => {
      const index = organizationData.findIndex(o => o.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '组织不存在' };
      }

      organizationData[index].status = body.status;
      return { code: 200, data: organizationData[index], message: 'success' };
    },
  },
] as MockMethod[];
