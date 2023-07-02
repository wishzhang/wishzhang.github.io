---
title: 使用GitHub存储图片&JSON数据
date: 2023-07-02
tags: 

- 软件工程

categories:

- 其它


---

开发软件时，通常需要考虑软件部署到哪里的问题，在如今网络架构普遍存在的情况下，对于个人开发者而言选择的其实并不多。当软件的数据不能被用户动态添加，那么会有一些直接简便的方法来存储，而不需要用到MySQL等高级的能力，只需要存储静态数据。

静态数据可以直接存储在客户端，也可以存储在服务端，看具体的需求和质量要求。这里来看看如果存储在服务端有哪些选择？
服务端从是否收费的角度分为收费和免费的，收费的一般是增值服务。另外可以分为云服务器类型的、只包含云存储类型的，一般收费的包含了云服务器类型的，而免费的只包含云存储类型也就是只能存储静态数据。

如果是收费的就不考虑这么多了，这里来看免费的。笔者用的比较顺手的有三种，不分先后：

1. Vercel

2. https://raw.githubusercontent.com/

3. https://www.jsdelivr.com/

这三种只有jsdelivr是满足以下需求的：

- 免费
- 无需翻墙
- 可访问GitHub文件

但jsdelivr不能满足的是：

- html页面的访问，只是获取到了html数据，如果需要这个静态站点功能就不要用jsdelivr

接下来看看jsdelivr如何使用。

## jsdelivr与GitHub配置

1、创建一个GitHub仓库并设置为public公开类型

2、使用jsdelivr链接直接访问https://cdn.jsdelivr.net/gh/[github用户名]/[github仓库]/[文件路径]

3、（可选）自动同步GitHub到jsdelivr

jsdelivr有个缺点是不能实时同步GitHub，导致链接需要等到可能24小时后才有效。但jsdelivr对于GitHub的release包是实时的，通过push到GitHub，然后触发自动release的动作，就可以自动release了。自动release通过GitHub Actions来定义，如下：

在项目根目录创建`.github/workflows/auto-release.yml`

```yaml
name: Auto Release

on:
  push:
    branches:
      - main

jobs:
  auto-release:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [ 12.x ]
    steps:
      # check it to your workflow can access it
      # from: https://github.com/actions/checkout
      - name: 1. 检查master分支
        uses: actions/checkout@master

      - name: 2. 读取当前版本号
        id: version
        uses: ashley-taylor/read-json-property-action@v1.0
        with:
          path: ./package.json
          property: version

      - name: 3. 删除tag和release
        uses: ClementTsang/delete-tag-and-release@v0.3.1
        with:
          delete_release: true # default: false
          tag_name: v0.1.0 # tag name to delete
          repo: wishzhang/assets # target repo (optional). defaults to repo running this action
        env:
          GITHUB_TOKEN: ${{ secrets.PRIVATE_GITHUB_TOKEN }}

      - name: 4. 创建GitHub Release
        id: create_release
        uses: actions/create-release@latest
        env:
          GITHUB_TOKEN: ${{ secrets.PRIVATE_GITHUB_TOKEN }}
        with:
          tag_name: v${{steps.version.outputs.value}}
          release_name: v${{steps.version.outputs.value}}
          body: ${{steps.description.outputs.content}}
          draft: false
          prerelease: false
```

这样就ok了！现在可以提交文件到对应的GitHub仓库，然后通过jsdelivr实时访问了！（这个过程两分钟左右）。
另外，如果需要提交一些图片之类的文件，可以使用picGo工具来上传图片更方便一点。

附：

上面的action release后只删除了tag并没有删除release，不过不影响最终效果，这个后续可以再优化。GitHub不适合存储二进制的大文件，通过浏览器添加到仓库的文件大小限于每个文件 25 MB，更大的文件需要其他方式添加。
