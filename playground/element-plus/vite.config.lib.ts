/*
 * @Description:
 * @Date: 2024-09-06 11:50:17
 * @LastEditTime: 2024-09-14 17:27:47
 */
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import {
  ElementPlusResolver,
  createAutoInjectCssPlugin,
} from 'vite-plugin-auto-inject-css'

export default defineConfig((): Record<string, any> => {
  return {
    build: {
      target: 'es2018',
      emptyOutDir: true,
      cssCodeSplit: true,
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
        resolvers: [
          ElementPlusResolver({
            inject: (name) => {
              if (name === 'el-button') {
                return [
                  `element-plus/theme-chalk/base.css`,
                  `element-plus/theme-chalk/${name}.css`,
                ]
              }
              return `element-plus/theme-chalk/${name}.css`
            },
          }),
        ],
      }),
    ],
  }
})
