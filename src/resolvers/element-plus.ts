/*
 * @Description: element-plus解析器
 * @Date: 2024-09-05 16:09:50
 * @LastEditTime: 2024-09-09 11:43:31
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
    base: 'element-plus/theme-chalk/base.css',
    style: 'element-plus/theme-chalk/index.css',
    inject: (name: string) => {
      if (typeof options?.inject === 'function') {
        return options.inject(name)
      }
      return `element-plus/theme-chalk/${name}.css`
    },
  }
}
