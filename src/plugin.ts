/*
 * @Description:
 * @Date: 2024-09-05 14:51:42
 * @LastEditTime: 2024-10-15 13:48:19
 */

import type { ConfigEnv, Plugin, UserConfig } from 'vite'
import type { VitePluginAutoInjectCssOptions } from './typing'
import { getImportComponents, handleChunks } from './utils/index'

export interface VitePluginConfig extends Plugin {
  generateBundle: (
    options: Record<string, any>,
    bundle: Record<string, any>,
  ) => void
}

const autoInjectCssPlugin = (
  options: VitePluginAutoInjectCssOptions,
): VitePluginConfig => {
  const resolvers = options.resolvers ?? []
  const baseCss = options.baseCss ?? true
  let config: UserConfig = {}
  let env: Partial<ConfigEnv> = {}
  return {
    name: 'vite-plugin-auto-inject-css',
    config(viteConfig, envConfig) {
      config = viteConfig
      env = envConfig
    },
    transform(code, id) {
      if (
        id.includes('node_modules') ||
        id.includes('workspace') ||
        !resolvers.length
      ) {
        return code
      }
      const importComponents = getImportComponents('element-plus', { code })
      if (!importComponents.length) {
        return code
      }
      const { command } = env
      const mode = options.mode || 'dependencies'
      if (
        command === 'serve' ||
        (command === 'build' && mode === 'dependencies')
      ) {
        handleChunks({
          resolvers,
          format: 'es',
          baseCss,
          chunks: [{ code }],
          getChunkCode: (newCode) => {
            code = newCode as string
          },
        })
      }
      return code
    },
    generateBundle(
      { format }: Record<string, any>,
      bundle: Record<string, { [x: string]: any }>,
    ) {
      if (options.mode !== 'peerDependencies') return
      const chunks = Object.values(bundle)
      handleChunks({
        resolvers,
        format,
        baseCss,
        chunks,
        getChunkCode: (newCode, index) => {
          chunks[index as number].code = newCode as string
        },
      })
    },
  }
}

export default autoInjectCssPlugin
