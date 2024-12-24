---
title: 如何封一个好用装组件
date: 2024-11-27
tag: ['Vue']
description: 如何封装一个好用的组件
---

在日常开发中，遇到第三方组件库不满足需求时，我们通常会封装一个组件来满足需求。
如何封装一个好用的组件，是我们开始封装组件的初衷。这里以部门人员选择组件为例，来分析如何封装一个好用的组件。

## 一. 需求分析
首先我们要明确一点，在封装组件前，应该先确定该组件如何使用，有那些功能、接口入参出参等。

部门人员选择组件，以我司为例，有以下需求：
1. 可以单选、多选
2. 面包屑导航
3. 人员才可选择（通常是叶子结点）
4. 取消、确定按钮以及展示选择人数



## 二. 实现

### 1. 命名
如何命名是有考究的，简单来说命名通常为大家常见、熟悉易懂的名称。我司该项目是移动端的项目，且使用了vnat-ui组件库，因此在命名上我参照了该组件的规范，减少其他同事的使用心智负担
文件命名：department-user-picker.vue
组件的props：
options：可选项数据源
field-names：自定义 options 结构中的字段
组件的emit：
cancel：取消选择
confirm：确定选择

### 2. 确定数据结构
```ts
interface CascaderOption {
  id: string
  parentId: string | number
  label: string
  value: string
  children?: CascaderOption[]
  accountId?: string
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
2. 获取的树结构数据伪造一个根节点，方便展示
