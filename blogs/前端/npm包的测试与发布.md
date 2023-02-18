---
title: npm包的测试与发布
date: 2022-11-30
tags: 

- npm

categories:

- 前端
showSponsor: true
---

## 配置 package.json

当完成了一个 npm 包源码的编写并且本地构建完毕，那么就可以开始配置 `package.json`文件了：

```json
{
  "name": "@wishzhang/tool",
  "version": "1.0.0",
  "main": "dist/tool.umd.prod.js.js",
  "module": "dist/tool.esm.prod.js",
  "types": "dist/src/index.d.ts",
  "files": [
  	"dist",
  	"README.md"
  ]
}
```

上面这几个字段是最基本的配置（只配置了这些字段就可以发布），这里说明一下这些字段的含义：

| 字段名           | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| name             | 包名。如上面的包名当被安装的时候执行：`npm install --save @wishzhang/tool`，这里使用了 @wishzhang 命名空间，这里的命名空间需要是 npm 的账号名或另外申请的一个组织名 |
| version          | 版本号                                                       |
| main             | 当不是通过 ES6 module 引入或没有声明 module 字段的时候，引入 npm 包会找到这个入口 |
| module           | 当使用 ES6 module 的时候，会找到这个入口                     |
| types            | TS 类型声明文件的入口                                        |
| files            | 发布后 npm 里包含的文件                                      |
| peerDependencies | 表示宿主环境如果使用该npm包需要满足安装这里声明的条件的依赖。因为该包其实是和宿主环境有些依赖是需要共用的，而不需要共用的依赖则可以放在 dependencies 里面。 |

除了上面几个字段，还有一些比较重要的字段（可选的）：

```json
{
  "name": "@wishzhang/cvue",
  "version": "1.0.3",
  "author": "wishzhang",
  "description": "A Vue.js 3 UI library base on Element Plus",
  "keywords": [
    "@wish",
    "cvue",
    "element-plus",
    "element",
    "component library",
    "ui framework",
    "ui",
    "vue"
  ],
  "license": "MIT",
  "main": "dist/index.full.js",
  "module": "dist/index.full.mjs",
  "unpkg": "dist/index.full.js",
  "jsdelivr": "dist/index.full.js",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/wishzhang/wish-cvue.git"
  },
  "publishConfig": {
    "access": "public"
  },
  "style": "dist/index.css",
  "sideEffects": [
    "dist/*",
    "theme-chalk/**/*.css",
    "theme-chalk/src/**/*.scss"
  ],
  "peerDependencies": {
    "vue": ">=3.2.29"
  },
  "dependencies": {
    "@types/lodash-es": "^4.17.6",
    "lodash-es": "^4.17.21"
  },
  "browserslist": [
    "> 1%",
    "not ie 11",
    "not op_mini all"
  ]
}
```

| 字段名        | 说明                                                         | 是否官方字段 |
| ------------- | ------------------------------------------------------------ | ------------ |
| author        | npm 包的作者名                                               |              |
| description   | 描述                                                         |              |
| keywords      | 可以帮助其他人在 npm 搜索列表中发现你的包                    |              |
| license       | 许可证类型                                                   |              |
| unpkg         | npm 包入口可以通过链接访问。如：https://unpkg.com/@wishzhang/cvue/dist/index.full.js ，建议带上版本号 | 否           |
| jsdelivr      | npm 包入口可以通过链接访问。如：https://cdn.jsdelivr.net/npm/@wishzhang/cvue/dist/index.full.js，建议带上版本号 | 否           |
| repository    | 仓库地址。在 npm 网站上的 npm 包介绍上会展示                 |              |
| publishConfig | 发布的配置。可以指定仓库地址。access 为 public 表示发到 npm 网站上 |              |
| style         | 声明当前模块包含 style 部分，并指定入口文件                  | 否           |
| sideEffects   | 作用同 files 字段                                            | 否           |

发布一个npm所需要的主要配置就是这么多了。细节的研究需要去查看 [npm官网的package.json文档](https://docs.npmjs.com/cli/v8/configuring-npm/package-json) 。

## 测试 npm 包

在测试项目目录下执行 `npm install 包本地路径`，或直接拷贝。

## 发布 npm 包

1、切换到 npm 包的 package.json 所在的目录

2、配置 npm 登录地址（如果已配置可省略这一步）：

```bash
npm config set registry http://registry.npmjs.org
```

3、执行 npm 登录命令（如果已登录可省略这一步）：

```bash
npm login
```

执行后命令行会提示输入账号密码。

4、修改 npm 包的版本号

```bash
npm version <update_type>
```

<update_type>可以是patch, major, or minor，或者其他遵循语义化版本的值

5、登录成功后，执行 npm 发布命令：

```bash
npm publish --access public
```

上面的命令带上了 `--access public` 参数，是因为包含了命名空间。

6、源码版本打上对应版本的 tag，并发布release

## 管理 npm 包

[Deprecating and undeprecating packages or package versions](https://docs.npmjs.com/deprecating-and-undeprecating-packages-or-package-versions)

