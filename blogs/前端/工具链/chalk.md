---
title: chalk
date: 2022-12-18
tags: 

- 工具链

categories:

 - 前端
showSponsor: true
---

## 基础用法

来看一下 [chalk](https://www.npmjs.com/package/chalk) , 主要了解一下是怎么构建链式调用的。

```js
import chalk from 'chalk';

const log = console.log;
log(chalk.blue.bgRed.bold('Hello world!'));
```

我们可以猜一下，`chalk.blue.bgRed.bold`，这些链式属性应该要放在一个对象上来方便管理，然后访问一个属性的时候，使用 getter 来判断有没有传参，没有的话总是返回 this。

---

看了源码，发现除了上面说的（getter 来判断有没传参不对，应该返回一个函数），最最核心的点是使用原型链。每次访问属性创建一个函数，这个函数的原型指向一个全局定义的 proto 对象。其他 styles 对象的属性也是类似的方式来定义。



## 了解更多

chalk 用于对控制台输出的文本样式的设置，另外还有一个包比 `console` 有更美观和方便的API。来看看 [consola](https://www.npmjs.com/package/consola) 这个依赖包吧，它也可以和 chalk 结合起来用：

```js
import consola from 'consola'

consola.success('Added source files')
consola.info('Reporter: Some info')
consola.error(new Error('Foo'))

consola.trace(
  chalk.yellow(
    `Generating definition for file: ${chalk.bold(relativePath)}`
  )
)
```

这两个库在平时业务开发上没必要用，但在一些第三方库会经常用于控制台的输出。怎么说呢？技术很快会过时，没有说学了就是你的，像感情很好的人也会离开，好像没有真正属于你自己的。这技术上能把握的是，去做一个工具库产品的时候去了解去运用，然后分享，这样似乎才比较有价值。



