---
title: tool.MaxHeap
date: 2022-01-01
categories:

 - tool.js
---

堆是一个具有次序的完全二叉树。它有最大堆、最小堆两种形式。以最大堆来说，其特点是每个结点都小于该结点的父结点。



## 构造函数

创建 MaxHeap 最大堆对象。

```js
let maxHeap = new tool.MaxHeap([4, 1, 3, 2]);
```



## MaxHeap 实例

### 属性

无。



### 方法

`insert(x: number): boolean`

`getMax(): number`

`removeMax(): number`

`isEmpty(): boolean`

`size(): number`



## 示例

```js
let maxHeap = new toMaxHeap([4, 1, 3, 2]);

maxHeap.getMax(); // 4
maxHeap.insert(5); // true
maxHeap.insert(6); // true
maxHeap.getMax(); // 6

maxHeap.removeMax(); // 6
maxHeap.size(); // 5
maxHeap.removeMax(); // 5
maxHeap.removeMax(); // 4
maxHeap.removeMax(); // 3
maxHeap.removeMax(); // 2
maxHeap.removeMax(); // 1

maxHeap.isEmpty(); // true
```



