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

```js
//分为数据属性和访问器属性。
//都含有configurable和enumerable特性
//区别在于访问器属性采用get和set函数对数据值进行了封装。
var book={   
    _year:2004,   
    edition:1
 };
 
Object.defineProperties(book,{   
    month:{        
        value:1,        
        writable:false   
    },    
    day:{        
        value:2    
    }
})


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

```js
obj.a
obj[key]
for(var key in obj){
    if(obj.hasOwnProperty(key)){
        
    }
}
```
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

