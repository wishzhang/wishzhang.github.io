---
title: gulp
date: 2023-04-30
tags: 
- 低代码
- 工具链

categories:

- 前端
---

[gulp](https://gulpjs.com/) 可以为前端构建，提供自由度更高的任务处理。最核心的就是同步和异步任务可以任意嵌套的机制。

这里介绍一下 gulp 的基础使用问题。

- 安装 gulp

```bash
npm install --save-dev gulp
```



- 定义 gulp 构建命令

运行 gulp 命令，默认是读取项目根目录下的 gulpfile 文件。但如果有特殊情况可以指定 gulpfile 的文件位置，并且指定后还需要指定 gulp 的打包命令的上下文（通过 --cwd）。具体可以通过 gulp --help 查看 gulp 命令的用法。如：

```bash
gulp --cwd . --gulpfile lcdp
```



- 定义 gulpfile.js 文件

```js
const { series, parallel } = require('gulp');

function clean(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

function javascript(cb) {
  // body omitted
  cb();
}

exports.build = series(clean, parallel(css, javascript));
```

具体参考 gulp 官方文档。



