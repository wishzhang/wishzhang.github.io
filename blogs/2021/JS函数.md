---
title: JS函数
date: 2021-09-21
tags: 

- JavaScript

categories:

 - 前端
---

## 函数柯里化

在计算机科学的概念中，柯里化是指可以将具有多个参数的函数转换为一个单参数的函数链（由德国数学家、逻辑学家弗雷德发明的）JavaScript的柯里化实现如下：

```js
function curry(fn) {    
  const len = fn.length;    
  return function (...args) {        
    const arr = [];        
    function subCurry(...args) {           
      arr.push(...args);           
      if (arr.length < len) {                
        return subCurry;            
      } else {                
        return fn.apply(this, arr);           
      }        
    }       
    return subCurry(...args);   
  }
}
// 测试
let fn = curry(function (a, b, c) {    
  console.log([a, b, c]);
});
fn("a", "b", "c") // ["a", "b", "c"]
fn("a", "b", "c") // ["a", "b", "c"]
fn("a", "b", "c") // ["a", "b", "c"]
fn("a", "b", "c") // ["a", "b", "c"]
```

上面的fn函数时柯里化后提供的函数，初次调用要注意arr这个参数收集容器的初始化问题。当所有参数数量达到要求时才会调用，不然调用只会返回一个函数。



## 偏函数

在计算机科学中，偏函数是指通过固定一个函数的参数，然后产生另一个更小元的函数。  
JavaScript的偏函数实现如下：

```js
function partial(fn, ...args1) {    
  return function (...args2) {        
    const arr = args1.concat(args2);        
    return fn.apply(this, arr);   
  }
}

// 测试
function fn1(a, b, c) {    
  console.log([a, b, c]);
}
const fn2 = partial(fn1, 1);
fn2(2,3); // [1,2,3]
```

柯里化函数和偏函数的意图是不一样的，柯里化函数目的是将多个参数的函数转化为单个参数的函数，而偏函数是为了转化为更小元的参数。  
也可以把偏函数看做是柯里化过程其中的一个结果。而且他们的实现思想都是工厂设计模式，即预先固定好参数，然后生成新的结果。



## 惰性函数

惰性的概念也是生活中常见的概念，比如按需加载，运行时加载，即等到真正需要的时候才去做这个事情，达到优化程序性能的目的。实践中可以有各种各样的具体实现。下面是JavaScript其中的一种实现：

```js
let foo = function() {
    let t = new Date();
    foo = function() {
        return t;
    };
    return foo();
};
```



## 函数记忆

函数记忆是通过空间换时间的方式，将计算后的结果保存起来，下次如果命中就从缓存中取出来，从而减少计算时间。

```js
let getUpperName = (function(){
	const cache = Object.create(null);
    return function(name){
    	if(!cache[name]){
           cache[name] = name.toUpperCase();
        }
      	return cache[name];
    }
})();
```



## 箭头函数

箭头函数表达式的语法比函数表达式更简洁，并且没有自己的this，arguments，super或new.target。  
箭头函数表达式更适用于那些本来需要匿名函数的地方，不大适合作为对象的方法。没有原型prototype,不能new调用。

