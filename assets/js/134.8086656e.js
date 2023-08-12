(window.webpackJsonp=window.webpackJsonp||[]).push([[134],{544:function(v,_,l){"use strict";l.r(_);var i=l(2),t=Object(i.a)({},(function(){var v=this,_=v._self._c;return _("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[_("p",[v._v("这里所说的“前端代码”的粒度是一个页面上的功能点，比如一个echarts图、一个表格区域、一个表单区域的功能。")]),v._v(" "),_("p",[v._v("在之前需要做一些模块的设计，这里所讨论的是一个小模块内部的设计编码。")]),v._v(" "),_("p",[v._v("虽说这对其他模块的影响比较小，在模块内代码组织得比较乱似乎不会造成较大的维护困难。而且随着人员流动和需求变更，通常一个文件模块内的代码也容易趋向于混乱。似乎在这个小粒度的代码文件里去追求较高的设计工作，反而会浪费精力甚至可能会增加复杂度，使得维护性降低，这就设计过度了。")]),v._v(" "),_("p",[v._v("通常在一个开发模式里，一个模块文件内的编码模式也需要对齐这个全局开发模式的规范，在这基础上去做具体功能点的编码。由于设计过度和成本的问题，在一个模块文件的开发所追求的目标是：生成率略大于维护性（质量属性）。")]),v._v(" "),_("hr"),v._v(" "),_("p",[v._v("生产率略大于维护性，意思是编写的代码具有一定可用可靠功能性的前提下，还必须关注提高一下代码的可维护性。如果遇到感觉某个代码难以提高易理解性、维护性，也可暂时不理会。但必须持续关注代码的维护性。")]),v._v(" "),_("p",[v._v("实际的编码有三个层面：")]),v._v(" "),_("ol",[_("li",[v._v("实现算法、业务逻辑正确的代码（可用性可靠性）")]),v._v(" "),_("li",[v._v("代码是写给别人看的（可维护可修改性）")]),v._v(" "),_("li",[v._v("满足系统性能的需求问题（性能）")])]),v._v(" "),_("p",[v._v("这里主要讲一下第1、2点。")]),v._v(" "),_("p",[v._v("第一点实现算法、业务逻辑正确的代码，这点几乎所有工程师都能很快找到一条逻辑链进行编码，实现可用的功能，通常在可用性上不会有啥问题。但经常会在稳定可靠性上出现问题，比如：")]),v._v(" "),_("ul",[_("li",[v._v("有部分未考虑到的逻辑情况（一般的测试也测不出来）")]),v._v(" "),_("li",[v._v("没考虑容错情况")]),v._v(" "),_("li",[v._v("没考虑当错误发生后的处理")])]),v._v(" "),_("p",[v._v("第二点代码是写给别人看的，写一遍代码通常需要看至少10遍的代码，上百遍也是有的是。这光是修改别人代码之前需要读代码并且理清逻辑就需要花费不少精力，如果需要一点改动，那么我估计写代码的成本和读代码的成本，是1:100以上，有修改过很乱的代码都应该知道这个。")]),v._v(" "),_("hr"),v._v(" "),_("p",[v._v("对于第一点，通常是因为没有详细设计就开始编码造成的。这个设计指的不只是原型、设计稿或在脑海中的一条逻辑链，而是具体到设计稿和交互图。在工作中，如果设计稿还没出你就提前去堆页面，这其中会浪费至少1/3的成本。而在工作中的原型图几乎是没有详细交互逻辑的，只有一些说明文字。那么前端工程师需要去看懂这个原型图的另外，建议是去画活动图来表示交互逻辑。这样做好设计之后，再去针对一个个逻辑点去进行编码，写出来的代码可靠性会更高，思路更清晰。实际上画活动图的方式来代替脑海中的一条逻辑链的成本通常是要低的。大脑还是适合高层抽象的逻辑，太多的逻辑是没法推演的，再聪明的人也难以光在脑海就进行复杂的逻辑论证。")]),v._v(" "),_("p",[v._v("对于第二点，这里直接给出几点参考吧：")]),v._v(" "),_("ul",[_("li",[v._v("使用eslint、prettier统一代码风格")]),v._v(" "),_("li",[v._v("保持尽量的简单、清晰的数据流和控制流")]),v._v(" "),_("li",[v._v("单一职责、面向接口等设计原则、高内聚低耦合（数据耦合、控制耦合、全局耦合，不要内容耦合）")]),v._v(" "),_("li",[v._v("一个方法是单一职责的，应该把声明都提到最上边")])]),v._v(" "),_("hr"),v._v(" "),_("p",[v._v("这里单纯地摘抄几个设计原则：")]),v._v(" "),_("ul",[_("li",[v._v("针对接口编程，而不是针对实现")]),v._v(" "),_("li",[v._v("多用组合，少用继承")]),v._v(" "),_("li",[v._v("为了交互对象之间的松耦合设计而努力")]),v._v(" "),_("li",[v._v("类应该对扩展开放，对修改关闭")]),v._v(" "),_("li",[v._v("要依赖抽象，不要依赖具体类")]),v._v(" "),_("li",[v._v("最少知识原则：只和你的密友谈话")]),v._v(" "),_("li",[v._v("单一职责：一个类应该只有一个引起变化的原因")])])])}),[],!1,null,null,null);_.default=t.exports}}]);