---
title: vue2开发实践
date: 2023-08-11
tags: 

- vue2

categories:

 - 前端
---



### 组件参数

当引入第三方组件库，由于它的通用和默认参数总是不符合具体项目需求，需要对这个第三方组件进行简单的包装。包装的约束主要有以下几点：

- 尽量做到不改变原来组件的所有参数（不增不减）
- 需要改变默认值的参数应当显式声明

上面这种方式是基础组件和业务组件的中间层次，叫做基础业务组件，它具有基础组件原本的通用性并且添加了少量的业务性质，这个就解释了为什么按上面的约束点进行包装的缘由。

那么vue2怎么实现这两点的呢？
假设当前组件为B组件，原来的组件为A组件，B组件里面包含了A组件。那么会有一个问题是，外面传给B组件的多个参数如何原封不动地传给A组件？
vue2提供了一个叫`$attrs`的属性，这个属性默认情况下包含了所有传给B组件的属性（除了class和style属性！），然后通过`v-bind="$attrs"`传给A组件。另外还有个叫`$listener`的属性，这个属性包含了所有传给B的emit事件，通过`v-on="$listener"`传给A组件。代码如下：

```vue
<template>
	<A v-bind="$attrs" v-on="$listener"/>
</template>
```

这样就把传给B组件的参数统一传给A组件了！

那么来到另外一个问题，如何改变传给A组件的默认参数值呢？
显然我们可以在B组件声明对应的参数，改变这个参数值后再传给A组件：

```vue
<template>
	<A v-bind="$attrs" v-on="$listener" :type="type"/>
</template>
<script>
	export default {
		name: 'B',
		props: {
      // 比如需要改变type的默认值
			type: {
				type: String,
				default: 'default'
			}
		}
	}
</script>
```

在`props`声明的属性就不会出现在`$attrs`上了，比如传给B组件的参数只有type、size，当`props`声明了type，那么`$attrs`就不包含type，只有size了。

另外还需要说明一下`inheritAttrs`这个特性，默认是为true表示传给B组件的属性会设置在B组件的根节点上（也是除了props，并且props没有传给A组件）。这个特性其实在vue2没啥作用，因为无论true or false，B组件里面`$attrs`都能获取到对应的值，唯一的作用就是副作用吧，而设置`inheritAttrs: false`可以去掉这种副作用。

讲真，vue2引入的副作用还是比较多的！这个概念模式和react相比也要麻烦。再来看看class和style属性，这两个属性是不受上面所说的影响的，无论设置了啥，传给B组件的class和style都会隐式地设置在B组件的根元素上。其中如果class都保留下来，就算名字相同的；而style的样式相同，则会覆盖根元素对应相同的样式。

ok，到这里上面两点约束的基本就可以实现了，完成对基础组件的包装组件的传参了。

等等。。。最后好像漏了插槽，这个笔者很少用不知道功能是否可行，这里看下大致的代码是怎样的:

```vue
<template>
  <A>
    <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
      <slot :name="slot" v-bind="props" />
    </template>
  </A>
</template>
```

这个叫做嵌套插槽。

但这些特性在一般的业务开发可以不使用的，也就是可选的，竞争力主要在于核心应用场景。



### beforeUpdate

来说一下beforeUpdate这个什么周期的作用。在实践中遇到一个问题：computed里面包含了dom操作，这是不允许的，因为在mounted之前已经调用了。那么这样就需要在mounted之后赋值，在data里面定义数据了。

vue生命周期的原理（也可参照官方文档），执行mounted生命周期执行完会调用mounted钩子，而mounted生命周期执行完其实已经执行了一遍正常的patch流程。这第一遍的流程不会触发beforeUpdate、updated的流程，而当在mounted的钩子或者之后的响应式数据改变，就会触发beforeUpdate、update流程。

在beforeUpdate钩子中可以做一些改变响应式数据的操作，那么在响应式数据改变后就会触发beforeUpdate流程。看一下这个代码例子：
```vue
<template>
  <div>
    <div>msg:{{msg}}</div>
    <div>cmsg:{{cMsg}}</div>
    <button @click="handleClick"> 点击</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        msg: 'hello'
      }
    },
    computed: {
      cMsg() {
        console.log('cMsg')
        return this.msg + 'cMsg'
      }
    },
    mounted() {
      this.msg = 'dd'
      console.log('mounted')
    },
    beforeUpdate() {
      console.log('beforeUpdate')
      this.msg = this.msg + '-beforeUpdate'
    },
    updated() {
      console.log('updated')
    },
    methods: {
      handleClick() {
        this.msg = 'b'
      }
    }
  }
</script>
```

但其实上面的解释是错的，抽象与穷举方法在于数量与变量的变化，对应到归纳法和演绎法。但还需要注意其根基：认识论和基本的逻辑相关性。在上面的例子中，mounted之后并且响应式数据改变了 -> 执行beforeUpdate流程。这个其实是必要但是不充分条件。

从穷举和对单个对象的控制变量发来看，将这段代码注释了结果就会不同：

```vue
<!--    <div>msg:{{msg}}</div>-->
<!--    <div>cmsg:{{cMsg}}</div>-->
```

所以上面的解释应该为：mounted之后 && **视图层的**响应式数据改变了  -> 执行beforeUpdate流程。



### 命题

**抽象与穷举是用来解释世界网的方法（认识论），真假命题挂在网中的结点。**

这里再来看认识论与知识，知识是可以解释一定量的现象并且失真的命题。但注意是基于认识论，认识论基于人的观察（人与世界的交互），而实际场景是难以描述的，知识几乎是失真的（理论的），最终解决问题的场景需要的是认识、观察、实验、判断，参考知识而避免抽象知识的误导（甚至会和实际场景有矛盾）。

认识论+命题，命题的必要性、充分性、控制变量法等只是一些工具而非底层逻辑。



最重要的是，现象的不确定性、未知性、人环境的局限性、时效性等等会导致与目的相背离。知识大多都很快会过时也是过眼云烟了，所以，不管黑猫白猫，能捉到老鼠的才是好猫。**而对于个人来说，更多的应该考虑个人。**



















