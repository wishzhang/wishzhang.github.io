---
title: react源码分析-渲染流程（一）
date: 2022-09-06
tags: 
- react源码分析

categories:

- 前端
---

react源码分析第一篇，分析的是react 16.8.0之后的版本。

先来看看react入口，当前端应用引入react的初始化代码：

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

index.js

```js
import React from 'react';
import ReactDOM from 'react-dom/client';

const Game = () => {
  return <div>a good start</div>
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game/>);
```



---

好了，上面的意思呢，先从react-dom包引进ReactDom，调用createRoot方法将页面上的一个dom节点作为参数传进去，得到一个root。然后这个root调用render方法将组件Game传进去，猜是将Game进行解析成vdom，最后patch到传进去的那个dom去。

这里边需要弄清楚ReactDOM.createRoot这个方法传了dom节点进去主要去做了什么事情，最后得到的是什么，为什么要这样子调用。render又是包含了哪几个过程？

接下来，开始去react源码看看是怎么做的吧。

通过构建脚本等等可以知道，react目录结构是将源码放在packages目录下，然后packages直接子目录是各种可发布的包同时也是一个个模块。找到react-dom模块的入口文件index.js。发现里面代码有点绕哈：

```js
// packages/react-dom/index.js
// Export all exports so that they're available in tests.
// We can't use export * from in Flow for some reason.
export {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  createPortal,
  createRoot,
  hydrateRoot,
  findDOMNode,
  flushSync,
  hydrate,
  render,
  unmountComponentAtNode,
  unstable_batchedUpdates,
  unstable_createEventHandle,
  unstable_flushControlled,
  unstable_isNewReconciler,
  unstable_renderSubtreeIntoContainer,
  unstable_runWithPriority, // DO NOT USE: Temporarily exposed to migrate off of Scheduler.runWithPriority.
  version,
} from './src/client/ReactDOM';
```

上面那发现了`createRoot`, 那么沿着路径去找吧。就来到了packages/react-dom/src/client/ReactDOM.js这个文件。这个文件相当于一个模块，可以看到ReactDOM只是导出了一些变量、函数，它本身作为一个实例去调用这些方法（自己并不是一个类来提供多个对象状态，而是作为一个工具集模块）。而且其实ReactDOM这个文件里定义的是一个抽象接口层。继续看ReactDOM.js里面的`createRoot`函数代码：

```js
// packages/react-dom/src/client/ReactDOM.js
import {
  createRoot as createRootImpl,
  hydrateRoot as hydrateRootImpl,
  isValidContainer,
} from './ReactDOMRoot';

function createRoot(
  container: Element | Document | DocumentFragment,
  options?: CreateRootOptions,
): RootType {
  if (__DEV__) {
    if (!Internals.usingClientEntryPoint && !__UMD__) {
      console.error(
        'You are importing createRoot from "react-dom" which is not supported. ' +
          'You should instead import it from "react-dom/client".',
      );
    }
  }
  return createRootImpl(container, options);
}
```

具体的实现在`createRootImpl`这个函数里呢。可以看到具体实现又是在`ReactDOMRoot`来实现的。另外，可以看到除了ReactDOMRoot.js文件，还有十来个命名上类似的文件比如ReactDOMInput.js等等，现在我不知道这是干嘛的先不管。来继续看`ReactDOMRoot`的实现：

```js
// packages/react-dom/src/client/ReactDOMRoot.js
export function createRoot(
  container: Element | Document | DocumentFragment,
  options?: CreateRootOptions,
): RootType {
  if (!isValidContainer(container)) {
    throw new Error('createRoot(...): Target container is not a DOM element.');
  }

  warnIfReactDOMContainerInDEV(container);

  let isStrictMode = false;
  let concurrentUpdatesByDefaultOverride = false;
  let identifierPrefix = '';
  let onRecoverableError = defaultOnRecoverableError;
  let transitionCallbacks = null;
	...
  const root = createContainer(
    container,
    ConcurrentRoot,
    null,
    isStrictMode,
    concurrentUpdatesByDefaultOverride,
    identifierPrefix,
    onRecoverableError,
    transitionCallbacks,
  );
  markContainerAsRoot(root.current, container);

  const rootContainerElement: Document | Element | DocumentFragment =
    container.nodeType === COMMENT_NODE
      ? (container.parentNode: any)
      : container;
  listenToAllSupportedEvents(rootContainerElement);

  return new ReactDOMRoot(root);
}
```

最后可以知道ReactDOM.createRoot实质上是返回了一个`ReactDOMRoot`实例，而传进去的参数`container`即dom节点通过`createContainer`之后得到root，再将root作为参数传给`ReactDOMRoot`。先简单来看看`createContainer`做了什么，之后就深入看下`ReactDOMRoot`。

---

竟然来到了packages/react-reconciler/src/ReactFiberReconciler.js这个文件下，reconciler这个单词是解调器的意思，我猜这是做一些适配或工厂相关工作的模块。

```js
// packages/react-reconciler/src/ReactFiberReconciler.js
import {enableNewReconciler} from 'shared/ReactFeatureFlags';
import {
  createContainer as createContainer_new
  ...
} from './ReactFiberReconciler.new';
export const createContainer = enableNewReconciler
  ? createContainer_new
  : createContainer_old;
...
```

这大概是实现react庞大的功能所做的解耦，不管它。继续看看createContainer_new是啥。

```js
// packages/react-reconciler/src/ReactFiberReconciler.new.js
export function createContainer(
  containerInfo: Container,
  tag: RootTag,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
  isStrictMode: boolean,
  concurrentUpdatesByDefaultOverride: null | boolean,
  identifierPrefix: string,
  onRecoverableError: (error: mixed) => void,
  transitionCallbacks: null | TransitionTracingCallbacks,
): OpaqueRoot {
  const hydrate = false;
  const initialChildren = null;
  return createFiberRoot(
    containerInfo,
    tag,
    hydrate,
    initialChildren,
    hydrationCallbacks,
    isStrictMode,
    concurrentUpdatesByDefaultOverride,
    identifierPrefix,
    onRecoverableError,
    transitionCallbacks,
  );
}
```

不管继续看：

```js
// packages/react-reconciler/src/ReactFiberRoot.new.js
function FiberRootNode(
  containerInfo,
  tag,
  hydrate,
  identifierPrefix,
  onRecoverableError,
) {
  this.tag = tag;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.current = null;
  this.pingCache = null;
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  this.callbackNode = null;
  this.callbackPriority = NoLane;
  this.eventTimes = createLaneMap(NoLanes);
  this.expirationTimes = createLaneMap(NoTimestamp);

	...
}

export function createFiberRoot(
  containerInfo: any,
  tag: RootTag,
  hydrate: boolean,
  initialChildren: ReactNodeList,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
  isStrictMode: boolean,
  concurrentUpdatesByDefaultOverride: null | boolean,
  // TODO: We have several of these arguments that are conceptually part of the
  // host config, but because they are passed in at runtime, we have to thread
  // them through the root constructor. Perhaps we should put them all into a
  // single type, like a DynamicHostConfig that is defined by the renderer.
  identifierPrefix: string,
  onRecoverableError: null | ((error: mixed) => void),
  transitionCallbacks: null | TransitionTracingCallbacks,
): FiberRoot {
  const root: FiberRoot = (new FiberRootNode(
    containerInfo,
    tag,
    hydrate,
    identifierPrefix,
    onRecoverableError,
  ): any);
 
  ...

  return root;
}
```

到这，发现 `ReactDOM.createRoot(document.getElementById("root"));` 里边拿到 `document.getElementById("root")`节点创建了`FiberRootNode`实例，再将`FiberRootNode`实例作为`new ReactDOMRoot(root)`的参数，最后返回`ReactDOMRoot`的实例。

---

这里看看`ReactDOMRoot`实例是怎样的：

```js
// src/react/v18/react-dom/src/client/ReactDOMRoot.js
function ReactDOMRoot(internalRoot: FiberRoot) {
  this._internalRoot = internalRoot;
}
ReactDOMRoot.prototype.render = function(
  children: ReactNodeList,
): void {
  const root = this._internalRoot;
  if (root === null) {
    throw new Error('Cannot update an unmounted root.');
  }
  ...
  updateContainer(children, root, null, null);
};
...
```

**迄今为止，这几个步骤和Vue是相似的。拿到vnode，然后处理渲染vnode。**（浏览器本身渲染的流程少了vnode这一层）

这一篇源码分析就到这就好了，接下来第二篇来分析一下`updateContainer`。	







