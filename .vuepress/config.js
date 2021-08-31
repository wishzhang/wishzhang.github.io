module.exports = {
  "title": "仰望星空",
  "description": "",
  "dest": "docs",
  "locales": {
    '/': {
      lang: 'zh-CN'
    }
  },
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.jfif"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    "mode": "light",
    "nav": [
      {
        "text": "时间线",
        "link": "/timeline/",
        "icon": "reco-date"
      },
    ],
    "sidebar": {
      "/docs/theme-reco/": [
        "",
        "theme",
        "plugin",
        "api"
      ]
    },
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 1,     // 在导航栏菜单中所占的位置，默认2
        "text": '文章', // 默认文案 “分类”
      },
      "tag": {
        "location": 2,
        "text": "标签"
      },
      socialLinks: [     // 信息栏展示社交信息
        { icon: 'reco-github', link: 'https://github.com/wishzhang' },
        { icon: 'reco-npm', link: 'https://www.npmjs.com/~wishzhang' }
      ]
    },
    "logo": "/logo.jfif",
    "search": true,
    "searchMaxSuggestions": 10,
    "author": "仰望星空",
    "authorAvatar": "/avatar.jfif",
    "record": "",
    "startYear": "2021",
    "lastUpdated": false
  },
  "markdown": {
    "lineNumbers": true
  }
}