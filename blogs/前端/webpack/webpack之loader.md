---
title: webpack之loader
date: 2022-2-9
tags: 

- webpack

categories:

 - 前端
---

## 介绍

[loader](https://webpack.docschina.org/contribute/writing-a-loader/) 用于对模块的源代码进行转换。我们一般使用配置的方式来使用 loader，如在 webpack.config.js 中配置：

```js
module.exports = {
  module: {
    rules: [
      { test: /\.css$/, use: 'css-loader' },
      { test: /\.ts$/, use: 'ts-loader' },
    ],
  }
};
```

注意 loader 的执行顺序是从右到左（或从下到上）执行，在上面的示例中，从 ts-loader 开始执行，然后继续执行 css-loader。接下来让我们来看看如何编写一个 loader 吧！

## 编写一个loader

一个 loader 是一个导出默认函数的 node 模块。这个函数在 webpack 编译源码的转换过程中会被调用。这个函数内部可通过 this 来调用 [Loader API](https://webpack.docschina.org/api/loaders/)。

### 实践指导

以下的实践指导在编写一个 loader 时应该遵守，在需要时可以去了解具体的指导细节。

- 保持简单
- 利用链式调用
- 暴露模块化接口
- 确保 loader 无公共状态
- 使用 loader 工具 API
- 声明使用到的依赖
- 抽取并管理公共代码
- 避免使用绝对路径
- 使用关联的依赖 peer dependencies



### 一个例子

```js
export default function loader(source) {
  const options = this.getOptions();

  source = source.replace(/\[name\]/g, options.name);

  return `export default ${JSON.stringify(source)}`;
}
```

我们例子里的 loader 的作用是处理 .txt 文件，将文件内容的`[name]`字符串替换成我们要求的目标字符串，最后将这些内容作为一个默认模块导出。

### 测试

我们使用[Jest](https://jestjs.io/)测试框架来测试，并且我们将配置 babel-jest 和一些预配置集，这样我就可以使用 import/export 和async/await，让我们开始添加这些依赖吧：

```bash
npm install --save-dev jest babel-jest @babel/core @babel/preset-env
```

**babel.config.js**

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
};
```

---

以上是测试环境的基本配置，接下来我们将使用 [Node.js API ](https://webpack.docschina.org/api/node)和 [memfs ](https://github.com/streamich/memfs)模块在代码中使用 webpack，这让我们可以获取到编译过程中的中间数据来使用。安装好 webpack 和 memfs：

```bash
npm install --save-dev webpack memfs
```

下面是一个 loader 文件 **test/compiler.js**:

```js
import path from 'path';
import webpack from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';

export default (fixture, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.txt$/,
          use: {
            loader: path.resolve(__dirname, '../src/loader.js'),
            options,
          },
        },
      ],
    },
  });

  compiler.outputFileSystem = createFsFromVolume(new Volume());
  compiler.outputFileSystem.join = path.join.bind(path);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      if (stats.hasErrors()) reject(stats.toJson().errors);

      resolve(stats);
    });
  });
};
```

现在我们可以编写测试然后添加到 npm 命令脚本来运行测试：

**test/loader.test.js**

```js
/**
 * @jest-environment node
 */
import compiler from './compiler.js';

test('Inserts name and outputs JavaScript', async () => {
  const stats = await compiler('example.txt', { name: 'Alice' });
  const output = stats.toJson({ source: true }).modules[0].source;

  expect(output).toBe('export default "Hey Alice!\\n"');
});
```

**package.json**

```json
{
  "scripts": {
    "test": "jest"
  },
  "jest": {
    "testEnvironment": "node"
  }
}
```

运行测试，我们将看到：

```bash
PASS  test/loader.test.js
✓ Inserts name and outputs JavaScript (229ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.853s, estimated 2s
Ran all test suites.
```

大功告成！现在可以去开发你专属的 loader 啦！







