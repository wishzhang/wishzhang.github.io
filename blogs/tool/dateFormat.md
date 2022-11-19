---
title: tool.dateFormat
date: 2022-01-01
categories:

 - tool.js
---

时间格式化函数。

`dateFormat(date: Date | string | number, format: string): string`

## 示例

```js
tool.dateFormat('2021-12-05 09:01:02', 'yyyy-MM-dd'); // 2021-12-05
tool.dateFormat(new Date('2021-12-05'), 'yyyy-MM'); // 2021-12-05
```

