---
title: only-allow
date: 2022-12-18
tags: 

- 工具链

categories:

 - 前端

showSponsor: true
---

前端项目如果没有限制包管理工具的使用，那么可以使用 npm、yarn、cnpm、pnpm来进行安装，但这有个缺点是不同的包管理工具的配置文件、node_modules 结构可能不同，会导致 install 之后，项目运行不起来，严重的话会影响到线上环境。那么这时得花时间去排查问题，比如删除 node_modules 重新安装（如果依赖包比较多，还影响到了开发效率，需要半个钟作用吧）。

所以，建议每个前端项目使用单一的包管理工具，可以通过 [only-allow](https://www.npmjs.com/package/only-allow) 来解决这个问题。



## 基础用法

假设我们有一个初始的前端项目，没有的话新建一个：

```sh
npm init -y
```

新建完项目后会生成一个 package.json 文件。如果使用单一的 pnpm 包管理工具，写上对应的 scripts :

```json
{
	"scripts": {
		"preinstall": "npx only-allow pnpm"
	}
}
```

这样就可以了，是不是很简单:smile:



## 了解更多

### npx

npx 是 npm v5.2.0 引入的一条命令，我们可以使用 npx 来执行各种命令。

npx 执行流程如下：

1. 到 node_modules/.bin 路径检查对应的命令是否存在，找到之后执行；
2. 没有找到，就去环境变量 $PATH 里面，检查对应命令是否存在，找到之后执行；
3. 还是没找到，自动下载一个临时依赖包的最新版本在一个临时目录，然后再运行命令。运行完之后删除。

上面的 `npx only-allow pnpm` 脚本，如果没有预先安装 only-allow 依赖包，那么就临时下载运行。这样不用预先使用 install 命令，因为这个脚本本身就要求先执行 install。

### Shebang

我们再来看 only-allow 的源码。主要是 bin.js 这个文件：

```js
#!/usr/bin/env node
const whichPMRuns = require('which-pm-runs')
const boxen = require('boxen')

const argv = process.argv.slice(2)
if (argv.length === 0) {
  console.log('Please specify the wanted package manager: only-allow <npm|cnpm|pnpm|yarn>')
  process.exit(1)
}
const wantedPM = argv[0]
if (wantedPM !== 'npm' && wantedPM !== 'cnpm' && wantedPM !== 'pnpm' && wantedPM !== 'yarn') {
  console.log(`"${wantedPM}" is not a valid package manager. Available package managers are: npm, cnpm, pnpm, or yarn.`)
  process.exit(1)
}
const usedPM = whichPMRuns()
const cwd = process.env.INIT_CWD || process.cwd()
const isInstalledAsDependency = cwd.includes('node_modules')
if (usedPM && usedPM.name !== wantedPM && !isInstalledAsDependency) {
  const boxenOpts = {borderColor: 'red', borderStyle: 'double', padding: 1}
  switch (wantedPM) {
    case 'npm':
      console.log(boxen('Use "npm install" for installation in this project', boxenOpts))
      break
    case 'cnpm':
      console.log(boxen('Use "cnpm install" for installation in this project', boxenOpts))
      break
    case 'pnpm':
      console.log(boxen(`Use "pnpm install" for installation in this project.

If you don't have pnpm, install it via "npm i -g pnpm".
For more details, go to https://pnpm.js.org/`, boxenOpts))
      break
    case 'yarn':
      console.log(boxen(`Use "yarn" for installation in this project.

If you don't have Yarn, install it via "npm i -g yarn".
For more details, go to https://yarnpkg.com/`, boxenOpts))
      break
  }
  process.exit(1)
}
```

这行代码 `#!/usr/bin/env node` 是为了兼容性。而其中的 `#!` 表示调用指定的解释器来执行文件内容。在 Linux 系统中 `$./bin.js` 表示执行 bin.js 文件内容，实质的执行过程是：

1. 如果指定了 `#!` ，比如 `#!/usr/bin/env node ` 就是使用环境变量中配置的 node 的路径，所有最终会执行 `node bin.js` ；
2. 如果没有字段 `#!`, 那么 Linux 系统会将文件作为 shell 脚本来执行。



### process.argv

[process.argv](http://nodejs.cn/api/process/process_argv.html) 是获取命令行的所有参数。比如 `node bin.js` 那么 process.argv[0] 是 node, process[1] 是 bin.js 。以此类推。



### process.exit(1)

执行后，执行的命令行程序，退出。exit(1) 表示异常退出。



### process.cwd()

`const cwd = process.env.INIT_CWD || process.cwd()` 这句代码表示当前执行的进程是在哪个目录下。详细请看 [process.cwd()](https://nodejs.org/api/process.html#processcwd)。



### which-pm-runs 依赖包

[which-pm-runs](https://www.npmjs.com/package/which-pm-runs)这个依赖包还是同一位大佬发布的，简单看一下它的用法：

```js
'use strict'
const whichPMRuns = require('which-pm-runs')

whichPMRuns()
//> {name: "pnpm", version: "0.64.2"}
```

看一下这个依赖包的核心源码只有十几行：

```js
'use strict'

module.exports = function () {
  if (!process.env.npm_config_user_agent) {
    return undefined
  }
  return pmFromUserAgent(process.env.npm_config_user_agent)
}

function pmFromUserAgent (userAgent) {
  const pmSpec = userAgent.split(' ')[0]
  const separatorPos = pmSpec.lastIndexOf('/')
  const name = pmSpec.substring(0, separatorPos)
  return {
    name: name === 'npminstall' ? 'cnpm' : name,
    version: pmSpec.substring(separatorPos + 1)
  }
}
```

核心是通过 `process.env.npm_config_user_agent` 来判断当前正在运行进程是哪个包管理工具。



THE END.



