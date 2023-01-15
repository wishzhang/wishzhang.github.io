---
title: npm配置
date: 2022-12-24
tags: 

- 工具链
- npm

categories:

 - 前端
showSponsor: true

---

这里主要解决 `npm install` 或 `pnpm install` 由于镜像源在国外而导致下载速度慢的问题。解决办法是设置国内的镜像源，可以选择全局设置或者项目级别的设置。

## 全局设置

1、查看并了解当前的 npm 配置，在命令窗口输入：

```bash
npm config ls
```

2、设置镜像源

```bash
npm config set registry http://registry.npmmirror.com
```

设置成功！:tada::tada::tada:

如果需要还原 npm 的镜像源，输入：

```bash
npm config set registry https://registry.npmjs.org
```

## 项目级设置

如果只是想在某个项目设置国内的镜像源，那么可以使用这种办法。

在项目根目录新建 `.npmrc` 文件，并写入以下配置即可：

```
registry=https://registry.npmmirror.com/
```





