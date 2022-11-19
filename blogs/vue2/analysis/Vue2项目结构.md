---
title: Vue2 项目结构
date: 2021-11-28
tags: 

- vue2

categories:

 - 前端
---

以下是 Vue2 的主要的目录结构：

```markdown
- benchmarks/
- dist/
- examples/ 
- flow/
- packages/
  - vue-server-renderer/
  - vue-template-compiler/
  - weex-template-compiler/
  - weex-vue-framework/
- scripts/
- src/
  - compiler/
    - codegen/
    - parser/
    - create-compiler.js
    - index.js
    - ...
  - core/
    - components/
    - global-api/
    - instance/
      - index.js
      - events.js
      - init.js
      - inject.js
      - lifecycle.js
      - render.js
      - state.js
      - ...
    - observer/
      - array.js
      - dep.js
      - index.js
      - watcher.js
      - scheduler.js
    - util/
    - vdom/
      - create-component.js
      - create-element.js
      - patch.js
      - vnode.js
    - config.js
    - index.js
  - platforms/
    - web/
      - compiler/
        - index.js
        - ...
      - runtime/
        - index.js
      - server/
      - entry-compiler.js
      - entry-runtime.js
      - entry-runtime-with-compiler.js
      - entry-server-basic-renderer.js
      - entry-server-renderer.js
  - server/
  - sfc/
  - shared
- test/
  - e2e/
  - helpers/
  - ssr/
  - unit/
  - weex/
- types/
  - test/
  - ...
- .babelrc.js
- .editorconfig
- .eslintignore
- .eslintrc.js
- .flowconfig
- .gitignore
- BACKERS.md
- LICENSE
- package.json
- README.md
- yarn.lock
```



Vue2 的核心模块主要包括四块：Vue 实例、数据驱动与响应式原理、组件化、编译。分析源码的方法应该首先搞清楚项目结构、和几个主要模块的基本原理就基本完成了，之后遇到某个特性再结合实践去了解清楚。Vue2 源码的架构总体是调用/返回风格，编译器那里是数据流的架构风格，然后再往下抽象出模块。需要明白一点的是，源码的结构是演化而来的，某个方法的代码更不是一开始就从上到下就写好了的。通过 git 提交记录可以知道这点，大部分的修修改改、重构。 `所以了解源码只需要了解基本原理和项目当前的整体情况，再根据具体需要来了解细节。`







