---
title: eslint&prettier
date: 2022-12-20
tags: 

- 工具链

categories:

 - 前端
showSponsor: true

---

[eslint](https://eslint.org/) 用来代码的静态检查包括代码质量或代码风格，[prettier](https://prettier.io/) 是修正代码风格的工具。实际应用中，主要以 eslint 的提示为主，prettier 作为代码风格的修正。为了让 eslint 检测 prettier 的代码风格并提示，将 prettier 配置到 eslint 时可能会有冲突。所以这里来看下如何配置 eslint 和 prettier，最后来了解一下 eslint 插件的编写。

## 基础用法

首先安装 eslint 及相关插件：

```sh
npm init @eslint/config
npm install prettier --save-dev
npm install eslint-config-prettier --save-dev
npm install eslint-plugin-prettier --save-dev
npm install vue-eslint-parser --save-dev
npm install @typescript-eslint/eslint-plugin --save-dev
npm install @typescript-eslint/parser --save-dev
npm install eslint-plugin-unused-imports --save-dev
npm install eslint-plugin-vue --save-dev
```

然后配置 `.eslintrc.json` 文件：

```json
{
  "root": true,
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-essential",
    "prettier"
  ],
  "overrides": [],
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "@typescript-eslint/parser",
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint", "unused-imports", "vue", "prettier"],
  "rules": {
    "prettier/prettier": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "unused-imports/no-unused-imports": "error",
    "vue/no-unused-vars": "error"
  }
}
```

配置 prettier：

```json
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true,
  "vueIndentScriptAndStyle": true,
  "arrowParens": "always",
  "endOfLine": "auto"
}
```

在 package.json 写上 scripts 脚本：

```json
{
	"scripts": {
	  "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx,.json",
    "lint:fix": "pnpm run lint --fix"
	}
}
```

这样就配置好了。IDE 可以配置当按下 格式化或保存快捷键的时候，执行 --fix。Webstorm 有 bug，所以笔者只配置了它的 prettier 的格式化快捷键。



## 了解更多

我们来了解 [eslint-config-prettier](https://www.npmjs.com/package/eslint-plugin-prettier)、[eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier) 做了什么事。

先看下 [eslint 插件的介绍](https://eslint.org/docs/latest/developer-guide/working-with-plugins) 。

这三个依赖的作用如下：

```json
{
  extends: [
    ..., // 其他
    "prettier", // eslint-config-prettier 禁用与prettier冲突的规则
  ]
  plugins: ["prettier"], // eslint-plugin-prettier
  rules: {
    "prettier/prettier": "error" // 开启规则
  }
}
```

参考 [extends字段含义](https://eslint.org/docs/latest/user-guide/configuring/configuration-files) 可以知道 eslint-config-prettier 配置在 extends 中，为了禁用和 prettier 冲突的规则（插件内部定义了规则配置）。

eslint-plugin-prettier 源代码主要定义了一个对象。[recommended](https://eslint.org/docs/latest/developer-guide/working-with-plugins#configs-in-plugins) 的插件配置需要显示引用并不会默认引用的。

```js
const eslintPluginPrettier = {
  configs: {
    recommended: {
      extends: ['prettier'],
      plugins: ['prettier'],
      rules: {
        'prettier/prettier': 'error',
        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off',
      },
    },
  },
  rules: {
    prettier: {
      meta: {
        docs: {
          url: 'https://github.com/prettier/eslint-plugin-prettier#options',
        },
        type: 'layout',
        fixable: 'code',
        schema: [
          // Prettier options:
          {
            type: 'object',
            properties: {},
            additionalProperties: true,
          },
          {
            type: 'object',
            properties: {
              usePrettierrc: { type: 'boolean' },
              fileInfoOptions: {
                type: 'object',
                properties: {},
                additionalProperties: true,
              },
            },
            additionalProperties: true,
          },
        ],
        messages: {
          [INSERT]: 'Insert `{{ insertText }}`',
          [DELETE]: 'Delete `{{ deleteText }}`',
          [REPLACE]: 'Replace `{{ deleteText }}` with `{{ insertText }}`',
        },
      },
      create(context) {
        const usePrettierrc =
          !context.options[1] || context.options[1].usePrettierrc !== false;
        /**
         * @type {FileInfoOptions}
         */
        const fileInfoOptions =
          (context.options[1] && context.options[1].fileInfoOptions) || {};
        const sourceCode = context.getSourceCode();
        const filepath = context.getFilename();
        // Processors that extract content from a file, such as the markdown
        // plugin extracting fenced code blocks may choose to specify virtual
        // file paths. If this is the case then we need to resolve prettier
        // config and file info using the on-disk path instead of the virtual
        // path.
        const onDiskFilepath = context.getPhysicalFilename();
        const source = sourceCode.text;

        return {
          Program() {
            if (!prettierFormat) {
              // Prettier is expensive to load, so only load it if needed.
              prettierFormat = require('synckit').createSyncFn(
                require.resolve('./worker'),
              );
            }

            /**
             * @type {{}}
             */
            const eslintPrettierOptions = context.options[0] || {};

            // prettier.format() may throw a SyntaxError if it cannot parse the
            // source code it is given. Usually for JS files this isn't a
            // problem as ESLint will report invalid syntax before trying to
            // pass it to the prettier plugin. However this might be a problem
            // for non-JS languages that are handled by a plugin. Notably Vue
            // files throw an error if they contain unclosed elements, such as
            // `<template><div></template>. In this case report an error at the
            // point at which parsing failed.
            /**
             * @type {string}
             */
            let prettierSource;
            try {
              prettierSource = prettierFormat(
                source,
                {
                  ...eslintPrettierOptions,
                  filepath,
                  onDiskFilepath,
                  parserPath: context.parserPath,
                  usePrettierrc,
                },
                fileInfoOptions,
              );
            } catch (err) {
              if (!(err instanceof SyntaxError)) {
                throw err;
              }

              let message = 'Parsing error: ' + err.message;

              const error =
                /** @type {SyntaxError & {codeFrame: string; loc: SourceLocation}} */ (
                  err
                );

              // Prettier's message contains a codeframe style preview of the
              // invalid code and the line/column at which the error occurred.
              // ESLint shows those pieces of information elsewhere already so
              // remove them from the message
              if (error.codeFrame) {
                message = message.replace(`\n${error.codeFrame}`, '');
              }
              if (error.loc) {
                message = message.replace(/ \(\d+:\d+\)$/, '');
              }

              context.report({ message, loc: error.loc });

              return;
            }

            if (prettierSource == null) {
              return;
            }

            if (source !== prettierSource) {
              const differences = generateDifferences(source, prettierSource);

              for (const difference of differences) {
                reportDifference(context, difference);
              }
            }
          },
        };
      },
    },
  },
};

module.exports = eslintPluginPrettier;
```

从上面的源码可以知道，eslint-plugin-prettier 已经为 eslint-config-prettier 配置了 extends （但还是要安装 eslint-config-prettier）。所以，其实只需要配置 `plugin:prettier/recommended`：

```json
{
  "root": true,
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-essential",
    "plugin:prettier/recommended"
  ],
  "overrides": [],
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "@typescript-eslint/parser",
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint", "unused-imports", "vue", "prettier"],
  "rules": {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "unused-imports/no-unused-imports": "error",
    "vue/no-unused-vars": "error"
  }
}
```







