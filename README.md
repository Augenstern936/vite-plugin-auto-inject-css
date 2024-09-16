<h1 align="center">vite-plugin-auto-inject-css</h1>

<p align="center">按需注入UI库对应的组件样式，无需手动引入 💪</p>

## 为什么要开发这款插件！！

> 当前社区现有的插件无法满足日常开发需求，一些插件发布时间久远，一直未在更新及维护，使用效果不是太好.

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
│  ├─ index-CwY391-e.css               # 按需打包的UI库对应的组件样式
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

> 以上打包方式不会在输出文件中产生 `style` 代码，而是在对应的 `chunk` 中，以 `import` 和 `require` 的方式按需注入在文件顶部.
> 这对封装第三方组件很有帮助，如：开发一个基于ElementPlus的业务组件库，当我们在打包时，无需在对样式重复打包，因为在宿主环境下已经包含了样式文件, 只需引入即可.
> 这样不仅减小了打包后的体积，同时也避免了在使用时还要再单独引入style文件.

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

> 如果当前样式不属于UI库自身的，那么会在输出目录下生成样式文件并自动注入在对应的`chunk`中.

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
