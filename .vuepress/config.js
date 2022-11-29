const createSidebar = require('./sidebar');

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
        "href": "/avatar.jpg"
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
    // https://vuepress-theme-reco.recoluan.com/
    // https://console.leancloud.cn/
    // wishzhang.io@qq.com/Zleancloud123
    valineConfig: {
      // 默认所有页面是否加载评论
      // 在单独的md文件不加载评论，可以在md里标记 isShowComments: false
      showComment: true,
      appId: 'nbv8DpgadE91qfxPrV9KeZNs-gzGzoHsz',
      appKey: '00ZmPADjmjBd3ZV69Z6xLYyc',
      // https://valine.js.org/avatar.html
      avatar: 'hide',
      // 阅读量统计
      visitor: true,
      meta: ['nick'],
      pageSize: 20
    },
    "subSidebar": 'auto',
    "mode": "light",
    "nav": [
      {
        "text": "时间线",
        "link": "/timeline/",
        "icon": "reco-date"
      }
    ],
    "sidebar": createSidebar([{
      dir: 'blogs/tool/',
      title: 'tool.js'
    }]),
    // "sidebar": {
    //   "/blogs/tool/":  [
    //     {
    //       title: 'tool.js',
    //       sidebarDepth: 2,
    //       children: [
    //         'profile',
    //         'Timer'
    //       ]
    //     },
    //   ]
    // },
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 1,     // 在导航栏菜单中所占的位置，默认2
        "text": '文章' // 默认文案 “分类”
      },
      "tag": {
        "location": 2,
        "text": "标签"
      },
      socialLinks: [     // 信息栏展示社交信息
        {icon: 'reco-github', link: 'https://github.com/wishzhang'},
        {icon: 'reco-npm', link: 'https://www.npmjs.com/~wishzhang'}
      ]
    },
    "logo": "/avatar.jpg",
    "search": true,
    "searchMaxSuggestions": 10,
    "author": "仰望星空",
    "authorAvatar": "/avatar.jpg",
    "record": "粤ICP备2021142243号-1",
    "startYear": "2021",
    "lastUpdated": false
  },
  "markdown":
    {
      "lineNumbers":
        true
    }
}
