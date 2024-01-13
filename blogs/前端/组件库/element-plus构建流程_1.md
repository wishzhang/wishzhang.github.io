---
title: element-plus源码分析-构建流程
date: 2022-2-2
tags: 

- element-plus

categories:

 - 前端
---



# 总体构建流程介绍





![cvue.js.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0931676cc2b4a7baf926372db06c7f0~tplv-k3u1fbpfcp-watermark.image?)


上图是 element-plus 项目开发和打包的项目总体构建流程图，几乎其他的项目构建过程也类似这个过程。

以下笔者将具体介绍 `build process` 的构建流程。

我们在控制台 element-plus 根目录路径下运行 `pnpm run build` 命令将执行 `gulp --require sucrase/register/ts -f build/gulpfile.ts` 意思是通过gulp执行构建任务，任务构建的入口文件是 `build/gulpfile.ts`

让我们看一下这个 gulpfile.ts 文件的主要内容：

```typescript
export const copyFiles = () =>
  Promise.all([
    copyFile(epPackage, path.join(epOutput, 'package.json')),
    copyFile(
      path.resolve(projRoot, 'README.md'),
      path.resolve(epOutput, 'README.md')
    ),
    copyFile(
      path.resolve(projRoot, 'typings/global.d.ts'),
      path.resolve(epOutput, 'global.d.ts')
    ),
  ])

export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, 'types')
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path, { recursive: true })
    )

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}

export const copyFullStyle = async () => {
  await mkdir(path.resolve(epOutput, 'dist'), { recursive: true })
  await copyFile(
    path.resolve(epOutput, 'theme-chalk/index.css'),
    path.resolve(epOutput, 'dist/index.css')
  )
}

export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () => mkdir(epOutput, { recursive: true })),

  parallel(
    runTask('buildModules'),
    runTask('buildFullBundle'),
    runTask('generateTypesDefinitions'),
    runTask('buildHelper'),
    series(
      withTaskName('buildThemeChalk', () =>
        run('pnpm run -C packages/theme-chalk build')
      ),
      copyFullStyle
    )
  ),

  parallel(copyTypesDefinitions, copyFiles)
)

export * from './types-definitions'
export * from './modules'
export * from './full-bundle'
export * from './helper'

```

可以看到首先执行任务：清空项目 dist 文件夹和创建 `dist/element-plus` 目录，然后依次执行 `buildModules` 、 `buildFullBundle` 、`generateTypesDefinitions` 、 `buildThemeChalk 和 copyFullStyle` 、`copyTypesDefinitions和copyFiles` 这些构建任务。对应的构建任务的处理函数划分为模块 export 导出给 gulp 工具来处理，如其中的 `generateTypesDefinitions`处理过程定义在 `export * from './types-definitions'`  这个文件中。



打包路径定义在 `build/utils/paths.ts`中，如下所示：

```typescript
import { resolve } from 'path'
// projRoot 为项目根目录
export const projRoot = resolve(__dirname, '..', '..')
export const pkgRoot = resolve(projRoot, 'packages')
export const themeRoot = resolve(pkgRoot, 'theme-chalk')
export const epRoot = resolve(pkgRoot, 'element-plus')
/** dist */
export const buildOutput = resolve(projRoot, 'dist')
/** dist/element-plus */
export const epOutput = resolve(buildOutput, 'element-plus')
```



总的来说，在element-plus项目执行 `pnpm run build` 的打包任务细分为四个：

- 生成适合模块环境的文件
- 生成适合浏览器环境的文件
- 生成声明文件
- 生成样式文件



下面笔者将依次介绍这四个打包任务。

# 1、生成适合模块环境的文件

```typescript
export const buildModules = async () => {
  const input = excludeFiles(
    await glob('**/*.{js,ts,vue}', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )
  const bundle = await rollup({
    input,
    plugins: [
      ElementPlusAlias(),
      css(),
      vue({
        isProduction: false,
      }),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      commonjs(),
      esbuild({
        sourceMap: true,
        target,
      }),
      filesize({ reporter }),
    ],
    external: await generateExternal({ full: false }),
  })
  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true,
        preserveModulesRoot: epRoot,
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`,
      }
    })
  )
}
```

```
export const buildConfig: Record<Module, BuildInfo> = {
  esm: {
    module: 'ESNext',
    format: 'esm',
    ext: 'mjs',
    output: {
      name: 'es',
      path: path.resolve(epOutput, 'es'),
    },
    bundle: {
      path: `${EP_PKG}/es`,
    },
  },
  cjs: {
    module: 'CommonJS',
    format: 'cjs',
    ext: 'js',
    output: {
      name: 'lib',
      path: path.resolve(epOutput, 'lib'),
    },
    bundle: {
      path: `${EP_PKG}/lib`,
    },
  },
}
export const buildConfigEntries = Object.entries(
  buildConfig
) as BuildConfigEntries
```

执行 `buildModules` 是将 `packages下所有的 js,ts,vue文件`，打包输出到`dist/element-plus/es或lib`文件夹中, 并且发布的 element-plus 包的如下图所示在 package.json 中声明了的 main、module字段引用这里的文件

package.json

```json
{
  "main": "lib/index.js",
  "module": "es/index.mjs",
}
```



# 2、生成适合浏览器环境的文件



```typescript
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

async function buildFullLocale(minify: boolean) {
  const files = await glob(`${path.resolve(localeRoot, 'lang')}/*.ts`, {
    absolute: true,
  })
  return Promise.all(
    files.map(async (file) => {
      const filename = path.basename(file, '.ts')
      const name = capitalize(camelCase(filename))

      const bundle = await rollup({
        input: file,
        plugins: [
          esbuild({
            minify,
            sourceMap: minify,
            target,
          }),
          filesize({ reporter }),
        ],
      })
      await writeBundles(bundle, [
        {
          format: 'umd',
          file: path.resolve(
            epOutput,
            'dist/locale',
            formatBundleFilename(filename, minify, 'js')
          ),
          exports: 'named',
          name: `ElementPlusLocale${name}`,
          sourcemap: minify,
          banner,
        },
        {
          format: 'esm',
          file: path.resolve(
            epOutput,
            'dist/locale',
            formatBundleFilename(filename, minify, 'mjs')
          ),
          sourcemap: minify,
          banner,
        },
      ])
    })
  )
}

export const buildFull = (minify: boolean) => async () =>
  Promise.all([buildFullEntry(minify), buildFullLocale(minify)])

export const buildFullBundle = parallel(
  withTaskName('buildFullMinified', buildFull(true)),
  withTaskName('buildFull', buildFull(false))
)
```

这里主要看 `buildFullEntry(minify)` 函数，打包入口为 `packages/element-plus/index.ts`, 然后输出到 `dist/element-plus/dist`文件夹下，文件名为index.full(.min).(mjs|js)。这里打包生成的文件可供浏览器环境使用。



#  3、生成声明文件



```typescript
const TSCONFIG_PATH = path.resolve(projRoot, 'tsconfig.json')
const outDir = path.resolve(buildOutput, 'types')

export const generateTypesDefinitions = async () => {
  const project = new Project({
    compilerOptions: {
      emitDeclarationOnly: true,
      outDir,
      baseUrl: projRoot,
      paths: {
        '@element-plus/*': ['packages/*'],
      },
    },
    tsConfigFilePath: TSCONFIG_PATH,
    skipAddingFilesFromTsConfig: true,
  })

  const filePaths = excludeFiles(
    await glob(['**/*.{js,ts,vue}', '!element-plus/**/*'], {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )
  const epPaths = excludeFiles(
    await glob('**/*.{js,ts,vue}', {
      cwd: epRoot,
      onlyFiles: true,
    })
  )

  const sourceFiles: SourceFile[] = []
  await Promise.all([
    ...filePaths.map(async (file) => {
      if (file.endsWith('.vue')) {
        const content = await fs.readFile(file, 'utf-8')
        const sfc = vueCompiler.parse(content)
        const { script, scriptSetup } = sfc.descriptor
        if (script || scriptSetup) {
          let content = ''
          let isTS = false
          if (script && script.content) {
            content += script.content
            if (script.lang === 'ts') isTS = true
          }
          if (scriptSetup) {
            const compiled = vueCompiler.compileScript(sfc.descriptor, {
              id: 'xxx',
            })
            content += compiled.content
            if (scriptSetup.lang === 'ts') isTS = true
          }
          const sourceFile = project.createSourceFile(
            path.relative(process.cwd(), file) + (isTS ? '.ts' : '.js'),
            content
          )
          sourceFiles.push(sourceFile)
        }
      } else {
        const sourceFile = project.addSourceFileAtPath(file)
        sourceFiles.push(sourceFile)
      }
    }),
    ...epPaths.map(async (file) => {
      const content = await fs.readFile(path.resolve(epRoot, file), 'utf-8')
      sourceFiles.push(
        project.createSourceFile(path.resolve(pkgRoot, file), content)
      )
    }),
  ])

  const diagnostics = project.getPreEmitDiagnostics()
  console.log(project.formatDiagnosticsWithColorAndContext(diagnostics))

  await project.emit({
    emitOnlyDtsFiles: true,
  })

  const tasks = sourceFiles.map(async (sourceFile) => {
    const relativePath = path.relative(pkgRoot, sourceFile.getFilePath())
    yellow(`Generating definition for file: ${bold(relativePath)}`)

    const emitOutput = sourceFile.getEmitOutput()
    const emitFiles = emitOutput.getOutputFiles()
    if (emitFiles.length === 0) {
      errorAndExit(new Error(`Emit no file: ${bold(relativePath)}`))
    }

    const tasks = emitFiles.map(async (outputFile) => {
      const filepath = outputFile.getFilePath()
      await fs.mkdir(path.dirname(filepath), {
        recursive: true,
      })

      await fs.writeFile(
        filepath,
        pathRewriter('esm')(outputFile.getText()),
        'utf8'
      )

      green(`Definition for file: ${bold(relativePath)} generated`)
    })

    await Promise.all(tasks)
  })

  await Promise.all(tasks)
}
```

这个过程是通过项目根目录的 `tsconfig.json` 配置来读取 packages下的一些文件（除去element-plus目录）的路径来作为打包入口，而打包出口为 `dist/types`

```typescript
  const project = new Project({
    compilerOptions: {
      emitDeclarationOnly: true,
      outDir,
      baseUrl: projRoot,
      paths: {
        '@element-plus/*': ['packages/*'],
      },
    },
    tsConfigFilePath: TSCONFIG_PATH,
    skipAddingFilesFromTsConfig: true,
  })
```

如上图所示，表示打包的 TypeScript 配置继承了项目根目录的 tsconfig.json,下图为根目录的 tsconfig.json 配置：

```json
{
  "compilerOptions": {
    "allowJs": true,
    "strict": true,
    "module": "ES6",
    "target": "ES2018",
    "noImplicitAny": false,
    "declaration": true,
    "moduleResolution": "Node",
    "esModuleInterop": true,
    "jsx": "preserve",
    "sourceMap": true,
    "lib": ["ES2018", "DOM"],
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["packages"],
  "exclude": ["node_modules", "**/__test?__", "**/dist"]
}
```

TypeScript 生成声明文件起作用的配置为 `"declaration: true"` ,  `emitDeclarationOnly `表示只生成 `*.d.ts`文件。

执行 `generateTypesDefinitions  ` 过程的作用是生成声明文件。生成了声明文件之后，再执行`copyTypesDefinitions` 将这些声明文件再拷贝到  `buildModules` 过程对应的输出目录下。



# 4、打包样式文件

```typescript
export const copyFullStyle = async () => {
  await mkdir(path.resolve(epOutput, 'dist'), { recursive: true })
  await copyFile(
    path.resolve(epOutput, 'theme-chalk/index.css'),
    path.resolve(epOutput, 'dist/index.css')
  )
}

series(
  withTaskName('buildThemeChalk', () =>
               run('pnpm run -C packages/theme-chalk build')
              ),
  copyFullStyle
)
```

执行 `pnpm run -C packages/theme-chalk build `相当于在 `packages/theme-chalk `目录下执行 `pnpm run build `命令，即`gulp --require sucrase/register/ts`, 我们来看一下对应的gulp配置文件：

```typescript
import path from 'path'
import chalk from 'chalk'
import { src, dest, series, parallel } from 'gulp'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import rename from 'gulp-rename'
import { epOutput } from '../../build/utils/paths'

const distFolder = path.resolve(__dirname, 'dist')
const distBundle = path.resolve(epOutput, 'theme-chalk')

/**
 * compile theme-chalk scss & minify
 * not use sass.sync().on('error', sass.logError) to throw exception
 * @returns
 */
function buildThemeChalk() {
  const sass = gulpSass(dartSass)
  const noElPrefixFile = /(index|base|display)/
  return src(path.resolve(__dirname, 'src/*.scss'))
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(
      cleanCSS({}, (details) => {
        console.log(
          `${chalk.cyan(details.name)}: ${chalk.yellow(
            details.stats.originalSize / 1000
          )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
        )
      })
    )
    .pipe(
      rename((path) => {
        if (!noElPrefixFile.test(path.basename)) {
          path.basename = `el-${path.basename}`
        }
      })
    )
    .pipe(dest(distFolder))
}

/**
 * copy from packages/theme-chalk/dist to dist/element-plus/theme-chalk
 */
export function copyThemeChalkBundle() {
  return src(`${distFolder}/**`).pipe(dest(distBundle))
}

/**
 * copy source file to packages
 */

export function copyThemeChalkSource() {
  return src(path.resolve(__dirname, 'src/**')).pipe(
    dest(path.resolve(distBundle, 'src'))
  )
}

export const build = parallel(
  copyThemeChalkSource,
  series(buildThemeChalk, copyThemeChalkBundle)
)

export default build

```

可以看到这里执行两个任务：

```typescript
export const build = parallel(
  copyThemeChalkSource,
  series(buildThemeChalk, copyThemeChalkBundle)
)
```

`copyThemeChalkSource` 做的是将 `src/** `下所有scss文件拷贝输出到 `dist/element-plus/theme-chalk  `路径下。

`buildThemeChalk` 做的是将 `src/**` 下所有 scss 编译成 css 文件并输出到 `packages/theme-chalk/dist `文件夹下，接着再将这些 css 文件拷贝到 `dist/element-plus/theme-chalk`中。

最后执行了 `copyFullStyle`，将 `dist/element-plus/theme-chalk/index.css `文件拷贝到 `dist/element-plus/dist/index.css` 中，这样对应的样式文件就全部生成了。



# 生成的包的文件结构


![image-20220128105151261.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be996e33b8a84528ad44a3b306fcc89a~tplv-k3u1fbpfcp-watermark.image?)

# 一个按钮组件的编写



## 查看组件运行效果

element-plus 项目使用了 pnpm，并运用其中工作空间的概念在项目中搭建了一个演示项目。运行 `pnpm run dev` 即可以开始这个项目的开发，我们看到运行了命令 `pnpm -C play dev`, 意思是 pnpm 定位到 `play` 文件夹下然后执行 `dev` 命令。而 play 文件夹这个其实是基于 `vite` 运行起来的，如下所示 `play` 文件夹结构：


![image-20220128143934639.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78a090c327b64b4887ab7eee008cc6a1~tplv-k3u1fbpfcp-watermark.image?)

vite 项目入口在 `index.html`，其中 `<script type="module" src="/main.ts"></script>` 引入了 `main.ts` ，而在 `main.ts` 中引入了样式文件 `index.scss` 和 `element-plus/index.ts`。

```typescript
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import '@element-plus/theme-chalk/src/index.scss'
import App from './src/App.vue'

const app = createApp(App)

app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.mount('#play')
```

上面`import ElementPlus from 'element-plus'` 因为在 `vite.config.ts` 里定义了路径别名，将定位到打包入口 `packages/element-plus/index.ts`：

```typescript
export default defineConfig(async () => {
  return {
    resolve: {
      alias: [
        {
          find: /^element-plus(\/(es|lib))?$/,
          replacement: path.resolve(epRoot, 'index.ts'),
        },
        {
          find: /^element-plus\/(es|lib)\/(.*)$/,
          replacement: `${pkgRoot}/$2`,
        },
      ],
    }
  }
})
```

那么，我们就可以在 `play/src/App.vue`文件中直接引用组件，运行然后查看效果了：

```vue
<template>
  <div class="play-container">
    <el-button type="primary">pleas click me!</el-button>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
html,
body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  #play {
    height: 100%;
    width: 100%;
    .play-container {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
```



## 组件的文件结构


![image-20220128153719684.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d5572aafbdf491a99d7dbb793936a55~tplv-k3u1fbpfcp-watermark.image?)

如上图所示，组件入口在 `button/index.ts`，然后分为 `__test__` 、`src` 、`style` 三个文件夹，其中 `__test__` 是用于编写单元测试用例，`style` 文件夹只是用于按需引入的情况下，如：

```typescript
import 'element-plus/es/components/button/style/css'
import { ElButton } from 'element-plus'
```

关于组件测试这里先不介绍，先介绍组件目录下的 `index.ts` 以及其 `src` 文件夹。



我们来看一下 `packages/components/button/index.ts`文件：

```typescript
import { withInstall, withNoopInstall } from '@element-plus/utils/with-install'
import Button from './src/button.vue'
import ButtonGroup from './src/button-group.vue'

export const ElButton = withInstall(Button, {
  ButtonGroup,
})
export const ElButtonGroup = withNoopInstall(ButtonGroup)
export default ElButton

export * from './src/button'
```

在 `index.ts`中用两种方式导出了组件， `export const ElButton` 以及 `export default ElButton`，而其它的一些导出是为了类型提示。我们看到 `import Button from './src/button.vue'` 其中的Button，利用`withInstall`函数混入了[install方法](https://cn.vuejs.org/v2/guide/plugins.html#ad)。



那么，打包的时候 `packages/element-plus/index.ts`导出一个安装器对象，包含了一个总的 `install` 安装方法：

```typescript
import installer from './defaults'
export * from '@element-plus/components'
export * from '@element-plus/directives'
export * from '@element-plus/hooks'
export * from '@element-plus/tokens'
export * from '@element-plus/utils/popup-manager'
export { makeInstaller } from './make-installer'

export const install = installer.install
export const version = installer.version
export default installer
```

其中 `packages/elements-plus/defaults.ts`文件: 将  Components 各组件导入，然后创建一个安装器。

```typescript
import { makeInstaller } from './make-installer'
import Components from './component'
import Plugins from './plugin'

export default makeInstaller([...Components, ...Plugins])
```

接着 `packages/elements-plus/makk-installer.ts`创建安装器：

```typescript
const INSTALLED_KEY = Symbol('INSTALLED_KEY')

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App, options: ConfigProviderContext = {}) => {
    if (app[INSTALLED_KEY]) return

    app[INSTALLED_KEY] = true
    components.forEach((c) => app.use(c))
    provideGlobalConfig(options, app)

    watch(
      () => unref(options).zIndex,
      () => {
        const zIndex = unref(options).zIndex
        if (isNumber(zIndex)) PopupManager.globalInitialZIndex = zIndex
      },
      { immediate: true }
    )
  }

  return {
    version,
    install,
  }
}

```

 我们看到  `components.forEach((c) => app.use(c)) ` 这句代码意思是安装各个组件，将注册各个组件，到这里我们对一个组件的对外的打包接口已经大致了解了。



## 组件内部结构

来看组件文件中最核心的 ` button.vue` 文件吧：

```typescript
<template>
  <button
    ref="buttonRef"
    :class="[
      ns.b(),
      ns.m(buttonType),
      ns.m(buttonSize),
      ns.is('disabled', buttonDisabled),
      ns.is('loading', loading),
      ns.is('plain', plain),
      ns.is('round', round),
      ns.is('circle', circle),
    ]"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :style="buttonStyle"
    @click="handleClick"
  >
    <template v-if="loading">
      <slot v-if="$slots.loading" name="loading"></slot>
      <el-icon v-else :class="ns.is('loading')">
        <component :is="loadingIcon" />
      </el-icon>
    </template>
    <el-icon v-else-if="icon">
      <component :is="icon" />
    </el-icon>
    <span
      v-if="$slots.default"
      :class="{ [ns.em('text', 'expand')]: shouldAddSpace }"
    >
      <slot></slot>
    </span>
  </button>
</template>

<script lang="ts">
import { computed, inject, defineComponent, Text, ref } from 'vue'
import { useCssVar } from '@vueuse/core'
import { TinyColor } from '@ctrl/tinycolor'
import { ElIcon } from '@element-plus/components/icon'
import {
  useDisabled,
  useFormItem,
  useGlobalConfig,
  useNamespace,
  useSize,
} from '@element-plus/hooks'
import { buttonGroupContextKey } from '@element-plus/tokens'
import { Loading } from '@element-plus/icons-vue'

import { buttonEmits, buttonProps } from './button'

export default defineComponent({
  name: 'ElButton',

  components: {
    ElIcon,
    Loading,
  },

  props: buttonProps,
  emits: buttonEmits,

  setup(props, { emit, slots }) {
    const buttonRef = ref()
    const buttonGroupContext = inject(buttonGroupContextKey, undefined)
    const globalConfig = useGlobalConfig('button')
    const ns = useNamespace('button')
    const autoInsertSpace = computed(
      () =>
        props.autoInsertSpace ?? globalConfig.value?.autoInsertSpace ?? false
    )

    // add space between two characters in Chinese
    const shouldAddSpace = computed(() => {
      const defaultSlot = slots.default?.()
      if (autoInsertSpace.value && defaultSlot?.length === 1) {
        const slot = defaultSlot[0]
        if (slot?.type === Text) {
          const text = slot.children
          return /^\p{Unified_Ideograph}{2}$/u.test(text as string)
        }
      }
      return false
    })

    const { form } = useFormItem()
    const buttonSize = useSize(computed(() => buttonGroupContext?.size))
    const buttonDisabled = useDisabled()
    const buttonType = computed(
      () => props.type || buttonGroupContext?.type || ''
    )

    // calculate hover & active color by color
    const typeColor = computed(
      () => useCssVar(`--el-color-${props.type}`).value
    )
    const buttonStyle = computed(() => {
      let styles = {}

      const buttonColor = props.color || typeColor.value

      if (buttonColor) {
        const shadeBgColor = new TinyColor(buttonColor).shade(10).toString()
        if (props.plain) {
          styles = {
            '--el-button-bg-color': new TinyColor(buttonColor)
              .tint(90)
              .toString(),
            '--el-button-text-color': buttonColor,
            '--el-button-hover-text-color': 'var(--el-color-white)',
            '--el-button-hover-bg-color': buttonColor,
            '--el-button-hover-border-color': buttonColor,
            '--el-button-active-bg-color': shadeBgColor,
            '--el-button-active-text-color': 'var(--el-color-white)',
            '--el-button-active-border-color': shadeBgColor,
          }
        } else {
          const tintBgColor = new TinyColor(buttonColor).tint(20).toString()
          styles = {
            '--el-button-bg-color': buttonColor,
            '--el-button-border-color': buttonColor,
            '--el-button-hover-bg-color': tintBgColor,
            '--el-button-hover-border-color': tintBgColor,
            '--el-button-active-bg-color': shadeBgColor,
            '--el-button-active-border-color': shadeBgColor,
          }
        }

        if (buttonDisabled.value) {
          const disabledButtonColor = new TinyColor(buttonColor)
            .tint(50)
            .toString()
          styles['--el-button-disabled-bg-color'] = disabledButtonColor
          styles['--el-button-disabled-border-color'] = disabledButtonColor
        }
      }

      return styles
    })

    const handleClick = (evt: MouseEvent) => {
      if (props.nativeType === 'reset') {
        form?.resetFields()
      }
      emit('click', evt)
    }

    return {
      buttonRef,
      buttonStyle,

      buttonSize,
      buttonType,
      buttonDisabled,

      shouldAddSpace,

      handleClick,

      ns,
    }
  },
})
</script>

```

运用 vue3 的代码组织方式，主要是定义组件的 `name` 、`components` 、`props` 、`emits` 、`setup`， `setup` 函数将一些方法 return 出去给 template 使用，具体细节这里不介绍了。









