---
title: sucrace
date: 2022-12-19
tags: 

- 工具链
- 编译

categories:

 - 前端
showSponsor: true

---

[sucrace](https://www.npmjs.com/package/sucrase) 是一个编译器，相对于 babel、typescript 等编译器，它的适用范围很小，只适合在开发环境下适用。因为它主要处理 ts、jsx、flow 这些的简单编译工作，并且不会作编译检查。

来看一个使用[示例](https://github.com/wishzhang/wish-cvue/blob/main/package.json)：

```json
// package.json
{
  "scripts": {
		 "build": "gulp --require sucrase/register/ts -f build/gulpfile.ts",
  }
  "devDependencies": {
  	 "sucrase": "3.20.3"
	}
}
```

`--require ` 参数表示引入一个前置模块，这个模块和 gulp 是兼容的。