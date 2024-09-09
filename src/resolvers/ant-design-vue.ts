/*
 * @Description: ant-design-vue解析器
 * @Date: 2024-09-05 16:09:50
 * @LastEditTime: 2024-09-09 12:02:15
 */

import type { Resolver, ResolverOptions } from '../typing'

/**
 *
 * @param options
 * @returns
 */
export const AntDesignVueResolver = (options?: ResolverOptions): Resolver => {
  return {
    name: 'ant-design-vue',
    base: 'ant-design-vue/theme-chalk/base.css',
    style: 'ant-design-vue/dist/reset.css',
    inject: (name: string) => {
      if (typeof options?.inject === 'function') {
        return options.inject(name)
      }
      return `ant-design-vue/theme-chalk/${name}.css`
    },
  }
}
