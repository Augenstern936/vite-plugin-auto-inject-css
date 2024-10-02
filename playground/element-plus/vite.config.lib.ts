/*
 * @Description:
 * @Date: 2024-09-06 11:50:17
 * @LastEditTime: 2024-10-02 14:31:26
 */
import { resolve } from 'path'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import {
  ElementPlusResolver,
  createAutoInjectCssPlugin,
} from 'vite-plugin-auto-inject-css'

export default defineConfig({
  build: {
    target: 'es2018',
    emptyOutDir: true,
    cssCodeSplit: true,
    copyPublicDir: true,
    lib: {
      entry: 'src/text/index.ts',
    },
    rollupOptions: {
      external: [
        'vue',
        'element-plus',
        'copy-to-clipboard',
        '@vueuse/core',
        '@element-plus/icons-vue',
      ],
      output: [
        {
          format: 'es',
          dir: 'es',
          // preserveModules: true,
          // preserveModulesRoot: resolve(process.cwd(), 'src/text'),
          entryFileNames: `[name].mjs`,
          //assetFileNames: 'assets/[name][extname]',
        },
        // {
        //   format: 'cjs',
        //   dir: 'lib',
        //   exports: 'named',
        //   assetFileNames: 'assets/[name][extname]',
        // },
      ],
    },
  },
  plugins: [
    Vue(),
    VueJsx(),
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
})
