---

title: LeetCode_两个数组的交集 II
date: 2021-11-29
tags: 

- 数组
- 双指针
- 哈希表
- LeetCode

categories:

 - 数据结构与算法

---

题目详情请查看：[https://leetcode-cn.com/leetbook/read/top-interview-questions/xmcbym/](https://leetcode-cn.com/leetbook/read/top-interview-questions/xmcbym/)

题目的意思是求解两个数组的交集，而且不需要去重。有三种解法：第一种是常规的逻辑解法，用两重循环去判断得到结果，时间复杂度是O(n2)；第二种解法是双指针法，需要首先对两个数组进行排序，然后移动指针直到其中的一个指针到尾部则结束，这个时间复杂度是O(m+n)，但会由于一个数组的规模远小于另一数组规模而更快，另外可能会受到排序算法的影响，还有包括题目说的内存不够的情况；第三种解法是哈希表解法：通过记录一个数组的每个元素出现的次数，然后遍历另一个数组的元素，找到便抵消一个数组对应的一个次数，这种解法的时间复杂度也是O(n)，但空间复杂度也是O(m+n)。以下列出三种解法的JavaScript的实现：

1、常规解法

```js
var intersect = function (nums1, nums2) {
  let res = [];
  for (let m of nums1) {
    for (let j = nums2.length - 1; j >= 0; j--) {
      if (nums2[j] === m) {
        res.push(m);
        nums2.splice(j, 1);
        break;
      }
    }
  }
  return res;
}
```

2、双指针解法

```js
var intersect = function (nums1, nums2) {
  nums1 = nums1.sort((a,b)=>{
    return a-b;
  });
  nums2 = nums2.sort((a,b)=>{
    return a-b;
  });

  let res = [];
  let i, j;
  i = j = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] === nums2[j]) {
      res.push(nums1[i]);
      i++;
      j++;
    } else if (nums1[i] < nums2[j]) {
      i++;
    } else {
      j++;
    }
  }
  return res;
}
```

3、哈希表解法

```js
var intersect = function (nums1, nums2) {
  let hash = {};
  let res = [];
  for (let num of nums1) {
    if (!hash[num]) {
      hash[num] = 0;
    }
    hash[num]++;
  }
  for (let num of nums2) {
    if (hash[num] > 0) {
      res.push(num);
      hash[num]--;
    }
  }
  return res;
}
```

