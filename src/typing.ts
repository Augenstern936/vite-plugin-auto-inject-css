/*
 * @Description:
 * @Date: 2024-09-05 14:26:22
 * @LastEditTime: 2024-09-06 18:04:16
 */
export type ResolverName = 'element-ui' | 'element-plus'

export interface ResolverOptions {
  inject?: (componentName?: string) => string | string[]
}

export interface Resolver {
  name: ResolverName
  inject: (componentName: string) => string | string[]
}

export interface VitePluginAutoInjectCssOptions {
  baseCss?: boolean
  resolvers: Resolver[]
}
