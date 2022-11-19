---
title: LC_有序矩阵中第K小的元素
date: 2022-01-17
tags: 

- LeetCode
- 堆
- 排序

categories:

- 数据结构与算法


---

https://leetcode-cn.com/leetbook/read/top-interview-questions/xaicbc/

这道题可以用最小堆和排序来做，但最小堆在JavaScript中没有 API，笔者只是用了排序来做：

```js
/**
 * @param {number[][]} matrix
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function (matrix, k) {
  let arr = matrix.reduce((a,b)=>{
    return a.concat(b);
  })

  arr.sort((a, b) => {
    return a - b;
  })

  return arr[k-1];
};
```

结果是击败了 60% 的 JavaScript 用户，然后根据题目中的有序信息，改写了代码，先排除掉右下角那些必定大于第 k 大的元素，然后再对剩下的排序。

```javascript
/**
 * @param {number[][]} matrix
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function (matrix, k) {
  let m = Math.sqrt(k * 2);
  m = Math.ceil(m) + 1;

  let arr = [];
  for (let row of matrix) {
    let rr = row.slice(0, m);
    arr.push(...rr);
  }

  arr.sort((a, b) => {
    return a - b;
  })

  return arr[k - 1];
};
```

然而，实际运行结果和第一种差不多，可能是因为第二种只是缩小了规模，并没有降低时间复杂度。



