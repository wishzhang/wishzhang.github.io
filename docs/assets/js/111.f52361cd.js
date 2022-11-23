(window.webpackJsonp=window.webpackJsonp||[]).push([[111],{519:function(v,_,t){"use strict";t.r(_);var a=t(2),s=Object(a.a)({},(function(){var v=this,_=v._self._c;return _("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[_("h2",{attrs:{id:"来源"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#来源"}},[v._v("#")]),v._v(" 来源")]),v._v(" "),_("p",[v._v("这是无论框架设计者或者业务程序员在编程中认为的比较重要的一个点，比如会说「解耦很重要」、「啥那耦合度太高」、「那代码是面条式代码」、「你这掺杂了其他的业务代码」，这些都指向系统的修改成本、可维护性。那么高内聚低耦合这个如何定位呢？在系统设计中为解决高层的软件需求，解决过程中涉及到的几个要素是目标、抽象、模块、逻辑链，那么高内聚低耦合其实是作为一种辅助模块设计的方法，其直接作用在于系统的可维护性方面，间接作用还是需要考虑最终的目标上。所以高内聚低耦合是过程中的一个辅助方法，是侧重系统关于可维护性方面的目标，但不是系统可用性等目标。从理论的角度看「高内聚低耦合」并不是系统设计的必要要素。")]),v._v(" "),_("p",[v._v("但在工程实践中，几乎没有几个程序文件就能搞定的项目，并且是团队协作的项目，项目得考虑成本等因素，所以系统可维护性就出现在大家的考虑范围内了。对于个人项目，初期系统是因为可维护性没有成为主要矛盾，最终还是要以实际工程来考虑。")]),v._v(" "),_("h2",{attrs:{id:"在项目中"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#在项目中"}},[v._v("#")]),v._v(" 在项目中")]),v._v(" "),_("p",[v._v("高内聚低耦合是软件维护工作的其中一个最佳实践，但由于进度、质量要求、业务敏捷度等原因，需要在合理的范围内平衡取舍，这个和程序员所处的环境有关。维护工作的成本通常远远大于开发成本，大多软件项目的初期需要尽快交互一个可用的产品，有时这点比什么都重要。所以一个工程项目实际只能平衡各种情况，评估项目进展的当前情况，确定要解决的主要矛盾。（项目的目的就是以较低的成本来完成满足需求，如果不这样做那可能是盈利不多、能力不足、或者存在亏损、疯狂压榨员工、或者是被竞争对手淘汰，如果还继续生存下去还怎么来提高员工工资（而且老板哪还有那玩意））。")]),v._v(" "),_("h2",{attrs:{id:"具体内容"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#具体内容"}},[v._v("#")]),v._v(" 具体内容")]),v._v(" "),_("p",[v._v("高内聚与低耦合之间没有必然的联系，高内聚不表示就是低耦合，因为高内聚是对于一个模块内部而言的，而低耦合是针对模块之间的耦合度。高内聚低耦合是一个定性的评估准则。")]),v._v(" "),_("p",[v._v("内聚性由高到低有7种：")]),v._v(" "),_("ol",[_("li",[v._v("功能内聚")]),v._v(" "),_("li",[v._v("顺序内聚")]),v._v(" "),_("li",[v._v("数据内聚")]),v._v(" "),_("li",[v._v("过程内聚")]),v._v(" "),_("li",[v._v("时间内聚")]),v._v(" "),_("li",[v._v("逻辑内聚")]),v._v(" "),_("li",[v._v("偶然内聚")])]),v._v(" "),_("p",[v._v("耦合性有低到高也有7种：")]),v._v(" "),_("ol",[_("li",[v._v("非直接耦合")]),v._v(" "),_("li",[v._v("数据耦合")]),v._v(" "),_("li",[v._v("标记耦合")]),v._v(" "),_("li",[v._v("控制耦合")]),v._v(" "),_("li",[v._v("外部耦合")]),v._v(" "),_("li",[v._v("公共耦合")]),v._v(" "),_("li",[v._v("内容耦合")])]),v._v(" "),_("p",[_("strong",[v._v("高内聚低耦合源于可维护性工作的其中一个维度的度量，内聚程度不同则应对变化的能力（内部元素稳定性）也不同。高内聚通常表示一个模块里的所有元素应该做好一件事并且这件事有足够应对变化的能力。")]),v._v(" （小技巧：无论是由于功能、顺序等因素而内聚，都需要注意写代码像写诗一样，这几行代码表达一个意思，下面几行表达一个意思，有时可以简化一些不必要的中间变量，总之以写诗那样，不要每句流水账什么逻辑都杂糅在一起，意图把意思表达清晰。）")]),v._v(" "),_("p",[_("strong",[v._v("耦合性是度量模块之间交互的质量，同样需要考虑模块之间的接口应对模块的变化（外部接口稳定性），需要足够稳定、一致性、易理解性等等。在设计上我们应采用以下原则：如果需要存在直接耦合，就尽量使用数据耦合，少用控制耦合，限制公共耦合的范围，尽量避免使用内容耦合。")])]),v._v(" "),_("h2",{attrs:{id:"最后"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#最后"}},[v._v("#")]),v._v(" 最后")]),v._v(" "),_("p",[v._v("看了各种各样不同的解释，意思虽然各自有些偏离，但其实都是有一定的作用的。另外在不同的环境下，不同的情况下，往往需要调整，需要从不同的角度，粒度，层次去考虑来解决最终问题。")]),v._v(" "),_("p",[v._v("最后总结一句话："),_("strong",[v._v("道的关键是天人合一，工程实践的关键是过程改进。")])])])}),[],!1,null,null,null);_.default=s.exports}}]);