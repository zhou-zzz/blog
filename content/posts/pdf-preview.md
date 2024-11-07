---
title: pdf预览
date: 2023-06-29
description: 在线预览pdf
---
# 前端预览 PDF 的几种方式

在开发过程中，我们经常会遇到需要在网页上预览 PDF 文件的需求。本文将总结几种常用的前端 PDF 预览方法，帮助开发者在不同场景下选择合适的技术方案。

## 1. 使用 HTML 标签

### 1.1 使用 `<embed>` 标签

`<embed>` 标签可以直接嵌入 PDF 文件，简单易用。

```vue
<embed
  type="application/pdf"
  :src="pdfUrl"
  width="100%"
  height="100%"
/>
```

### 1.2 使用 `<iframe>` 标签

`<iframe>` 标签也是一种常见的嵌入方式，适用于需要在页面中嵌入其他文档的场景。

```vue
<iframe
  id="iframe"
  :src="pdfUrl"
  width="100%" height="500px"
>
</iframe>
```

### 1.3 使用 `<object>` 标签

`<object>` 标签可以嵌入多种类型的资源，包括 PDF 文件。

```vue
<object
  type="application/pdf"
  :data="pdfUrl"
  width="100%"
  height="100%"
>
</object>
```

## 2. 使用第三方库

### 2.1 PDF.js

PDF.js 是一个强大的开源库，可以在网页上渲染 PDF 文件。使用 PDF.js 可以提高移动端的兼容性。

```ts
const url = encodeURIComponent(window.URL.createObjectURL(blob))
const pdfUrl = `static/pdf/web/viewer.html?file=${url}`
```

将生成的 `pdfUrl` 传递给 `<iframe>` 即可实现预览。

## 3. 总结

- HTML 标签（`<embed>`、`<iframe>`、`<object>`）适合简单的 PDF 预览需求，易于实现，但功能和样式有限。
- PDF.js 适合需要自定义界面和功能的场景，尤其是在移动端需要更好兼容性时，但实现较为复杂。
