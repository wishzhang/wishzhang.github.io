---
title: Docker
date: 2022-05-21
tags: 
- docker

categories:

- 编程基础


---



<img title="" src="/assets/docker1.jpg" alt="" width="100%" height="400">

Docker为应用程序实现了一种部署方案，将运行环境和应用程序抽象为一个整体，解耦了部署过程。这个方案提高了系统的可移植性、可维护性。

## 相关概念

镜像：运行环境和应用程序抽象为一个整体，具体为一个文件。

容器：容器通过镜像来创建，创建的容器有其自身的生命周期。

仓库：存放各个镜像的仓库。

## 安装

前提：用VMware装好Ubuntu虚拟机，然后在Ubuntu上安装Docker。

1.使用官方安装脚本安装：

```bash
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

2.配置Docker镜像加速

a.创建或修改 `/etc/docker/daemon.json` 文件，并写入以下内容：

```json
{
   "registry-mirrors": [
       "https://mirror.ccs.tencentyun.com"
  ]
}
```

b.依次执行以下命令，重新启动 [Docker](https://cloud.tencent.com/product/tke?from=10680) 服务。

```bash
systemctl daemon-reload
service docker restart
```

c.检查是否生效

```bash
docker info
```

在返回信息最底下有如下信息则表示成功

```yml
Registry Mirrors:
 https://mirror.ccs.tencentyun.com
```

## 使用

1. 准备Dockerfile文件

```docker
FROM nginx
COPY dist/ /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf
```

2. 开始构建镜像并推送镜像

```bash
VERSION=1.1.28-SNAPSHOT # 项目开发版本(每次打包手动更改，例，下次打包：1.1.29-SNAPSHOT)
PROJECT_NAME=dev1 # 项目组名称
APP_NAME=hello-world # 项目名称

docker build -t ${PROJECT_NAME}/${APP_NAME}:${VERSION} .

docker tag ${PROJECT_NAME}/${APP_NAME}:${VERSION} harbor.aiagain.com/${PROJECT_NAME}/${APP_NAME}:${VERSION}

docker push harbor.aiagain.com/${PROJECT_NAME}/${APP_NAME}:${VERSION}
```

3. 运行镜像

```bash
docker run -d -p 5000:5000 容器名称
docker ps 
```

## 实践场景

学会docker的基本用法，这让我也很方便地部署一个软件系统，之前那个easy-mock系统我终于可以部署到腾讯云服务器了

目前基本有两种使用方式：

- 一种是批处理的方式运行docker的命令

- 另一种是以更为内聚的方式Dockerfile来构建镜像，再运行简单运行镜像 

## 其他

https://www.runoob.com/docker/docker-tutorial.html

https://www.docker.com/

https://cloud.tencent.com/document/product/213/46000
