---

title: 移动零
date: 2021-09-27
tags:

- LeetCode
- 双指针

categories:

 - 数据结构与算法
---

题目详情请查看：[https://leetcode-cn.com/leetbook/read/top-interview-questions/xmy9jh/](https://leetcode-cn.com/leetbook/read/top-interview-questions/xmy9jh/)

这道题直接想怎么来就怎么来的解法：

```js
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
    let zeroNum = 0;
    for(let i=nums.length-1;i>=0;i--){
        let num = nums[i];
        if(num === 0){
            zeroNum++;
            nums.splice(i,1);
        }
    }
    while(zeroNum--){
        nums.push(0);
    }
};
```

然而，这里又可以扯上双指针的解法，比上面的解法优化，快了一些，其中减少了大量不必要的数组元素移动。双指针不是数据结构，也不是什么算法思路，只是一种编程的技巧（但更能体现一种极客精神、数学的思想）。对比只有一个指针，双指针的引入可以轻易地达到优化的效果。

```js
  /**
   * @param {number[]} nums
   * @return {void} Do not return anything, modify nums in-place instead.
   */
  var moveZeroes = function (nums) {
    let l, r;
    l = r = 0;
    while (r < nums.length) {
      if (nums[r] !== 0) {
        while (l < r && nums[l] !== 0) {
          l++;
        }
        if (l < r) {
          let tmp = nums[l];
          nums[l] = nums[r];
          nums[r] = tmp;
        }
      }
      r++;
    }
  };
```

