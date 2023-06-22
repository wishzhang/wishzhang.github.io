---
title: JS对象
date: 2021-09-21
tags: 

- JavaScript

categories:

 - 前端
---

## 对象
对象为引用类型。

### 属性

您可以使用以下语法来定义 JavaScript 对象的属性：

```js
// 使用点表示法
objectName.propertyName = propertyValue;

// 使用方括号表示法
objectName['propertyName'] = propertyValue;
```

例如，以下代码演示如何创建一个具有两个属性的对象：

```js
var person = {};
person.firstName = "John";
person["lastName"] = "Doe";
```

我们来看看上面定义的对象的属性访问器：

```json
{
  "firstName":
  	{
      "value":"John",
      "writable":true,
      "enumerable":true,
      "configurable":true
    },
  "lastName":
  	{
      "value":"Doe",
      "writable":true,
      "enumerable":true,
      "configurable":true
    }
}
```

- enumerable 当值为true，对象这个属性或值才能被遍历，是充分条件且不受其他属性影响。但`enumerable`无论true or false，都能直接访问这个属性。
- writable 当值为true，才能修改属性值，是充分条件且不受其他属性影响。能否删除属性只取决于下面的`configurable`属性
- configurable 用于控制对象的属性是否可以被删除或是否可以修改属性描述符。`configurable`属性可以用于保护对象的属性，以防止它们被意外删除或修改。

下面是一个示例，演示如何使用`configurable`：

```js
const obj = {};

Object.defineProperty(obj, 'name', {
  value: 'Monica',
  writable: false,
  enumerable: true,
  configurable: true
});

console.log(obj.name); // 'Monica'

Object.defineProperty(obj, 'name', {
  value: 'Rachel',
  writable: false,
  enumerable: true,
  configurable: false
});

console.log(obj.name); // 'Rachel'

delete obj.name; // TypeError: Cannot delete property 'name' of #<Object>

Object.defineProperty(obj, 'name', {
  value: 'Phoebe',
  writable: false,
  enumerable: true,
  configurable: true
}); // TypeError: Cannot redefine property: name
```

### 创建对象

```js
var obj={};
var obj=new Object();
var obj=Object.create(pObj);

模式：
工厂模式
构造函数模式
原型模式    
组合使用构造函数和原型模式
```
### 访问对象

一般这样直接访问对象的属性：
```txt
obj.a
obj[key]
```

但这样无法避免地会访问到对象原型链上的属性，那么可以使用`hasOwnProperty`来检查是否为对象的自有属性：
```js
const obj = {
  name: 'John',
  age: 30
};
if (obj.hasOwnProperty('name')) {
  console.log(obj.name); // 输出 'John'
}

if (obj.hasOwnProperty('toString')) {
  console.log(obj.toString); // 不会输出，因为toString是从Object原型继承来的属性
}
```

当需要遍历对象的自有属性，使用`for...in`遍历对象属性时，需要同时使用`hasOwnProperty`代码就会比较繁琐。JS提供了更简洁的API来获取对象的自有属性`Object.keys()`，另外还有`Object.values()`,`Object.entries`来遍历对象的自有属性和值。

```js
const obj = {
  name: 'John',
  age: 30
};

Object.keys(obj).forEach(key => {
  console.log(key + ': ' + obj[key]);
});

Object.entries(obj).forEach(([key, value]) => {
  console.log(key + ': ' + value);
});
```
由于对象的属性包含可枚举`enumerable`特性，上面的`for...in`,`Object.keys()`等都是遍历对象的可枚举的自有属性。如果需要遍历对象的自有属性（包括可枚举和不可枚举的），那么可以使用`Object.getOwnPropertyNames()`来获取：
```js
const obj = {
  name: 'John',
  age: 30
};

Object.getOwnPropertyNames(obj).forEach(key => {
  console.log(key + ': ' + obj[key]);
});

/* 
输出
name: John
age: 30
*/
```

还有呢，我们使用`Object.getOwnPropertyDescriptors`方法获取`obj`对象的所有自有属性及其描述符，并将其输出。这将输出一个包含所有自有属性及其描述符的对象。
```js
const obj = {
  name: 'John',
  age: 30
};

Object.getOwnPropertyDescriptors(obj);

/*
输出：
{
  name: {
    value: "John",
    writable: true,
    enumerable: true,
    configurable: true
  },
  age: {
    value: 30,
    writable: true,
    enumerable: true,
    configurable: true
  }
}
*/
```

那么最终是回归到对象属性的定义上，需要清楚其中的含义。



### 删除对象

```js
delete obj.a
```

* * *

## 继承
ECMAScript只支持实现继承，而且其实现继承主要依靠原型链来实现的。其基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法。

### 组合模式继承

```js
function SuperType(name){
this.name=name;
}

SuperType.prototype.eat=function () {    
return 'super eat.';
};

var superObj=new SuperType('super');

function SubType(name,age) {
SuperType.call(this,name);    
this.age=age;
}

SubType.prototype=new SuperType();
SubType.constructor=SubType;

SubType.prototype.drink=function(){    
return this.name+' drink.';
};

```

