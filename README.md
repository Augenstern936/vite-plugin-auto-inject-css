<h1 align="center">vite-plugin-auto-inject-css</h1>

<p align="center">自动注入对应的 <b>Style</b> 文件及 <b>UI</b> 库组件样式，无需关心样式引入问题</p>
<p align="center">助力于组件库开发. 💪</p>

## 为什么要开发这款插件！！

> <p>经常有这样一个场景，每次在使用一个 <b>UI</b> 库时，都要全量引入 <b>Style</b> 文件，或按需手动引入对应的组件 <b>Style</b>.</p>
> <p>全量引入可能会存在一些未使到的样式，增加了打包后的体积；按需手动引入又太过于麻烦，容易出.</p>
> <p>本质上 <b>Component</b> 和 <b>Style</b> 应同为一体，在使用时无需在额外引入 <b>Style</b> 而不影响正常使用.</p>
> <p>同时，当前社区现有的插件无法满足日常开发需求，一些插件发布时间久远，一直未更新及维护，使用效果不是太好.</p>

```ts
import { ElButton } from 'element-plus';

        ↓ ↓ ↓ ↓ ↓ ↓

import 'element-plus/theme-chalk/el-button.css';
import { ElButton } from 'element-plus';
```

## 📦 安装

```bash
$ npm i vite-plugin-auto-inject-css -D
```

```bash
$ yarn add vite-plugin-auto-inject-css -D
```

```bash
$ pnpm add vite-plugin-auto-inject-css -D
```

## API

| 属性      | 描述                  | 类型                                | 默认值       |
| --------- | --------------------- | ----------------------------------- | ------------ |
| mode      | 以什么样式的模式注入. | `dependencies` / `peerDependencies` | dependencies |
| baseCss   | 是否注入基础样式.     | `boolean`                           | true         |
| resolvers | 要注入的库列表.       | `ElementPlusResolver[]`             | []           |

### Resolver

| 属性   | 描述            | 类型                                    | 默认值 |
| ------ | --------------- | --------------------------------------- | ------ |
| inject | 自定义注入样式. | `(name?: string) => string \| string[]` | -      |

## 🔨 使用案例

```ts
import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import {
  ElementPlusResolver,
  createAutoInjectCssPlugin,
} from 'vite-plugin-auto-inject-css'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    server: {
      open: true,
      host: true,
      https: !!env.https,
    },
    plugins: [
      Vue(),
      createAutoInjectCssPlugin({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  }
})
```

#### ↓ ↓ ↓ ↓ ↓ ↓ 📚

```text
dist
├─ assets
│  ├─ index-Ca3M0RQA.js                # js文件
│  ├─ index-CwY391-e.css               # 按需打包的UI库组件样式
├─ index.html                          # 入口 html
```

### 库模式 🚀

```ts
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import {
  ElementPlusResolver,
  createAutoInjectCssPlugin,
} from 'vite-plugin-auto-inject-css'

export default defineConfig(() => {
  return {
    build: {
      target: 'es2018',
      emptyOutDir: true,
      copyPublicDir: true,
      lib: {
        entry: './src/App.vue',
      },
      rollupOptions: {
        external: ['vue', 'element-plus'],
        output: [
          {
            format: 'es',
            dir: 'es',
          },
          {
            format: 'cjs',
            dir: 'lib',
            exports: 'named',
          },
        ],
      },
    },
    plugins: [
      Vue(),
      createAutoInjectCssPlugin({
        mode: 'peerDependencies',
        resolvers: [ElementPlusResolver()],
      }),
    ],
  }
})
```

> <p>以上打包方式不会在输出目录中生成 <b>style</b> 文件，而是在对应的 <b>chunk</b> 中，以 <b>import</b> 和 <b>require</b> 的方式按需注入在文件顶部.</p>
> <p>这对封装第三方组件很有帮助，如：开发一个基于 <b>ElementPlus</b> 的业务组件库，当我们在打包时，无需在对样式重复打包，因为在宿主环境下已经包含了样式文件, 只需引入即可.</p>
> <p>这样不仅减小了打包后的体积，同时也避免了在使用时还要再单独引入 <b>style</b> 文件.</p>
> <p>前提需设置 <b>mode</b> 参数为 <b>peerDependencies</b>，否则正常生成 <b>style</b> 文件.</p>

### ↓ ↓ ↓ ↓ ↓ ↓

```ts
import { ElButton } from 'element-plus';

        ↓ ↓ ↓ ↓ ↓ ↓

import 'element-plus/theme-chalk/base.css';
import 'element-plus/theme-chalk/el-button.css';
import { ElButton } from 'element-plus';
```

```ts
const { ElButton } = require('element-plus')

        ↓ ↓ ↓ ↓ ↓ ↓

'use strict';
require('element-plus/theme-chalk/base.css');
require('element-plus/theme-chalk/el-button.css');
const { ElButton } = require('element-plus');
```

> 如果当前 <b>style</b> 不属于 <b>UI</b> 库自身的，那么会在输出目录下生成 <b>style</b> 文件并自动注入在对应的 <b>chunk</b> 中.

### ↓ ↓ ↓ ↓ ↓ ↓

```ts
import './App.css'

或

require('./App.css')
```

### 自定义注入样式 🚀

```ts
import { defineConfig } from 'vite'
import {
  ElementPlusResolver,
  createAutoInjectCssPlugin,
} from 'vite-plugin-auto-inject-css'

export default defineConfig(() => {
  return {
    plugins: [
      createAutoInjectCssPlugin({
        mode: 'peerDependencies',
        resolvers: [
          ElementPlusResolver({
            inject: (name) => `element-plus/theme-chalk/${name}.css`,
          }),
        ],
      }),
    ],
  }
})
```

## 🍵 捐赠

如果您正在使用这个项目或者喜欢这个项目，可以通过以下方式支持我：

- Star、Fork、Watch 一键三连 🚀
