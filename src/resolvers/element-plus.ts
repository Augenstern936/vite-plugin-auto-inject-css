/*
 * @Description:
 * @Date: 2024-09-05 16:09:50
 * @LastEditTime: 2024-09-06 18:11:06
 */

import type { Resolver, ResolverOptions } from '../typing'

/**
 *
 * @param options
 * @returns
 */
export const ElementPlusResolver = (options?: ResolverOptions): Resolver => {
  return {
    name: 'element-plus',
    inject: (name: string) => {
      if (typeof options?.inject === 'function') {
        return options.inject(name)
      }
      return `element-plus/theme-chalk/${name}.css`
    },
  }
}
