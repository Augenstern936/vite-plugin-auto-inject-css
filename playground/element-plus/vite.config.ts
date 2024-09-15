/*
 * @Description:
 * @Date: 2024-09-06 11:50:17
 * @LastEditTime: 2024-09-15 12:20:19
 */
import Vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import {
  ElementPlusResolver,
  createAutoInjectCssPlugin,
} from 'vite-plugin-auto-inject-css'

export default defineConfig(({ mode }): Record<string, any> => {
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
        mode: 'peerDependencies',
        resolvers: [ElementPlusResolver()],
      }),
    ],
  }
})
