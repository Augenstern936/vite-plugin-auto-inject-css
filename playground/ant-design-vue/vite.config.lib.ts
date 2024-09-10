/*
 * @Description:
 * @Date: 2024-09-06 11:50:17
 * @LastEditTime: 2024-09-09 11:27:46
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
        external: ['vue', 'ant-design-vue'],
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
