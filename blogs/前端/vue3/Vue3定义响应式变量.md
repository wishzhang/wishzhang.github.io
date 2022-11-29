---
title: Vue3定义响应式变量
date: 2022-11-28
isShowComments: true
tags:
- Vue3

categories:

 - 前端
---

## 使用 reactive

我们可以使用 `reactive()` 函数创建一个响应式对象或数组：

```js
import { reactive } from 'vue'

const state1 = reactive({ count: 0 })
const state2 = reactive([{
	name: 'zhangsan'
}])
```

使用 `reactive()` 定义的变量可以直接操作，并在模板中直接使用：

```vue
<script setup>
import { reactive } from 'vue'

const state1 = reactive({ count: 0 })

const increase = () => {
	state1.count++
}

increase()
console.log(state1.count)
// 1
</script>

<template>
	<button @click="increase">
    {{ state1.count }}
  </button>
</template>
```

## reactive的局限性

1、仅对对象类型有效（对象、数组和 `Map` 、`Set` 这样的集合类型），而对 `string` 、`number` 和 `boolean` 这样的原始类型无效。

2、因为 Vue 的响应式系统是通过属性访问进行追踪的，因此我们必须始终保持对该响应式对象的相同引用。这意味着我们不可以随意地“替换”一个响应式对象，因为这将导致对初始引用的响应性连接丢失（视图不会响应变化）

```vue
let state = reactive({ count: 0 })

// 错误
state = { count: 1 }

// 错误
const change = () => {
  state = reactive({
      count: 2
    })
}

<template>
  <button @click="change">change</button>
</template>
```

同时这也意味着当我们将响应式对象的属性赋值或解构至本地变量时，或是将该属性传入一个函数时，我们会失去响应性：

```js
const state = reactive({ count: 0 })

// n 是一个局部变量，同 state.count
// 失去响应性连接
let n = state.count
// 不影响原始的 state
n++

// count 也和 state.count 失去了响应性连接
let { count } = state
// 不会影响原始的 state
count++

// 该函数接收一个普通数字，并且
// 将无法跟踪 state.count 的变化
callSomeFunction(state.count)
```

**使用 `rective()` 后，赋值操作主要有两种：**

```
// 为属性赋值
state.count = 1

// 使用 Object.assign 赋值
Object.assign(state, {count: 1}) 
```



## 使用 ref

`reactive()` 的种种限制归根结底是因为 JavaScript 没有可以作用于所有值类型的 “引用” 机制。为此，Vue 提供了一个`ref()`方法来允许我们创建可以使用任何值类型的响应式 **ref**：

是的，可以使用任意类型来定义。

```js
import { ref } from 'vue'

const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

并且当值为对象类型时，会用 `reactive()` 自动转换它的 `.value`。一个包含对象类型值的 ref 可以响应式地替换整个对象，这和 `reactive()`不一样，不会丢失响应性：

```js
const objectRef = ref({ count: 0 })

// 这是响应式的替换
objectRef.value = { count: 1 }
```

ref 被传递给函数或是从一般对象上被解构时，不会丢失响应性：

```js
const obj = {
  foo: ref(1),
  bar: ref(2)
}

// 该函数接收一个 ref
// 需要通过 .value 取值
// 但它会保持响应性
callSomeFunction(obj.foo)

// 仍然是响应式的
const { foo, bar } = obj

// 仍然是响应式的
const haa = obj.foo
haa.value++

// 错误
const state = ref({
	count: ref(0)
})
let b = state.value.count
const increase = () => {
	b++
}
```

简言之，`ref()` 让我们能创造一种对任意值的 “引用”，并能够在不丢失响应性的前提下传递这些引用。这个功能很重要，因为它经常用于将逻辑提取到组合函数中。

## ref 在模板中的解包

当 ref 在模板中作为顶层属性被访问时，它们会被自动“解包”，所以不需要使用 `.value`。下面是之前的计数器例子，用 `ref()` 代替：

```js
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }} <!-- 无需 .value -->
  </button>
</template>
```

请注意，仅当 ref 是模板渲染上下文的顶层属性时才适用自动“解包”。 所以我们给出以下 `object`：

```js
const object = { foo: ref(1) }
```

下面的**表达式**将**不会**像预期的那样工作：

```js
{{ object.foo + 1 }}
```

渲染的结果会是一个 `[object Object]`，因为 `object.foo` 是一个 ref 对象。我们可以通过将 `foo` 改成顶层属性来解决这个问题：

```js
const { foo } = object
```

```js
{{ foo + 1 }}
```

现在渲染结果将是 `2`。

需要注意的是，如果一个 ref 是**文本插值** 计算的最终值，它也将被解包。因此下面的渲染结果将为 `1`：

```js
{{ object.foo }}
```

### ref 在响应式对象中的解包

当一个 `ref` 被嵌套在一个响应式对象中，作为属性被访问或更改时，它会自动解包，因此会表现得和一般的属性一样：

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

如果将一个新的 ref 赋值给一个关联了已有 ref 的属性，那么它会替换掉旧的 ref：

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// 原始 ref 现在已经和 state.count 失去联系
console.log(count.value) // 1
```

只有当嵌套在一个深层响应式对象内时，才会发生 ref 解包。当其作为浅层响应式对象的属性被访问时不会解包。

### 数组和集合类型的 ref 解包

跟响应式对象不同，当 ref 作为响应式数组或像 `Map` 这种原生集合类型的元素被访问时，不会进行解包。

```js
const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```
