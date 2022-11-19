---

title: LeetCode_打乱数组
date: 2021-11-28
tags: 

- 数组
- LeetCode

categories:

 - 数据结构与算法

---

题目详情请查看：[https://leetcode-cn.com/leetbook/read/top-interview-questions/xmchc3/](https://leetcode-cn.com/leetbook/read/top-interview-questions/xmchc3/)

这道题考查随机数生成 API 和利用随机数来获取一个随机数组。在 [0, length) 随机取一个整数放到随机数组，取完后将元素从原数组移除，循环这个过程知道length 为 0，即可得到随机数组，时间复杂度是 O(n)。伪代码如下：

```pseudocode
res = []
for nums.length to 0
	index = random(0, nums.length-1)
	res.push(res[index])	
```

以下是 JavaScript 的实现解法：

```javascript
/**
 * @param {number[]} nums
 */
var Solution = function (nums) {
  this.$nums = JSON.parse(JSON.stringify(nums));
  this.nums = nums;
};

/**
 * @return {number[]}
 */
Solution.prototype.reset = function () {
  this.nums = JSON.parse(JSON.stringify(this.$nums));
  return this.nums;
};

/**
 * let ns = nums;
 * for
 *  从ns随机取出一个元素，删除原来的元素，直到ns为空
 * @return {number[]}
 */
Solution.prototype.shuffle = function () {
  let res = [];
  while (this.nums.length > 0) {
    let index = Math.floor(Math.random() * this.nums.length);
    res.push(this.nums[index]);
    this.nums.splice(index, 1);
  }
  return res;
};

/**
 * 用例
 */
let r;
var solution = new Solution([1, 2, 3]);
r = solution.shuffle();
console.log(r);
r = solution.reset();
console.log(r);
r = solution.shuffle();
console.log(r);
```

Math.random() 的用法参考：[Math.random()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/random)

