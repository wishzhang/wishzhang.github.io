---
title: tool.MinHeap
date: 2022-01-01
categories:

 - tool.js
---

堆是一个具有次序的完全二叉树。它有最大堆、最小堆两种形式。以最小堆来说，其特点是每个结点都大于该结点的父结点。



## 构造函数

创建 MinHeap 最小堆对象。

```js
let minHeap = new tool.MinHeap([4, 1, 3, 2]);
```



## MinHeap 实例

### 属性

无。



### 方法

`insert(x: number): boolean`

`getMin(): number`

`removeMin(): number`

`isEmpty(): boolean`

`size(): number`



## 示例

```js
let minHeap = new tool.MinHeap([4, 1, 3, 2]);

minHeap.getMin(); // 1
minHeap.insert(0); // true
minHeap.insert(-1); // true
minHeap.getMin(); // -1

minHeap.removeMin(); // 6
minHeap.size(); // 5
minHeap.removeMin(); // 5
minHeap.removeMin(); // 4
minHeap.removeMin(); // 3
minHeap.removeMin(); // 2
minHeap.removeMin(); // 1

minHeap.isEmpty(); // true
```



