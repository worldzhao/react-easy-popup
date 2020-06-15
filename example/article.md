[上篇文章](https://juejin.im/post/5ebcf12df265da7bc55df460)中介绍了如何从 0 到 1 搭建一个 React 组件库架子，但为了一两个组件去搭建组件库未免显得大材小用。

这次以移动端常见的一个组件 `Popup` 为例，以最方便快捷的形式发布一个流程完整的 npm 包。

![preview](https://fdfs.xmcdn.com/group87/M01/83/8B/wKg5IV7m4L_T7oWaACQGa4ao7_A704.gif)

- [🚀 在线预览](https://worldzhao.github.io/react-easy-popup/)
- [✨ 仓库地址](https://github.com/worldzhao/react-easy-popup)

如果对你有所帮助，欢迎点赞 Star 以及 PR。

如果有所错漏还烦请评论区指正。

本文包含以下内容：

1. `Popup`组件的开发；
2. 一些工具的使用

   - [tsdx](https://github.com/jaredpalmer/tsdx) ：项目初始化、开发以及打包大管家；
   - [np](https://github.com/sindresorhus/np)：一键发布 npm 包；
   - [gh-pages](https://www.npmjs.com/package/gh-pages)：部署示例 demo ；
   - [readme-md-generator](https://github.com/kefranabg/readme-md-generator)：生成一份规范的`README.md`文件。

> 本文不会和组件库那篇文章一般死扣打包细节，因为单个组件和组件库的打包有本质上的区别。<br/><br/>
> 组件库需要提供按需引入的能力，所以对组件仅仅是进行了语法上的编译（以及比较绕的样式处理），故选择了 gulp 管理打包流程。
> <br/><br/>
> 单组件则不同，由于不需要提供按需引入的能力，只需要打包出一个 js bundle 和 css bundle 即可，webpack 以及 rollup 就更适用于此类场景。

## 项目初始化

[tsdx](https://github.com/jaredpalmer/tsdx)是一个脚手架，内置三种项目模板：

1. basic => 工具包模板
2. react => React 组件模板，使用 parcel 用作 example 调试
3. react-with-storybook => 同上，使用 storybook 编写文档以及 example 调试

模板还内置了`start`、`build`、`test`以及`lint`等 npm scripts，的确是零配置开箱即用（大误）。

为了方便讲解，此处选择`react`模板。

![tsdx](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfsnhlddrkj30b4076mxa.jpg)

执行`npx tsdx create react-easy-popup`，选择`react`完成项目创建后进入项目目录。

![目录结构](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfsnhm1gauj30600bf74g.jpg)

### 配置 tsdx

很尴尬的一点是：`tsdx` 没有提供样式文件打包支持（国外的开发者真的很偏爱 `css in js`呢）。

而我们的初衷只是开发一个组件，不至于让使用者额外引入一个`styled-components`依赖，所以还是需要配置一下样式文件的处理支持（less）。

参照[customization-tsdx](https://github.com/jaredpalmer/tsdx#customization)这一小节进行配置。

安装相关依赖：

```sh
yarn add rollup-plugin-postcss autoprefixer cssnano less --dev
```

新建 `tsdx.config.js`，写入以下内容：

**tsdx.config.js**

```js
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        plugins: [
          autoprefixer(),
          cssnano({
            preset: 'default',
          }),
        ],
        inject: false,
        extract: 'react-easy-popup.min.css',
      })
    );
    return config;
  },
};
```

在 `package.json` 中配置`browserslist`字段。

**package.json**

```diff
// ...
+ "browserslist": [
+   "last 2 versions",
+   "Android >= 4.4",
+   "iOS >= 9"
+  ],
// ...
```

清空`src`目录，新建`index.tsx`、`index.less`。

**src/index.tsx**

```jsx
import * as React from 'react';
import './index.less';

const Popup = () => (
  <div className="react-easy-popup">hello,react-easy-popup</div>
);

export default Popup;
```

**src/index.less**

```less
.react-easy-popup {
  display: flex;
  color: skyblue;
}
```

**example/index.tsx**

```jsx
import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Popup from '../.'; // 此处存在parcel alias 见下文
import '../dist/react-easy-popup.min.css'; // 此处不存在parcel alias 写好相对路径

const App = () => {
  return (
    <div>
      <Popup />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
```

进入项目根目录，执行以下命令：

```sh
yarn start
```

现在 `src` 目录下的内容的变更会被实时监听，在根目录下生成的`dist`文件夹包含打包后的内容。

开发时调试的文件夹为`example`，另起一个终端。执行以下命令：

```sh
cd example
yarn # 安装依赖
yarn start # 启动example
```

在`localhost:1234`可以发现项目启动啦，样式生效且有浏览器前缀。

![样式配置完成](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfsnhn3ty4j31x60psn1d.jpg)

> 若 example 启动后网页报错，删除 example 下的.cache 以及 dist 目录重新 start

需要注意的是 `example` 的入口文件`index.tsx`引入的是我们打包后的文件，即`dist/index.js`。

但是引入路径却为`'../.'`，这是因为 `tsdx` 使用了 `parcel` 的 [aliasing](https://github.com/palmerhq/tsdx/pull/88/files)。

![example-index.ts](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfsnhnzrnsj30h807jdg9.jpg)

同时，观察根目录下的`dist`文件夹：

**dist**

```
├── index.d.ts # 组件声明文件
├── index.js # 组件入口
├── react-easy-popup.cjs.development.js # 开发时引入的组件代码 Commonjs规范
├── react-easy-popup.cjs.development.js.map # soucemap
├── react-easy-popup.cjs.production.min.js # 压缩后的组件代码
├── react-easy-popup.cjs.production.min.js.map # sourcemap
├── react-easy-popup.esm.js # ES Module规范的组件组件代码
├── react-easy-popup.esm.js.map # sourcemap
└── react-easy-popup.min.css # 样式文件
```

也可以很轻易地在`package.json`中找到`main`、`module`以及`typings`相关配置。

> 基于 rollup 手动搭一个组件模板并不困难，但是社区已经提供了方便的轮子，就不要重复造轮子啦。既要有造轮子的能力，也要有不造轮子的觉悟。似乎我们正在造轮子？

## 实现 Portal

`Popup`在移动端场景下极其常见，其内部基于`Portal`实现，自身又可以作为`Toast`和`Modal`等组件的下层组件。

要实现`Popup`，就要先基于[ReactDOM.createPortal](https://zh-hans.reactjs.org/docs/portals.html)实现一个`Portal`。

此处结合官方文档做一个简单总结。

1. 什么是传送门？`Portal` 是一种将子节点渲染到存在于父组件以外的 `DOM` 节点的优秀的方案。

2. 为什么需要传送门？父组件有 `overflow: hidden` 或 `z-index` 样式，我们又需要子组件能够在视觉上“跳出”其容器。例如，对话框、悬浮卡以及提示框。

同时还有很重要的一点：`portal`与普通的 `React` 子节点行为一致，仍存在于`React`树，所以`Context`依旧可以触及。有一些弹层组件会提供`xxx.show()`的 API 形式进行弹出，这种调用形式较为方便，虽然底层也是基于`Portal`，但是内部重新执行了`ReactDOM.render`，脱离了当前主应用的`React`树，自然也无法获取到`Context`。

> 推荐阅读：[传送门：React Portal-程墨 Morgan](https://zhuanlan.zhihu.com/p/29880992)

清空 src 目录，新建以下文件：

```sh
├── index.less # 样式文件
├── index.ts # 入口文件
├── popup.tsx # popup 组件
├── portal.tsx # portal 组件
└── type.ts # 类型定义文件
```

在编写代码之前，需要确定好`Portal`组件的 API。

与`ReactDOM.createPortal`方法接受的参数基本一致：指定的挂载节点以及内容。唯一的区别是：`Portal` 在未传入指定的挂载节点时，会创建一个节点以供使用。

| 属性     | 说明                 | 类型        | 默认值 |
| -------- | -------------------- | ----------- | ------ |
| node     | 可选，自定义容器节点 | HTMLElement | -      |
| children | 需要传送的内容       | ReactNode   | -      |

在`type.ts`中写入`Portal`的`Props`类型定义。

**src/type.ts**

```ts
export type PortalProps = React.PropsWithChildren<{
  node?: HTMLElement;
}>;
```

现在开始编写代码：

```jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { PortalProps } from './type';

const Portal = ({ node, children }: PortalProps) => {
  return ReactDOM.createPortal(children, node);
};

export default Portal;
```

> 注意：此处没有使用 React.FC 去进行声明 <br/> [react-typescript-cheatsheet](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet):Section 2: Getting Started => Function Components => What about `React.FC`/`React.FunctionComponent`?

代码实现比较简单，就是调用了一下`ReactDOM.createPortal`，没有考虑到使用者未传入`node`的情况：需要内部创建，组件销毁时销毁该`node`。

```jsx
import * as React from "react";
import * as ReactDOM from "react-dom";

import { PortalProps } from "./type";

// 判断是否为浏览器环境
const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

const Portal = ({ node, children }: PortalProps) => {
  // 使用ref记录内部创建的节点 初始值为null
  const defaultNodeRef = React.useRef<HTMLElement | null>(null);

  // 组件卸载时 移除该节点
  React.useEffect(
    () => () => {
      if (defaultNodeRef.current) {
        document.body.removeChild(defaultNodeRef.current);
      }
    },
    []
  );

  // 如果非浏览器环境 直接返回 null 服务端渲染需要
  if (!canUseDOM) return null;

  // 若用户未传入节点，Portal也未创建节点，则创建节点并添加至body
  if (!node && !defaultNodeRef.current) {
    const defaultNode = document.createElement("div");
    defaultNode.className = "react-easy-popup__portal";
    defaultNodeRef.current = defaultNode;
    document.body.appendChild(defaultNode);
  }

  return ReactDOM.createPortal(children, (node || defaultNodeRef.current)!); // 这里需要进行断言
};

export default Portal;
```

同时为了让非 ts 用户能够享受到良好的运行时错误提示，需要安装`prop-types`。

```sh
yarn add prop-types
```

**src/portal.tsx**

```diff
// ...

+ Portal.propTypes = {
+   node: canUseDOM ? PropTypes.instanceOf(HTMLElement) : PropTypes.any,
+   children: PropTypes.node,
+ };

export default Portal;
```

这样就完成了 `Portal` 组件的编写，在入口文件进行导出。

**src/index.ts**

```ts
export { default as Portal } from './portal';
```

`example/index.ts`中引入`Portal`，进行测试。

**example/index.tsx**

```diff
import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom";
- import Popup from "../."; // 此处存在parcel alias 见下文
- import "../dist/react-easy-popup.min.css"; // 此处不存在
+ import { Portal } from '../.';

// 创建自定义node节点
+ const node = document.createElement('div');
+ node.className = 'react-easy-popup__test-node';
+ document.body.appendChild(node);

const App = () => {
  return (
    <div>
-     <Popup />
+     <Portal>123</Portal>
+     <Portal node={node}>456</Portal>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

在网页中看到预期的`DOM`结构。

![portal-test](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfsnhogdbkj30rs0cmt9f.jpg)

## 实现 Popup

### API 梳理

老规矩，先规划 API，写好类型定义，再动手写代码。

我写这个组件的时候参考了[Popup-cube-ui](https://didi.github.io/cube-ui/#/zh-CN/docs/popup)。

最终确定 API 如下：

| 属性           | 说明                                                        | 类型                                           | 默认值   |
| -------------- | ----------------------------------------------------------- | ---------------------------------------------- | -------- |
| visible        | 可选，控制 popup 显隐                                       | boolean                                        | false    |
| position       | 可选，内容定位                                              | 'center' / 'top' / 'bottom' / 'left' / 'right' | 'center' |
| mask           | 可选，控制蒙层显隐                                          | boolean                                        | true     |
| maskClosable   | 可选，点击蒙层是否可以关闭                                  | boolean                                        | false    |
| onClose        | 可选，关闭函数，若 maskClosable 为 true，点击蒙层调用该函数 | function                                       | ()=>{}   |
| node           | 可选，元素挂载节点                                          | HTMLElement                                    | -        |
| destroyOnClose | 可选，关闭是否卸载内部元素                                  | boolean                                        | false    |
| wrapClassName  | 可选，自定义 Popup 外层容器类名                             | string                                         | ''       |

**src/type.ts**

```ts
export type Position = 'top' | 'right' | 'bottom' | 'left' | 'center';

type PopupPropsWithoutChildren = {
  node?: HTMLElement;
} & typeof defaultProps;

export type PopupProps = React.PropsWithChildren<PopupPropsWithoutChildren>;

// 默认属性写在这儿很难受 实在是typescript 对react组件默认属性的声明就是得这么拧巴
export const defaultProps = {
  visible: false,
  position: 'center' as Position,
  mask: true,
  maskClosable: false,
  onClose: () => {},
  destroyOnClose: false,
};
```

编写 `Popup` 的基本结构。

**src/popup.tsx**

```jsx
import * as React from 'react';
import PropTypes from 'prop-types';

import { PopupProps, defaultProps } from './type';
import './index.less';

const Popup = (props: PopupProps) => {
  console.log(props);
  return <div className="react-easy-popup">hello,react-easy-popup</div>;
};

Popup.propTypes = {
  visible: PropTypes.bool,
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left', 'center']),
  mask: PropTypes.bool,
  maskClosable: PropTypes.bool,
  onClose: PropTypes.func,
  stopScrollUnderMask: PropTypes.bool,
  destroyOnClose: PropTypes.bool,
};

Popup.defaultProps = defaultProps;

export default Popup;
```

在入口文件进行导出。

**src/index.ts**

```diff
+ export { default as Popup } from './popup';
```

### 前置 CSS 知识

在正式开发逻辑之前，先明确一点：

蒙层 Mask 以及内容 Content 入场以及出场均有动画效果。具体表现为：蒙层为 Fade 动画，内容则取决于当前 position，比如内容在中间（position === 'center'），则其动画效果为 Fade，如果在左边（position === 'left'），则其动画效果为 SlideRight，其他 position 以此类推。

再回顾张鑫旭大大的一篇文章：[小 tip: transition 与 visibility](https://www.zhangxinxu.com/wordpress/2013/05/transition-visibility-show-hide/)

划重点：

1. `opacity`的值在 `0` 与 `1` 之间相互过渡（`transition`）可以实现 Fade 动画。然而元素即使透明度变成 0，肉眼看不见，在页面上却依旧点击，还是可以覆盖其他元素的，我们希望元素淡出动画结束后，元素可以自动隐藏；
2. 元素隐藏很容易想到`display:none`。而`display:none` 无法应用 `transition` 效果，甚至是破坏作用；
3. `visibility:hidden` 可以看成 `visibility:0`；`visibility:visible` 可以看成 `visibility:1`。实际上，只要 `visibility` 的值大于 `0` 就是显示的。

总结一下：我们想用`opacity`实现淡入淡出的 Fade 动画，但是希望元素淡出后，能够隐藏，而不仅仅是透明度为 `0`，覆盖在其他元素上。所以需要配置 `visibility`属性，淡出动画结束时，`visibility`值也由`visible`变为了`hidden`，元素成功隐藏。

> 如果蒙层淡出动画结束后仅仅是透明度变为 0，却未隐藏，那么蒙层在视觉上虽然消失了，实际还是覆盖在页面上，就无法触发页面上的事件。

### 预设动画样式

借助[react-transition-group](https://github.com/reactjs/react-transition-group)完成动画效果，需要内置一些动画样式。

新建`animation.less`，写入以下动画样式。

<details>
<summary>展开查看代码</summary>

```less
@animationDuration: 300ms;

.react-easy-popup {
  /* Fade */
  &-fade-enter,
  &-fade-appear,
  &-fade-exit-done {
    visibility: hidden;
    opacity: 0;
  }

  &-fade-appear-active,
  &-fade-enter-active {
    visibility: visible;
    opacity: 1;
    transition: opacity @animationDuration, visibility @animationDuration;
  }
  &-fade-exit,
  &-fade-enter-done {
    visibility: visible;
    opacity: 1;
  }
  &-fade-exit-active {
    visibility: hidden;
    opacity: 0;
    transition: opacity @animationDuration, visibility @animationDuration;
  }

  /* SlideUp */
  &-slide-up-enter,
  &-slide-up-appear,
  &-slide-up-exit-done {
    transform: translate(0, 100%);
  }
  &-slide-up-enter-active,
  &-slide-up-appear-active {
    transform: translate(0, 0);
    transition: transform @animationDuration;
  }
  &-slide-up-exit,
  &-slide-up-enter-done {
    transform: translate(0, 0);
  }
  &-slide-up-exit-active {
    transform: translate(0, 100%);
    transition: transform @animationDuration;
  }

  /* SlideDown */
  &-slide-down-enter,
  &-slide-down-appear,
  &-slide-down-exit-done {
    transform: translate(0, -100%);
  }
  &-slide-down-enter-active,
  &-slide-down-appear-active {
    transform: translate(0, 0);
    transition: transform @animationDuration;
  }
  &-slide-down-exit,
  &-slide-down-enter-done {
    transform: translate(0, 0);
  }
  &-slide-down-exit-active {
    transform: translate(0, -100%);
    transition: transform @animationDuration;
  }

  /* SlideLeft */
  &-slide-left-enter,
  &-slide-left-appear,
  &-slide-left-exit-done {
    transform: translate(100%, 0);
  }

  &-slide-left-enter-active,
  &-slide-left-appear-active {
    transform: translate(0, 0);
    transition: transform @animationDuration;
  }

  &-slide-left-exit,
  &-slide-left-enter-done {
    transform: translate(0, 0);
  }

  &-slide-left-exit-active {
    transform: translate(100%, 0);
    transition: transform @animationDuration;
  }

  /* SlideRight */
  &-slide-right-enter,
  &-slide-right-appear,
  &-slide-right-exit-done {
    transform: translate(-100%, 0);
  }

  &-slide-right-enter-active,
  &-slide-right-appear-active {
    transform: translate(0, 0);
    transition: transform @animationDuration;
  }

  &-slide-right-exit,
  &-slide-right-enter-done {
    transform: translate(0, 0);
  }

  &-slide-right-exit-active {
    transform: translate(-100%, 0);
    transition: transform @animationDuration;
  }
}
```

</details>

### 完成基本逻辑

安装相关依赖。

```sh
yarn add react-transition-group classnames

yarn add @types/classnames @types/react-transition-group --dev
```

- node: 透传给`Portal`即可；
- visible: 将该属性赋值给蒙层以及内容外层`CSSTransition`组件的`in`属性，控制蒙层以及内容的过渡显隐；
- destroyOnClose: 将该属性赋值给内容外层`CSSTransition`组件的`unmountOnExit`属性，决定隐藏时是否卸载内容节点；
- wrapClassName: 拼接在外层容器节点的 `className` ；
- position: 1）用于获取内容节点的对应动画名称；2）决定容器节点以及内容节点类名，配合样式决定内容节点位置；
- mask: 决定蒙层节点的 `className`，从而控制蒙层有无；
- maskClose: 决定点击蒙层是否触发 onClose 函数。

用过 `antd` 的同学都知道，`antd`的`modal`在首次`visible === true`之前，内容节点是不会被挂载的，只有首次 `visible === true`，内容节点才挂载，而后都是样式上隐藏，而不会去卸载内容节点，除非手动设置 `destroyOnClose` 属性，我们也顺带实现这个特点。

> 代码逻辑比较简单，在拼接类名时注意配合样式文件一起阅读，重要的点都有注释标出。

<details>
<summary>展开查看逻辑代码</summary>

```jsx
// 类名前缀
const prefixCls = "react-easy-popup";
// 动画时长
const duration = 300;
// 位置与动画的映射
const animations: { [key in Position]: string } = {
  bottom: `${prefixCls}-slide-up`,
  right: `${prefixCls}-slide-left`,
  left: `${prefixCls}-slide-right`,
  top: `${prefixCls}-slide-down`,
  center: `${prefixCls}-fade`,
};

const Popup = (props: PopupProps) => {
  const firstRenderRef = React.useRef(false);

  const { visible } = props;
  // 在首次visible === true之前 都返回null
  if (!firstRenderRef.current && !visible) return null;
  if (!firstRenderRef.current) {
    firstRenderRef.current = true;
  }

  const {
    node,
    mask,
    maskClosable,
    onClose,
    wrapClassName,
    position,
    destroyOnClose,
    children,
  } = props;

  // 蒙层点击事件
  const onMaskClick = () => {
    if (maskClosable) {
      onClose();
    }
  };

  // 拼接容器节点类名
  const rootCls = classnames(
    prefixCls,
    wrapClassName,
    `${prefixCls}__${position}`
  );

  // 拼接蒙层节点类名
  const maskCls = classnames(`${prefixCls}-mask`, {
    [`${prefixCls}-mask__visible`]: mask,
  });

  // 拼接内容节点类名
  const contentCls = classnames(
    `${prefixCls}-content`,
    `${prefixCls}-content__${position}`
  );

  // 内容过渡动画
  const contentAnimation = animations[position];

  return (
    <Portal node={node}>
      <div className={rootCls}>
        <CSSTransition
          in={visible}
          timeout={duration}
          classNames={`${prefixCls}-fade`}
          appear
        >
          <div className={maskCls} onClick={onMaskClick}></div>
        </CSSTransition>
        <CSSTransition
          in={visible}
          timeout={duration}
          classNames={contentAnimation}
          unmountOnExit={destroyOnClose}
          appear
        >
          <div className={contentCls}>{children}</div>
        </CSSTransition>
      </div>
    </Portal>
  );
};
```

</details>

<details>
<summary>展开查看样式代码</summary>

```less
@import './animation.less';

@popupPrefix: react-easy-popup;

.@{popupPrefix} {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1999;
  pointer-events: none; // 特别注意：为none时可以产生点透的效果 可以理解为容器节点压根不存在

  .@{popupPrefix}-mask {
    position: absolute;
    top: 0;
    left: 0;
    display: none; // mask默认隐藏
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.72);
    pointer-events: auto;

    &__visible {
      display: block; // 展示mask
    }

    // fix some android webview opacity render bug
    &::before {
      display: block;
      width: 1px;
      height: 1px;
      margin-left: -10px;
      background-color: rgba(0, 0, 0, 0.1);
      content: '.';
    }
  }

  /* position为center时 使用flex居中 */
  &__center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .@{popupPrefix}-content {
    position: relative;
    width: 100%;
    color: rgba(113, 113, 113, 1);
    pointer-events: auto;
    -webkit-overflow-scrolling: touch; /* ios5+ */
    ::-webkit-scrollbar {
      display: none;
    }

    &__top {
      position: absolute;
      left: 0;
      top: 0;
    }

    &__bottom {
      position: absolute;
      left: 0;
      bottom: 0;
    }

    &__left {
      position: absolute;
      width: auto;
      max-width: 100%;
      height: 100%;
    }

    &__right {
      position: absolute;
      right: 0;
      width: auto;
      max-width: 100%;
      height: 100%;
    }

    &__center {
      width: auto;
      max-width: 100%;
    }
  }
}
```

</details>

组件编写完毕，接下来在`example/index.ts`中编写相关示例测试功能即可。

[example/index.ts](https://github.com/worldzhao/react-easy-popup/blob/master/example/index.tsx)

## 部署 github pages

相信大多数人使用一个 npm 包会先看示例再看文档。

接下来将 `example` 中的示例项目打包，并部署到 github pages 上。

安装`gh-pages`。

```sh
yarn add gh-pages --dev
```

package.json 新增脚本。

**package.json**

```json
{
  "scripts": {
    //...
    "predeploy": "npm run build && cd example && npm run build",
    "deploy": "gh-pages -d ./example/dist"
  }
}
```

由于 gh-pages 默认部署在`https://username.github.io/repo`下，而非根路径。为了能够正确引用到静态资源，还需要修改打包的 `public-url`。

修改 example 的 package.json 中的打包命令：

```diff
{
  "scripts":{
-   "build": "parcel build index.html"
+   "build": "parcel build index.html --public-url https://username.github.io/repo"
  }
}
```

> `https://username.github.io/repo`记得换成你自己的哦。

在根目录下执行 `yarn deploy`，等脚本执行完再去看看吧。

## 编写 README.md

一份规范的 README 会显得作者很专业，此处使用`readme-md-generator`生成基本框架，向里面填充内容即可。

[readme-md-generator](https://github.com/kefranabg/readme-md-generator):📄 CLI that generates beautiful README.md files

```sh
npx readme-md-generator -y
```

[README.md](https://github.com/worldzhao/react-easy-popup/blob/master/README.md)

## 使用 np 发包

在上一篇文章中，专门编写了一个脚本来处理以下六点内容：

1. 版本更新
2. ~~生成 CHANGELOG~~
3. 推送至 git 仓库
4. 组件打包
5. 发布至 npm
6. 打 tag 并推送至 git

这次就不生成 CHANGELOG 文件了，其他五点配合`np`，操作十分简单。

[np](https://github.com/sindresorhus/np):A better `npm publish`

```sh
yarn add np --dev
```

**package.json**

```json
{
  "scripts": {
    // ...
    "release": "np --no-yarn --no-tests --no-cleanup"
  }
}
```

```sh
npm login
npm run release
```

- `--no-yarn`： 不使用 `yarn`。发包时出现 npm 与 yarn 之间的一些问题；
- `--no-tests`：测试用例暂时还未编写，先跳过；
- `--no-cleanup`：发包时不要重新安装 node_modules；
- 首次发布新包时可能会[报错](https://github.com/sindresorhus/np/issues/398)，因为 np 进行了 npm 双因素认证，但依旧可以发布成功，等后续更新。

更多配置请查看官方文档。

## 结语

这篇文章写的很快（也很累），特别是组件逻辑部分，主要依赖动画效果，而本人 CSS 又不大好。

如果对你有所帮助，欢迎点赞 Star 以及 PR，当然啦，也欢迎使用本组件。

如果有所错漏还烦请评论区指正。

- 仓库地址：[戳我 ✨](https://github.com/worldzhao/react-easy-popup)
