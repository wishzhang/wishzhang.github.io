---
title: husky
date: 2022-12-21
tags: 

- 工具链

categories:

 - 前端
showSponsor: true

---

笔者希望在 git 操作中添加两项功能：

- commit 代码质量检查
- commit 规范检查

其实只需要用到 [husky](https://www.npmjs.com/package/husky) 工具。尽量去看官方文档（因为可能有破坏性变更导致一些博文的用法和版本对不上）。

## 基础用法

### commit 代码质量检查

首先安装 husky：

```sh
npm install husky --save-dev
```

然后再 package.json 添加以下脚本：

```json
{
	"scripts": {
		"prepare": "husky install"
	}
}
```

添加 hook，执行以下命令：

```sh
npx husky add .husky/pre-commit "npm run lint"
git add .husky/pre-commit
```

执行以上命令，会生成 `.husky/pre-commit` 文件：

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
```

:tada::tada::tada:  当执行 git commit 的时候就会触发 npm run lint 命令了!



### commit 规范检查

安装 [commitlint](https://github.com/conventional-changelog/commitlint/#what-is-commitlint) 工具：

```sh
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

然后新建 `.commitlintrc.js` 配置文件：

```js
module.exports = {
  extents:[
    "@commitlint/config-conventional"
  ],
  rules:{
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 72],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case']
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'wip',
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'improvement',
        'perf',
        'refactor',
        'revert',
        'style',
        'test'
      ]
    ]
  }
}
```

这样就完成了 commit 规范检查的配置了！

