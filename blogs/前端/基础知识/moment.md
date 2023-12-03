---
title: moment
date: 2023-12-03
tags: 

categories:

- 前端
---

时间处理有几个概念，比如本地时间、服务器时间、时区等。



moment的常见用法如下：

```js
moment('2023-08-03').format('YYYY年M月')
// 2023年8月

let m = moment('2023-08-03')
m.isAfter(moment())
m.isSameOrAfter(moment())
m.isBefore(moment())

m.startOf('week')
m.startOf('month')
m.startOf('year')

m.subtract(1, 'days')

const now = moment()
now.diff(m)
now.diff(m, 'seconds')
now.diff(m, 'minutes')
now.diff(m, 'hours')
now.diff(m, 'days')

let mm = moment.duration(100000)
mm.as('hours')
mm.as('minutes')
mm.as('seconds')
```



