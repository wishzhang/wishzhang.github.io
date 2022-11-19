---
title: Vue.set
date: 2022-02-11
tags: 

- vue2

categories:

 - 前端
---

Vue.set 调用的是下面这个 set 方法：

```js
/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set (target: Array<any> | Object, key: any, val: any): any {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```

如同 set 方法的注释所说的：设置一个对象的属性值，如果当前对象是响应式对象则添加一个新属性的时候，为这个属性添加响应式。为响应式对象添加响应式属性的代码如下：

```js
 defineReactive(ob.value, key, val)
 ob.dep.notify()
```

defineReactive 函数定义了该属性的响应式依赖，当访问该属性的时候将这个依赖添加到当前的 watcher，当这个属性值改变的时候，将通知这个依赖对应所有的 watcher 进行更新。



定义响应式数据是在 created 生命周期后就完成了，定义响应式数据实际是给比如 data 那些属性设置 setter、getter，里面包含收集、触发依赖机制。并且像 splice 这些变异方法，vue 进行了覆盖重写来进行定义响应式。







