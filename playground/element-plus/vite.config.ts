/*
 * @Description:
 * @Date: 2024-09-06 11:50:17
 * @LastEditTime: 2024-09-06 18:16:29
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
    build: {
      outDir: 'dist',
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    plugins: [
      Vue(),
      createAutoInjectCssPlugin({ resolvers: [ElementPlusResolver()] }),
    ],
  }
})
