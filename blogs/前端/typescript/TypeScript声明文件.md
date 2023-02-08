---
title: TypeScript声明文件
date: 2023-02-02
tags: 
- TypeScript

categories:

- 前端
sponsor: true
---

TypeScript 声明文件的作用是对 js 代码提供类型检查，主要会遇到两个问题：

- 全局变量的类型检查问题
- npm 包类型检查问题以及 IDE 智能提示



## 全局变量的类型检查问题

### 识别声明文件的方式

全局变量的 .d.ts 文件在哪里创建呢？首先来看这种场景下 .d.ts 是如何被识别的。

- 识别方式1

一般来说，ts 会解析项目中所有的 *.ts、*.tsx、.d.ts 文件（如果 allowJs 为 true 也会解析 js、jsx），假如仍然无法解析，那么可以检查 tsconfig.json 中的 files、includes 和 excludes 配置。

而 .d.ts 文件有两种表现形式：全局形式和局部形式。当 .d.ts 文件内容没有 import 或 export 时为全局形式，否则为局部形式。全局形式就是正常的定义全局变量类型，局部形式则会将 .d.ts 作为模块。

- 识别方式2

可通过 tsconfig.json 的 types 字段将 node_modules 下的模块文件作为全局形式。



### 声明文件的编写

不同使用场景下的声明文件有不同的方式编写，这里是全局形式的方式。全局变量的声明文件主要有以下几种语法：

- declare var/let/const
- declare function
- declare class
- declare enum
- declare namespace (被淘汰了，建议使用 es6 module)
- interface 和 type (项目太多这样类型，注意命名冲突)



## npm 包类型检查问题以及IDE智能提示

npm 包模块主要有三种，umd、es6 module 和 cmj。



### 识别声明文件的方式

一般我们通过 `import foo from 'foo'` 导入一个 npm 包，这是符合 ES6 模块规范的。

在我们尝试给一个 npm 包创建声明文件之前，需要先看看它的声明文件是否已经存在。一般来说，npm 包的声明文件可能存在于两个地方：

1. 与该 npm 包绑定在一起。判断依据是 `package.json` 中有 `types` 字段，或者有一个 `index.d.ts` 声明文件。
2. 发布到 `@types` 里。

假如以上两种方式都没有找到对应的声明文件，那么我们就需要自己为它写声明文件了。由于是通过 `import` 语句导入的模块，所以声明文件存放的位置也有所约束：

创建一个 `types` 目录，专门用来管理自己写的声明文件，将 `foo` 的声明文件放到 `types/foo/index.d.ts` 中。这种方式需要配置下 `tsconfig.json` 中的 `paths` 和 `baseUrl` 字段。

目录结构：

```autoit
/path/to/project
├── src
|  └── index.ts
├── types
|  └── foo
|     └── index.d.ts
└── tsconfig.json
```

`tsconfig.json` 内容：

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "baseUrl": "./",
        "paths": {
            "*": ["types/*"]
        }
    }
}
```



### 声明文件的编写

npm 包的声明文件主要有以下几种语法：

- [`export`](https://ts.xcatliu.com/basics/declaration-files.html#export) 导出变量
- [`export namespace`](https://ts.xcatliu.com/basics/declaration-files.html#export-namespace) 导出（含有子属性的）对象
- [`export default`](https://ts.xcatliu.com/basics/declaration-files.html#export-default) ES6 默认导出
- [`export =`](https://ts.xcatliu.com/basics/declaration-files.html#export-1) commonjs 导出模块

npm 包的声明文件与全局变量的声明文件有很大区别。在 npm 包的声明文件中，使用 `declare` 不再会声明一个全局变量，而只会在当前文件中声明一个局部变量。只有在声明文件中使用 `export` 导出，然后在使用方 `import` 导入后，才会应用到这些类型声明。

### umd

这种方式将 js 最终打包成一个 js 文件，可以使用 script 标签和 import 引入。这种方式也是可以选择创建一个 .d.ts文件还是多个 .d.ts 文件。但这种方式有个重要的特点是，我们需要额外声明一个全局变量，为了实现这种方式，ts 提供了一个新语法 export as namespace.

```typescript
// types/foo/index.d.ts

export as namespace foo;
export default foo;

declare function foo(): string;
declare namespace foo {
    const bar: number;
}
```



### IDE智能提示

ts 提供代码的类型检查、编译功能，但 IDE 的智能提示功能是 IDE 提供的。其中啥原理了解一点示例就行。

::: warning 注意

IDE 的智能提示是可能出错的。当可以从入口知道的抛出的这些类型，则是可以找的到的。

但还有一些提示是需要 IDE 来处理，不同IDE有不同的处理方式。

:::

## 其它

- exports field of packages.json

[exports](https://webpack.js.org/guides/package-exports/)字段不是 packages.json 的标准字段，而是 wepack、rollup、vite 等打包工具另外实现的字段。这个字段的作用是定义了 npm 包与外界引入方式的映射，解耦了 npm 包内部的文件夹结构与引入姿势的耦合。

来看一个具体的示例：

```json
{
  "main": "dist/index.full.js",
  "module": "dist/index.full.mjs",
  "types": "es/packages/cvue/index.d.ts",
  "unpkg": "dist/index.full.js",
  "jsdelivr": "dist/index.full.js",
  "exports": {
    ".": {
      "types": "./es/packages/cvue/index.d.ts",
      "import": "./es/packages/cvue/index.mjs",
      "require": "./lib/packages/cvue/index.js"
    },
    "./es": "./es/packages/cvue/index.mjs",
    "./lib": "./lib/packages/cvue/index.js",
    "./es/*.mjs": "./es/packages/cvue/*.mjs",
    "./es/*": "./es/packages/cvue/*.mjs",
    "./lib/*.js": "./lib/packages/cvue/*.js",
    "./lib/*": "./lib/packages/cvue/*.js",
    "./*": "./*"
  }
}
```

如果都支持，打包工具会优先选择 exports 字段而不是 types字段。将 类型声明代码 按路径都导出去。
IDE会沿着入口找到类型声明，比如：

```typescript
import type {CvueTestProps} from '@wele/cvue'

let t: CvueTestProps
```

如果没按路径找到，其实IDE也会全局去找类型声明，但 import 的路径不一定是正确的，因为内部结构不一定符合IDE要求（一般是 node 查找规则的那种）。























