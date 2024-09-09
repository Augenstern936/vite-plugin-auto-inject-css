/*
 * @Description:
 * @Date: 2024-09-05 14:26:22
 * @LastEditTime: 2024-09-09 12:02:23
 */
export type ResolverName = 'element-ui' | 'element-plus' | 'ant-design-vue'

export interface ResolverOptions {
  inject?: (componentName?: string) => string
}

export interface Resolver {
  name: ResolverName
  base: string
  style: string
  inject: (componentName: string) => string
}

export interface VitePluginAutoInjectCssOptions {
  mode?: 'dependencies' | 'peerDependencies'
  baseCss?: boolean
  resolvers: Resolver[]
}
