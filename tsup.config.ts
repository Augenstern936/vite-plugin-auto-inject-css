/*
 * @Description:
 * @Date: 2024-09-05 16:25:38
 * @LastEditTime: 2024-09-05 18:01:54
 */
import type { Options } from 'tsup'

export const tsup: Options = {
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
}
