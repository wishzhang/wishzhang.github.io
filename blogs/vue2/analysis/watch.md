---
title: watch
date: 2022-02-22
tags: 

- vue2

categories:

 - 前端
---

了解 watch 是怎么实现监听一个prop或data属性值，当一个值改变触发了什么？

我猜想一开始属性是添加为响应式属性，并且把watch值对应的处理函数添加进去，这样就能触发。

二话不说，先写个例子，再在源码打上断点调试：

```vue
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <script src="./dist/vue.js"></script>
</head>

<body>
  <div id="app">
    <div>{{greet}}</div>
    <button @click="onClick">改变值</button>
  </div>

  <script>
    new Vue({
      el: '#app',
      data() {
        return {
          greet: 'hello'
        }
      },
      methods: {
        onClick() {
          this.greet = this.greet === 'hello'? 'hi': 'hello';
        }
      },
      watch: {
        greet(old, val){
          debugger;
          console.log(old,val);
        }
      }
    })
  </script>
</body>

</html>

```

通过调试堆栈，可以很容易看到执行路径。到这里我们先来看看 vue 的响应式原理：

> 首先定义 getter和setter用来自动触发依赖收集和更新。
> 然后用一个watcher（一个watcher有一个处理函数），当前的这个watcher在头和尾中间赋值当前的watcher,当访问到属性时，每个属性是一个依赖，将这个依赖和当前这个watcher关联，当改变这个值的时候，就把和这个依赖关联的watcher执行对应的处理函数。

然后 watch 选项在 vue 实例初始化的时候执行一下 intState:

```js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

```js
function initWatch (vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
```

```js
function createWatcher (
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}
```

```js

  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value)
      } catch (error) {
        handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
      }
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }
```

到这里我们可以看到，通过调用 `vm.$watch(expOrFn, handler, options)` api对expOrFn值进行监听，其原理是 new Watcher （执行访问代码，结果是将依赖与watcher关联）。

---

总结：所以watch的原理是通过调用 new Watcher来执行代码从而触发将依赖和watcher关联，当依赖值变化，对应的watcher就会执行了。





