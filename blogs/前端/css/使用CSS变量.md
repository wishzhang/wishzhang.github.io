---
title: 使用CSS变量
date: 2022-12-4
tags: 

- css

categories:

 - 前端
showSponsor: true
---

通常我们使用 Sass、Less 和 Stylus 这些预处理器的变量定义、嵌套语法等特性，来提高页面编写的效率和可维护性。而目前各浏览器原生已经支持了 **定义CSS变量** 的特性，虽然目前只相当于支持 CSS 预处理器的一个变量定义的功能，但其优点也很明显：

- 不必安装预处理器就可以定义 CSS 变量，这在一些没有用到构建工具的项目会很有用。
- 由于是浏览器原生支持，当在不同的项目需要引入 CSS 变量时更通用。

估计公司的业务项目在几年内应该还是使用功能更为全面的 CSS 预处理器，但目前 CSS 变量特性在一些开源组件库中会用得比较多。



## 基础用法

定义一个 CSS 变量，属性名需要以 `--` 开头，属性值则可以是任意有效的 CSS 值。可以定义在常见的 CSS 选择器下，在其作用域范围内可访问。通常的最佳实践是定义在根伪类 [`:root`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:root)  下，这样就可以在 HTML 文档的任何地方访问到它了：

```css
:root {
  --text-color: red;
}
```

定义好之后，需要通过 `var()` 函数来引用 CSS 变量：

```css
.demo1 {
	color: var(--text-color);
}
```

`var()` 函数还可以传入第二个参数来提供 **后备值**。当第一个参数失效时，会应用提供的后备值：

```css
.demo2 {
  --text-color: green; 
}

.demo2 .text {
  color: var(--text-color, black); 
}

.demo2 .header {
  color: var(--header-color, blue);
}
```

[在 CodeSandbox 运行完整示例代码，查看效果 ^~^](https://codesandbox.io/s/define-css-variable-64uwe2?file=/index.html)

