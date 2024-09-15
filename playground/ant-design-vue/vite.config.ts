/*
 * @Description:
 * @Date: 2024-09-06 11:50:17
 * @LastEditTime: 2024-09-10 11:32:19
 */
import Vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

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
      // createAutoInjectCssPlugin({
      //   resolvers: [AntDesignVueResolver()],
      // }),
    ],
  }
})
