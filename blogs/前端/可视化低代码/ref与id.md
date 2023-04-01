---
title: ref与id
date: 2023-04-02
tags: 
- 低代码
- vue

categories:

- 前端
---

在 Vue 的文档可以看到 ref 的作用是两个：

- 当 ref 作用在普通 DOM 元素时，可以获取到对应 DOM 元素对象
- 但 ref 作用在组件的时候，可以获取到对应组件的 Vue 实例

而元素的 id 属性是通过`document.getElementById()`来获取 DOM 元素对象。



那么使用 ref 和 id 的方式在获取 DOM 元素的情况下，有什么区别呢？

有人说 ref 是为了方便获取 DOM，没说清楚。因为有时候也使用 id 获取 DOM 元素，没有说 ref 或 id 有什么区别。来考虑一种场景：当在一个组件内在元素上使用了 id，而一个页面同时使用了两个这组件，那么就会导致第二个组件通过`document.getElementById()`获取的 DOM 是第一个组件的 DOM，第二个组件的 DOM 效果失效。

这个问题解决方法有两个：

- 给组件内的 id 设置不同的值，比如以时间戳的方式设置 id 值
- 当在 vue 组件时，可以通过 ref 解决

使用 Vue 组件在普通元素上添加 ref 属性，渲染后 ref 属性不会在该普通元素而且也不会渲染成 id 属性。



所以考虑一整个页面下组件的这个 id 是否唯一，如果不是就用 ref，如果是那么才考虑使用 id。





