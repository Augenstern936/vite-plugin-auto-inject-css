/*
 * @Description:
 * @Date: 2024-09-05 14:26:22
 * @LastEditTime: 2024-09-14 17:40:09
 */
export type ResolverName = 'element-ui' | 'element-plus' | 'ant-design-vue'

type ResolverInject = (componentName?: string) => string | string[]

export interface ResolverOptions {
  inject?: ResolverInject
}

export interface Resolver {
  name: ResolverName
  base: string[]
  style: string
  inject: ResolverInject
}

export interface VitePluginAutoInjectCssOptions {
  mode?: 'dependencies' | 'peerDependencies'
  baseCss?: boolean
  resolvers: Resolver[]
}
