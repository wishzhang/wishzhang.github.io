---
title: keep-alive
date: 2022-02-11
tags: 

- vue2

categories:

 - 前端
---



## 动态组件 component 的使用

根据 is 的值，来决定哪个组件被渲染。

```vue
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component v-bind:is="currentTabComponent"></component>
```

在上述示例中，`currentTabComponent` 可以包括

- 已注册组件的名字，或
- 一个组件的选项对象



## 动态组件上使用抽象组件keep-alive

```vue
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

组件会在它们第一次被创建的时候缓存下来。

keep-alive 包含 include、exclude、max属性，根据具体情况使用。
keep-alive 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。当组件在 keep-alive 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。



## 动态组件 component 的源码

讲真，一开始我以为这是内置的一个直接挂载的组件，然后找了半天没找到对应的源码（方法不对），后来看人家的源码分析才知道，这个功能在render的过程中实现，即在编译模板的过程中实现的（也猜到了）。让我们来看看这 vue2 的编译过程吧，主要分为两个步骤：

1. parse 过程：输入模板字符串 -> 输出 ast

2. codegen 过程：输入ast -> 输出render函数

具体编译的这两步代码如下：

```js
  var createCompiler = createCompilerCreator(function baseCompile (
    template,
    options
  ) {
    var ast = parse(template.trim(), options);
    if (options.optimize !== false) {
      optimize(ast, options);
    }
    var code = generate(ast, options);
    return {
      ast: ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns
    }
  });
```

---

在 parse 过程，经过 processComponent 的处理：

```js
function processComponent (el) {
  let binding
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true
  }
}
```

到这里，可能也看不明白，我们没有啥具体要解决的问题，所以很多细节的东西可以略过。这里需要提到的一点是，看源码除了分析大致的思路外，如果想深入一点了解细节，最好的办法是写一点简洁的示例代码打上断点，然后去看函数调用栈和具体的单步调试结果。好了，来展示一行神奇的代码吧：

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
  <component :is="comp1Name"></component>
</div>
<script>
  const comp1 = {
    name: 'comp1Name',
    template: '<div>{{aa}}</div>',
    data() {
      return {
        aa: 'hello-aa'
      }
    }
  };

  Vue.component(comp1.name, comp1);

  new Vue({
    el: '#app',
    data() {
      return {
        comp1Name: comp1.name
      }
    }
  })
</script>
</body>
</html>
```

输入的 template 是:

```
"<div id=\"app\">\n  <component :is=\"comp1.name\"></component>\n</div>"
```

输出的 ast 是(大概的样子)：

```
ast:
attrs: [{…}]
attrsList: [{…}]
attrsMap: {id: 'app'}
children: Array(1)
0:
attrsList: []
attrsMap: {:is: 'comp1.name'}
children: []
component: "comp1.name"
end: 57
parent: {type: 1, tag: 'div', attrsList: Array(1), attrsMap: {…}, rawAttrsMap: {…}, …}
plain: false
rawAttrsMap: {:is: {…}}
start: 17
tag: "component"
type: 1
[[Prototype]]: Object
length: 1
[[Prototype]]: Array(0)
end: 64
parent: undefined
plain: false
rawAttrsMap: {id: {…}}
start: 0
tag: "div"
type: 1
```

好像只是给对 component 标签添加了一个 component 属性，再看看 generate 过程输出的 render 函数吧：

```
"with(this){return _c('div',{attrs:{\"id\":\"app\"}},[_c(comp1.name,{tag:\"component\"})],1)}"
```

这个 render 字符串经过 new Function(code) 转换成函数。可以看到这就是一个正常的 render 函数，最后我们再深入一点。_c 即 createElement 函数，让我们来看看：

```js
if (isDef(data) && isDef(data.is)) {
    tag = data.is
}

if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
  // component
  vnode = createComponent(Ctor, data, context, children, tag)
}
```

所以最后，根据 createComponent 创建 vnode ，后面的步骤和一般的组件的流程一样。



总结：动态组件 component 主要是在 render 过程中通过读取 is 属性值实现的，后面的流程和一般的组件一样。



## 抽象组件 keep-alive 的源码

抽象组件是为了实现某些功能但不作为渲染到页面 DOM 的组件，实现的原理是，页面上的 标签被编译为 vnode，并且抽象组件的 vnode 含有 abstract 为 true 的属性，然后根据这个属性作为判断条件，将其孩子的实际的父节点指向其父节点，从而实现不渲染 keep-alive 标签。部分源码如下：

```js

export function initLifecycle (vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm
  
  vnode.data.keepAlive = true
}
```

**keep-alive 是怎么实现缓存功能的呢？**

我们可以看到 keep-alive 源码位于 core 文件夹下，视为无关平台的实现。其中包含 render 函数，利用内部的 cache 变量（细节之处是这个cache只是实例属性，但不是在data上的，因为不需要响应式）将 `<keep-alive></keep-alive>`标签包裹的的第一个组件缓存，注意缓存的是其 vnode，vnode 的 key 或组件 id 作为缓存的键，这样就实现了缓存功能。

之后的流程和创建组件的流程大致相同，但也不同，为了处理 keep-alive 组件，给 keep-alive 这个vnode 的 data 上添加了 keepAlive 属性，通过这个标志后续再根据需要来处理情况。

```js
export default {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created () {
    this.cache = Object.create(null)
    this.keys = []
  },

  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  render () {
    const slot = this.$slots.default
    const vnode: VNode = getFirstComponentChild(slot)
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
```



**keep-alive 的 activated 和 deactivated 生命周期在哪触发的？**

通过调用 activateChildComponent 和 deactivateChildComponent 两个函数来触发的，触发的时机是在patch里的几个钩子 insert 和 destory：

```js
// inline hooks to be invoked on component VNodes during patch
const componentVNodeHooks = {
  init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },

  prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions
    const child = vnode.componentInstance = oldVnode.componentInstance
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    )
  },

  insert (vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true
      callHook(componentInstance, 'mounted')
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance)
      } else {
        activateChildComponent(componentInstance, true /* direct */)
      }
    }
  },

  destroy (vnode: MountedComponentVNode) {
    const { componentInstance } = vnode
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy()
      } else {
        deactivateChildComponent(componentInstance, true /* direct */)
      }
    }
  }
}
```

keep-alive 的源码看到这里吧，了解了基本的几个问题，over。

---

来说一下 vue2 的源码，乱的地方是有的，一个框架的实现，里面各种依赖调用共同完成功能。理想情况的简单依赖关系在客观复杂的需求下是不存在的。但最终 vue2 实现了它的价值，比起一些设计的完美的可靠性可维护性而没被推广使用的框架来说，vue2 的价值更大。这里面包含了 vue2 的蓝图，产品的设计理念、架构的设计和几个算法细节的设计，这些才是技术通往价值的道路。而一些在当前不那么重要的可维护性可以随着过程改进进行提高。





