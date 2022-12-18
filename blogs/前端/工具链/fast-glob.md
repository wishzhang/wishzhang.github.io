---
title: fast-glob
date: 2022-12-18
tags: 

- 工具链

categories:

 - 前端
showSponsor: true

---

## 基础用法

fast-glob 用于获取路径。这里写个简单的 [示例](https://github.com/wishzhang/wish-cvue/blob/main/build/types-definitions.ts)，fast-glob 详细的 API 请查看[fast-glob](https://www.npmjs.com/package/fast-glob?activeTab=readme) 

```js
import glob from 'fast-glob'

await glob([globSourceFile, '!element-plus/**/*'], {
  cwd: pkgRoot,
  absolute: true,
  onlyFiles: true
})
```



## 了解更多

获取路径后，对文件管理（包括文件读写）还有一个非常实用的包 [fs-extra](https://www.npmjs.com/package/fs-extra) 。

```js
import fs from 'fs-extra'
// both fs and fs-extra methods are defined
```

然后是读取文件的方法参考：[https://nodejs.dev/en/learn/reading-files-with-nodejs/](https://nodejs.dev/en/learn/reading-files-with-nodejs/)

