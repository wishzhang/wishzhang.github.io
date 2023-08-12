(window.webpackJsonp=window.webpackJsonp||[]).push([[58],{470:function(t,s,n){"use strict";n.r(s);var a=n(2),e=Object(a.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("生命周期的概念在很多领域都有，比如人的生命周期分为少年、青年、中年、老年，从出生到死亡的几个重要的阶段，软件过程也有生命周期模型，除了 vue 之外的很多框架都有生命周期的概念。这个概念从时间过程的角度来描述目标系统，这倒不是说这个模型就一定适合用来描述某个系统模型，但从 vue 框架的设计来说应该属于逻辑模型，实际上区分这些生命周期对于 vue 的理解和程序员的编程都有很大作用。。。废话不多说了，对于用户来说，最重要的是知道有哪些生命周期和这些生命周期框架底层做了哪个标志性的事情，用户在写代码中的常见的使用方法，这些就基本上是关于生命周期的所有了。")]),t._v(" "),s("p",[t._v("来看一下官方的生命周期图：")]),t._v(" "),s("img",{attrs:{src:"/assets/lifecycle.png",width:"100%",height:"auto",alt:"图片名称",align:"center"}}),t._v(" "),s("p",[t._v("vue 的生命周期有八个阶段：beforeCreate、created、beforeMount、mounted、beforeUpdate、updated、beforeDestroy、destroyed。")]),t._v(" "),s("p",[t._v("beforeCreate 阶段已经把 vue 内部的一些变量初始化了，在created阶段定义了状态的代理、响应式绑定，beforeMount 阶段没有做什么关键的事情，而到了mounted 阶段已经完成了组件的渲染并绑定在页面上，更新函数如下：")]),t._v(" "),s("div",{staticClass:"language-js line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("updateComponent")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  vm"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("_update")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("vm"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("_render")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" hydrating"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Watcher")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("vm"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" updateComponent"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" noop"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("before")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("vm"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_isMounted "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&&")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!")]),t._v("vm"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_isDestroyed"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("callHook")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("vm"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'beforeUpdate'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* isRenderWatcher */")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br"),s("span",{staticClass:"line-number"},[t._v("6")]),s("br"),s("span",{staticClass:"line-number"},[t._v("7")]),s("br"),s("span",{staticClass:"line-number"},[t._v("8")]),s("br"),s("span",{staticClass:"line-number"},[t._v("9")]),s("br"),s("span",{staticClass:"line-number"},[t._v("10")]),s("br")])]),s("p",[t._v("到这一阶段基本组件就显示出来了，接着由于 vue 的响应式绑定，改变响应式属性值会继续触发视图更新，会再次调用 beforeUpdate 钩子（这个钩子还没开始渲染），到了 updated 钩子就已经渲染完成，注意 mounted 阶段也是已经调用 updateComponent 更新组件了并且这个更新是同步的。")]),t._v(" "),s("p",[t._v("最后是 beforeDestroy 是做一些清理工作前的钩子，destroyed 是已经清理完成了。")])])}),[],!1,null,null,null);s.default=e.exports}}]);