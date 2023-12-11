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

### 父组件给子组件传函数参数
在vue2这里是没有支持意图的，而react是支持的。如果在vue2传了函数参数给子组件，当子组件调用时this指向的是子组件的实例。而在父组件用箭头函数或者bind方法还不知道可不可行。
那么这样的父子组件通信还是通过直接引用实例来进行。这个问题的造成是vue2框架的设计问题，因为用了this就有指向问题，那么就有函数不能自然传参的问题。还有个问题是，为啥要使用this呢？


### 命题

**抽象与穷举是用来解释世界网的方法（认识论），真假命题挂在网中的结点。**

这里再来看认识论与知识，知识是可以解释一定量的现象并且失真的命题。但注意是基于认识论，认识论基于人的观察（人与世界的交互），而实际场景是难以描述的，知识几乎是失真的（理论的），最终解决问题的场景需要的是认识、观察、实验、判断，参考知识而避免抽象知识的误导（甚至会和实际场景有矛盾）。

认识论+命题，命题的必要性、充分性、控制变量法等只是一些工具而非底层逻辑。



最重要的是，现象的不确定性、未知性、人环境的局限性、时效性等等会导致与目的相背离。知识大多都很快会过时也是过眼云烟了，所以，不管黑猫白猫，能捉到老鼠的才是好猫。**而对于个人来说，更多的应该考虑个人。**



### Symbol

symbol是基础数据类型，像string,数字类型这些类型表示了一定的数值的范围，而symbol目前来看是表示对象的键名的范围。symbol不能序列化也就不能用来保存到数据库，而唯一性只是当前运行环境的唯一性。

那么symbol用在对象的键上，到底解决了什么问题？

**解决的问题是：键名的唯一性，防止名称冲突或被覆盖。因为拿到一个不知道的对象，可以方便地给这个对象加一个键并且保证唯一性。**

#### 创建symbol

有两种方式：一种是使用`Symbol()`每次生成不同的值:

```js
const symbol1 = Symbol();
const symbol2 = Symbol();

console.log(symbol1 === symbol2); // false
```

另一种是`Symbol.for()`:

```js
const symbol1 = Symbol.for('hi');
const symbol2 = Symbol.for('hi');

console.log(symbol1 === symbol2); // true
```

#### 弱封装性

对象上的symbol键默认是不可迭代的，如果需要迭代需要自定义 `Symbol.iterator`

```js
// 创建一个Symbol
const MY_SYMBOL = Symbol();

// 创建一个对象
let obj = {};

// 使用Symbol作为属性键
obj[MY_SYMBOL] = 'Hello, world!';

// 访问使用Symbol作为键的属性
console.log(obj[MY_SYMBOL]);  // 输出：'Hello, world!'
```



### Object

#### Object.is()

这是一种更精确的方式来对值进行比较，和===不同的是，在处理这几个值的比较上+0 -0 NaN。

+0,-0在一些计算上是有表示意义的。NaN表示计算中有出现错误的情况。

> 在JavaScript中，`NaN`（Not a Number）是一种特殊的数值，用于表示某些数学运算的结果未定义或无法表示。使用`NaN`而不是直接抛出错误有几个原因：
>
> 1. **容错性**：在某些情况下，程序可能需要继续执行，即使某个操作的结果未定义或无法表示。例如，如果你正在进行一系列的数学运算，其中一个操作的结果是`NaN`，你可能希望忽略这个结果，而让程序继续执行后续的操作。
> 2. **信息传递**：`NaN`可以传递有关失败操作的信息。例如，如果一个函数返回`NaN`，调用者就知道这个函数的操作失败了。
> 3. **非阻塞性**：JavaScript是一种非阻塞的语言，意味着它会尽可能地避免抛出导致程序停止的错误。相反，它会返回像`NaN`这样的特殊值，以表示操作失败，然后让程序继续运行。
>
> 然而，值得注意的是，虽然`NaN`在某些情况下很有用，但它也可能导致一些混淆。例如，`NaN`不等于任何值，包括其自身。因此，检查一个值是否为`NaN`需要使用特殊的函数，如`isNaN()`。

可以看出一些设计是考虑了JS这门语言的特性和环境。



### Object.freeze()、Object.seal()、Object.preventExtensions()

> Object.freeze()和Object.seal()都是JavaScript中用于限制对象可修改性的方法，但它们之间有一些重要的区别：
>
> Object.freeze()：这个方法会冻结一个对象，使得不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。该对象的原型也不能被重新指定。
>
> Object.seal()：这个方法会封闭一个对象，阻止添加新的属性，并将所有现有属性标记为不可配置。当前存在的属性值可以被改变，但不能被删除。
>
> 总的来说，Object.freeze()提供了比Object.seal()更严格的限制。如果你想要一个对象完全不可变，你应该使用Object.freeze()。如果你只是想防止添加新的属性，而允许修改现有属性，那么你应该使用Object.seal()。

```js
let a = {
  b: 'bb'
}

let b = Object.create(a)

Object.freeze(b)

a.b = 'cc'
//b.b = 'cc'

console.log(b.b)
```

可以看到被冻结的这个对象不能直接修改原型属性值，但是改原型值后可以访问改后的值。



### lodash两个操作对象的方法

```js
// 将数组转成对象
let arr = [
  {
    name: 'zhangsan',
    age: 18
  },
  {
    name: 'lisi',
    age: 38
  }
]
// 要转成的对象
let obj = {
  zhangsan: {
    name: 'zhangsan',
    age: 18
  },
  lisi: {
    name: 'lisi',
    age: 38  
  }
}

// 只需要
_.keyBy(arr, 'name')

// 如果要转成的对象
let obj = {
  zhangsan: 18,
  lisi: 38
}

// 那么
_.mapValues(_.keyBy(arr, 'name'), 'age')
```

如果用原生实现的话：

```js
let newObj = arr.reduce((obj, el) => { 
  obj[el.name] = el.age
}, {})

// 或者
let newObj = {}
arr.forEach(el => {
  newObj[el.name] = el.age
})
```

可以看到使用lodash的代码行数最短，如果熟悉lodash的话易理解性相差不多。



### Number

Number()和+的操作结果一模一样。

```js
Number(3) // 3
Number('3') // 3
typeof Number(3) // "number"
typeof Number('3') // "number"

+'3' // 3
+3 // 3
+-3 // -3

let num = Number(3)
console.log(num === 3); // true

// 但是
typeof new Number('3') // "object"
Number("123abc") // NaN
Number.parseInt("123abc") // 123
Number(true) // 1
```

注意了，传入的值可能是任意类型的话，会进行隐式类型转换，这转换就复杂了。

参考[JavaScript 数据类型和数据结构](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)

> 以下是一些在编程实践中注意JavaScript隐式类型转换的建议：
>
> 理解隐式类型转换规则：了解JavaScript的隐式类型转换规则，可以帮助我们避免一些常见的错误，编写出更加可靠的代码。
>
> 使用严格相等操作符：在使用“==”或“!=”进行比较时，会进行隐式转换，应该尽可能的使用严格相等（“===”或“!==”）操作符进行比较。
>
> 避免隐式转换：在编写代码时应尽量避免隐式转换，而是显式地进行类型转换。



#### 显示转换

> 在JavaScript中，你可以使用以下方法进行显式数据类型转换，当需要转换的时候：
>
> 1. **Number()**：将一个值转换为数字。
>
> ```javascript
> let num = Number("123"); // 将字符串转换为数字
> ```
>
> 2. **String()**：将一个值转换为字符串。
>
> ```javascript
> let str = String(123); // 将数字转换为字符串
> ```
>
> 3. **Boolean()**：将一个值转换为布尔值。
>
> ```javascript
> let bool = Boolean(1); // 将数字转换为布尔值
> ```
>
> 4. **parseInt()** 和 **parseFloat()**：将字符串转换为整数或浮点数。
>
> ```javascript
> let int = parseInt("123"); // 将字符串转换为整数
> let float = parseFloat("123.45"); // 将字符串转换为浮点数
> ```
>
> 5. ~~**.toString()**：将一个值转换为字符串¹。这是一个对象方法，可以用于任何值，除了`null`和`undefined`。~~
>
> ```javascript
> let num = (123).toString(); // 将数字转换为字符串
> ```
>



#### 关于new Number()和Number()

> new Number()和Number()在JavaScript中都可以用来进行类型转换，但它们的行为是有所不同的。
>
> new Number()是一个构造函数，它创建一个Number对象。例如，typeof new Number(42)的结果是"object"，并且new Number(42)不等于42（尽管new Number(42) == 42）。
>
> Number()是一个函数，当它被调用时，它会将参数强制转换为一个数字原始值。例如，Number("123")会返回数字123。
>
> 因此，new Number()和Number()的主要区别在于，new Number()创建的是一个Number对象，而Number()返回的是一个数字原始值。
>
> 在实际编程中，通常推荐使用Number()，因为原始值在大多数情况下更易于处理。而且使用new Number()可能会导致一些意想不到的结果，因为它创建的是一个对象，而不是一个简单的数字。

