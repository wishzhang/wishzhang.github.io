---
title: nginx入门指南
date: 2021-09-22
tags: 

- nginx

categories:

 - 前端

showSponsor: true

---

[nginx](https://nginx.org/en/docs/) 由一个主进程和一些[工作进程](https://nginx.org/en/docs/ngx_core_module.html#worker_processes)构成。主进程用来读取配置信息和维护工作进程，工作进程负责实际的请求处理。nginx 采用基于事件模型和依赖操作系统机制，来有效分发请求给工作进程。

### 开启，停用和重启

nginx 开启后可执行以下命令：

```sh
nginx -s signal
```

sginal:

- stop 立即关掉
- quit 正常关掉，等所有工作进程处理完手中的请求才关掉
- reload 重新加载配置文件
- reopen 重新打开日志文件

nginx 重新加载配置文件后，会根据配置文件开启新的工作进程，然后关掉旧的工作进程。  
[更多关于nginx信号的信息](https://nginx.org/en/docs/control.html)



### 配置文件

nginx 的配置文件主要有两类指令来控制。指令分为简单指令和块指令。简单的指令由名称和参数组成，参数之间用空格分隔，并以分号结束。块指令与简单指令具有相同的结构，但它以一组由大括号包围的附加指令结束，而不是分号。一个块指令构成的直接作用域被称为上下文( [events](https://nginx.org/en/docs/ngx_core_module.html#events) , [http](https://nginx.org/en/docs/http/ngx_http_core_module.html#http) , [server](https://nginx.org/en/docs/http/ngx_http_core_module.html#server) , [location](https://nginx.org/en/docs/http/ngx_http_core_module.html#location) )。events 和 http 指令在 [main](https://nginx.org/en/docs/ngx_core_module.html) 上下文中，server 在 http 中，location 在 server 中。



### 代理静态资源

web 服务器的一个重要的功能就是代理文件。接下来的一个例子是，将请求代理到不同的文件夹下。

```nginx
location / {
	root /data/www;
}

location /images {
	root /data;
}
```

http://localhost/images/example.png 这个请求的实际本地路径是 /data/images/example.png  
htttp://localhost/some/example.html 这个请求实际请求的本地路径是 /data/www/some/example.html  
再次加载配置文件后，如果结果不是你所期望的，你可以尝试去 logs 下的 access.log 和 error.log 文件去找原因。



### 配置代理服务器

nginx 还有一个常用的功能是作为一个代理服务器来转发请求。我们将配置一个基本的代理服务器来接收图片文件的请求，然后将请求转发到被代理的服务器。在下面这个例子中，代理服务器和被代理服务器相关的配置都被定义在一个 nginx 实例上。

1）首先，被代理的服务器的配置如下，[监听](https://nginx.org/en/docs/http/ngx_http_core_module.html#listen)8080端口：

```nginx
server {
    listen 8080;
    root /data/up1;

    location / {
    }
}
```

这个服务器将监听8080端口，并将所有的请求映射到 /data/up1 文件目录下。在这个文件目录创建好 index.html 文件。  
注意，这里只在 server 上下文环境中定义了 [root](https://nginx.org/en/docs/http/ngx_http_core_module.html#root) , 而如果location里没有定义自己的 root，请求就会映射到 server 的 root。

2）接下来，配置代理服务器，主要是配置 [proxy_pass](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass) 字段，配置如下：

```nginx
server {
    location / {
        proxy_pass http://localhost:8080/;
    }

    location ~ \.(gif|jpg|png)$ {
        root /data/images;
    }
}
```

这个服务器会接收 .gif、.jpg、.png 的请求，对应到 /data/images 目录下，并且其他的所有请求会被转发到被代理的服务器上。
