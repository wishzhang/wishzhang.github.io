---

title: LC_环形链表
date: 2022-2-3
tags: 

- 链表
- 哈希表
- 双指针
- LeetCode

categories:

 - 数据结构与算法

---

题目详情请查看：[https://leetcode-cn.com/leetbook/read/top-interview-questions/xaazns/](https://leetcode-cn.com/leetbook/read/top-interview-questions/xaazns/)

这道题是考查关于链表的应用，一共有 4 种解法。

1、判断一个链表有没有环，一开始想到的是访问过的结点可以收集起来到集合 A，如果访问的结点已经在A 集合中，那么表示有环，这个解法是哈希表的解法。

2、在访问的过程中给结点添加标记，如果访问到有标记的节点表示有环。如下是 JavaScript 的代码实现：

```javascript
// function ListNode(val) {
//      this.val = val;
//      this.next = null;
// }

/**
 * @param {ListNode} head
 * @return {boolean}
 */
 var hasCycle = function(head) {
    let node = head;
    while(node!==null){
      if(!('flag' in node)){
        node.flag = true;
        node = node.next;
      }else{
        return true;
      }
    }
    return false;
};
```

3、采用快慢双指针的方法，如果有换，那么这两个指针一定会相遇，否则不会。

4、经过每个节点时都将节点反向链接，如果最终回到了起点说明是有环，否则无环。

