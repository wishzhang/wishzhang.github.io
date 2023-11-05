---
title: patch-package
date: 2023-11-05
tags: 

categories:

 - 前端
---
当依赖包不满足需求时，找不到替换依赖包的方式，那么就只能动该依赖包的代码。因为如果不能修改依赖包版本代码的话，那么修改依赖包有两种方式：
- 拷贝依赖包代码到当前项目
- 使用patch-package类似的工具

这里来看一下如何使用patch-package工具，使用的环境是npm。

1、安装

```sh
npm install --save-dev patch-package
```

2、修改node_modules下的对应依赖包的代码

3、执行 `patch-package 依赖包名称`,直接是名称不用版本号等

4、在package.json添加scripts

```json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```



