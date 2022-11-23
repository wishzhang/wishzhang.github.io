---
title: TypeScript的使用
date: 2022-01-25
tags: 
- 工具链
- TypeScript

categories:

- 前端
---



# tsconfig.json

```json
{
  "compilerOptions": {
    "allowJs": true, // 是否对js文件进行编译，默认false
    "strict": true, // 严格模式
    "module": "ES6",	// 编译生成的模块类型，有"CommonJS","ESNext","ES6","ES2015","ES2020"等
    // target 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "target": "ES2018", 
    /* 不允许变量或函数参数具有隐式any类型,例如
       function(name) {
           return name;
       } */
    "noImplicitAny": false,
    /* 如果设为true，编译每个ts文件之后会生成对应的声明文件,
       declaration和allowJs不能同时设为true */
    "declaration": true,
    // 用于选择模块解析查找策略，有'node'和'classic'两种类型
    "moduleResolution": "Node",
    // 实现CommonJS和ES模块之间的互操作性
    "esModuleInterop": true,
    // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "jsx": "preserve",
    // 用来指定编译时是否生成.map文件
    "sourceMap": true,
    /* 注意：如果未指定--lib，则会注入默认的librares列表。注入的默认库为：
       对于 --target ES5: DOM,ES5,ScriptHost
       对于 --target ES6: DOM,ES6,DOM.Iterable,ScriptHost
       TS 绝不会在您的代码中注入polyfill,所以需要你自己制定编译lib */
    "lib": ["ES2018", "DOM"],
    // 用来指定允许从没有默认导出的模块中默认导入 
    "allowSyntheticDefaultImports": true,
    // 禁止对同一个文件的不一致的引用。
    "forceConsistentCasingInFileNames": true,
    // 允许导入.json文件
    "resolveJsonModule": true，
    // 作为解析非相对模块名的基准目录
    "baseUrl": "."
    // 这个标志切换到即将到来的ECMA运行时行为
    "useDefineForClassFields": true
  },
  "include": ["packages"],
  "exclude": ["node_modules", "**/__test?__", "**/dist"]
}
```



# 声明文件配置

@types，typeRoots和types

默认所有*可见的*"`@types`"包会在编译过程中被包含进来。 `node_modules/@types`文件夹下以及它们子文件夹下的所有包都是*可见的*； 也就是说， `./node_modules/@types/`，`../node_modules/@types/`和`../../node_modules/@types/`等等。

如果指定了`typeRoots`，*只有*`typeRoots`下面的包才会被包含进来。 比如：

```json
{
   "compilerOptions": {
       "typeRoots" : ["./typings"]
   }
}
```

这个配置文件会包含*所有*`./typings`下面的包，而不包含`./node_modules/@types`里面的包。

如果指定了`types`，只有被列出来的包才会被包含进来。 比如：

```json
{
   "compilerOptions": {
        "types" : ["node", "lodash", "express"]
   }
}
```

这个`tsconfig.json`文件将*仅会*包含 `./node_modules/@types/node`，`./node_modules/@types/lodash`和`./node_modules/@types/express/@types/。 ` 	`node_modules/@types/*`里面的其它包不会被引入进来。

指定`"types": []`来禁用自动引入`@types`包。

注意，自动引入只在你使用了全局的声明（相反于模块）时是重要的。 如果你使用 `import "foo"`语句，TypeScript仍然会查找`node_modules`和`node_modules/@types`文件夹来获取`foo`包。



# 使用

- as const 断言 （TypeScript 3.4）

可以用as const断言将宽泛的数据类型限定为只读类型。

```typescript
// Type '"hello"'
let x = "hello" as const;
// Type 'readonly [10, 20]'
let y = [10, 20] as const;
// Type '{ readonly text: "hello" }'
let z = { text: "hello" } as const;

let arr = [1, 2, 3, 4];
let foo = {
  name: "foo",
  contents: arr,
} as const;
foo.name = "bar"; // error!
foo.contents = []; // error!
foo.contents.push(5); // ...works!
```



- unknown顶级类型（TypeScript 3.0）

unknown表示未知类型，相对于 any是类型安全的。其他类型的值可以赋给unknown类型，但是unknown除了本身和any，不可以赋给其他类型unknown。同样地，除非断言或者缩小类型范围，否则不允许任何在unknown类型上操作。

```typescript
// keyof unknown
type T40 = keyof any; // string | number | symbol
type T41 = keyof unknown; // never

// In an intersection everything absorbs unknown
type T00 = unknown & null; // null
type T01 = unknown & undefined; // undefined
type T02 = unknown & null & undefined; // null & undefined (which becomes never)
type T03 = unknown & string; // string
type T04 = unknown & string[]; // string[]
type T05 = unknown & unknown; // unknown
type T06 = unknown & any; // any
// In a union an unknown absorbs everything
type T10 = unknown | null; // unknown
type T11 = unknown | undefined; // unknown
type T12 = unknown | null | undefined; // unknown
type T13 = unknown | string; // unknown
type T14 = unknown | string[]; // unknown
type T15 = unknown | unknown; // unknown
type T16 = unknown | any; // any

// Only equality operators are allowed with unknown
function f10(x: unknown) {
  x == 5;
  x !== 10;
  x >= 0; // Error
  x + 1; // Error
  x * 2; // Error
  -x; // Error
  +x; // Error
}

// No property accesses, element accesses, or function calls
function f11(x: unknown) {
  x.foo; // Error
  x[5]; // Error
  x(); // Error
  new x(); // Error
}

// typeof, instanceof, and user defined type predicates
declare function isFunction(x: unknown): x is Function;
function f20(x: unknown) {
  if (typeof x === "string" || typeof x === "number") {
    x; // string | number
  }
  if (x instanceof Error) {
    x; // Error
  }
  if (isFunction(x)) {
    x; // Function
  }
}


// Anything is assignable to unknown
function f21<T>(pAny: any, pNever: never, pT: T) {
  let x: unknown;
  x = 123;
  x = "hello";
  x = [1, 2, 3];
  x = new Error();
  x = x;
  x = pAny;
  x = pNever;
  x = pT;
}

// unknown assignable only to itself and any
function f22(x: unknown) {
  let v1: any = x;
  let v2: unknown = x;
  let v3: object = x; // Error
  let v4: string = x; // Error
  let v5: string[] = x; // Error
  let v6: {} = x; // Error
  let v7: {} | null | undefined = x; // Error
}
```



- 构造器类型支持混入类（[TypeScript 2.2](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html)）

```typescript

class Point {
  constructor(public x: number, public y: number) {}
}
class Person {
  constructor(public name: string) {}
}
type Constructor<T> = new (...args: any[]) => T;
function Tagged<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    _tag: string;
    constructor(...args: any[]) {
      super(...args);
      this._tag = "";
    }
  };
}
const TaggedPoint = Tagged(Point);
let point = new TaggedPoint(10, 20);
point._tag = "hello";
class Customer extends Tagged(Person) {
  accountBalance: number;
}
let customer = new Customer("Joe");
customer._tag = "test";
customer.accountBalance = 0;

```



- 交叉类型

交叉类型是将多个类型合并为一个类型。 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。



- keyof

keyof操作获取对象的键的类型。

```typescript
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
    
type A = number
 
type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
    
type M = string | number
```



- infer

1) 用于提取函数类型的返回值类型
2) 用于提取构造函数中参数（实例）类型



- never

举个具体点的例子，当你有一个 union type:

```typescript
interface Foo {
  type: 'foo'
}

interface Bar {
  type: 'bar'
}

type All = Foo | Bar
```

在 switch 当中判断 type，TS 是可以收窄类型的 (discriminated union)：

```typescript
function handleValue(val: All) {
  switch (val.type) {
    case 'foo':
      // 这里 val 被收窄为 Foo
      break
    case 'bar':
      // val 在这里是 Bar
      break
    default:
      // val 在这里是 never
      const exhaustiveCheck: never = val
      break
  }
}
```

注意在 default 里面我们把被收窄为 never 的 val 赋值给一个显式声明为 never 的变量。如果一切逻辑正确，那么这里应该能够编译通过。但是假如后来有一天你的同事改了 All 的类型：

```typescript
type All = Foo | Bar | Baz
```

然而他忘记了在 handleValue 里面加上针对 Baz 的处理逻辑，这个时候在 default branch 里面 val 会被收窄为 Baz，导致无法赋值给 never，产生一个编译错误。所以通过这个办法，你可以确保 handleValue 总是穷尽 (exhaust) 了所有 All 的可能类型。



# Utility Types

TypeScript 提供给一些工具类型来辅助操作类型。

TypeScript provides several utility types to facilitate common type transformations. These utilities are available globally.



- `InstanceType<T>`

该工具类型能够获取构造函数的返回值类型，即实例类型。

```typescript
class C {
   x = 0;
}
type T0 = InstanceType<typeof C>;         // C

type T1 = InstanceType<new () => object>; // object

type T2 = InstanceType<any>;              // any

type T3 = InstanceType<never>;            // any

type T4 = InstanceType<string>;           // 编译错误
type T5 = InstanceType<Function>;         // 编译错误
```



- `Partial<Type>`

```typescript
interface Todo {
  title: string;
  description: string;
}
 
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}
 
const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};
 
const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
```





# 应用思想

与JavaScript不通过的是应用TypeScript是基于软件工程的基本思想的，代码可能只写一两遍，但读代码和改代码可能是数百遍数千遍，提高系统的可维护性、易修改性，对于长期的正式的项目是比较有利的。Vue3之前用的是flow类型检查工具，随着发展Vue3全面用TypeScript重写了，阶段不同也不能说好坏，当然如果一开始采用TypeScript来弄就更好了，这个也可能是yyx不是专业出身的，然后中国的思想本身保守一点，这本身无可厚非，不可否认的是yyx的软件产品的眼光是独到杰出的，并且有杰出的艺术鉴赏力和交流思想的能力。



由无类型到有类型，其中的编程的思想也规范了一些。意味着提高设计工作、初次实现工作的比例，这个呢通常对编写库、框架这类的项目是百利无一害的。



**应用TypeScript其中的接口需要定义类型的，而内部的某些变量定义可以借用类型推导（这不推荐），我们看到有些没有直接定义类型是因为在全局有类型声明。**

