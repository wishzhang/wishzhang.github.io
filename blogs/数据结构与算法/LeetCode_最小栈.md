---

title: LeetCode_最小栈
date: 2021-12-01
tags: 

- 栈
- LeetCode

categories:

 - 数据结构与算法

---

题目详情请查看：[https://leetcode-cn.com/leetbook/read/top-interview-questions/xa7r55/](https://leetcode-cn.com/leetbook/read/top-interview-questions/xa7r55/)

常规解法：

```js
var MinStack = function () {
  this.min = undefined;
  this.stack = [];
};

/**
 * @param {number} val
 * @return {void}
 */
MinStack.prototype.push = function (val) {
  this.stack.push(val);

  if (typeof this.min === 'undefined') {
    this.min = val;
  }
  if (val < this.min) {
    this.min = val;
  }
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function () {
  let el = this.stack.pop();
  if (el === this.min) {
    this.min = this._getMin();
  }
};

/**
 * @return {number}
 */
MinStack.prototype.top = function () {
  return this.stack[this.stack.length - 1];
};

/**
 * @return {number}
 */
MinStack.prototype._getMin = function () {
  if (this.stack.length > 0) {
    let min = this.stack[0];
    for (let num of this.stack) {
      if (num < min) {
        min = num;
      }
    }
    return min;
  }
};

MinStack.prototype.getMin = function () {
  return this.min;
};
```

利用现有的数据来发现其可以利用的规律，最小栈方法，是可以利用一个同步栈来标记最小值，是因为结合了实际的栈操作和题目要求而采取的一种方法。代码如下：

```js
var MinStack = function () {
  this.stack2 = [];
  this.stack = [];
};

/**
 * @param {number} val
 * @return {void}
 */
MinStack.prototype.push = function (val) {
  this.stack.push(val);
  if (this.stack2.length && this.stack2[this.stack2.length - 1] <= val) {
    this.stack2.push(this.stack2[this.stack2.length - 1]);
  } else {
    this.stack2.push(val);
  }
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function () {
  this.stack.pop();
  this.stack2.pop();
};

/**
 * @return {number}
 */
MinStack.prototype.top = function () {
  return this.stack[this.stack.length - 1];
};

MinStack.prototype.getMin = function () {
  return this.stack2[this.stack2.length-1];
};
```

