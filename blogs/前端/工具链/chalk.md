---
title: chalk
date: 2022-12-18
tags: 

- 工具链

categories:

 - 前端

---

来看一下 [chalk](https://www.npmjs.com/package/chalk) , 主要了解一下是怎么构建链式调用的。

```js
import chalk from 'chalk';

const log = console.log;
log(chalk.blue.bgRed.bold('Hello world!'));
```

我们可以猜一下，`chalk.blue.bgRed.bold`，这些链式属性应该要放在一个对象上来方便管理，然后访问一个属性的时候，使用 getter 来判断有没有传参，没有的话总是返回 this。

---

看了源码，发现除了上面说的（getter 来判断有没传参不对，应该返回一个函数），最最核心的点是使用原型链。每次访问属性创建一个函数，这个函数的原型指向一个全局定义的 proto 对象。其他 styles 对象的属性也是类似的方式来定义。





