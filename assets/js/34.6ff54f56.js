(window.webpackJsonp=window.webpackJsonp||[]).push([[34],{446:function(s,n,a){"use strict";a.r(n);var t=a(2),e=Object(t.a)({},(function(){var s=this,n=s._self._c;return n("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[n("h2",{attrs:{id:"github访问速度很慢"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#github访问速度很慢"}},[s._v("#")]),s._v(" github访问速度很慢")]),s._v(" "),n("p",[s._v("因为github.global.ssl.fastly.net这个域名被限制处理了。只要找到这个域名对应的IP地址，然后在hosts文件中加上IP–>域名的映射，刷新DNS缓存便可。")]),s._v(" "),n("p",[s._v("1、找到域名对应IP地址。去 "),n("a",{attrs:{href:"https://www.whatsmydns.net/",target:"_blank",rel:"noopener noreferrer"}},[s._v("https://www.whatsmydns.net/"),n("OutboundLink")],1),s._v(" 分别搜索以下域名：")]),s._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[s._v("github.com \ngithub.global.ssl.fastly.net\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br")])]),n("p",[s._v("2、修改host文件。如下：")]),s._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[s._v("20.205.243.166 github.com \n151.101.1.194 github.global.ssl.fastly.net\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br")])]),n("p",[s._v("3、刷新DNS。如下windows的做法，在CMD中执行：")]),s._v(" "),n("div",{staticClass:"language-sh line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[s._v("ipconfig /flushdns\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br")])]),n("p",[s._v("4、完成，再去试一下"),n("code",[s._v("git clone")]),s._v("吧！")]),s._v(" "),n("h2",{attrs:{id:"windows桌面右键markdown"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#windows桌面右键markdown"}},[s._v("#")]),s._v(" Windows桌面右键Markdown")]),s._v(" "),n("p",[s._v("1、在桌面新增.txt文件，将下面拷贝进去：")]),s._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[s._v('Windows Registry Editor Version 5.00\n\n[HKEY_CLASSES_ROOT\\.md]\n\n@="Typora.exe"\n\n[HKEY_CLASSES_ROOT\\.md\\ShellNew]\n\n"NullFile"=""\n\n[HKEY_CLASSES_ROOT\\Typora.exe]\n\n@="Markdown"\n')])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br"),n("span",{staticClass:"line-number"},[s._v("13")]),n("br")])]),n("p",[s._v("2、修改文件后缀为.reg")]),s._v(" "),n("p",[s._v("3、桌面双击打开.reg文件，确定确定")]),s._v(" "),n("p",[s._v("4、重启电脑")])])}),[],!1,null,null,null);n.default=e.exports}}]);