---
title: element-plus源码分析-构建流程之full-bundle
date: 2022-2-2
tags: 

- element-plus

categories:

 - 前端
---



阅读这篇文章前，请先了解 [element-plus源码分析-构建流程](./构建流程_1)

full-bundle 是打包给浏览器的环境使用的，入口为 `packages/element-plus/index.ts`,出口为 `dist/element-plus/dist/index.full(.min).(mjs|js)` 



```ts
async function buildFullEntry(minify: boolean) {
  const bundle = await rollup({
    input: path.resolve(epRoot, 'index.ts'),
    plugins: [
      ElementPlusAlias(),
      vue({
        isProduction: true
      }),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      commonjs(),
      esbuild({
        minify,
        sourceMap: minify,
        target,
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),

        // options
        preventAssignment: true,
      }),
      filesize(),
    ],
    external: await generateExternal({ full: true }),
  })
  await writeBundles(bundle, [
    {
      format: 'umd',
      file: path.resolve(
        epOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'js')
      ),
      exports: 'named',
      name: 'ElementPlus',
      globals: {
        vue: 'Vue',
      },
      sourcemap: minify,
      banner,
    },
    {
      format: 'esm',
      file: path.resolve(
        epOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'mjs')
      ),
      sourcemap: minify,
      banner,
    },
  ])
}
```

来看看 `ElementPlusAlias` 插件做了什么事情：

```ts
import { EP_PKG, EP_PREFIX } from '../utils/constants'
import type { Plugin } from 'rollup'

export function ElementPlusAlias(): Plugin {
  const THEME_CHALK = `${EP_PREFIX}/theme-chalk`

  return {
    name: 'element-plus-alias-plugin',
    resolveId(id, importer, options) {
      if (!id.startsWith(EP_PREFIX)) return

      if (id.startsWith(THEME_CHALK)) {
        return {
          id: id.replaceAll(THEME_CHALK, `${EP_PKG}/theme-chalk`),
          external: 'absolute',
        }
      }

      return this.resolve(id, importer, { skipSelf: true, ...options })
    },
  }
}
```

这里处理 `[resolveId](https://www.rollupjs.com/guide/plugin-development#resolveid)` 钩子，rollup 中模块(文件)的id就是文件地址，所以类似resolveID这种就是解析文件地址的意思，我们可以返回我们想返回的文件id(也就是地址，相对路径、决定路径)来让rollup加载。EP_PREFIX的值是 `@element-plus` ， EP_PKG的值是 `element-plus` ,也就是不是 `@element-plus`的模块不打包，并且遇到的模块 `@element-plus/theme-chalk` 名称改为 `element-plus/theme-chalk`。也就是将js中的 样式文件的路径改为实际打包后的文件引用地址。（不过貌似 element-plus 源码中找不到那个 @element-plus/theme-chalk路径）



然后是 `import vue from '@vitejs/plugin-vue'`这个是导入 vite 的 vue 插件，真是烦单从这两行代码只能猜是用于 vite 解析 vue 文件的，而文档几乎啥也没写（需要的话只能去看源码了），就直接这样用吧前端真是乱，工程实践很多都是这样。



`nodeResolve` 这个 [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) 插件可以告诉 Rollup 如何查找外部模块。



目前， npm 中的大多数包都是以 CommonJS 模块的形式出现的。在它们更改之前，我们需要将 CommonJS 模块转换为 ES2015 供 Rollup 处理。这个 [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs) 插件就是用来将 CommonJS 转换成 ES2015 模块的。



`esbuild` 是将 TS/ESNext 编译成 ES6.



`@rollup/plugin-replace`是在打包的过程中将目标字符串替换。



`rollup-plugin-filesize` 是用来显示打包后的文件大小的插件。



来看 rollup 不打包进的依赖包:

```ts

export const generateExternal = async (options: { full: boolean }) => {
  const { dependencies, peerDependencies } = await getPackageDependencies(
    epPackage
  )

  return (id: string) => {
    const packages: string[] = peerDependencies
    if (!options.full) {
      packages.push('element-plus/theme-chalk')
      // dependencies
      packages.push('@vue', ...dependencies)
    }

    return [...new Set(packages)].some(
      (pkg) => id === pkg || id.startsWith(`${pkg}/`)
    )
  }
}
```

上面的意思是：将epPackage对应的package.json的上某些相关依赖不打包。

行了，你开始打包吧。













