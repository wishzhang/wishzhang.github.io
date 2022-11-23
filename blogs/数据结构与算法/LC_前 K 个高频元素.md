---
title: LC_前 K 个高频元素
date: 2022-01-18
tags: 

- LeetCode
- 堆
- 排序
- 哈希表

categories:

- 数据结构与算法


---

https://leetcode-cn.com/leetbook/read/top-interview-questions/xau4ci/

这里用哈希表、排序的思路来做，对于哈希表一开始用数组的下标来表示键，但发现键可能是负数，然后想到了 ES6 的 Map 接口，这个非常适合存储键值对，比运用对象来存储键值对方便的多。以下是这道题的 JavaScript 实现：

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function(nums, k) {
  let index = -1;
  let arr = [];
  let map = new Map();
  for(let num of nums){
    if(map.has(num)){
      arr[map.get(num)].times++;
    }else{
      index++;
      arr[index] = {
        num: num,
        times: 1
      }
      map.set(num, index);
    }
  }
  arr = arr.sort((a,b)=> b.times - a.times);
  let res = arr.slice(0,k).map(el=> el.num);
  return res;
};
```



