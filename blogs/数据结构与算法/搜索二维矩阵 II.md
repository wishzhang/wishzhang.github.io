---

title: 搜索二维矩阵 II
date: 2021-09-02
tags:

- LeetCode

categories:

 - 数据结构与算法
---

题目详情请查看：[https://leetcode-cn.com/leetbook/read/top-interview-questions/xmlwi1/](https://leetcode-cn.com/leetbook/read/top-interview-questions/xmlwi1/)

一开始笔者根据题目的信息「每行的所有元素从左到右升序排列」和「每列的所有元素从上到下升序排列」，立马浮现的想法是利用二分法查找，但是问题来了，之前运用二分法的时候都是线性的且排好序的数组，在这里同一列或者同一行的两个元素根据位置可以知道大小，但是不同行的不同列就不能确定大小了。所以，如果采用二分法则只在一个维度上采用二分法，另一个维度独立的顺序遍历或者也采用二分法，则这个算法的复杂度是 O(logm*logn） ,规模是1<=m,n<=300，按理这个 log300 * log300 怎么也才执行几百个程序步吧，是符合复杂度要求的。由于这里输入的二维数组的结构的列不可直接编码，所以只在一个维度用二分法，另一维度直接遍历，代码如下：

```javascript
var searchMatrix = function (matrix, target) {
  let flag = false;
  for (let row of matrix) {
    flag = binarySearch(row, target);
    if (flag) {
      break;
    }
  }
  return flag;
};

function binarySearch(arr, target) {
  let start = 0;
  let end = arr.length - 1;
  while (start <= end) {
    let ind = Math.floor((start + end) / 2);
    let num = arr[ind];
    if (target === num) {
      return true;
    } else if (target > num) {
      start = ind + 1;
    } else {
      end = ind - 1;
    }
  }
  return false
}
```

这个算法执行用时 3 秒。

另外一种思路是从右上角第一个格子开始搜索，移动下标一直搜索下去，如果最后下标超出还没有搜索到，则表示没有该元素。这个思路有点像二叉排序树，搜索目标的节点比当前的节点小则往左移动，比当前节点大则往右移动，经过演绎，从右上角出发并不会搜索已搜索的节点而且能有正确的搜索结果，复杂度是O(n)。那么从左上角开始搜索可不可以呢？答案是不可以，因为右边和下边都比当前的大没办法判断，这样的话还是要遍历数组。代码如下：

```javascript
var searchMatrix = function (matrix, target) {
  let flag, rowLen, colLen, rowIndex, colIndex;

  flag = false;
  rowLen = matrix.length;
  colLen = matrix[0].length;
  rowIndex = 0;
  colIndex = colLen - 1;

  while (rowIndex < rowLen && colIndex >= 0) {
    let num = matrix[rowIndex][colIndex];
    if (target === num) {
      flag = true;
      break;
    } else if (target < num) {
      colIndex--;
    } else {
      rowIndex++;
    }
  }

  return flag;
};
```

这个算法用时不到 1 秒！

这道题要求的规模并不大，后来想了想，然后用最简单的两层循环也是可以通过的 T-T

```javascript
var searchMatrix = function (matrix, target) {
  for (let i = 0; i < matrix.length; i++) {
    let row = matrix[i];
    for (let j = 0; j < row.length; j++) {
      let td = row[j];
      if (td === target) {
        return true;
      }
    }
  }
  return false;
}
```

执行用时6秒，但就是能通过！

这里再来总结一下，笔者犯的一个错误是，一开始直接排除了最后一个最简单的解法，直接认为这样的解法肯定会超时的，而没有去分析算法复杂度等等，这其实不是真正地在分析、解决问题。而实际的分析过程可能会考虑多种算法，然后比较这些算法的复杂度，对于同一种算法思想，由于实际的数据不同、数据结构不同、具体的应用场景不同，实现的思路也会有所不同。`这个分析问题的思路才是比较有价值的`，过程中会运用到各种归纳、演绎的思维方法，需要一定的观察力、理解力和基础的数学等工科基础知识，最终来确定一个最适合的算法。

最后记下一个执行用时的估算技巧：执行用时可以在实际的环境做一个基准测试。比如JavaScript在某个浏览器上循环执行一亿（100000000）个程序步，需要大概 2 秒时间，所有这里以 2 秒为程序执行时间上限，则假如规模 n>=10000 那么复杂度就必须小于 O(n^2)。