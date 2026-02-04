<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useUsersStore } from '@/stores/users';
import { Plus, Search, Edit, Trash2, MoreHorizontal } from 'lucide-vue-next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const usersStore = useUsersStore();

const searchQuery = ref('');
const isAddDialogOpen = ref(false);
const editingUser = ref<any>(null);

const isEditDialogOpen = computed({
  get: () => !!editingUser.value,
  set: (value) => {
    if (!value) {
      editingUser.value = null;
    }
  }
});

const newUser = ref({
  name: '',
  email: '',
  role: 'viewer' as const,
  status: 'active' as const
});

const filteredUsers = computed(() => {
  if (!searchQuery.value) return usersStore.users;
  const query = searchQuery.value.toLowerCase();
  return usersStore.users.filter(
    user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
  );
});

const statusColors = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  suspended: 'bg-red-500/10 text-red-500 border-red-500/20'
};

const roleLabels = {
  admin: '管理员',
  editor: '编辑',
  viewer: '查看者'
};

const handleAddUser = () => {
  usersStore.addUser(newUser.value);
  isAddDialogOpen.value = false;
  newUser.value = { name: '', email: '', role: 'viewer', status: 'active' };
};

const handleEditUser = (user: any) => {
  editingUser.value = { ...user };
};

const handleUpdateUser = () => {
  if (editingUser.value) {
    usersStore.updateUser(editingUser.value.id, editingUser.value);
    editingUser.value = null;
  }
};

const handleDeleteUser = (id: string) => {
  if (confirm('确定要删除此用户吗？')) {
    usersStore.deleteUser(id);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">用户管理</h1>
        <p class="text-muted-foreground mt-1">管理系统用户和权限</p>
      </div>
      <Dialog v-model:open="isAddDialogOpen">
        <DialogTrigger as-child>
          <Button>
            <Plus class="h-4 w-4 mr-2" />
            添加用户
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加新用户</DialogTitle>
            <DialogDescription>填写用户信息以创建新账户</DialogDescription>
          </DialogHeader>
          <div class="space-y-4 py-4">
            <div class="space-y-2">
              <Label for="name">姓名</Label>
              <Input id="name" v-model="newUser.name" placeholder="张三" />
            </div>
            <div class="space-y-2">
              <Label for="email">邮箱</Label>
              <Input id="email" v-model="newUser.email" type="email" placeholder="user@example.com" />
            </div>
            <div class="space-y-2">
              <Label for="role">角色</Label>
              <select
                id="role"
                v-model="newUser.role"
                class="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="viewer">查看者</option>
                <option value="editor">编辑</option>
                <option value="admin">管理员</option>
              </select>
            </div>
            <div class="space-y-2">
              <Label for="status">状态</Label>
              <select
                id="status"
                v-model="newUser.status"
                class="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="active">活跃</option>
                <option value="inactive">非活跃</option>
                <option value="suspended">已暂停</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button @click="handleAddUser">添加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>用户列表</CardTitle>
          <div class="flex items-center gap-2">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                v-model="searchQuery"
                placeholder="搜索用户..."
                class="pl-9 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border">
          <table class="w-full">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="text-left p-4 font-medium">用户</th>
                <th class="text-left p-4 font-medium">角色</th>
                <th class="text-left p-4 font-medium">状态</th>
                <th class="text-left p-4 font-medium">创建时间</th>
                <th class="text-left p-4 font-medium">最后登录</th>
                <th class="text-right p-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in filteredUsers"
                :key="user.id"
                class="border-b hover:bg-muted/50 transition-colors"
              >
                <td class="p-4">
                  <div>
                    <p class="font-medium">{{ user.name }}</p>
                    <p class="text-sm text-muted-foreground">{{ user.email }}</p>
                  </div>
                </td>
                <td class="p-4">
                  <Badge variant="outline">{{ roleLabels[user.role] }}</Badge>
                </td>
                <td class="p-4">
                  <Badge :class="statusColors[user.status]" variant="outline">
                    {{ user.status === 'active' ? '活跃' : user.status === 'inactive' ? '非活跃' : '已暂停' }}
                  </Badge>
                </td>
                <td class="p-4 text-sm text-muted-foreground">{{ user.createdAt }}</td>
                <td class="p-4 text-sm text-muted-foreground">{{ user.lastLogin || '-' }}</td>
                <td class="p-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="handleEditUser(user)">
                        <Edit class="h-4 w-4 mr-2" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="handleDeleteUser(user.id)" class="text-red-500">
                        <Trash2 class="h-4 w-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="6" class="p-8 text-center text-muted-foreground">
                  未找到用户
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <Dialog v-model:open="isEditDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑用户</DialogTitle>
          <DialogDescription>更新用户信息</DialogDescription>
        </DialogHeader>
        <div v-if="editingUser" class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="edit-name">姓名</Label>
            <Input id="edit-name" v-model="editingUser.name" />
          </div>
          <div class="space-y-2">
            <Label for="edit-email">邮箱</Label>
            <Input id="edit-email" v-model="editingUser.email" type="email" />
          </div>
          <div class="space-y-2">
            <Label for="edit-role">角色</Label>
            <select
              id="edit-role"
              v-model="editingUser.role"
              class="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="viewer">查看者</option>
              <option value="editor">编辑</option>
              <option value="admin">管理员</option>
            </select>
          </div>
          <div class="space-y-2">
            <Label for="edit-status">状态</Label>
            <select
              id="edit-status"
              v-model="editingUser.status"
              class="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="active">活跃</option>
              <option value="inactive">非活跃</option>
              <option value="suspended">已暂停</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="editingUser = null">取消</Button>
          <Button @click="handleUpdateUser">保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
