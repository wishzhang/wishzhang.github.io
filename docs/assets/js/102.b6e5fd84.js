(window.webpackJsonp=window.webpackJsonp||[]).push([[102],{516:function(_,v,t){"use strict";t.r(v);var a=t(2),u=Object(a.a)({},(function(){var _=this,v=_._self._c;return v("ContentSlotsDistributor",{attrs:{"slot-key":_.$parent.slotKey}},[v("p",[_._v("前端开发工作不免遇到bug，内部环境的bug还好，但主要的难点是生产环境的bug。生产环境若是紧急的bug要求停下手中的工作，去定位解决这个bug。生产环境的bug解决的效率和质量对用户体验的影响是比较大的，也是工作中让人焦头烂额的一个原因。所以这里来讲一下如何解决生产环境的bug。")]),_._v(" "),v("h3",{attrs:{id:"解决bug的制度"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#解决bug的制度"}},[_._v("#")]),_._v(" 解决bug的制度")]),_._v(" "),v("p",[_._v("首先是一个工作制度的问题。大多公司有各自的bug管理工具，比如禅道、jira等。通过bug管理工具将bug登记，然后指派给总的管理人员，然后进行分发到子管理人员，最后由子管理人员负责处理。这个流程总体是正常的，但是现实情况可能会出现两种让开发人员头疼的事情。")]),_._v(" "),v("p",[_._v("一是bug过多并且反复出现，需要耗费很多精力去维护这样的系统，导致团队没精力去进行新的开发任务。")]),_._v(" "),v("p",[_._v("二是类似越级的沟通，直接让不同团队里的成员去帮忙解决这个事情，甚至jira直接指派到另一个团队的成员里去。")]),_._v(" "),v("p",[_._v("第一个问题，通常需要一定的人力去维护线上版本，需要保证开发人员一周至少有三个工作日是可以进行新的开发工作的（总之要有合理的时间），不然需要重新估算工作量去解决问题。不去解决这个问题，那么线上版本和新的开发工作都没法完成，同时开发人员也是疲于救火和无法完成的开发工作中，也可能导致开发人员离职进一步加大项目风险。")]),_._v(" "),v("p",[_._v("第二个问题，这个问题就很烦。我的工作任务至少是需要我的上级知道或分配的，直接分配给我是不大可能搞好的。我自身是有工作任务的而且上级不知道还可能分配更多的工作任务，导致完成不了。而且也没有完全的心思去搞的，这种越级的行为让开发人员也是头疼，咨询可以但是具体的实施不应该是这样的，需要找上级。")]),_._v(" "),v("h3",{attrs:{id:"解决bug的思维"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#解决bug的思维"}},[_._v("#")]),_._v(" 解决bug的思维")]),_._v(" "),v("p",[_._v("解决的道看不见摸不着，像隐藏在偌大的概率节点球网中。")]),_._v(" "),v("p",[_._v("**道来源于人观察到的事实。人发现道通过不断的逼近道，观察（角度维度）、抽象、归纳、演绎、假设等思维方法，最终必须以观察事实去验证道，道就是可以用来解释不同范围、数量事实的东西。**所以，一般能解释多个以上的事实可以称为道，能假释更多事实的也是道，这是个不断逼近的过程。牛顿定律是广义相对论的特例，牛顿定律是道，广义相对论也是道，只是可以解释的范围不同。")]),_._v(" "),v("p",[_._v("同样地，「概念」是人通过抽象出来的特征，作为道的节点。概念是这些特征的集合，也有一定的范围。一个概念、一个道的适用范围，要看目标事物集合是否都具有道的特征，只要事物集合有一个事物违背了这个道就可能处理不了这个事物集合。")]),_._v(" "),v("p",[_._v("上面是解决问题的道。")]),_._v(" "),v("p",[_._v("解决问题还有一个重要且容易忽略的节点，是人的局限。人的局限比如人的逻辑思维能力有限、人的个人力量有限、人的精力有限、人的态度消极等。所以需要注意这个特点，大多数情况下难以穷举以达道。通常人必须依靠抽象、假设等以某个角度粒度去解释道，然后逐渐完善去逼近道。")]),_._v(" "),v("h3",{attrs:{id:"解决bug的方法"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#解决bug的方法"}},[_._v("#")]),_._v(" 解决bug的方法")]),_._v(" "),v("h4",{attrs:{id:"_1、定位bug"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1、定位bug"}},[_._v("#")]),_._v(" 1、定位bug")]),_._v(" "),v("p",[_._v("定位bug就像医生诊断疾病。现代医生一般会问你过去的这段时间的身体状况，查看病历，望闻问切，逻辑假设，抽血化验等等。拿到数据后再分析判断，数据表现为某种疾病（这里面也有一定的概率成分，想想为什么）。这个流程总的来说比较繁杂不够快速，当遇到急诊的时候该怎么办呢？")]),_._v(" "),v("p",[_._v("要快速，更多的是与症状直接相关、二分法、大胆假设小心验证，不过这个误诊率就要比上面的要高一些。")]),_._v(" "),v("p",[_._v("而遇到比较棘手的bug通常是难以复现的bug。这里来看看几种复现bug的方法。")]),_._v(" "),v("ul",[v("li",[_._v("通过后门进入到用户的账号环境中测试")]),_._v(" "),v("li",[_._v("构造类似用户的环境、数据进行测试")])]),_._v(" "),v("h4",{attrs:{id:"_2、修复bug"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_2、修复bug"}},[_._v("#")]),_._v(" 2、修复bug")]),_._v(" "),v("p",[_._v("做到修复bug并且几乎不影响原来的代码功能。这里常出现的问题是：")]),_._v(" "),v("ol",[v("li",[v("p",[_._v("代码覆盖的事实不全，边界情况导致的bug")])]),_._v(" "),v("li",[v("p",[_._v("代码多处重复，改完一处另一处没改")])]),_._v(" "),v("li",[v("p",[_._v("代码一处但多处依赖，改完一处把相关的依赖也改了导致新的bug")])]),_._v(" "),v("li",[v("p",[_._v("对原来的功能不清楚没有单元测试，改好这个把另外一个原来正常的功能改出bug")])])]),_._v(" "),v("p",[_._v("第一个主要看代码逻辑：入参，出参，代码所覆盖的逻辑范围等等。")]),_._v(" "),v("p",[_._v("第二个的话是全局搜索看有没有同样的代码，可以的话抽成一处代码。")]),_._v(" "),v("p",[_._v("第三个可能是复用后随着需求改变造成的，如果单纯地拷贝出来会出现上面的第二个问题，这种的话可以适当的拆分为更内聚的功能或小心得在里边继续加代码。")]),_._v(" "),v("p",[_._v("第四个的话改之前要知道原来的功能，有单元测试会好一些。不知道的话就少动原来的代码，这也是无奈之举，bug改好了但随着需求变更，代码就越来越乱了。")]),_._v(" "),v("h3",{attrs:{id:"解决好bug的发布"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#解决好bug的发布"}},[_._v("#")]),_._v(" 解决好bug的发布")]),_._v(" "),v("p",[_._v("通常从线上版本分支拉出一个修复代码的分支，写好commit信息后提交，构建、测试。测试好后，如果可以就挑个好日子去发布，在bug管理工具上登记状态，就告一段落了。")])])}),[],!1,null,null,null);v.default=u.exports}}]);