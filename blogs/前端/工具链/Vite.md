---
title: Vite
date: 2022-12-08
tags: 

- Vite
- 工具链

categories:

 - 前端

showSponsor: true
---



## 介绍

Vite 是什么呢？打开 Vite 的官网，可以看到一个很显眼的口号「Vite 下一代的前端工具链」。在我的想法里，前端工具链是分为两种的：一种是应用的构建工具，另一种是构建工具的工具。这句口号所指的应该是前一种。Vite 是尤大大在 2020 年发起的项目，现在的版本已经是 v4 了，这样算几乎是每半年发一个向后不兼容的大版本。

但这对于大多数应用开发者来说，并不是件好事。至少从目前来看，相关的生态系统还在构建中，如果使用这些新技术就很可能会遇到比较多的问题，花费更大的成本但没解决痛点，甚至加班加点，结果是不尽人意的。所以，Vite 是下一代还不是这一代，现在使用有些为时尚早了。

不同尺子的度量只会度量出尺子能度量的范围，商业只会不管不顾地宣传好的一面，而公司的具体应用总以经济效益为目标。但最终大多数开发者还是去折腾了。如果对底层的工具链不了解，遇到问题是比较棘手的，真的很是浪费生命。



## Vite 配置

好了吐槽完了，我也该卷起来了。来看一下 Vite + Vue3 脚手架 vite.config.ts 的默认配置：

```ts
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

### resolve.alias

[node:url](https://nodejs.org/api/url.html) 是 node 模块。那 `fileURLToPath(new URL('./src', import.meta.url))` 是什么意思呢？这句代码其实是获取相对当前 vite.config.ts 文件的一个路径，这在 [import.meta](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta) 有详细说明。

顺便再看一下 `URL  ` 的用法：

```js
const myURL = new URL('/foo', 'https://example.org/');
// https://example.org/foo
```

最后 `fileURLToPath` 是一个路径的跨平台兼容的方法。



### @vitejs/plugin-vue

这个是用来编译 Vue3 SFC 的 Vite 插件，而 Vue2 用的是 Vite 插件是 [vite-plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)。



### @vitejs/plugin-vue-jsx

顾名思义，这是用来编译 Vue JSX 的插件。





