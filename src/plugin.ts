/*
 * @Description:
 * @Date: 2024-09-05 14:51:42
 * @LastEditTime: 2024-09-06 18:26:07
 */

import type { Plugin } from 'vite'
import type { VitePluginAutoInjectCssOptions } from './typing'
import {
  formatComponentName,
  getAppendCode,
  getImportComponents,
} from './utils'

export interface VitePluginConfig extends Plugin {
  generateBundle: (
    options: Record<string, any>,
    bundle: Record<string, any>,
  ) => void
}

const autoInjectCssPlugin = (
  options: VitePluginAutoInjectCssOptions,
): VitePluginConfig => {
  const resolvers = options.resolvers

  return {
    name: 'vite-plugin-auto-inject-css',
    generateBundle(
      { format }: Record<string, any>,
      bundle: Record<string, string>,
    ) {
      if (!resolvers.length) return
      resolvers.forEach((resolver) => {
        Object.values(bundle).forEach((chunk: any) => {
          const importComponents = getImportComponents(resolver.name, chunk)
          if (importComponents.length) {
            if (options.baseCss === undefined || options.baseCss === true) {
              const basePath = `element-plus/theme-chalk/base.css`
              chunk.code = `${getAppendCode(format, basePath)}${chunk.code}`
            }
            importComponents.forEach((com: string) => {
              const path = resolver.inject(formatComponentName(com))
              if (typeof path === 'string') {
                chunk.code = `${getAppendCode(format, path)}${chunk.code}`
              }
            })
          }
        })
      })
    },
  }
}

export default autoInjectCssPlugin
