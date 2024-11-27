---
title: 部门人员选择组件
date: 2024-11-27
tag: ['Vue', 'Ts', 'mobile']
description: 部门人员选择组件
---

## 一. 需求分析
级联选择

1. 级联选择
2. 部门树形结构展示，先选择部门在选择人员
3. 支持多选
4. 面包屑导航

## 二. 实现

### 1. 先定义好数据结构

```ts
interface DepartmentItem {
  id: string
  parentId: string | number
  label: string
  weight: number
  children?: (DepartmentItem | UserItem)[]
}

// 用户数据结构接口
interface UserItem {
  id: string
  label: string
  accountId: string
}

// 修改选中项的数据结构
interface SelectedItem {
  id: string
  label: string
  accountId?: string // 用户才有 accountId
  deptId?: string // 添加部门ID
  deptName?: string // 添加部门名称
}
```
### 2、面包屑导航
```ts
// 当前路径追踪
const currentPath = ref<DepartmentItem[]>([])

// 处理部门点击
function handleDeptClick(item: DepartmentItem | UserItem) {
  if (isUser(item)) {
    handleSelect(item)
    return
  }

  updateCurrentPath(item)
}

// 更新导航路径
function updateCurrentPath(item: DepartmentItem) {
  const pathIndex = currentPath.value.findIndex(p => p.id === item.id)
  if (pathIndex !== -1)
    currentPath.value = currentPath.value.slice(0, pathIndex + 1)
  else
    currentPath.value.push(item)
}

function isUser(item: DepartmentItem | UserItem): item is UserItem {
  return 'accountId' in item
}
```

### 3、选择逻辑
```ts
// 处理选择
function handleSelect(item: UserItem) {
  // 过滤当前用户
  if (isCurrentUser(item))
    return

  // 更新选中状态
  const index = selectedItems.value.findIndex(i => i.id === item.id)
  if (index === -1)
    addSelectedItem(item)
  else
    removeSelectedItem(index)
}

// 添加选中项
function addSelectedItem(item: UserItem) {
  selectedItems.value.push({
    ...item
  })
}

// 移除选中项
function removeSelectedItem(index: number) {
  selectedItems.value.splice(index, 1)
}
```

### 4、部门树形结构展示

```ts
// 获取当前层级可显示的部门列表
function getCurrentDepts(): DepartmentItem[] {
  if (currentPath.value.length === 0)
    return departments.value

  const lastDept = currentPath.value[currentPath.value.length - 1]
  return (lastDept.children || []) as any
}
```
```vue
<template>
  <div class="select-departments">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span
        v-for="(dept, index) in currentPath"
        :key="dept.id"
        class="breadcrumb-item"
      >
        <span
          class="dept-link"
          @click="currentPath = currentPath.slice(0, index + 1)"
        >
          {{ dept.label }}
        </span>
        <span v-if="index < currentPath.length - 1" class="separator">&gt;</span>
      </span>
    </div>

    <!-- 部门和用户列表 -->
    <div class="dept-list">
      <div
        v-for="item in getCurrentDepts()"
        :key="item.id"
        class="dept-item"
        @click="handleDeptClick(item)"
      >
        <van-cell>
          <template #title>
            <span class="dept-name">{{ item.label }}</span>
          </template>
          <template #right-icon>
            <van-checkbox
              v-if="isUser(item)"
              :disabled="isCurrentUser(item)"
              :checked="isSelected(item.id)"
            />
            <van-icon
              v-else
              name="arrow"
              class="arrow-icon"
            />
          </template>
        </van-cell>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="footer-buttons">
      <van-button
        block
        type="default"
        class="cancel-btn"
        @click="handleClear"
      >
        取消
      </van-button>
      <van-button
        block
        type="primary"
        class="confirm-btn"
        @click="handleConfirm"
      >
        确定
      </van-button>
    </div>
  </div>
</template>
```

## 三、总结

1. 合理拆分业务逻辑
2. 提供良好的交互逻辑，提升用户体验
3. 获取的树结构数据伪造一个根节点，方便展示
