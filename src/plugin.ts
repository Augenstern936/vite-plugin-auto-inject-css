/*
 * @Description:
 * @Date: 2024-09-05 14:51:42
 * @LastEditTime: 2024-09-09 11:52:46
 */

import type { ConfigEnv, Plugin, UserConfig } from 'vite'
import type { ResolverName, VitePluginAutoInjectCssOptions } from './typing'
import {
  formatComponentName,
  getImportComponents,
  getNewChunkCode,
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
  const style: Partial<Record<ResolverName, boolean>> = {}
  let config: UserConfig = {}
  let env: Partial<ConfigEnv> = {}
  return {
    name: 'vite-plugin-auto-inject-css',
    config(viteConfig, envConfig) {
      config = viteConfig
      env = envConfig
    },
    transform(code, id) {
      if (id.includes('node_modules') || !resolvers.length) {
        return code
      }
      const importComponents = getImportComponents('element-plus', { code })
      if (!importComponents.length) {
        return code
      }
      const { command } = env
      const { mode = 'dependencies' } = options
      if (
        command === 'serve' ||
        (command === 'build' && mode === 'dependencies')
      ) {
        resolvers.forEach((resolver) => {
          style[resolver.name] = code.includes(resolver.style)
          if (!style[resolver.name]) return
          importComponents.forEach((com: string) => {
            const path = resolver.inject(formatComponentName(com))
            if (typeof path === 'string') {
              code = getNewChunkCode('es', code, path)
            }
          })
          if (options.baseCss === void 0 || options.baseCss === true) {
            code = getNewChunkCode('es', code, resolver.base)
          }
        })
      }
      return code
    },
    generateBundle(
      { format }: Record<string, any>,
      bundle: Record<string, string>,
    ) {
      if (options.mode !== 'peerDependencies' || !resolvers.length) return
      resolvers.forEach((resolver) => {
        Object.values(bundle).forEach((chunk: any) => {
          const importComponents = getImportComponents(resolver.name, chunk)
          if (!importComponents.length) {
            return
          }
          importComponents.forEach((com: string) => {
            const path = resolver.inject(formatComponentName(com))
            if (typeof path === 'string') {
              chunk.code = getNewChunkCode(format, chunk.code, path)
            }
          })
          if (options.baseCss === void 0 || options.baseCss === true) {
            chunk.code = getNewChunkCode(format, chunk.code, resolver.base)
          }
        })
      })
    },
  }
}

export default autoInjectCssPlugin
