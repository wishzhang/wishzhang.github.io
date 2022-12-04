---
title: GitHub自动化部署
date: 2022-12-4
tags: 
- CI/CD
- github

categories:

- 编程基础

showSponsor: true

---

前不久笔者才发现 GitHub Pages 可以部署多个站点，尝试把一个静态文档网站部署了上去。同时又了解到 GitHub Actions 的功能，可以将网站自动化部署到第三方服务器。这两个功能真的太实用了，大大减少了部署网站的成本。这里来记录一下笔者如何使用 GitHub Pages 和 GitHub Actions 的功能。

## GitHub Actions

GitHub Actions 功能的使用流程大致如下：

1. 在仓库根目录创建 `.github/workflows/文件名.yml`，文件名只要是合法的就行。每一个 .yml 文件对应各自一个部署流程
2. 当 push 代码到仓库后，GitHub 会自动去同时执行各个 .yml 文件里定义的部署流程

**所以，GitHub Actions 功能的关键是配置好 .yml 文件里的部署流程。**

这里来看一下两个 `.yml  ` 文件的例子：

[github-page.yml 文件](https://github.com/wishzhang/wishzhang.github.io/blob/main/.github/workflows/github-page.yml)

```yaml
name: Deploy To Github Page

on:
  # 每当 push 到 main 分支时触发部署
  push:
    branches: [main]
  # 手动触发部署
  workflow_dispatch:

jobs:
  docs:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
        with:
          # “最近更新时间” 等 git 日志相关信息，需要拉取全部提交记录
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v1
        with:
          # 选择要使用的 node 版本
          node-version: '16.15.0'

      # 缓存 node_modules
      - name: Cache dependencies
        uses: actions/cache@v2
        id: npm-cache
        with:
          path: |
            **/node_modules
          key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-npm-

      # 如果缓存没有命中，安装依赖
      - name: Install dependencies
        if: steps.npm-cache.outputs.cache-hit != 'true'
        run: npm ci

      # 运行构建脚本
      - name: Build VuePress site
        run: npm run build

      # 查看 workflow 的文档来获取更多信息
      # @see https://github.com/crazy-max/ghaction-github-pages
      - name: Deploy to GitHub Pages
        uses: crazy-max/ghaction-github-pages@v2
        with:
          # 部署到 gh-pages 分支
          target_branch: gh-pages
          # 构建输出的资源目录
          build_dir: docs
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

上面定义的流程大致分为这几个步骤：

1. 定义触发自动化部署的时机
2. 定义待部署的代码分支
3. 定义运行环境
4. 定义Node.js的版本
5. 定义依赖安装，缓存node_modules文件夹（这里是npm的方式）
6. 定义构建命令
7. 将打包后的资源文件部署上去



[xinmi-page.yml 文件](https://github.com/wishzhang/wishzhang.github.io/blob/main/.github/workflows/xinmi-page.yml)

```yaml
name: Deploy To Tencent Server

on:
  # 每当 push 到 main 分支时触发部署
  push:
    branches: [ main ]
  # 手动触发部署
  workflow_dispatch:

env:
  SERVER_PRIVATE_KEY: ${{ secrets.SERVER_PRIVATE_KEY }} # 服务器私钥
  SERVER_HOST: ${{ secrets.SERVER_HOST }} # 服务器IP地址
  SERVER_USER_NAME: ${{ secrets.SERVER_USER_NAME }} # 服务器用户名

jobs:
  docs:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
        with:
          # “最近更新时间” 等 git 日志相关信息，需要拉取全部提交记录
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v1
        with:
          # 选择要使用的 node 版本
          node-version: '16.15.0'

      # 当前目录
      - name: Address docs root directory
        run: ls -l

      # 缓存 node_modules
      - name: Cache dependencies
        uses: actions/cache@v2
        id: npm-cache
        with:
          path: |
            **/node_modules
          key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-npm-

      # 如果缓存没有命中，安装依赖
      - name: Install dependencies
        if: steps.npm-cache.outputs.cache-hit != 'true'
        run: npm ci

      # 运行构建脚本
      - name: Build VuePress site
        run: npm run build

      # 上传
      # 使用第三方action，用于ssh私钥缓存  
      - uses: webfactory/ssh-agent@v0.4.1 
        with:
         ssh-private-key: ${{ env.SERVER_PRIVATE_KEY }}

      # 使用 ssh-keyscan 命令扫描我们服务器的公钥
      # 并保存到github actions虚拟环境的 ~/.ssh/known_hosts 中，用于工作流的无人值守
      - name: Scan public keys
        run: ssh-keyscan ${{ env.SERVER_HOST }} >> ~/.ssh/known_hosts            

      # 部署 通过rsync将虚拟环境下编译好的public目录同步到我们的服务器指定目录下。
      # rsync --delete会删除目的目录中不在源目录中的文件。
      - name: Deploy
        run: rsync -av --delete docs root@${{ secrets.SERVER_HOST }}:/usr/local/nginx/html
```

::: warning

上面需要在腾讯云服务器生成公钥和私钥。公钥的内容(不包含公钥名称)粘贴到`/root/.ssh/authorized_keys`文件。在 GitHub 仓库的`Settings->Secrets->Actions`创建键值对，其中私钥的值是私钥文件里的所有内容！

:::

::: warning

解决 centos ssh 服务启动失败的方法：
```sh
#systemctl start sshd
#service sshd start
```

启动服务失败可以使用 `sudo sshd -t` 检查服务，跟着提示一步一步解决问题，如果执行命令没有任何提示那证明服务基本没什么问题了。

:::

这里再来看一个 [.yml 文件](https://github.com/wishzhang/wish-cvue/blob/main/.github/workflows/webpack.yml)的例子：

```yaml
name: docs

on:
  # 每当 push 到 main 分支时触发部署
  push:
    branches: [main]
  # 手动触发部署
  workflow_dispatch:

defaults:
  run:
    working-directory: docs

jobs:
  docs:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
        with:
          # “最近更新时间” 等 git 日志相关信息，需要拉取全部提交记录
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v1
        with:
          # 选择要使用的 node 版本
          node-version: '16.15.0'

      # 当前目录
      - name: Address docs root directory
        run: ls -l

      # 缓存 node_modules
      - name: Cache dependencies
        uses: actions/cache@v2
        id: npm-cache
        with:
          path: |
            **/node_modules
          key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-npm-

      # 如果缓存没有命中，安装依赖
      - name: Install dependencies
        if: steps.npm-cache.outputs.cache-hit != 'true'
        run: npm ci

      # 运行构建脚本
      - name: Build VuePress site
        run: npm run build

      # 查看 workflow 的文档来获取更多信息
      # @see https://github.com/crazy-max/ghaction-github-pages
      - name: Deploy to GitHub Pages
        uses: crazy-max/ghaction-github-pages@v2
        with:
          # 部署到 gh-pages 分支
          target_branch: gh-pages
          # 部署目录为 VuePress 的默认输出目录
          build_dir: docs/docs/.vuepress/dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```



## GitHub Pages

每个代码仓库都可以对应一个 GitHub 网站链接，比如仓库名是 `wish-cvue`，那么网站链接对应就是 [https://wishzhang.github.io/wish-cvue/](https://wishzhang.github.io/wish-cvue/)。一个特例是，如果需要以 [https://wishzhang.github.io](https://wishzhang.github.io) 为网站链接，那么仓库名需要是 `wishzhang.gihub.io`。



最后在 GitHub 仓库的 `Settings -> Pages` 调整配置参数，自动化部署就好啦！

































