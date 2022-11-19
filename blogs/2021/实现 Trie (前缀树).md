---

title: 实现 Trie (前缀树)
date: 2021-09-14
tags: 

- 树

categories:

 - 数据结构与算法

---

题目详情请查看：[https://leetcode-cn.com/leetbook/read/top-interview-questions/xaeate/](https://leetcode-cn.com/leetbook/read/top-interview-questions/xaeate/)

字典树巧妙地将树节点用来表示一个字符（也可以是一个单词的一部分），这样的结构可以包含所有单词，并且同一个节点及其所有直接父节点表示不同单词的公共前缀，从而基于过去完成的结果来计算可以大大减少计算量，从而提高速度。但字典树由于稀疏现象严重，空间利用率会很低。

字典树的基本操作是：添加单词、查找单词、匹配单词前缀。

下面给出字典树的 JavaScript 代码实现：

```javascript
/**
 * Initialize your data structure here.
 */
var Trie = function () {
  this.node = new Node();
};

/**
 * Inserts a word into the trie.
 * @param {string} word
 * @return {void}
 */
Trie.prototype.insert = function (word) {
  let n = this.node;
  let i = 0;
  while (i < word.length) {
    let ch = word[i];
    let code = getCharIndex(ch);
    if (!n.children[code]) {
      n.children[code] = new Node(ch);
    }
    n = n.children[code];
    i++;
  }
  n.full = true;
};

/**
 * Returns if the word is in the trie.
 * @param {string} word
 * @return {boolean}
 */
Trie.prototype.search = function (word) {
  let n = this.node;
  let i = 0;
  let code = 0;
  while (i < word.length) {
    code = getCharIndex(word[i]);
    if (!n.children[code]) {
      break;
    } else {
      n = n.children[code];
    }
    i++;
  }

  if (i === word.length && n.full === true) {
    return true;
  }
  return false;
};

/**
 * Returns if there is any word in the trie that starts with the given prefix.
 * @param {string} prefix
 * @return {boolean}
 */
Trie.prototype.startsWith = function (prefix) {
  let n = this.node;
  let i = 0;
  let code = 0;
  while (i < prefix.length) {
    code = getCharIndex(prefix[i]);
    if (!n.children[code]) {
      break;
    } else {
      n = n.children[code];
    }
    i++;
  }

  if (i === prefix.length) {
    return true;
  }
  return false;
};

function Node(ch = null) {
  return {
    ch: ch,
    children: new Array(26)
  }
}

function getCharIndex(ch) {
  return ch.charCodeAt() - 97;
}

/**
 * Run test example
 */
let trie = new Trie();
trie.insert("apple");
trie.search("apple"); // 返回 True
trie.search("app"); // 返回 False
trie.startsWith("app"); // 返回 True
trie.insert("app");
trie.search("app"); // 返回 True
```



