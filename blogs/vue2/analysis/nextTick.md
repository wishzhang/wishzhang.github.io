---
title: nextTick
date: 2021-09-26
tags: 

- vue2

categories:

 - 前端
---

今天看了 nextTick 的源码，看之前感觉挺神秘的，因为经常听到一些概念，比如「下一个tick运行」，在 vue 的 created 生命周期访问不到当前组件 dom 节点，等等很多的概念好像都和 nextTick 有关。然后笔者就打开 vue 项目源码看了起来，vue 有个全局的 nextTick 方法，根据这个信息很快找到了对应的 nextTick 的源码，原来只用了一个文件模块几十行代码就实现这个 nextTick。

看完这部分源码，用一句话概括就是，**nextTick 其实是对异步函数的封装**。其中用了优雅降级、兼容性处理、缓冲区、promise的支持等方法进一步处理这个异步函数。如果把一些非关键代码去掉，那么可以理解成这样：

```js
Vue.nextTick(callback);
相当于 Promise.resolve().then(callback);
或 setTimeout(callback);
```

其中 nextTick 的优雅降级的处理涉及到了几个异步的函数，Promise、MutationOberver、setImmediate、setTimeout，按这样的顺序处理，也就是通常是调用的是Promise这样异步方式。

最后，vue 实例上的 nextTick 方法的定义在实例的 render.js 上（在哪里不是那么重要，随着项目演化会改变的），伪代码如下：

```js
Vue.prototype.$nextTick = function (fn: Function) {
  return nextTick(fn, this)
}
function nextTick (cb?: Function, ctx?: Object) {
    cb.call(ctx)
}

// 调用$nextTick
this.$nextTick(function(){
  // 因为this在$nextTick内部已经绑定了，所以这里的this是当前vue实例
})

```



