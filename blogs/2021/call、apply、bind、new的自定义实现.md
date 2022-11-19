---
title: call、apply、bind、new的自定义实现
date: 2021-09-21
tags: 

- JavaScript

categories:

 - 前端
---

> 函数在JavaScript中是一等公民，很大一部分原因是JavaScript现存的一部分编程模式是事件驱动，监听事件，那么就需要将函数作为参数传递。而且函数还可以作为返回值。在使用函数的过程中，由于传统的this的指向是动态的，为了显示地绑定到this的指向，JavaScript提供了call、apply、bind这3个api。接下来，我们看看这三个api的内部实现逻辑。

## call

call方法的使用是，第一个参数传递待绑定的对象，后面为可变参数列表。  
那么我们如何自定义实现call方法呢？首先我们知道必须要有以下几个功能需求：

- 参数列表为 对象obj和可变参数列表
- 我们需要将函数内部的this指向对象obj
- 并且这个函数被调用

1. 我们通过归纳推理的方法可以知道，要想this指向obj，那么就要让obj调用这个函数，      所以我们可以让函数作为obj的属性来调用。
2. 可变参数可以用arguments获取，并传递给函数。关于怎么传递呢？不能直接转成数组和值，因为无法表示用逗号分隔的可变参数       但我们可以用eval函数来调用这个函数字符串

由上我们可以得到初始版本的call方法代码：

```js
Function.prototype.myCall = function (context) {
    context.fn = this;
    var args = [];
    for (let i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    eval('context.fn(' + args + ')');
    delete context.fn;
};

// 测试
const foo = {
    name: 'wishzhang'
};

function funTest(arg1) {
    console.log(this.name);
    console.log(arg1);
}

funTest.myCall(foo, 'this is arg1');
```

再考虑在实际使用中还有两点需要注意：

- 当call的第一个参数为null的时候，this是默认指向window对象的
- 函数式有返回值的

所以第二版的call方法代码如下：

```js
Function.prototype.myCall = function (context) {
    context = context || window;
    context.fn = this;
    var args = [];
    for (let i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    var result = eval('context.fn(' + args + ')');
    delete context.fn;
    return result
};

// 测试
const foo = {
    name: 'wishzhang'
};


function funTest(arg1) {
    console.log(this.name);
    console.log(arg1);
    return 'success';
}

console.log(funTest.myCall(foo, 'this is arg1'));
```



## apply

apply方法和call的区别是call的可变参数在apply这里是一个数组。

```js


Function.prototype.myCall = function (context, arr) {
    context = context || window;
    context.fn = this;

    var result;

    if (!arr) {
        result = context.fn();
    } else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')');
    }

    delete context.fn;

    return result
};

// 测试
const foo = {
    name: 'wishzhang'
};

function funTest(arg1, arg2) {
    console.log(this.name);
    console.log(arg1, arg2);
    return 'success';
}

console.log(funTest.myCall(foo, ['this is arg1', '镇领导']));
```



## bind

bind方法的用法是预先将函数绑定this的指向和一些参数，然后在需要的地方再调用这个函数，可传入剩余的参数bind和前端的call、apply还是有比较大的区别的，在时间、空间先后顺序不一样。  
第一版的代码如下： 

```js
Function.prototype.myBind = function (context) {
    var self = this;

    var args = Array.prototype.slice.call(arguments, 1);

    return function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(context, args.concat(bindArgs));
    }
}

// 测试
const foo = {
    name: 'wishzhang'
};

function funTest(arg1, arg2) {
    console.log(this.name);
    console.log(arg1, arg2);
    return 'success';
}

const f = funTest.myBind(foo, 'nihao');

f('nihao2');
```

最后,bind还有一个特点，就是：当用new执行构造函数时，应该用构造函数的this应该执行自身的对象

```js
Function.prototype.bind2 = function (context) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}
```



## new

new关键字调用和普通关键字调用不同，内部的逻辑大概有以下几个步骤:

1. 创建对象obj
2. 使obj得原型指向函数的原型
3. 执行函数
4. 返回对象obj

```js
function objectFactory() {
    var obj = new Object(),

    Constructor = [].shift.call(arguments);
    obj.__proto__ = Constructor.prototype;

    Constructor.apply(obj, arguments);

    return obj;
};
```



## arguments

arguments和数组在读写、长度、遍历很相像，但arguments并不支持数组的其他方法，比如你无法调用push，forEarch等，原因是设计的目的是不一样的。arguments还有callee属性是和函数关联起来的。  
而我们为了在实际应用中，让arguments可以想数组那样操作的话，可以将arguments转换成数组：

```js
var arrayLike = {0: 'name', 1: 'age', 2: 'sex', length: 3 };
Array.prototype.slice.call(arrayLike);
Array.from(arrayLike);
Array.prototype.concat.apply([], arrayLike)
```

注意arguments.length为实参长度，而函数的length是形参长度。  
最后，ES6有很方便的剩余参数功能：

```js
function func(a, ...arguments) {
    console.log(arguments.length); // 2
}
console.log(func.length); // 1
func(1, 2, 3);
```



