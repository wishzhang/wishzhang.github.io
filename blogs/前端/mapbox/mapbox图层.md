---
title: mapbox图层
date: 2023-06-23
tags: 

- mapbox

categories:

 - 前端
---

mapbox所渲染的style是一个JSON数据，里面包含图层和图层源数据。可以简单的认为mapbox的运行机制是 mapbox api + mapbox style。图层与图层源都有不同的类型，有的图层类型可以选择不配置图层源。其中这里来了解下图层源：矢量切片、栅格切片、GeoJSON的数据结构。

但mapbox不能同时setStyle多个style，setStyle方法会删除地图上的所有源、图层和交互，因此需要重新添加它们。在初始化了地图后，通常使用`addSource()`、`addLayer()`方法继续添加图层。



## 矢量切片

栅格切片和[矢量切片](https://docs.mapbox.com/data/tilesets/guides/vector-tiles-introduction/)都是tileset数据格式，这是mapbox自家定义的数据结构。传统上地图是由图像一块块组成的，而矢量切片是一个本质上是包含了地理信息的数据结构，通过编译器转码进行渲染。Mapbox Vector切片的数据结构是一种基于Protocol Buffers的二进制格式，它包含了地图数据的几何、属性和样式信息。**每个瓦片都是一个单独的文件，包含了一定范围内的地图数据。**瓦片的编号采用了XYZ格式，其中X和Y表示瓦片在水平和垂直方向上的位置，Z表示当前缩放级别。在Mapbox中，瓦片的缩放级别从0开始，最高级别为22。每个瓦片都包含了当前缩放级别下的一部分地图数据，可以通过将多个瓦片拼接在一起来显示完整的地图。由于Mapbox Vector切片是基于二进制格式的，因此它具有更高的压缩率和更快的加载速度，同时也允许进行动态样式和交互。

首先来看看矢量切片的图层参数是如何定义的，这个`url`属性值是一个链接，返回TileJSON数据。
```json
{
  "sources": {
    "sourceId": {
      "type": "vector",
      "url": "mapbox://mapbox.mapbox-streets-v8"
    }
  },
  "layers": [
    {
      "id": "layerId",
      "type": "line",
      "source": "sourceId",
      "source-layer": "landuse",
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "#ff69b4",
        "line-width": 1
      }
    }
  ]
}
```

矢量切片的图层配置必须配置`source-layer`属性，来看看下面获取到的矢量切片集合的数据格式。其中`mapbox.mapbox-streets-v8`是图层源id，前面的`source-layer`属性值是从`vector_layers`里面挑出来的。最后矢量切片的数据在这个`tiles`属性。

```json
{
  "tiles": [
    "https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoibWVpaW4xMjM0NTYiLCJhIjoiY2tqbWtlemR5MGt4MTJ4bjBxcjNmcng5NCJ9.GRpGEmZhxJ58EkNW6Ta_AQ",
    "https://b.tiles.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoibWVpaW4xMjM0NTYiLCJhIjoiY2tqbWtlemR5MGt4MTJ4bjBxcjNmcng5NCJ9.GRpGEmZhxJ58EkNW6Ta_AQ"
  ],
}
```



## 栅格切片

Mapbox Raster切片的数据结构是基于Web Mercator投影的瓦片结构，**其中每个瓦片都是256x256像素大小的PNG格式图像。**瓦片的编号采用了XYZ格式，其中X和Y表示瓦片在水平和垂直方向上的位置，Z表示当前缩放级别。在Mapbox中，瓦片的缩放级别从0开始，最高级别为22。每个瓦片都包含了一部分地图数据，可以通过将多个瓦片拼接在一起来显示完整的地图。



## GeoJSON

GeoJSON是一种基于JSON格式的地理数据交换标准，它可以用来描述地理要素的几何、属性和空间关系。GeoJSON支持多种几何类型，包括点、线、面、多点、多线和多面等。GeoJSON数据通常包含一个FeatureCollection对象，其中包含了多个Feature对象，每个Feature对象都代表了一个地理要素。每个Feature对象包含了一个geometry属性，用于描述地理要素的几何信息，以及一个properties属性，用于描述地理要素的属性信息。GeoJSON还支持一些特殊的属性，如crs属性用于指定地理坐标系。在解读GeoJSON数据时，需要注意几何类型、属性信息以及坐标系等重要信息，以便正确地处理和显示地理数据。

GeoJSON数据结构的各部分含义如下：

- **type**：表示geojson对象的类型，可以是FeatureCollection、Feature或几何类型之一。
- **features**：表示一个Feature对象的数组，只有当type为FeatureCollection时才存在。
- **geometry**：表示一个几何对象，只有当type为Feature时才存在。
- **coordinates**：表示一个坐标数组，只有当type为几何类型时才存在。坐标的维度和顺序取决于几何类型。
- **properties**：表示一个任意的JSON对象，只有当type为Feature时才存在。它可以包含与特征相关的任何属性信息。



## 附录

### 矢量切片url返回的数据



`mapbox://mapbox.mapbox-streets-v8`获取的数据如下：

```json
{
  "attribution": "<a href=\"https://www.mapbox.com/about/maps/\" target=\"_blank\" title=\"Mapbox\" aria-label=\"Mapbox\" role=\"listitem\">&copy; Mapbox</a> <a href=\"https://www.openstreetmap.org/about/\" target=\"_blank\" title=\"OpenStreetMap\" aria-label=\"OpenStreetMap\" role=\"listitem\">&copy; OpenStreetMap</a> <a class=\"mapbox-improve-map\" href=\"https://www.mapbox.com/contribute/\" target=\"_blank\" title=\"Improve this map\" aria-label=\"Improve this map\" role=\"listitem\">Improve this map</a>",
  "bounds": [
    -180,
    -85,
    180,
    85
  ],
  "center": [
    0,
    0,
    0
  ],
  "created": 1527888859555,
  "filesize": 0,
  "fillzoom": 8,
  "format": "pbf",
  "id": "mapbox.mapbox-streets-v8",
  "language_options": {
    "ar": "Arabic",
    "ca": "Catalan",
    "cs": "Czech",
    "da": "Danish",
    "de": "German",
    "el": "Greek",
    "en": "English",
    "es": "Spanish",
    "fa": "Farsi",
    "fi": "Finnish",
    "fr": "French",
    "he": "Hebrew",
    "hu": "Hungarian",
    "id": "Indonesian",
    "it": "Italian",
    "ja": "Japanese",
    "ka": "Georgian",
    "ko": "Korean",
    "local": "Renderable local language",
    "lv": "Latvian",
    "ms": "Malay",
    "nb": "Norwegian Bokmål",
    "nl": "Dutch",
    "no": "Norwegian",
    "pl": "Polish",
    "pt": "Portuguese",
    "ro": "Romanian",
    "ru": "Russian",
    "sk": "Slovak",
    "sl": "Slovenian",
    "sr": "Serbian",
    "sv": "Swedish",
    "th": "Thai",
    "tl": "Tagalog",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "vi": "Vietnamese",
    "zh-Hans": "Simplified Chinese",
    "zh-Hant": "Traditional Chinese"
  },
  "mapbox_logo": true,
  "maxzoom": 16,
  "minzoom": 0,
  "modified": 1617131926000,
  "name": "Mapbox Streets v8",
  "private": false,
  "scheme": "xyz",
  "tilejson": "2.2.0",
  "tiles": [
    "https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoibWVpaW4xMjM0NTYiLCJhIjoiY2tqbWtlemR5MGt4MTJ4bjBxcjNmcng5NCJ9.GRpGEmZhxJ58EkNW6Ta_AQ",
    "https://b.tiles.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoibWVpaW4xMjM0NTYiLCJhIjoiY2tqbWtlemR5MGt4MTJ4bjBxcjNmcng5NCJ9.GRpGEmZhxJ58EkNW6Ta_AQ"
  ],
  "vector_layers": [
    {
      "description": "",
      "fields": {
        "class": "One of: aboriginal_lands, agriculture, airport, cemetery, commercial_area, facility, glacier, grass, hospital, industrial, park, parking, piste, pitch, residential, rock, sand, school, scrub, wood",
        "type": "OSM tag, more specific than class"
      },
      "id": "landuse",
      "minzoom": 5,
      "source": "mapbox.mapbox-streets-v8",
      "source_name": "Mapbox Streets v8"
    },
    {
      "description": "",
      "fields": {
        "class": "One of: river, canal, stream, stream_intermittent, ditch, drain",
        "iso_3166_1": "Text. The ISO 3166-1 alpha-2 code of the country/territory the feature is in.",
        "iso_3166_2": "Text. The ISO 3166-2 code of the state/province/region the feature is in.",
        "type": "One of: river, canal, stream, ditch, drain"
      },
      "id": "waterway",
      "minzoom": 7,
      "source": "mapbox.mapbox-streets-v8",
      "source_name": "Mapbox Streets v8"
    },
    {
      "description": "",
      "fields": {},
      "id": "water",
      "minzoom": 0,
      "source": "mapbox.mapbox-streets-v8",
      "source_name": "Mapbox Streets v8"
    },
    {
      "description": "",
      "fields": {
        "iso_3166_1": "Text. The ISO 3166-1 alpha-2 code of the country/territory the feature is in.",
        "iso_3166_2": "Text. The ISO 3166-2 code of the state/province/region the feature is in.",
        "ref": "Text. Identifier of the runway or taxiway",
        "type": "One of: runway, taxiway, apron, helipad"
      },
      "id": "aeroway",
      "minzoom": 9,
      "source": "mapbox.mapbox-streets-v8",
      "source_name": "Mapbox Streets v8"
    },
    {
      "description": "",
      "fields": {
        "class": "One of: cliff, crosswalk, entrance, fence, gate, hedge, land",
        "iso_3166_1": "Text. The ISO 3166-1 alpha-2 code of the country/territory the feature is in.",
        "iso_3166_2": "Text. The ISO 3166-2 code of the state/province/region the feature is in.",
        "type": "The value of either the 'barrier' or 'man_made' tag from OSM, or for cliffs either cliff or earth_bank."
      },
      "id": "structure",
      "minzoom": 13,
      "source": "mapbox.mapbox-streets-v8",
      "source_name": "Mapbox Streets v8"
    },
    {
      "description": "",
      "fields": {
        "extrude": "String. Whether building should be extruded when rendering in 3D. One of: 'true', 'false'",
        "height": "Number. Height of building or part of building.",
        "iso_3166_1": "Text. The ISO 3166-1 alpha-2 code of the country/territory the feature is in.",
        "iso_3166_2": "Text. The ISO 3166-2 code of the state/province/region the feature is in.",
        "min_height": "Number. Height of bottom of building or part of building, if it does not start at ground level.",
        "type": "In most cases, values will be that of the primary key from OpenStreetMap tags.",
        "underground": "Text. Whether building is underground. One of: 'true', 'false'"
      },
      "id": "building",
      "minzoom": 12,
      "source": "mapbox.mapbox-streets-v8",
      "source_name": "Mapbox Streets v8"
    },
    {
      "description": "",
      "fields": {
        "class": "One of: national_park, wetland, wetland_noveg",
        "type": "OSM tag, more specific than class"
      },
      "id": "landuse_overlay",
      "minzoom": 5,
      "source": "mapbox.mapbox-streets-v8",
      "source_name": "Mapbox Streets v8"
    },
    {
      "description": "",
      "fields": {
        "bike_lane": "Text. Has a value if there is a bike lane that is part of the road itself. This is different from a separated cycle track, which will be shown as its own line. Possible values are 'right', 'left', 'both' (bike lane on right, left, or both sides of the street respectively), 'yes' (bike lane present but location not specified), 'no' (area was surveyed and confirmed to not have a bike lane), and null (presence of bike lane unknown).",
        "class": "One of: 'motorway', 'motorway_link', 'trunk', 'primary', 'secondary', 'tertiary', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link', 'street', 'street_limited', 'pedestrian', 'construction', 'track', 'service', 'ferry', 'path', 'golf', 'level_crossing', 'turning_circle', 'roundabout', 'mini_roundabout', 'turning_loop', 'traffic_signals'",
        "iso_3166_1": "Text. The ISO 3166-1 alpha-2 code of the country/territory the feature is in.",
        "iso_3166_2": "Text. The ISO 3166-2 code of the state/province/region the feature is in.",
        "lane_count": "Number. Number of lanes in the road",
        "layer": "Number. Specifies z-ordering in the case of overlapping road segments. Common range is -5 to 5. Available from zoom level 13+.",
        "len": "Number. Approximate length of the road segment in Mercator meters.",
        "name": "Local name of the road",
        "name_ar": "Arabic name of the road",
        "name_de": "German name of the road",
        "name_en": "English name of the road",
        "name_es": "Spanish name of the road",
        "name_fr": "French name of the road",
        "name_it": "Italian name of the road",
        "name_ja": "Japanese name of the road",
        "name_ko": "Korean name of the road",
        "name_pt": "Portuguese name of the road",
        "name_ru": "Russian name of the road",
        "name_script": "Primary written script of the local name",
        "name_vi": "Vietnamese name of the road",
        "name_zh-Hans": "Simplified Chinese name of the road",
        "name_zh-Hant": "Traditional Chinese name of the road",
        "oneway": "Text. Whether traffic on the road is one-way. One of: 'true', 'false'.",
        "ref": "Text. Route number/code of the road.",
        "reflen": "Number. How many characters long the ref tag is. Useful for shield styling.",
        "shield": "Text. The shield style to use. See the vector tile documentation for a list of possible values.",
        "shield_beta": "Text. The shield style to use if it doesn't exist in default shield values.",
        "shield_text_color": "Text. The color of the text to use on the highway shield.",
        "shield_text_color_beta": "Text. The color of the text to use on the beta highway shield.",
        "structure": "Text. One of: 'none', 'bridge', 'tunnel', 'ford'. Available from zoom level 13+.",
        "surface": "Whether the road is paved or not (if known). One of: 'paved', 'unpaved'",
        "toll": "Whether a road is a toll road or not.",
        "type": "In most cases, values will be that of the primary key from OpenStreetMap tags."
      },
      "id": "road",
      "minzoom": 3,
      "source": "mapbox.mapbox-streets-v8",
      "source_name": "Mapbox Streets v8"
    },
    {
      "description": "",
      "fields": {
        "admin_level": "Number, 0-2. The administrative level of the boundary",
        "disputed": "Disputed boundaries are 'true', all others are 'false'.",
        "iso_3166_1": "The ISO 3166-1 alpha-2 code(s) of the state(s) a boundary is part of. Format: 'AA' or 'AA-BB'",
        "maritime": "Maritime boundaries are 'true', all others are 'false'.",
        "worldview": "One of 'all', 'CN', 'IN', 'US'. Use for filtering boundaries to match different worldviews."
      },
      "id": "admin",
      "minzoom": 0,
      "source": "mapbox.mapbox-streets-v8",
      "source_name": "Mapbox Streets v8"
    },
    {
      "description": "",
      "fields": {
        "abbr": "Text. Local abbreviation of the place (available for type=state).",
        "capital": "Admin level the city is a capital of, if any. One of: 2, 3, 4, 5, 6, null",
        "class": "One of: country, state, settlement, or settlement_subdivision",
        "filterrank": "Number, 0-5. Priority relative to nearby places. Useful for limiting label density.",
        "iso_3166_1": "Text. The ISO 3166-1 alpha-2 code of the place.",
        "iso_3166_2": "Text. The ISO 3166-2 code of the state/province/region the road is in.",
        "name": "Local name of the place",
        "name_ar": "Arabic name of the place",
        "name_de": "German name of the place",
        "name_en": "English name of the place",
        "name_es": "Spanish name of the place",
        "name_fr": "French name of the place",
        "name_it": "Italian name of the place",
        "name_ja": "Japanese name of the place",
        "name_ko": "Korean name of the place",
        "name_pt": "Portuguese name of the place",
        "name_ru": "Russian name of the place",
        "name_script": "Primary written script of the local name",
        "name_vi": "Vietnamese name of the place",
        "name_zh-Hans": "Simplified Chinese name of the place",
        "name_zh-Hant": "Traditional Chinese name of the place",
        "symbolrank": "Number, 1-18. Useful for styling text & marker sizes.",
        "text_anchor": "A hint for label placement at low zoom levels.",
        "type": "One of: country, territory, sar, disputed_territory, state, city, town, village, hamlet, suburb, quarter, neighbourhood, island, islet, archipelago, residential, aboriginal_lands",
        "worldview": "One of 'all', 'CN', 'IN', 'US'. Use for filtering boundaries to match different worldviews."
      },
      "id": "place_label",
      "minzoom": 0,
      "source": "mapbox.mapbox-streets-v8",
      "source_name": "Mapbox Streets v8"
    },
    {
      "description": "",
      "fields": {
        "class": "One of: military, civil",
        "iso_3166_1": "Text. The ISO 3166-1 alpha-2 code of the country/territory the feature is in.",
        "iso_3166_2": "Text. The ISO 3166-2 code of the state/province/region the feature is in.",
        "maki": "One of: airport, heliport, rocket",
        "name": "Local name of the airport",
        "name_ar": "Arabic name of the airport",
        "name_de": "German name of the airport",
        "name_en": "English name of the airport",
        "name_es": "Spanish name of the airport",
        "name_fr": "French name of the airport",
        "name_it": "Italian name of the airport",
        "name_ja": "Japanese name of the airport",
        "name_ko": "Korean name of the airport",
        "name_pt": "Portuguese name of the airport",
        "name_ru": "Russian name of the airport",
        "name_script": "Primary written script of the local name",
        "name_vi": "Vietnamese name of the airport",
        "name_zh-Hans": "Simplified Chinese name of the airport",
        "name_zh-Hant": "Traditional Chinese name of the airport",
        "ref": "A 3-4 character IATA, FAA, ICAO, or other reference code",
        "sizerank": "A scale-dependent feature size ranking from 0 (large) to 16 (small)",
        "worldview": "One of 'all', 'CN', 'IN', 'US'. Use for filtering boundaries to match different worldviews."
      },
      "id": "airport_label",
      "minzoom": 8,
      "source": "mapbox.mapbox-streets-v8",
      "source_name": "Mapbox Streets v8"
    },
    {
      "description": "",
      "fields": {
        "filterrank": "Number, 0-5. Priority relative to nearby features. Useful for limiting label density.",
        "iso_3166_1": "Text. The ISO 3166-1 alpha-2 code of the country/territory the feature is in.",
        "iso_3166_2": "Text. The ISO 3166-2 code of the state/province/region the feature is in.",
        "maki": "One of: rail, rail-metro, rail-light, entrance, bus, bicycle-share, ferry",
        "mode": "One of: rail, metro_rail, light_rail, tram, bus, monorail, funicular, bicycle, ferry, narrow_gauge, preserved, miniature",
        "name": "Local name of the transit stop",
        "name_ar": "Arabic name of the transit stop",
        "name_de": "German name of the transit stop",
        "name_en": "English name of the transit stop",
        "name_es": "Spanish name of the transit stop",
        "name_fr": "French name of the transit stop",
        "name_it": "Italian name of the transit stop",
        "name_ja": "Japanese name of the transit stop",
        "name_ko": "Korean name of the transit stop",
        "name_pt": "Portuguese name of the transit stop",
        "name_ru": "Russian name of the transit stop",
        "name_script": "Primary written script of the local name",
        "name_vi": "Vietnamese name of the transit stop",
        "name_zh-Hans": "Simplified Chinese name of the transit stop",
        "name_zh-Hant": "Traditional Chinese name of the transit stop",
        "network": "The network(s) that the station serves. Useful for icon styling.",
        "network_beta": "One of: jp-shinkansen, jp-shinkansen.jp-jr, jp-shinkansen.tokyo-metro, jp-shinkansen.osaka-subway, jp-shinkansen.jp-jr.tokyo-metro, jp-shinkansen.jp-jr.osaka-subway, jp-jr, jp-jr.tokyo-metro, jp-jr.osaka-subway",
        "stop_type": "One of: station, stop, entrance"
      },
      "id": "transit_stop_label",
      "minzoom": 5,
      "source": "mapbox.mapbox-streets-v8",
      "source_name": "Mapbox Streets v8"
    },
    {
      "description": "",
      "fields": {
        "class": "One of: glacier, landform, water_feature, wetland, ocean, sea, river, water, reservoir, dock, canal, drain, ditch, stream, continent",
        "elevation_ft": "Integer elevation in feet",
        "elevation_m": "Integer elevation in meters",
        "filterrank": "Number, 0-5. Priority relative to nearby features. Useful for limiting label density.",
        "iso_3166_1": "Text. The ISO 3166-1 alpha-2 code of the country/territory the feature is in.",
        "iso_3166_2": "Text. The ISO 3166-2 code of the state/province/region the feature is in.",
        "maki": "One of: 'mountain', 'volcano', 'waterfall'",
        "name": "Local name of the natural feature",
        "name_ar": "Arabic name of the natural feature",
        "name_de": "German name of the natural feature",
        "name_en": "English name of the natural feature",
        "name_es": "Spanish name of the natural feature",
        "name_fr": "French name of the natural feature",
        "name_it": "Italian name of the natural feature",
        "name_ja": "Japanese name of the natural feature",
        "name_ko": "Korean name of the natural feature",
        "name_pt": "Portuguese name of the natural feature",
        "name_ru": "Russian name of the natural feature",
        "name_script": "Primary written script of the local name",
        "name_vi": "Vietnamese name of the natural feature",
        "name_zh-Hans": "Simplified Chinese name of the natural feature",
        "name_zh-Hant": "Traditional Chinese name of the natural feature",
        "sizerank": "A scale-dependent feature size ranking from 0 (large) to 16 (small)",
        "worldview": "One of 'all', 'CN', 'IN', 'US'. Use for filtering boundaries to match different worldviews."
      },
      "id": "natural_label",
      "minzoom": 0,
      "source": "mapbox.mapbox-streets-v8",
      "source_name": "Mapbox Streets v8"
    },
    {
      "description": "",
      "fields": {
        "brand": "String",
        "category_en": "English category description of the POI",
        "category_zh-Hans": "Simplified Chinese category description of the POI",
        "class": "Text. Thematic groupings of POIs for filtering & styling.",
        "filterrank": "Number, 0-5. Priority relative to nearby POIs. Useful for limiting label density.",
        "iso_3166_1": "Text. The ISO 3166-1 alpha-2 code of the country/territory the feature is in.",
        "iso_3166_2": "Text. The ISO 3166-2 code of the state/province/region the feature is in.",
        "maki": "The name of the Maki icon that should be used for the POI",
        "maki_beta": "",
        "maki_modifier": "",
        "name": "Local name of the POI",
        "name_ar": "Arabic name of the POI",
        "name_de": "German name of the POI",
        "name_en": "English name of the POI",
        "name_es": "Spanish name of the POI",
        "name_fr": "French name of the POI",
        "name_it": "Italian name of the POI",
        "name_ja": "Japanese name of the POI",
        "name_ko": "Korean name of the POI",
        "name_pt": "Portuguese name of the POI",
        "name_ru": "Russian name of the POI",
        "name_script": "Primary written script of the local name",
        "name_vi": "Vietnamese name of the POI",
        "name_zh-Hans": "Simplified Chinese name of the POI",
        "name_zh-Hant": "Traditional Chinese name of the POI",
        "sizerank": "A scale-dependent feature size ranking from 0 (large) to 16 (small)",
        "type": "The original OSM tag value"
      },
      "id": "poi_label",
      "minzoom": 6,
      "source": "mapbox.mapbox-streets-v8",
      "source_name": "Mapbox Streets v8"
    },
    {
      "description": "",
      "fields": {
        "class": "The class of road the junction is on. Subset of classes in the road layer. One of: motorway, motorway_link, trunk, trunk_link, primary, secondary, tertiary, primary_link, secondary_link, tertiary_link, street, street_limited, construction, track, service, path, major_rail, minor_rail, service_rail.",
        "filterrank": "Number, 0-5",
        "iso_3166_1": "Text. The ISO 3166-1 alpha-2 code of the country/territory the feature is in.",
        "iso_3166_2": "Text. The ISO 3166-2 code of the state/province/region the feature is in.",
        "maki_beta": "",
        "name": "Local name of the motorway junction",
        "name_ar": "Arabic name of the motorway junction",
        "name_de": "German name of the motorway junction",
        "name_en": "English name of the motorway junction",
        "name_es": "Spanish name of the motorway junction",
        "name_fr": "French name of the motorway junction",
        "name_it": "Italian name of the motorway junction",
        "name_ja": "Japanese name of the motorway junction",
        "name_ko": "Korean name of the motorway junction",
        "name_pt": "Portuguese name of the motorway junction",
        "name_ru": "Russian name of the motorway junction",
        "name_script": "Primary written script of the local name",
        "name_vi": "Vietnamese name of the motorway junction",
        "name_zh-Hans": "Simplified Chinese name of the motorway junction",
        "name_zh-Hant": "Traditional Chinese name of the motorway junction",
        "ref": "A short identifier",
        "reflen": "The number of characters in the ref field.",
        "type": "The type of road the junction is on. Subset of types in the road layer."
      },
      "id": "motorway_junction",
      "minzoom": 9,
      "source": "mapbox.mapbox-streets-v8",
      "source_name": "Mapbox Streets v8"
    },
    {
      "description": "",
      "fields": {
        "house_num": "House number",
        "iso_3166_1": "Text. The ISO 3166-1 alpha-2 code of the country/territory the feature is in.",
        "iso_3166_2": "Text. The ISO 3166-2 code of the state/province/region the feature is in."
      },
      "id": "housenum_label",
      "minzoom": 16,
      "source": "mapbox.mapbox-streets-v8",
      "source_name": "Mapbox Streets v8"
    }
  ],
  "webpage": "https://dev-studio.tilestream.net/tilesets/mapbox.mapbox-streets-v8",
  "worldview_default": "US",
  "worldview_options": {
    "AR": "Argentina",
    "CN": "China",
    "IN": "India",
    "JP": "Japan",
    "MA": "Morocco",
    "RU": "Russia",
    "TR": "Turkey",
    "US": "United States"
  }
}
```

### GeoJSON数据示例



```json
{
	"type": "FeatureCollection",
	"features": [{
		"type": "Feature",
		"properties": {
			"adcode": 440100,
			"name": "广州市",
			"center": [113.280637, 23.125178],
			"centroid": [113.544371, 23.32925],
			"childrenNum": 11,
			"level": "city",
			"parent": {
				"adcode": 440000
			},
			"subFeatureIndex": 0,
			"acroutes": [100000, 440000]
		},
		"geometry": {
			"type": "MultiPolygon",
			"coordinates": [
				[
					[
						[112.975184, 23.463622],
						[112.993347, 23.466845],
						[113.00469, 23.462037],
						[113.018025, 23.469065],
						[113.042932, 23.474137],
						[113.055884, 23.471971],
						[113.063854, 23.482537],
						[113.075503, 23.484228],
						[113.083933, 23.494266],
						[113.108994, 23.497964],
						[113.128689, 23.512596],
						[113.15352, 23.502823],
						[113.172066, 23.512384],
						[113.192069, 23.514761],
						[113.191149, 23.523212],
						[113.211918, 23.543914],
						[113.210155, 23.552997],
						[113.200805, 23.561815],
						[113.202262, 23.576492],
						[113.214524, 23.584253],
						[113.227015, 23.585731],
						[113.227859, 23.594441],
						[113.245868, 23.588265],
						[113.24035, 23.606212],
						[113.248474, 23.601567],
						[113.2766, 23.615977],
						[113.280049, 23.608957],
						[113.290548, 23.617085],
						[113.299438, 23.637456],
						[113.289245, 23.644368],
						[113.31101, 23.643313],
						[113.32833, 23.645371],
						[113.327947, 23.655502],
						[113.334845, 23.656399],
						[113.338447, 23.665737],
						[113.347413, 23.667215],
						[113.366343, 23.710311],
						[113.372397, 23.709731],
						[113.378375, 23.731511],
						[113.397841, 23.730562],
						[113.404278, 23.723495],
						[113.438459, 23.727134],
						[113.443823, 23.715901],
						[113.464286, 23.70799],
						[113.468731, 23.691006],
						[113.481069, 23.684043],
						[113.510268, 23.682461],
						[113.527052, 23.686153],
						[113.545445, 23.696387],
						[113.546901, 23.702558],
						[113.55878, 23.700712],
						[113.568053, 23.690215],
						[113.568053, 23.679454],
						[113.587289, 23.675234],
						[113.587212, 23.669008],
						[113.597252, 23.664946],
						[113.615721, 23.680192],
						[113.61166, 23.686206],
						[113.623845, 23.694699],
						[113.622619, 23.699446],
						[113.638176, 23.704562],
						[113.628137, 23.711682],
						[113.631662, 23.727872],
						[113.63649, 23.731985],
						[113.630742, 23.738946],
						[113.636414, 23.750229],
						[113.626144, 23.767416],
						[113.615185, 23.779804],
						[113.633731, 23.797198],
						[113.640245, 23.814274],
						[113.651664, 23.820123],
						[113.666379, 23.813694],
						[113.684312, 23.812956],
						[113.687378, 23.825709],
						[113.706384, 23.815275],
						[113.720178, 23.825129],
						[113.714814, 23.834982],
						[113.718033, 23.843887],
						[113.709756, 23.856267],
						[113.713511, 23.862484],
						[113.733667, 23.855003],
						[113.742327, 23.859165],
						[113.749071, 23.854371],
						[113.758191, 23.857479],
						[113.767081, 23.871439],
						[113.775358, 23.877918],
						[113.781105, 23.896299],
						[113.791605, 23.903882],
						[113.800265, 23.902566],
						[113.807315, 23.900407],
						[113.841496, 23.918732],
						[113.851152, 23.920312],
						[113.865177, 23.928947],
						[113.879815, 23.930369],
						[113.887478, 23.923998],
						[113.892536, 23.931685],
						[113.907787, 23.924577],
						[113.93645, 23.928737],
						[113.941201, 23.923577],
						[113.952697, 23.929632],
						[113.982126, 23.929684],
						[113.984502, 23.926157],
						[114.008413, 23.933001],
						[114.017992, 23.925261],
						[114.033856, 23.91889],
						[114.031327, 23.906305],
						[114.036232, 23.901776],
						[114.04267, 23.889874],
						[114.041827, 23.871491],
						[114.047728, 23.867488],
						[114.050487, 23.85474],
						[114.057767, 23.846784],
						[114.052249, 23.830029],
						[114.040294, 23.824444],
						[114.035312, 23.813378],
						[114.047728, 23.803312],
						[114.037228, 23.793509],
						[114.056311, 23.784021],
						[114.05999, 23.775851],
						[114.038454, 23.771212],
						[114.027419, 23.760141],
						[114.02489, 23.752549],
						[114.018222, 23.76283],
						[114.009945, 23.762988],
						[114.017686, 23.778276],
						[114.013087, 23.777959],
						[113.998756, 23.762988],
						[113.976071, 23.757716],
						[113.972853, 23.739262],
						[113.96105, 23.738207],
						[113.955916, 23.732671],
						[113.940282, 23.738155],
						[113.93645, 23.732143],
						[113.920049, 23.729454],
						[113.912386, 23.716534],
						[113.900967, 23.715426],
						[113.897595, 23.700184],
						[113.881884, 23.685151],
						[113.847857, 23.679348],
						[113.839963, 23.655449],
						[113.818811, 23.656188],
						[113.827778, 23.648009],
						[113.825555, 23.639883],
						[113.816742, 23.63582],
						[113.817432, 23.623471],
						[113.832223, 23.624263],
						[113.834215, 23.61756],
						[113.843565, 23.617877],
						[113.859582, 23.60996],
						[113.858356, 23.593491],
						[113.864027, 23.587368],
						[113.852838, 23.570579],
						[113.862495, 23.566303],
						[113.871384, 23.541327],
						[113.888168, 23.535095],
						[113.89315, 23.520254],
						[113.906408, 23.511856],
						[113.911543, 23.504144],
						[113.923115, 23.503088],
						[113.929936, 23.494213],
						[113.946643, 23.492522],
						[113.940895, 23.483594],
						[113.931162, 23.483066],
						[113.938749, 23.476726],
						[113.96105, 23.480371],
						[113.974156, 23.478839],
						[113.981743, 23.472129],
						[113.974462, 23.46489],
						[113.955456, 23.466053],
						[113.952774, 23.442907],
						[113.960054, 23.43276],
						[113.975382, 23.429378],
						[113.98795, 23.431439],
						[113.984195, 23.421238],
						[113.986801, 23.405591],
						[114.000442, 23.39338],
						[113.995997, 23.386771],
						[113.982049, 23.379369],
						[113.990556, 23.354833],
						[114.000902, 23.346636],
						[113.993928, 23.333149],
						[113.984195, 23.330505],
						[113.996151, 23.309346],
						[113.996687, 23.297443],
						[113.978217, 23.30104],
						[113.977451, 23.304849],
						[113.958445, 23.314953],
						[113.958905, 23.33262],
						[113.939285, 23.342934],
						[113.927483, 23.339972],
						[113.895985, 23.34505],
						[113.889394, 23.334154],
						[113.894989, 23.314689],
						[113.888475, 23.290512],
						[113.890314, 23.282681],
						[113.877209, 23.264213],
						[113.895142, 23.253523],
						[113.890084, 23.242144],
						[113.903802, 23.212554],
						[113.893993, 23.21266],
						[113.8838, 23.191694],
						[113.889011, 23.178616],
						[113.902116, 23.177186],
						[113.895679, 23.164529],
						[113.874757, 23.165377],
						[113.858739, 23.157221],
						[113.849849, 23.148853],
						[113.844715, 23.125599],
						[113.841113, 23.116169],
						[113.814673, 23.127771],
						[113.791298, 23.127665],
						[113.777427, 23.131108],
						[113.754052, 23.129572],
						[113.738572, 23.141331],
						[113.71696, 23.138895],
						[113.687837, 23.119772],
						[113.670671, 23.116434],
						[113.662011, 23.111454],
						[113.661244, 23.117971],
						[113.651281, 23.119295],
						[113.642698, 23.113467],
						[113.640245, 23.103878],
						[113.610433, 23.103772],
						[113.60139, 23.0954],
						[113.586446, 23.08777],
						[113.556327, 23.081252],
						[113.54897, 23.076006],
						[113.543759, 23.06228],
						[113.531957, 23.050938],
						[113.522913, 23.037262],
						[113.52299, 23.011338],
						[113.529198, 22.982599],
						[113.541766, 22.959369],
						[113.550503, 22.936189],
						[113.564298, 22.906903],
						[113.575104, 22.888331],
						[113.571195, 22.853143],
						[113.58407, 22.831325],
						[113.612119, 22.802281],
						[113.648139, 22.761759],
						[113.678181, 22.726113],
						[113.685308, 22.717719],
						[113.716883, 22.645172],
						[113.740487, 22.534284],
						[113.728149, 22.521993],
						[113.692052, 22.515129],
						[113.651588, 22.515715],
						[113.639326, 22.548276],
						[113.62078, 22.579554],
						[113.599628, 22.594393],
						[113.589971, 22.59519],
						[113.578552, 22.604603],
						[113.561615, 22.607528],
						[113.536861, 22.647511],
						[113.533106, 22.656388],
						[113.540693, 22.666222],
						[113.523373, 22.679297],
						[113.491875, 22.699811],
						[113.464822, 22.72096],
						[113.467964, 22.728504],
						[113.447808, 22.735836],
						[113.42612, 22.738014],
						[113.412172, 22.742849],
						[113.365116, 22.772595],
						[113.356533, 22.792989],
						[113.38305, 22.799308],
						[113.393396, 22.809822],
						[113.37439, 22.822618],
						[113.364273, 22.823467],
						[113.335994, 22.817945],
						[113.312083, 22.830369],
						[113.309631, 22.851179],
						[113.296296, 22.862485],
						[113.301354, 22.866094],
						[113.300434, 22.87708],
						[113.27706, 22.894699],
						[113.28595, 22.901438],
						[113.282424, 22.927383],
						[113.298212, 22.934014],
						[113.285183, 22.951095],
						[113.267557, 22.958786],
						[113.251923, 22.970348],
						[113.250007, 23.009058],
						[113.25836, 23.013989],
						[113.254912, 23.044842],
						[113.225713, 23.041874],
						[113.211688, 23.043305],
						[113.195747, 23.056185],
						[113.184865, 23.05963],
						[113.177201, 23.076695],
						[113.193678, 23.083902],
						[113.208776, 23.083531],
						[113.215826, 23.100646],
						[113.208163, 23.099692],
						[113.203718, 23.121891],
						[113.209695, 23.121838],
						[113.211535, 23.142603],
						[113.191992, 23.14345],
						[113.186857, 23.14827],
						[113.1877, 23.159127],
						[113.209465, 23.17708],
						[113.209006, 23.192171],
						[113.204867, 23.201172],
						[113.191072, 23.214937],
						[113.177508, 23.220866],
						[113.176511, 23.236587],
						[113.182029, 23.251459],
						[113.177738, 23.271304],
						[113.160877, 23.286649],
						[113.150608, 23.289983],
						[113.150838, 23.297972],
						[113.128, 23.31453],
						[113.124704, 23.307653],
						[113.105775, 23.302733],
						[113.11022, 23.295961],
						[113.105545, 23.289718],
						[113.090524, 23.28993],
						[113.086156, 23.285274],
						[113.072284, 23.284268],
						[113.081941, 23.261726],
						[113.079795, 23.250083],
						[113.070215, 23.248813],
						[113.053508, 23.253418],
						[113.044925, 23.2522],
						[113.052742, 23.26342],
						[113.051439, 23.278395],
						[113.042549, 23.283422],
						[113.032509, 23.300881],
						[113.037567, 23.320084],
						[113.023466, 23.324898],
						[113.027604, 23.33352],
						[113.043392, 23.351131],
						[113.034808, 23.357372],
						[113.018331, 23.341347],
						[113.012583, 23.352612],
						[112.989822, 23.354728],
						[112.980626, 23.380268],
						[112.988366, 23.390102],
						[112.990588, 23.402631],
						[113.001088, 23.406332],
						[112.988673, 23.419811],
						[112.982771, 23.434451],
						[112.989132, 23.443277],
						[112.978633, 23.441586],
						[112.974188, 23.434081],
						[112.96024, 23.425995],
						[112.961926, 23.44444],
						[112.972962, 23.450042],
						[112.975184, 23.463622]
					]
				]
			]
		}
	}]
}
```











