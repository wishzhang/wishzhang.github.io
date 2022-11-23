---
title: webpack之plugin
date: 2022-2-13
tags: 

- webpack

categories:

 - 前端
---

## 介绍

loader 能对某类型文件或模块进行处理，而 [plugin](https://webpack.docschina.org/api/plugins)能对 webpack 整个打包过程进行处理。插件的工作原理是通过对编译过程中的钩子编写处理过程。这些钩子有三种使用方法：tap、tapAsync、tapPromise。



## 自定义钩子

为了便于其他插件的编译过程中可以 `tap` 到，则需要创建一个新的 hook， 我们只需要简单的从 `tapable` 中 `require` 所需的 hook 类，并创建：

```js
const SyncHook = require('tapable').SyncHook;

if (compiler.hooks.myCustomHook) throw new Error('已存在该钩子');
compiler.hooks.myCustomHook = new SyncHook(['a', 'b', 'c']);

// 在你想要触发钩子的位置/时机下调用……
compiler.hooks.myCustomHook.call(a, b, c);
```



## 自定义插件

[自定义插件](https://webpack.docschina.org/contribute/writing-a-plugin) 向第三方开发者提供了 webpack 引擎中完整的能力。使用阶段式的构建回调，开发者可以在 webpack 构建流程中引入自定义的行为。创建插件比创建 loader 更加高级，因为你需要理解 webpack 底层的特性来处理相应的钩子，所以请做好阅读源码的准备！



### 基本插件架构

插件是由「具有 `apply` 方法的 prototype 对象」所实例化出来的。这个 `apply` 方法在安装插件时，会被 webpack compiler 调用一次。`apply` 方法可以接收一个 webpack compiler 对象的引用，从而可以在回调函数中访问到 compiler 对象。一个插件结构如下：

```js
class HelloWorldPlugin {
  apply(compiler) {
    compiler.hooks.done.tap(
      'Hello World Plugin',
      (
        stats /* 绑定 done 钩子后，stats 会作为参数传入。 */
      ) => {
        console.log('Hello World!');
      }
    );
  }
}

module.exports = HelloWorldPlugin;
```

然后，要安装这个插件，只需要在你的 webpack 配置的 plugin 数组中添加一个实例：

```js
// webpack.config.js
var HelloWorldPlugin = require('hello-world');

module.exports = {
  // ... 这里是其他配置 ...
  plugins: [new HelloWorldPlugin({ options: true })],
};
```



### 示例

一旦能我们深入理解 webpack compiler 和每个独立的 compilation，我们依赖 webpack 引擎将有无限多的事可以做。我们可以重新格式化已有的文件，创建衍生的文件，或者制作全新的生成文件。

让我们来写一个简单的示例插件，生成一个叫做 `assets.md` 的新文件；文件内容是所有构建生成的文件的列表。这个插件大概像下面这样：

```js
class FileListPlugin {
  static defaultOptions = {
    outputFile: 'assets.md',
  };

  // 需要传入自定义插件构造函数的任意选项
  //（这是自定义插件的公开API）
  constructor(options = {}) {
    // 在应用默认选项前，先应用用户指定选项
    // 合并后的选项暴露给插件方法
    // 记得在这里校验所有选项
    this.options = { ...FileListPlugin.defaultOptions, ...options };
  }

  apply(compiler) {
    const pluginName = FileListPlugin.name;

    // webpack 模块实例，可以通过 compiler 对象访问，
    // 这样确保使用的是模块的正确版本
    // （不要直接 require/import webpack）
    const { webpack } = compiler;

    // Compilation 对象提供了对一些有用常量的访问。
    const { Compilation } = webpack;

    // RawSource 是其中一种 “源码”("sources") 类型，
    // 用来在 compilation 中表示资源的源码
    const { RawSource } = webpack.sources;

    // 绑定到 “thisCompilation” 钩子，
    // 以便进一步绑定到 compilation 过程更早期的阶段
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      // 绑定到资源处理流水线(assets processing pipeline)
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,

          // 用某个靠后的资源处理阶段，
          // 确保所有资源已被插件添加到 compilation
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        (assets) => {
          // "assets" 是一个包含 compilation 中所有资源(assets)的对象。
          // 该对象的键是资源的路径，
          // 值是文件的源码

          // 遍历所有资源，
          // 生成 Markdown 文件的内容
          const content =
            '# In this build:\n\n' +
            Object.keys(assets)
              .map((filename) => `- ${filename}`)
              .join('\n');

          // 向 compilation 添加新的资源，
          // 这样 webpack 就会自动生成并输出到 output 目录
          compilation.emitAsset(
            this.options.outputFile,
            new RawSource(content)
          );
        }
      );
    });
  }
}

module.exports = { FileListPlugin };
```

**webpack.config.js**

```js
const { FileListPlugin } = require('./file-list-plugin.js');

// 在 webpack 配置中使用自定义的插件：
module.exports = {
  // …

  plugins: [
    // 添加插件，使用默认选项
    new FileListPlugin(),

    // 或者:

    // 使用任意支持的选项
    new FileListPlugin({
      outputFile: 'my-assets.md',
    }),
  ],
};
```

这样就生成了一个制定名称的 markdown 文件：

```markdown
# In this build:

- main.css
- main.js
- index.html
```





