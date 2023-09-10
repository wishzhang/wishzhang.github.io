---
title: http协议
date: 2023-08-28
tags: 
- 软件工程
categories:
- 编程基础
---



## 协议是什么？

http协议是一种协议，什么是协议呢？为什么要使用协议呢？

协议是实体对外交互的一种约定，协议本身将这些实体解耦，解耦是可以通过第三方实体解耦，但是那样的话第三方实体就需要实现所有对应的实现，这么说好像这个思路是可以的，但这几乎不可能，因为这意味着所有所有的实体都要通过这个第三方实体，安全性，管理第三方实体的成本，通信集中到第三方实体将有性能问题等等，都意味这这条路不可行。

从另一个角度来看，协议是一种抽象，是一种标准，是独立实体之间的约定，由独立实体实现并自己负责与其他实体无关。



## Ajax请求

http协议是一种规范，具体是由客户端和服务端实现的，客户端是架构上的叫法，接近http协议的叫法是用户代理。用户代理有多种实现，其中浏览器是一种。浏览器也可以定义多种http请求，比如导航请求、ajax请求，虽然在这些方式有所不同或有所抽象限制，但请求本质上的内容还是在http协议的范围。

- ajax请求在chrome浏览器是由`XMLHttpRequest`对象或`fetch`方法实现的，而浏览器导航请求属于普通请求。
- ajax请求是异步的，也就是说它不会阻塞浏览器的其他操作，而浏览器导航请求是同步的，也就是说它会等待服务器的响应才继续执行。

- ajax请求不会刷新或跳转页面，而浏览器导航请求会刷新或跳转页面。
- ajax请求可以自定义请求头和响应格式，而浏览器导航请求只能使用默认的请求头和响应格式。

来看看普通请求的概念，都要忘了这回事了。浏览器的普通请求是指通过点击链接、输入地址、提交表单等方式发出的http请求，**它会导致页面的刷新或跳转**。浏览器的**普通请求一般是同步**的，也就是说它会等待服务器的响应才继续执行。



### XMLHttpRequest

在实践中通常使用这个接口来进行http请求，这里重点来看看请求数据和响应数据在接口上是怎么体现的？

前端代码：

```vue
<template>
  <div id="app">
    <button @click="handleClick">http请求</button>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        style: {},
        imgSrc: ''
      }
    },
    mounted() {
    },
    methods: {
      handleClick() {
        // 创建XMLHttpRequest对象
        let xhr = new XMLHttpRequest();
        // 建立对服务器的调用，指定请求方法、请求地址和是否异步
        xhr.open("GET", "example.com/api/data", true);
        // 向服务器发送请求，如果是POST请求，需要传入请求体
        xhr.send();
        // 监听服务器的响应状态和数据
        xhr.onreadystatechange = function () {
          // readyState为4表示请求已完成，status为200表示响应成功
          if (this.readyState == 4 && this.status == 200) {
            // responseText为响应数据，根据内容类型进行解析
            console.log(xhr.responseText);
          }
        };
      }
    }
  }
</script>
```

后端代码：

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import {allowCors} from "../src/utils";

async function heart(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  });
}

export default allowCors(heart)
```

浏览器的响应数据：

```json
{"body":"","query":{},"cookies":{}}
```

`xhr.responseText`的数据：

```json
{"body":"","query":{},"cookies":{}}
```

可以看到http状态码由后端定义，通常是框架定义。浏览器的响应面板的数据通常是后台服务器的部分返回数据。

响应数据分为三层：

- 基础层：http协议定义的状态码和状态文本。比如5xx代表服务器出现错误，4xx用户代理端错误，定义了常见的一些状态码及状态文本。如果状态码为500，具体的错误还需要服务层定义更详细的信息。
- 服务层：区分服务器是否执行成功（不是用户期望的成功，是服务器是否正常执行业务。比如用户登录失败只是密码失败，但服务器执行是成功的）
- 前端业务层：处理业务数据。通常业务数据只有一个流程，如果需要一些用户容错流程，则可以定义业务状态码。

第一层通常使用的是服务端框架根据http协议已定义的，响应数据的后面两层层在json上的体现是：

```json
{
  "success": true,
  "data": {
    "code": 0,
    "data": null,
    "message": ""
  },
  "message": 
}
```

有的省略了第三层，即少了一层业务层，没有规范这一层会导致比较混乱。



### Axios

axios中的`response.data`为上面包括两层的json，应该把业务层`response.data.data`给后面业务代码执行，所以axios配置的示例代码如下：

```js
import axios from 'axios'

const instance = axios.create({
  baseURL: ''
})

instance.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  return config;
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error);
});

instance.interceptors.response.use(response => {
  // 对响应数据做点什么
  return response.data.data;
}, error => {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default instance
```

后面再看看axios的错误响应处理。

服务层的报错在axios拦截器可以做处理，通常不用在业务代码再来处理服务层的错误。

而业务层的catch是来处理业务代码的意外错误，业务层的响应错误状态是在then处理的。（通常code在代码可以省略，因为没有其他错误流程的业务）。

### 服务层的statusText英文问题

axios是一个基于Promise的HTTP库，可以用在浏览器和Node.js中。它的响应结构中包含了statusText属性，来自服务器响应的HTTP状态信息。一般来说，statusText是英文的，例如’OK’或’Not Found’，但是如果服务器返回了中文的状态信息，那么axios也会显示中文的statusText。

可以在axios配置那里进行处理。



























