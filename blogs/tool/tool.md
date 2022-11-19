---
title: 介绍
date: 2022-01-01
categories:

 - tool.js
---

<div style="text-align:center;font-size: 100px;margin:100px auto 130px;">tool.js</div>

  

`tool.js` 是一个一致性、模块化、高性能的 JavaScript 实用工具库。

> tool.js 遵循 MIT 开源协议发布，并且支持最新的运行环境。 查看各个构件版本的区别并选择一个适合你的版本。



## 安装

浏览器环境

```js
<script src="tool.js"></script>
```



通过 npm

```bash
npm install --save @wishzhang/tool
```



## 引用

```js
// 浏览器环境下，使用tool全局变量
tool.isURL('http://www.baidu.com'); // true

// ES6
import * as tool from '@wishzhang/tool';
import {dateFormat} from '@wishzhang/tool';
tool.isURL('http://www.baidu.com');
dateFormat(new Date(), 'yyyy-MM-dd');

// Node.js
const tool = require('@wishzhang/tool');
tool.isURL('http://www.baidu.com');

```

