---
title: BFC
date: 2022-2-13
tags: 

- CSS

categories:

 - 前端
---



## 什么是BFC

BFC 即块级格式化上下文，是web页面盒模型的一种渲染模式，是一个独立隔离的容器。



## BFC的特性

- 容器里面的子元素不会影响到外面的元素，反之亦然
- 属于同一个BFC的两个相邻元素垂直的margin会发生叠加
- 计算BFC的高度时，浮动元素也参与计算（当BFC内部有浮动时，为了不影响外部元素的布局，BFC计算高度时会包括浮动元素的高度）



## 触发BFC的方式

- display：inline-block、flex、inline-flex、table-cell、table-caption
- float：除了 none 以外的值
- overflow：除了 visible 以外的值（hidden、auto、scroll）
- position 的值为 absolute、fixed



