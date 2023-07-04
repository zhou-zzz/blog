---
title: pdf预览
date: 2023-06-29
description: 在线预览pdf
---

# 前端预览pdf的几种方式
最近做了一个签章功能的业务需求，其中有个功能要求预览签章过后的文件。
因为之前也实现过这个需求，于是立马就写出这个预览组件，通过h5标签embed，直接获取地址传给这个组件。

```vue
<embed
  type="application/pdf"
  :src="pdfUrl"
  width="100%"
  height="100%"
/>
```

由于之前的接口传回来是pdf的在线地址，而现在的接口传回来的是二进制数据，于是我又通过下边的代码生成url。

```ts
const pdfUrl = window.URL.createObjectURL(blob)
```

所有问题引刃而解，完成需求后，我想多总结几种预览pdf的方案，让以后的技术实现上有其他选择。在网上找到了一些方案，其中可以用iframe：

```vue
<iframe
  id="iframe"
  :src="pdfUrl"
  width="100%" height="500px"
>
</iframe>
```
也可以通过object标签内嵌资源：
```vue
<object
  type="application/pdf"
  :data="pdfUrl"
  width="100%"
  height="100%"
>
</object>
```
除了以上方法外，还可以使用第三方插件，这里我用的pdf.js，在官网下载解压，然后在iframe的url中加上你的pdf.js插件所在位置作为前缀即可。其中需要注意的是：
1、通过blob数据转换的url需要encodeURIComponent  
2、前缀需要注意（自己的项目是放在static目录下）
```ts
const url = encodeURIComponent(window.URL.createObjectURL(blob))
const pdfUrl = `static/pdf/web/viewer.html?file=${url}`
```
然后将pdfUrl传给iframe即可。

## 总结
1、html标签有embed、object、iframe预览  
2、可结合第三方库如pdf.js实现预览（移动端上兼容较好，单纯用iframe移动端有坑）

