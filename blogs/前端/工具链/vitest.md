---
title: vitest
date: 2022-12-24
tags: 

- 工具链
- 测试
- vue3

categories:

 - 前端
showSponsor: true

---

这是关于使用 [vitest](https://vitest.dev/) 进行[vue3 组件单元测试](https://cn.vuejs.org/guide/scaling-up/testing.html#recipes)的文章。另外还用到了 [@vue/test-utils](https://www.npmjs.com/package/@vue/test-utils) 依赖包。总体和之前常用的 [jest](https://jestjs.io/) 的使用方法类似，可以从 vitest 依赖包导出和 jest 一样的方法。

vue3 官网推荐首先的是 [vue-testing-library](https://testing-library.com/docs/vue-testing-library/intro/) ，但笔者认为上手难度要比 @vue/test-utils 要高一些的。不好找到代码示例，然后文档看的一头雾水。对于笔者来说还是选择 @vue/test-utils 包比较好上手。接下来看看如何使用 vitest 和 @vue/test-utils 来进行单元测试吧。



## 基础用法

首先安装 vitest 和 @vue/test-utils 依赖包：

```sh
npm install -D vitest
npm install -D @vue/test-utils
```

在 package.json 写上：

```json
{
	"scripts": {
	  "test": "vitest",
    "coverage": "vitest run --coverage"
	}
}
```

以 element-plus 的 [button 组件的测试源码](https://github.com/element-plus/element-plus/blob/dev/packages/components/button/__tests__/button.test.tsx)为例：

```ts
import { nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, test } from 'vitest'
import { Loading, Search } from '@element-plus/icons-vue'

import Button from '../src/button.vue'
import type { ComponentSize } from '@element-plus/constants'

const AXIOM = 'Rem is the best girl'

describe('Button.vue', () => {
  it('create', () => {
    const wrapper = mount(() => <Button type="primary" />)

    expect(wrapper.classes()).toContain('el-button--primary')
  })

  it('size', () => {
    const wrapper = mount(() => <Button size="large" />)

    expect(wrapper.classes()).toContain('el-button--large')
  })

  it('text', async () => {
    const bg = ref(false)

    const wrapper = mount(() => <Button text bg={bg.value} />)

    expect(wrapper.classes()).toContain('is-text')

    bg.value = true

    await nextTick()

    expect(wrapper.classes()).toContain('is-has-bg')
  })

  test('render text', () => {
    const wrapper = mount(() => (
      <Button
        v-slots={{
          default: () => AXIOM,
        }}
      />
    ))

    expect(wrapper.text()).toEqual(AXIOM)
  })

  test('handle click', async () => {
    const wrapper = mount(() => (
      <Button
        v-slots={{
          default: () => AXIOM,
        }}
      />
    ))

    await wrapper.trigger('click')
    expect(wrapper.emitted()).toBeDefined()
  })

  test('handle click inside', async () => {
    const wrapper = mount(() => (
      <Button
        v-slots={{
          default: () => <span class="inner-slot"></span>,
        }}
      />
    ))

    wrapper.find('.inner-slot').trigger('click')
    expect(wrapper.emitted()).toBeDefined()
  })

  it('disabled', async () => {
    const wrapper = mount(() => <Button disabled />)

    expect(wrapper.classes()).toContain('is-disabled')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('loading slot', () => {
    const wrapper = mount({
      setup: () => () =>
        (
          <Button
            v-slots={{ loading: () => <span class="custom-loading">111</span> }}
            loading={true}
          >
            Loading
          </Button>
        ),
    })

    expect(wrapper.find('.custom-loading').exists()).toBeTruthy()
  })
})
```

[it 和 test](https://stackoverflow.com/questions/45778192/what-is-the-difference-between-it-and-test-in-jest) 其实没什么区别，it 是 test 的区别。同一个源码文件会有 it 和 test 的原因，很大可能是因为不是一个人写的，而且可能是复制粘贴的。 

test 是一个测试用例，describe 用来归类。看完上面的示例，基本就知道如何进行 vue3 组件的单元测试了，不懂的话就多看几个组件的测试代码 :expressionless::expressionless::expressionless:



