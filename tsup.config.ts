/*
 * @Description:
 * @Date: 2024-09-05 16:25:38
 * @LastEditTime: 2024-09-15 18:42:57
 */
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['vite', 'element-plus'],
})
