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

[Vite](https://vitejs.dev/) 是什么呢？打开 Vite 的官网，可以看到一个很显眼的标题「Vite 下一代的前端工具链」。在我的想法里，前端工具链是分为两种的：一种是应用的构建工具，另一种是构建工具的工具。这个标题所指的应该是前一种。Vite 是尤大神在 2020 年发起的项目，现在的版本已经是 v4 了，这样算几乎是每半年发一个向后不兼容的大版本。

但这对于大多数应用开发者来说，并不是件好事。至少从目前来看，相关的生态系统还在构建中，如果使用这些新技术就很可能会遇到比较多的问题，花费更大的成本但没解决痛点，甚至加班加点，结果是不尽人意的。所以，Vite 是下一代还不是这一代，现在使用有些为时尚早了。

不同尺子的度量只会度量出尺子能度量的范围，商业只会不管不顾地宣传好的一面，而公司的具体应用总以经济效益为目标。但最终大多数开发者还是去折腾了。如果对底层的工具链不了解，遇到问题是比较棘手的，真的很是浪费生命。



## Vite 基础

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



## Vite 源码

Vite 官方文档介绍了基础的概念和运用，但开发者在没有遇到问题之前，查看扩展的使用方法没有太大意义。并且大多数库还没有达到全自动化的状态，基本都是半自动化。当半自动化失效的时候，理解内部运行原理对解决问题是有很大的帮助的，这是为什么在只了解了基础用法后，需要来了解源码的原因。

### 源码结构

- packages 主要的源码
- script 一些CI脚本
- docs 源码
- playground 一些功能测试代码
- 其他配置

核心源码是在packages文件夹，里面有三个包：

- [vite](https://github.com/vitejs/vite/blob/main/packages/vite) 核心源码
- [@vitejs/plugin-legacy](https://github.com/vitejs/vite/blob/main/packages/plugin-legacy) 为打包后的文件提供传统浏览器兼容性支持
- [create-vite](https://github.com/vitejs/vite/blob/main/packages/create-vite) 提供各种使用Vite作为构建工具的项目脚手架

### 入口流程 （1. 启动Server）

a. 从创建一个[基于 Vite 的 Vue3 应用](https://cn.vuejs.org/guide/quick-start.html#creating-a-vue-application)开始

b. 我们可以看到 packages.json 关于 Vite 的脚本：

```json{3}
{
  "scripts": {
    "dev": "vite",
    "preview": "vite preview",
    "build-only": "vite build"
  }
}
```

当执行 `npm run dev` ，实质上会执行 `vite ` 。而执行 `vite` 会去执行当前项目 node_modules/.bin/vite 这个脚本文件。

:::tip

当执行 npm install 会去检测 Vite 依赖包的 package.json 是否存在 bin 字段，如果存在则在 node_modules/.bin 目录生成 vite 脚本文件，这个在 [npm官方文档](https://docs.npmjs.com/cli/v9/using-npm/scripts)有介绍）。

:::

如下我们可以看到，node_modules/.bin/vite 命令脚本实质上是去执行 package.json 的 bin 字段指定的 vite.js 文件：

```sh{11}
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*|*MINGW*|*MSYS*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  exec "$basedir/node"  "$basedir/../vite/bin/vite.js" "$@"
else 
  exec node  "$basedir/../vite/bin/vite.js" "$@"
fi
```

根据上面的路径，我们再来看一下 node_modules/vite/bin/vite.js：

:::details 代码

```js{43-45}
#!/usr/bin/env node
import { performance } from 'node:perf_hooks'

if (!import.meta.url.includes('node_modules')) {
  try {
    // only available as dev dependency
    await import('source-map-support').then((r) => r.default.install())
  } catch (e) {}
}

global.__vite_start_time = performance.now()

// check debug mode first before requiring the CLI.
const debugIndex = process.argv.findIndex((arg) => /^(?:-d|--debug)$/.test(arg))
const filterIndex = process.argv.findIndex((arg) =>
  /^(?:-f|--filter)$/.test(arg),
)
const profileIndex = process.argv.indexOf('--profile')

if (debugIndex > 0) {
  let value = process.argv[debugIndex + 1]
  if (!value || value.startsWith('-')) {
    value = 'vite:*'
  } else {
    // support debugging multiple flags with comma-separated list
    value = value
      .split(',')
      .map((v) => `vite:${v}`)
      .join(',')
  }
  process.env.DEBUG = `${
    process.env.DEBUG ? process.env.DEBUG + ',' : ''
  }${value}`

  if (filterIndex > 0) {
    const filter = process.argv[filterIndex + 1]
    if (filter && !filter.startsWith('-')) {
      process.env.VITE_DEBUG_FILTER = filter
    }
  }
}

function start() {
  return import('../dist/node/cli.js')
}

if (profileIndex > 0) {
  process.argv.splice(profileIndex, 1)
  const next = process.argv[profileIndex]
  if (next && !next.startsWith('-')) {
    process.argv.splice(profileIndex, 1)
  }
  const inspector = await import('node:inspector').then((r) => r.default)
  const session = (global.__vite_profile_session = new inspector.Session())
  session.connect()
  session.post('Profiler.enable', () => {
    session.post('Profiler.start', start)
  })
} else {
  start()
}
```

::: 

我们可以看到上面代码主要是执行了 `start()` 函数，里边 import 了 node_modules/vite/dist/node/cli.js，为了方便查看，笔者展示 Vite 项目 [对应的源码文件](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/cli.ts)如下：

:::details 代码

```ts{5,15,95-198,352}
import path from 'node:path'
import fs from 'node:fs'
import { performance } from 'node:perf_hooks'
import type { Session } from 'node:inspector'
import { cac } from 'cac'
import colors from 'picocolors'
import type { BuildOptions } from './build'
import type { ServerOptions } from './server'
import type { LogLevel } from './logger'
import { createLogger } from './logger'
import { VERSION } from './constants'
import { bindShortcuts } from './shortcuts'
import { resolveConfig } from '.'

const cli = cac('vite')

// global options
interface GlobalCLIOptions {
  '--'?: string[]
  c?: boolean | string
  config?: string
  base?: string
  l?: LogLevel
  logLevel?: LogLevel
  clearScreen?: boolean
  d?: boolean | string
  debug?: boolean | string
  f?: string
  filter?: string
  m?: string
  mode?: string
  force?: boolean
}

// @ts-ignore
let profileSession: Session | undefined = global.__vite_profile_session
let profileCount = 0

export const stopProfiler = (
  log: (message: string) => void,
): void | Promise<void> => {
  if (!profileSession) return
  return new Promise((res, rej) => {
    profileSession!.post('Profiler.stop', (err: any, { profile }: any) => {
      // Write profile to disk, upload, etc.
      if (!err) {
        const outPath = path.resolve(
          `./vite-profile-${profileCount++}.cpuprofile`,
        )
        fs.writeFileSync(outPath, JSON.stringify(profile))
        log(
          colors.yellow(
            `CPU profile written to ${colors.white(colors.dim(outPath))}`,
          ),
        )
        profileSession = undefined
        res()
      } else {
        rej(err)
      }
    })
  })
}

const filterDuplicateOptions = <T extends object>(options: T) => {
  for (const [key, value] of Object.entries(options)) {
    if (Array.isArray(value)) {
      options[key as keyof T] = value[value.length - 1]
    }
  }
}
/**
 * removing global flags before passing as command specific sub-configs
 */
function cleanOptions<Options extends GlobalCLIOptions>(
  options: Options,
): Omit<Options, keyof GlobalCLIOptions> {
  const ret = { ...options }
  delete ret['--']
  delete ret.c
  delete ret.config
  delete ret.base
  delete ret.l
  delete ret.logLevel
  delete ret.clearScreen
  delete ret.d
  delete ret.debug
  delete ret.f
  delete ret.filter
  delete ret.m
  delete ret.mode
  return ret
}

cli
  .option('-c, --config <file>', `[string] use specified config file`)
  .option('--base <path>', `[string] public base path (default: /)`)
  .option('-l, --logLevel <level>', `[string] info | warn | error | silent`)
  .option('--clearScreen', `[boolean] allow/disable clear screen when logging`)
  .option('-d, --debug [feat]', `[string | boolean] show debug logs`)
  .option('-f, --filter <filter>', `[string] filter debug logs`)
  .option('-m, --mode <mode>', `[string] set env mode`)

// dev
cli
  .command('[root]', 'start dev server') // default command
  .alias('serve') // the command is called 'serve' in Vite's API
  .alias('dev') // alias to align with the script name
  .option('--host [host]', `[string] specify hostname`)
  .option('--port <port>', `[number] specify port`)
  .option('--https', `[boolean] use TLS + HTTP/2`)
  .option('--open [path]', `[boolean | string] open browser on startup`)
  .option('--cors', `[boolean] enable CORS`)
  .option('--strictPort', `[boolean] exit if specified port is already in use`)
  .option(
    '--force',
    `[boolean] force the optimizer to ignore the cache and re-bundle`,
  )
  .action(async (root: string, options: ServerOptions & GlobalCLIOptions) => {
    filterDuplicateOptions(options)
    // output structure is preserved even after bundling so require()
    // is ok here
    const { createServer } = await import('./server')
    try {
      const server = await createServer({
        root,
        base: options.base,
        mode: options.mode,
        configFile: options.config,
        logLevel: options.logLevel,
        clearScreen: options.clearScreen,
        optimizeDeps: { force: options.force },
        server: cleanOptions(options),
      })

      if (!server.httpServer) {
        throw new Error('HTTP server not available')
      }

      await server.listen()

      const info = server.config.logger.info

      // @ts-ignore
      const viteStartTime = global.__vite_start_time ?? false
      const startupDurationString = viteStartTime
        ? colors.dim(
            `ready in ${colors.reset(
              colors.bold(Math.ceil(performance.now() - viteStartTime)),
            )} ms`,
          )
        : ''

      info(
        `\n  ${colors.green(
          `${colors.bold('VITE')} v${VERSION}`,
        )}  ${startupDurationString}\n`,
        { clear: !server.config.logger.hasWarned },
      )

      server.printUrls()
      bindShortcuts(server, {
        print: true,
        customShortcuts: [
          profileSession && {
            key: 'p',
            description: 'start/stop the profiler',
            async action(server) {
              if (profileSession) {
                await stopProfiler(server.config.logger.info)
              } else {
                const inspector = await import('node:inspector').then(
                  (r) => r.default,
                )
                await new Promise<void>((res) => {
                  profileSession = new inspector.Session()
                  profileSession.connect()
                  profileSession.post('Profiler.enable', () => {
                    profileSession!.post('Profiler.start', () => {
                      server.config.logger.info('Profiler started')
                      res()
                    })
                  })
                })
              }
            },
          },
        ],
      })
    } catch (e) {
      const logger = createLogger(options.logLevel)
      logger.error(colors.red(`error when starting dev server:\n${e.stack}`), {
        error: e,
      })
      stopProfiler(logger.info)
      process.exit(1)
    }
  })

// build
cli
  .command('build [root]', 'build for production')
  .option('--target <target>', `[string] transpile target (default: 'modules')`)
  .option('--outDir <dir>', `[string] output directory (default: dist)`)
  .option(
    '--assetsDir <dir>',
    `[string] directory under outDir to place assets in (default: assets)`,
  )
  .option(
    '--assetsInlineLimit <number>',
    `[number] static asset base64 inline threshold in bytes (default: 4096)`,
  )
  .option(
    '--ssr [entry]',
    `[string] build specified entry for server-side rendering`,
  )
  .option(
    '--sourcemap',
    `[boolean] output source maps for build (default: false)`,
  )
  .option(
    '--minify [minifier]',
    `[boolean | "terser" | "esbuild"] enable/disable minification, ` +
      `or specify minifier to use (default: esbuild)`,
  )
  .option('--manifest [name]', `[boolean | string] emit build manifest json`)
  .option('--ssrManifest [name]', `[boolean | string] emit ssr manifest json`)
  .option(
    '--force',
    `[boolean] force the optimizer to ignore the cache and re-bundle (experimental)`,
  )
  .option(
    '--emptyOutDir',
    `[boolean] force empty outDir when it's outside of root`,
  )
  .option('-w, --watch', `[boolean] rebuilds when modules have changed on disk`)
  .action(async (root: string, options: BuildOptions & GlobalCLIOptions) => {
    filterDuplicateOptions(options)
    const { build } = await import('./build')
    const buildOptions: BuildOptions = cleanOptions(options)

    try {
      await build({
        root,
        base: options.base,
        mode: options.mode,
        configFile: options.config,
        logLevel: options.logLevel,
        clearScreen: options.clearScreen,
        optimizeDeps: { force: options.force },
        build: buildOptions,
      })
    } catch (e) {
      createLogger(options.logLevel).error(
        colors.red(`error during build:\n${e.stack}`),
        { error: e },
      )
      process.exit(1)
    } finally {
      stopProfiler((message) => createLogger(options.logLevel).info(message))
    }
  })

// optimize
cli
  .command('optimize [root]', 'pre-bundle dependencies')
  .option(
    '--force',
    `[boolean] force the optimizer to ignore the cache and re-bundle`,
  )
  .action(
    async (root: string, options: { force?: boolean } & GlobalCLIOptions) => {
      filterDuplicateOptions(options)
      const { optimizeDeps } = await import('./optimizer')
      try {
        const config = await resolveConfig(
          {
            root,
            base: options.base,
            configFile: options.config,
            logLevel: options.logLevel,
          },
          'build',
        )
        await optimizeDeps(config, options.force, true)
      } catch (e) {
        createLogger(options.logLevel).error(
          colors.red(`error when optimizing deps:\n${e.stack}`),
          { error: e },
        )
        process.exit(1)
      }
    },
  )

cli
  .command('preview [root]', 'locally preview production build')
  .option('--host [host]', `[string] specify hostname`)
  .option('--port <port>', `[number] specify port`)
  .option('--strictPort', `[boolean] exit if specified port is already in use`)
  .option('--https', `[boolean] use TLS + HTTP/2`)
  .option('--open [path]', `[boolean | string] open browser on startup`)
  .option('--outDir <dir>', `[string] output directory (default: dist)`)
  .action(
    async (
      root: string,
      options: {
        host?: string | boolean
        port?: number
        https?: boolean
        open?: boolean | string
        strictPort?: boolean
        outDir?: string
      } & GlobalCLIOptions,
    ) => {
      filterDuplicateOptions(options)
      const { preview } = await import('./preview')
      try {
        const server = await preview({
          root,
          base: options.base,
          configFile: options.config,
          logLevel: options.logLevel,
          mode: options.mode,
          build: {
            outDir: options.outDir,
          },
          preview: {
            port: options.port,
            strictPort: options.strictPort,
            host: options.host,
            https: options.https,
            open: options.open,
          },
        })
        server.printUrls()
      } catch (e) {
        createLogger(options.logLevel).error(
          colors.red(`error when starting preview server:\n${e.stack}`),
          { error: e },
        )
        process.exit(1)
      } finally {
        stopProfiler((message) => createLogger(options.logLevel).info(message))
      }
    },
  )

cli.help()
cli.version(VERSION)

cli.parse()
```

:::

::: details 简化后的代码

```ts
import { cac } from 'cac'

const cli = cac('vite')

// dev
cli
  .command('[root]', 'start dev server') // default command
  .alias('serve') // the command is called 'serve' in Vite's API
  .alias('dev') // alias to align with the script name
  .option('--host [host]', `[string] specify hostname`)
  .option('--port <port>', `[number] specify port`)
  .action(async (root: string, options: ServerOptions & GlobalCLIOptions) => {
    const { createServer } = await import('./server')
    const server = await createServer({
    	root,
    	server: cleanOptions(options),
    })

	await server.listen()

	server.printUrls()
  })
  
cli.parse()
```

:::

[calc](https://www.npmjs.com/package/calc) 是开发 `cli ` 的工具库。在命令行窗口执行 `vite` 首先创建了 Server，并将命令行参数传进去。另外可以知道 `vite` 、`vite run dev` 和 `vite run serve` 是等效的。



### 入口流程（2. 创建Server)

:::details packages/vite/src/node/server/index.ts 简化后的代码

```js
import connect from 'connect'
import chokidar from 'chokidar'

export async function createServer(
  inlineConfig: InlineConfig = {},
): Promise<ViteDevServer> {
  const config = await resolveConfig(inlineConfig, 'serve')
  const { root, server: serverConfig } = config
  const httpsOptions = await resolveHttpsConfig(config.server.https)
  const { middlewareMode } = serverConfig

  const resolvedWatchOptions = resolveChokidarOptions(config, {
    disableGlobbing: true,
    ...serverConfig.watch,
  })

  const middlewares = connect() as Connect.Server
  const httpServer = middlewareMode
    ? null
    : await resolveHttpServer(serverConfig, middlewares, httpsOptions)
  const ws = createWebSocketServer(httpServer, config, httpsOptions)

  const watcher = chokidar.watch(
    path.resolve(root),
    resolvedWatchOptions,
  ) as FSWatcher

  const moduleGraph: ModuleGraph = new ModuleGraph((url, ssr) =>
    container.resolveId(url, undefined, { ssr }),
  )

  const container = await createPluginContainer(config, moduleGraph, watcher)
  const closeHttpServer = createServerCloseFn(httpServer)

  let exitProcess: () => void

  const server: ViteDevServer = {
    config,
    middlewares,
    httpServer,
    watcher,
    pluginContainer: container,
    ws,
    moduleGraph,
    resolvedUrls: null, // will be set on listen
    async listen(port?: number, isRestart?: boolean) {
      await startServer(server, port, isRestart)
      if (httpServer) {
        server.resolvedUrls = await resolveServerUrls(
          httpServer,
          config.server,
          config,
        )
      }
      return server
    },
    async restart(forceOptimize?: boolean) {
      if (!server._restartPromise) {
        server._forceOptimizeOnRestart = !!forceOptimize
        server._restartPromise = restartServer(server).finally(() => {
          server._restartPromise = null
          server._forceOptimizeOnRestart = false
        })
      }
      return server._restartPromise
    }
  }

  server.transformIndexHtml = createDevHtmlTransformFn(server)

  watcher.on('change', async (file) => {
    file = normalizePath(file)
    if (file.endsWith('/package.json')) {
      return invalidatePackageData(packageCache, file)
    }
    // invalidate module graph cache on file change
    moduleGraph.onFileChange(file)
    if (serverConfig.hmr !== false) {
      try {
        await handleHMRUpdate(file, server)
      } catch (err) {
        ws.send({
          type: 'error',
          err: prepareError(err),
        })
      }
    }
  })

  watcher.on('add', (file) => {
    handleFileAddUnlink(normalizePath(file), server)
  })
  watcher.on('unlink', (file) => {
    handleFileAddUnlink(normalizePath(file), server)
  })

  ws.on('vite:invalidate', async ({ path, message }: InvalidatePayload) => {
    const mod = moduleGraph.urlToModuleMap.get(path)
    if (mod && mod.isSelfAccepting && mod.lastHMRTimestamp > 0) {
      config.logger.info(
        colors.yellow(`hmr invalidate `) +
          colors.dim(path) +
          (message ? ` ${message}` : ''),
        { timestamp: true },
      )
      const file = getShortName(mod.file!, config.root)
      updateModules(
        file,
        [...mod.importers],
        mod.lastHMRTimestamp,
        server,
        true,
      )
    }
  })

  // Internal middlewares

  return server
}
```

:::

可以看到创建Server的流程，主要有以下几个部分组成：

- http server
- ws server
- watcher
- middleware 
- server对象

通过使用 [connect](https://www.npmjs.com/package/connect) 包来创建 http server 和中间件处理，使用了 [ws](https://github.com/websockets/ws) 包来创建 ws server，使用 [chokidar ](https://www.npmjs.com/package/chokidar)来创建watcher。

#### **创建 http server**

这个过程大致是读取配置，然后创建一个 http server，没有特别要注意的地方。

```ts
const config = await resolveConfig(inlineConfig, 'serve')
  const { root, server: serverConfig } = config
  const httpsOptions = await resolveHttpsConfig(config.server.https)
  const { middlewareMode } = serverConfig
  const middlewares = connect() as Connect.Server
  
  const httpServer = middlewareMode
    ? null
    : await resolveHttpServer(serverConfig, middlewares, httpsOptions)
```

#### **创建 ws server**

创建 ws server 的过程，可以知道是使用了 [ws](https://github.com/websockets/ws) 包来创建 ws server，并封装了几个通信的 API。

:::details code

```ts
import { WebSocketServer as WebSocketServerRaw } from 'ws'
export function createWebSocketServer(
  server: Server | null,
  config: ResolvedConfig,
  httpsOptions?: HttpsServerOptions,
): WebSocketServer {
  let wss: WebSocketServerRaw

  wss = new WebSocketServerRaw({ noServer: true })

  wss.on('connection', (socket) => {
    socket.on('message', (raw) => {
      if (!customListeners.size) return
      let parsed: any
      try {
        parsed = JSON.parse(String(raw))
      } catch {}
      if (!parsed || parsed.type !== 'custom' || !parsed.event) return
      const listeners = customListeners.get(parsed.event)
      if (!listeners?.size) return
      const client = getSocketClient(socket)
      listeners.forEach((listener) => listener(parsed.data, client))
    })
    socket.send(JSON.stringify({ type: 'connected' }))
    if (bufferedError) {
      socket.send(JSON.stringify(bufferedError))
      bufferedError = null
    }
  })

  // Provide a wrapper to the ws client so we can send messages in JSON format
  // To be consistent with server.ws.send
  function getSocketClient(socket: WebSocketRaw) {
    if (!clientsMap.has(socket)) {
      clientsMap.set(socket, {
        send: (...args) => {
          let payload: HMRPayload
          if (typeof args[0] === 'string') {
            payload = {
              type: 'custom',
              event: args[0],
              data: args[1],
            }
          } else {
            payload = args[0]
          }
          socket.send(JSON.stringify(payload))
        },
        socket,
      })
    }
    return clientsMap.get(socket)!
  }

  return {
    on: ((event: string, fn: () => void) => {
      if (wsServerEvents.includes(event)) wss.on(event, fn)
      else {
        if (!customListeners.has(event)) {
          customListeners.set(event, new Set())
        }
        customListeners.get(event)!.add(fn)
      }
    }) as WebSocketServer['on'],
    get clients() {
      return new Set(Array.from(wss.clients).map(getSocketClient))
    },
    send(...args: any[]) {
      let payload: HMRPayload
      if (typeof args[0] === 'string') {
        payload = {
          type: 'custom',
          event: args[0],
          data: args[1],
        }
      } else {
        payload = args[0]
      }

      const stringified = JSON.stringify(payload)
      wss.clients.forEach((client) => {
        // readyState 1 means the connection is open
        if (client.readyState === 1) {
          client.send(stringified)
        }
      })
    },
  }
}
```

::::

接下来看看 watcher。

**watcher**

创建 watcher，这里边用到了 [fast-glob](https://www.npmjs.com/package/fast-glob) 工具库。

:::details code

```ts
import glob from 'fast-glob'

export function resolveChokidarOptions(
  config: ResolvedConfig,
  options: WatchOptions | undefined,
): WatchOptions {
  const { ignored = [], ...otherOptions } = options ?? {}

  const resolvedWatchOptions: WatchOptions = {
    ignored: [
      '**/.git/**',
      '**/node_modules/**',
      '**/test-results/**', // Playwright
      glob.escapePath(config.cacheDir) + '/**',
      ...(Array.isArray(ignored) ? ignored : [ignored]),
    ],
    ignoreInitial: true,
    ignorePermissionErrors: true,
    ...otherOptions,
  }

  return resolvedWatchOptions
}
  
  const resolvedWatchOptions = resolveChokidarOptions(config, {
    disableGlobbing: true,
    ...serverConfig.watch,
  })
  
  const watcher = chokidar.watch(
    path.resolve(root),
    resolvedWatchOptions,
  ) as FSWatcher
```

:::

当我们修改了 IDE 的代码文件时，触发了 change 事件。然后主要调用了 `moduleGraph.onFileChange(file)` 和 `handleHMRUpdate(file, server)` 方法。

```ts{7,10}
watcher.on('change', async (file) => {
    file = normalizePath(file)
    if (file.endsWith('/package.json')) {
      return invalidatePackageData(packageCache, file)
    }
    // invalidate module graph cache on file change
    moduleGraph.onFileChange(file)
    if (serverConfig.hmr !== false) {
      try {
        await handleHMRUpdate(file, server)
      } catch (err) {
        ws.send({
          type: 'error',
          err: prepareError(err),
        })
      }
    }
  })
```

里边的代码还是很多的，比较复杂。`moduleGraph`这个对象是存储了全局的文件-模块关系Map，来看一下单个的数据结构：

```ts
export class ModuleNode {
  /**
   * Public served url path, starts with /
   */
  url: string
  /**
   * Resolved file system path + query
   */
  id: string | null = null
  file: string | null = null
  type: 'js' | 'css'
  info?: ModuleInfo
  meta?: Record<string, any>
  importers = new Set<ModuleNode>()
  importedModules = new Set<ModuleNode>()
  acceptedHmrDeps = new Set<ModuleNode>()
  acceptedHmrExports: Set<string> | null = null
  importedBindings: Map<string, Set<string>> | null = null
  isSelfAccepting?: boolean
  transformResult: TransformResult | null = null
  ssrTransformResult: TransformResult | null = null
  ssrModule: Record<string, any> | null = null
  ssrError: Error | null = null
  lastHMRTimestamp = 0
  lastInvalidationTimestamp = 0

  /**
   * @param setIsSelfAccepting - set `false` to set `isSelfAccepting` later. e.g. #7870
   */
  constructor(url: string, setIsSelfAccepting = true) {
    this.url = url
    this.type = isDirectCSSRequest(url) ? 'css' : 'js'
    if (setIsSelfAccepting) {
      this.isSelfAccepting = false
    }
  }
}
```

`fileToModulesMap = new Map<string, Set<ModuleNode>>()` 每个文件对应一个 `ModuleNode` 的集合。

在来看下 `handleHMRUpdate()` 方法，这里面有一系列的判断是重载所有代码的，最后才调用 `updateModules(shortFile, hmrContext.modules, timestamp, server)` 方法。

:::details code

```ts{83}
export async function handleHMRUpdate(
  file: string,
  server: ViteDevServer,
): Promise<void> {
  const { ws, config, moduleGraph } = server
  const shortFile = getShortName(file, config.root)
  const fileName = path.basename(file)

  const isConfig = file === config.configFile
  const isConfigDependency = config.configFileDependencies.some(
    (name) => file === name,
  )
  const isEnv =
    config.inlineConfig.envFile !== false &&
    (fileName === '.env' || fileName.startsWith('.env.'))
  if (isConfig || isConfigDependency || isEnv) {
    // auto restart server
    debugHmr(`[config change] ${colors.dim(shortFile)}`)
    config.logger.info(
      colors.green(
        `${path.relative(process.cwd(), file)} changed, restarting server...`,
      ),
      { clear: true, timestamp: true },
    )
    try {
      await server.restart()
    } catch (e) {
      config.logger.error(colors.red(e))
    }
    return
  }

  debugHmr(`[file change] ${colors.dim(shortFile)}`)

  // (dev only) the client itself cannot be hot updated.
  if (file.startsWith(normalizedClientDir)) {
    ws.send({
      type: 'full-reload',
      path: '*',
    })
    return
  }

  const mods = moduleGraph.getModulesByFile(file)

  // check if any plugin wants to perform custom HMR handling
  const timestamp = Date.now()
  const hmrContext: HmrContext = {
    file,
    timestamp,
    modules: mods ? [...mods] : [],
    read: () => readModifiedFile(file),
    server,
  }

  for (const hook of config.getSortedPluginHooks('handleHotUpdate')) {
    const filteredModules = await hook(hmrContext)
    if (filteredModules) {
      hmrContext.modules = filteredModules
    }
  }

  if (!hmrContext.modules.length) {
    // html file cannot be hot updated
    if (file.endsWith('.html')) {
      config.logger.info(colors.green(`page reload `) + colors.dim(shortFile), {
        clear: true,
        timestamp: true,
      })
      ws.send({
        type: 'full-reload',
        path: config.server.middlewareMode
          ? '*'
          : '/' + normalizePath(path.relative(config.root, file)),
      })
    } else {
      // loaded but not in the module graph, probably not js
      debugHmr(`[no modules matched] ${colors.dim(shortFile)}`)
    }
    return
  }

  updateModules(shortFile, hmrContext.modules, timestamp, server)
}
```



:::

最后在 `updateModules ` 这个方法判断并发送给浏览器更新的文件：

:::details code

```ts
export function updateModules(
  file: string,
  modules: ModuleNode[],
  timestamp: number,
  { config, ws }: ViteDevServer,
  afterInvalidation?: boolean,
): void {
  const updates: Update[] = []
  const invalidatedModules = new Set<ModuleNode>()
  let needFullReload = false

  for (const mod of modules) {
    invalidate(mod, timestamp, invalidatedModules)
    if (needFullReload) {
      continue
    }

    const boundaries = new Set<{
      boundary: ModuleNode
      acceptedVia: ModuleNode
    }>()
    const hasDeadEnd = propagateUpdate(mod, boundaries)
    if (hasDeadEnd) {
      needFullReload = true
      continue
    }

    updates.push(
      ...[...boundaries].map(({ boundary, acceptedVia }) => ({
        type: `${boundary.type}-update` as const,
        timestamp,
        path: normalizeHmrUrl(boundary.url),
        explicitImportRequired:
          boundary.type === 'js'
            ? isExplicitImportRequired(acceptedVia.url)
            : undefined,
        acceptedPath: normalizeHmrUrl(acceptedVia.url),
      })),
    )
  }

  ws.send({
    type: 'update',
    updates,
  })
}
```

:::

Vite 源码分析暂告一段落了，毕竟这样分析下去会很复杂吃力不讨好，项目本身也经过了几年的迭代了。后面需要再深入源码的话，可以从测试用例开始。然后需要了解的是如何编写 Vite 的插件。



## Vite 插件

先过一下 [Vite 插件](https://cn.vitejs.dev/guide/api-plugin.html) 的功能介绍。然后笔者就挑了这个插件来看 [@vitejs/plugin-vue](https://www.npmjs.com/package/@vitejs/plugin-vue) 。拉下源码捣鼓了一下发现，底层工具链要求具备的知识完全不一样。总之，调试和测试这个插件的源代码这个先放下吧，直接看下这个插件的源码流程。

插件的引入：

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [vue()],
}
```

源码入口在 [packages/plugin-vue/src/index.ts](https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue/src/index.ts)

插件对象有以下几个方法属性：

- name  值为 vite:vue ，暂时不懂这里为什么这么写。但package.json是按照插件命名规范的 `@vitejs/plugin-vue`
- handleHotUpdate() Vite独有的钩子，执行自定义 HMR 更新处理。
- config() Vite独有的钩子，在解析 Vite 配置前调用。
- configResolved() Vite独有的钩子，在解析 Vite 配置后调用。
- configureServer() Vite独有的钩子，是用于配置开发服务器的钩子。
- buildStart() 通用钩子，
- resolveId() 通用钩子
- load() 通用钩子
- transform() 通用钩子

笔者看了源码的代码很复杂，主要还使用了 @vue/compiler-sfc。再分析下去就举步维艰了，也没多大意义了。遇到这种情况怎么办呢？

**目前比较好的办法是新开一个自己的 playground 去跑示例 demo，熟悉主要的 API（目前很多项目没有详细的   playground，源码测试用例也是异构的没那么方便，这种情况下就必须自己已经具备熟悉 API 的先决条件。软件的现状就是这样。熟悉API最好的方式是看文档然后自己运行示例，如果官方有详细的示例就好了，但很多是没有的）。熟悉 API 后，如果需要再深入，建议是看 test 用例和使用调试的方式。**

