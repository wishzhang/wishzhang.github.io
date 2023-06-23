---
title: mapbox使用流程
date: 2023-06-23
tags: 

- mapbox

categories:

 - 前端
---

mapbox使用流程如下：

```flow
start=>start: 注册账号
op=>operation: 创建token
op2=>operation: 创建Style
op3=>operation: 创建地图
end=>end: 结束

start->op->op2->op3->end
```





## 创建Style

制作Style，是在tileset数据上添加样式。瓦片集是一种数据集合，可以是栅格或矢量数据，将其分割成一个统一的正方形网格，并且提供了22个预设的缩放级别。这个概念通常用于地图制作和在线地图服务中。另外也可以使用dataset(比如GeoJSON数据)转换成tileset数据，再制作Style。



## 创建地图

mapbox创建一个地图的基础代码：

```js
mapboxgl.accessToken = '<your access token here>';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});
```









