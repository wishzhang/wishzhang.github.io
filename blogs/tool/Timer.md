---
title: tool.Timer
date: 2022-01-01
categories:

 - tool.js
---

`Timer` 类似一个简单的计时器，支持开始、暂停操作。每秒钟或者执行一个操作后，调用回调函数可得到当前用时。

## 构造函数

​	创建 `Timer` 计时器对象

```js
let timer = new tool.Timer({
  preDuration: 0,
  onProgress(duration){
    console.log(duration); // duration毫秒
  }
})
```



## Timer 实例

### 属性

无。



### 方法

`start(): void`

`pause(): void`

`reset(): void`



## 示例

```js
// 开始计时
timer.start();

// 暂停计时
timer.pause();

// 重置计时器,计时清零，preDuration也会置0
timer.reset();
```



