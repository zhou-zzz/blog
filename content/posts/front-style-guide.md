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
│   └── css/           # 样式资源
│
├── components/           # 组件
│
├── composables/         # 组合式函数
│   ├── use-user.ts
│   └── use-theme.ts
│
├── constants/           # 常量定义
│   ├── enum.ts
│   └── config.ts
│
├── services/           # 服务层
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
├── App.vue            # 入口文件
└── main.ts            # 入口脚本
```