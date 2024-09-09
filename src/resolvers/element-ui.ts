/*
 * @Description: element-ui解析器
 * @Date: 2024-09-05 16:09:50
 * @LastEditTime: 2024-09-09 11:44:24
 */

import type { Resolver, ResolverOptions } from '../typing'

/**
 *
 * @param options
 * @returns
 */
export const ElementUiResolver = (options?: ResolverOptions): Resolver => {
  return {
    name: 'element-ui',
    base: 'element-ui/theme-chalk/base.css',
    style: 'element-ui/lib/theme-chalk/index.css',
    inject: (name: string) => {
      if (typeof options?.inject === 'function') {
        return options.inject(name)
      }
      return `element-ui/theme-chalk/${name}.css`
    },
  }
}
