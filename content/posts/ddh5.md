---
title: 浙政钉内嵌H5项目搭建
date: 2024-11-20
tag: ['项目搭建']
description: 浙政钉内嵌H5开发
---

## 一. 项目架构

使用脚手架创建项目：vue3+vite+pinia+vue-router+axios+vant+ts+scss

## 二. 项目搭建

1. 使用vite创建vue项目
2. 使用vant作为ui库
3. 使用vue-router管理页面
4. 使用pinia管理状态
5. 使用axios管理请求
6. 使用scss管理样式

## 三. 移动端适配

项目采用 postcss-pxtorem + amfe-flexible 实现移动端适配

1. amfe-flexible 会根据设备宽度动态设置 rem 基准值(HTML根字体大小)
2. postcss-pxtorem 会将px单位自动转换为rem

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover">
```
## 四. Vite 配置

### 4.1 自动导入组件和APi

使用 unplugin-vue-components 和 unplugin-auto-import 实现组件和 API 的自动导入:
```ts
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from '@vant/auto-import-resolver'

export default {
  plugins: [
    Components({
      resolvers: [VantResolver()],
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-import.d.ts',
    })
  ]
}
```

### 4.2 兼容性处理

使用 @vitejs/plugin-legacy 处理浏览器兼容性:

```ts
import legacy from '@vitejs/plugin-legacy'

export default {
  plugins: [
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ]
}
```
## 五、调试
```ts
import VConsole from 'vconsole'

if (import.meta.env.MODE === 'development') {
  new VConsole()
}
```

## 六. 总结
- 浙政钉安卓的浏览器版本比较低，需要降级处理
- 1px线条粗可以使用伪元素➕transform: scaleY(0.5) 处理
