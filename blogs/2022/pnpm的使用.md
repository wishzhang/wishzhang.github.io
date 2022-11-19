---
title: pnpm 的使用
date: 2022-01-25
tags: 
- 工具链

categories:

- 前端
---



## 介绍

npm 的安装规则：用户安装当前项目的依赖，会把对应的依赖包下载安装到 node_modules 文件夹里面，并且还会下载包里面的 dependencies 的依赖包。

在 npm3 之前，node_modules 采用的是嵌套结构，即相同的依赖包也会重复下载安装到各自的包里面的node_modules，为了解决这个问题 npm3 默认采取了 node_modules 扁平化的结构，这样根据查找规则不会重复安装相同的包，但会出现一个问题：能访问项目没有显式声明的依赖包（虽然 npm 可以通过设置 --global-style 来设置非扁平化结构来解决这个问题，但这个配置默认是不开启的）。



----

pnpm 为了解决以上问题，通过软链接的方式来构建 node_modules 的结构。以下是 node_modules 目前的三种结构：

第一阶段：npm@3 之前版本

```
node_modules
└─ foo
   ├─ index.js
   ├─ package.json
   └─ node_modules
      └─ bar
         ├─ index.js
         └─ package.json
```



第二阶段：npm@3 版本，扁平化处理

```
node_modules
├─ foo
|  ├─ index.js
|  └─ package.json
└─ bar
   ├─ index.js
   └─ package.json
```



第三阶段：pnpm

```
node_modules
├─ .pnpm
|  ├─ foo@1.0.0/node_modules/foo
|  |  └─ index.js
|  └─ bar@2.0.0/node_modules/bar
├─ foo -> .pnpm/foo@1.0.0/node_modules/foo
└─ bar -> .pnpm/bar@2.0.0/node_modules/bar
```



## 应用场景

pnpm 对比 npm 有两个有优点：

1. 只允许访问项目显式声明的依赖包，是安全的

2. 节省磁盘空间

其中的第一个优点很重要，这是基本的逻辑正确性的问题，如果 pnpm 其他地方没有大问题以后我会用 pnpm  替代 npm（对于项目用 npm、yarn，因为 npm 默认的扁平化非法访问依赖包的问题在某些人的使用习惯里是易用的，虽然会有潜在的问题，但可靠度毕竟是一个概率问题），因为技术的目标也并不仅仅是适不适用的问题。



## 基础用法

- **安装 pnpm**

```shell
npm install -g pnpm
```



- **升级 pnpm**

```shell
pnpm add -g pnpm
```



- **与 npm 的差异**

    - -C path 是指将 path 设置为 pnpm 的运行目录，而不是当前目录。
    - 当你使用一个未知命令时，pnpm 将会查找和该命令具有相同名称的脚本， 因此，`pnpm run lint` 和 `pnpm lint` 是一样的。如果没有相同名称的脚本的话， 那么 pnpm 将按照 shell 脚本的形式执行该命令，所以你可以执行类似 `pnpm eslint`指令的命令。



- **生命周期脚本**

```json
// package.json
{
 "postinstall": "pnpm gen:version",
 "preinstall": "npx only-allow pnpm -y"
}
```



- **管理依赖项**

```shell
pnpm install
pnpm add sax 保存到 dependencies 配置项下
pnpm add -D sax 保存到 devDependencies 配置项下
pnpm add sax@3.0.0 安装指定版本 3.0.0
pnpm remove -D sax 卸载指定版本
```



## 进阶用法

### 工作空间

pnpm 内置了对多包存储库、多项目存储库的支持，我们可以创建 [工作空间](https://pnpm.io/zh/workspaces)，工作空间的根目录中必须有  [pnpm-workspace.yaml](https://pnpm.io/zh/pnpm-workspace_yaml) 文件。 工作空间的根目录中也可能有 [.npmrc](https://pnpm.io/zh/npmrc) 文件。

以 element-plus 项目为例子，其项目文件结构如下：

```
packages
├─ components
|  └─ package.json
├─ play
|  └─ src
|      └─ App.vue
├─ package.json 
├─ pnpm-workspace.yaml
```

- **pnpm-workspace.yaml**

pnpm-workspace.yaml 定义了工作空间的根目录，并能够使您从工作空间中包含 / 排除目录 。 默认情况下，包含所有子目录。

```
#
packages:
  - 'packages/**'
  - '!packages/__mocks__'
  - docs
  - play
  - '!**/__tests__/**'
```



- **package.json**

```json
"dependencies": {
  "@element-plus/components": "workspace:*",
}
```



- **App.vue**

```vue
<template>
  <el-button type="success">按钮</el-button>
</template>

<script setup lang="ts">
import ElButton from '@element-plus/components/button'
</script>
```



以上定义好工作空间后，对应的 `import ElButton from '@element-plus/components/button'` 就会在工作空间寻找对应的依赖包。



---



[附：pnpm 官网](https://www.pnpm.cn/)




