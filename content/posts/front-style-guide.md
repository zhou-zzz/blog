---
title: 代码风格
date: 2024-12-24
tag: ['个人实践']
description: '前端开发'
---

## 一. 命名规范

```ts
// 1. 变量命名（camelCase）
const userName = 'axi'
const userAge = 18

// 2. 常量命名（UPPER_CASE）
const USER_NAME = 'axi'
const API_URL = 'https://api.example.com'

// 3. 函数命名（camelCase，动词开头）
const getUserName = () => {}
const fetchUserInfo = () => {}

// 4. 类命名（PascalCase）
class User {
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

// 5. 组件命名（PascalCase）
const DepartmentUserPicker = () => {}

// 6. 文件命名（kebab-case）
// department-user-picker.vue
// use-user.ts

// 7. 接口命名（PascalCase，通常以I开头）
interface IUserInfo {
  id: string
  name: string
}

// 8. 类型命名（PascalCase，通常以T开头）
type TResponse<T> = {
  code: number
  data: T
  message: string
}
```

## 二.项目结构

```bash
src/
├── assets/                # 静态资源
│   ├── images/           # 图片资源
│   └── styles/           # 样式资源
│
├── components/           # 组件
│
├── composables/         # 组合式函数
│   ├── use-user.ts
│   └── use-theme.ts
│
├── constants/           # 常量定义
│   └── config.ts
│
├── services/           # 服务层
│   ├── user.ts
│   └── auth.ts
│
├── store/             # 状态管理
│   ├── user.ts
│   └── auth.ts
│
├── utils/             # 工具函数
│   ├── storage.ts
│   └── format.ts
│
├── views/             # 页面
│   ├── home/           # 首页
│   │   ├── index.vue
│   │   └── detail.vue
│   └── user-center/   # 用户中心
│       ├── index.vue
│       └── profile.vue
│
├── types/             # 类型定义
│   ├── user.ts
│   └── auth.ts
├── app.vue            # 入口文件
└── main.ts            # 入口脚本
```
关于文件命名all in kebab-case，这样就不用管大小驼峰，但是在js代码中要遵循上述命名规则


## 三.组件编写
```vue
<!-- components/user/user-profile.vue -->
<template>
  <div class="user-profile">
    <!-- 使用 BEM 命名规范 -->
    <div class="user-profile--header">
      <h2 class="user-profile--title">{{ title }}</h2>
    </div>
    
    <div class="user-profile--content">
      <!-- Props 传递使用 kebab-case -->
      <user-avatar
        :avatar-url="userInfo.avatar"
        :user-name="userInfo.name"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// 1. 类型导入
import type { IUserInfo } from '@/types'

// 2. 组件导入
import UserAvatar from './user-avatar.vue'

// 3. Props 定义
interface Props {
  title: string
  userInfo: IUserInfo
}

const props = withDefaults(defineProps<Props>(), {
  title: '用户信息'
})

// 4. Emits 定义
const emit = defineEmits<{
  (e: 'update', value: IUserInfo): void
}>()

// 5. 响应式数据
const loading = ref(false)

// 6. 计算属性
const displayName = computed(() => {
  return props.userInfo.nickname || props.userInfo.name
})

// 7. 方法定义
const handleUpdate = async () => {
  loading.value = true
  try {
    await updateUser()
    emit('update', props.userInfo)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
// 使用 BEM 命名规范
.user-profile {
  &--header {
    // ...
  }
  
  &--title {
    // ...
  }
  
  &--content {
    // ...
  }
}
</style>
```

## 四. Git 规范

```bash
# 提交格式
type(scope): subject

# 类型
feat: 新功能
fix: 修复
docs: 文档
style: 格式
refactor: 重构
test: 测试
chore: 构建
```