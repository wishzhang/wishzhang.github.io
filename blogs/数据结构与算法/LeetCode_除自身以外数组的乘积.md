---

title: LeetCode_除自身以外数组的乘积
date: 2021-11-30
tags: 

- 数组
- LeetCode

categories:

 - 数据结构与算法

---

题目详情请查看：[https://leetcode-cn.com/leetbook/read/top-interview-questions/xmf6z5/](https://leetcode-cn.com/leetbook/read/top-interview-questions/xmf6z5/)

这道题也是常规逻辑题，由于题目要求 O(n) 复杂度，从最初的逻辑演绎，到后面通过一定的空间换时间、缓存的思想，了解基础数据、基础解法的特点。有了一个 O(n) 算法的思路：遍历一遍数组便可以去得到每项 nums[i] 的前面所有的乘积，经过一些特性的思考得到，每项 nums[i] 的结果为其前面所有项乘积，和后面所有项乘积相乘的结果。

JavaScript 的算法实现如下：

```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function (nums) {
  let chengji1s = [];
  let chengji2s = [];
  chengji1s[0] = 1;
  chengji1s[1] = nums[0];
  chengji2s[nums.length-1] = 1;
  chengji2s[nums.length-2] = nums[nums.length-1];

  for (let i = 2; i < nums.length; i++) {
    chengji1s[i] = chengji1s[i - 1] * nums[i - 1];
  }

  for (let i = nums.length - 3; i >= 0; i--) {
    chengji2s[i] = chengji2s[i+1] * nums[i+1];
  }

  let res = [];
  for (let i = 0; i < nums.length; i++) {
    res[i] = chengji1s[i] * chengji2s[i];
  }

  return res;
};
```

