---
title: TypeScript
date: 2022-08-06
tags: 
- TypeScript

categories:

- 前端
---

TypeScript属于静态代码检查工具，主要是对数据结构、接口的检查。去官网看看https://www.typescriptlang.org/



## 常用类型





## 字典

从遇到的字典检查问题来看，如果我们知道具体的键名，那么可以用type别名或者interface来定义字典。而对于不确定的键名则用不确定字典。



### 键名确定的字典（interface VS type）

#### 相同点

##### 都可以描述一个对象或函数

interface

```tsx
interface User {
  name: string
  age: number
}

interface SetUser {
  (name: string, age: number): void;
}
```

type

```tsx
type User = {
  name: string
  age: number
};

type SetUser = (name: string, age: number): void;
```



##### 拓展（extends）与 交叉类型（Intersection Types）

interface 可以 extends， type 是不允许 extends 和 implement 的，但是 type 也可以 与 interface 类型交叉 。虽然效果差不多，但是两者语法不同。

interface extends interface

```tsx
interface Name { 
  name: string; 
}
interface User extends Name { 
  age: number; 
}
```

type 与 type 交叉

```tsx
type Name = { 
  name: string; 
}
type User = Name & { age: number  };
```

interface extends type

```tsx
type Name = { 
  name: string; 
}
interface User extends Name { 
  age: number; 
}
```

type 与 interface 交叉

```tsx
interface Name { 
  name: string; 
}
type User = Name & { 
  age: number; 
}
```



### 不同点

##### type 可以而 interface 不行

- type 可以声明基本类型别名，联合类型，元组类型

```tsx
// 基本类型别名
type Name = string

// 联合类型
interface Dog {
    wong();
}
interface Cat {
    miao();
}

type Pet = Dog | Cat

// 具体定义数组每个位置的类型
type PetList = [Dog, Pet]
```

- type 语句中还可以使用 typeof 获取实例的 类型进行赋值

```tsx
// 当你想获取一个变量的类型时，使用 typeof
let div = document.createElement('div');
type B = typeof div
```

##### interface 可以而 type 不行

interface 能够声明合并

```tsx
interface User {
  name: string
  age: number
}

interface User {
  sex: string
}

/*
User 接口为 {
  name: string
  age: number
  sex: string 
}
*/
```



### 总结

https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases

尽可能的使用interface。当interface不能表示时，而你想使用联合类型或元组，那么通常可以去使用type。



### 键名不确定的字典

**1、Using an indexed object type annotation**

```tsx
let scores: { [name: string]: number } = {};
scores.bill = 10; // ✔️ - no type error
scores.bill = "10"; // 💥 - Type 'string' is not assignable to type 'number'
```

The “name” label can be anything we like. Often “key” is used:

```tsx
let scores: { [key: string]: number } = {};
scores.bill = 10;
```

Unfortunately we can’t restrict keys using a union type:

```tsx
let scores: {
  [name: "bill" | "bob"]: number;
} = {};
// 💥 - An index signature parameter type cannot be a union type. Consider using a mapped object type instead
```

**2、Using the Record utility type**

We can use an indexed object type annotation as follows:

```tsx
let scores: Record<string, number> = {};
scores.bill = 10; // ✔️ - no type error
scores.trevor = "10"; // 💥 - Type 'string' is not assignable to type 'number'
```

We can narrow the type of the keys using a union type as follows:

```tsx
let scores: Record<"bill" | "bob", number> = {};
scores.bill = 10; // ✔️ - no type error
scores.trevor = 10; // 💥 - Property 'trevor' does not exist on type 'Record<"bill" | "bob", number>'
```

**3、Using Map**

A Map is a standard JavaScript feature that is useful for holding key-value pairs.

There is a corresponding TypeScript type for a Map called Map. This is a generic type that takes in the types for the key and value as parameters:

```tsx
let scores = new Map<string, number>();
scores.set("bill", 10);
scores.set("bob", "10"); // 💥 - Argument of type 'string' is not assignable to parameter of type 'number'.
```

We can use a union type for the keys and an object type for the values as follows:

```tsx
type Person = {
  email: string;
  rating: number;
};
let scores = new Map<"bill" | "bob", Person>();
scores.set("bill", {
  email: "bill@somewhere.com",
  rating: 9,
});
```

A benefit of Map is that it provides a nice API for accessing items in the object:

```tsx
let scores = new Map<"bill" | "bob", Person>();
scores.set("bill", {
  email: "bill@somewhere.com",
  rating: 9,
});
scores.set("bob", {
  email: "bob@somewhere.com",
  rating: 9,
});
console.log(scores.has("bill")); // true

scores.forEach((person) => console.log(person));
// { "email": "bill@somewhere.com", "rating": 9 }
// { "email": "bob@somewhere.com", "rating": 9 }
```

Nice !

**Wrap up**
**The Record utility type is a concise approach to strongly typing a dictionary. If we want a nicer API around the dictionary we can use Map.**



## 工具类型

- Record
- Omit
- ReturnType
- Partial
- Readonly



## 类型声明文件

*.d.ts(这里也可以定义global)，导出类型、接口、namespace

*.global.ts 这里都不用导出，默认全局使用





## ts配置文件





