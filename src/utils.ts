/*
 * @Description:
 * @Date: 2024-09-05 16:09:04
 * @LastEditTime: 2024-09-15 22:59:45
 */
import * as ElementPlus from 'element-plus'
import type { Resolver, ResolverName } from './typing'

/**
 * 大驼峰转短横线格式
 * @param v
 * @returns
 */
export const formatComponentName = (v: string): string =>
  v.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

/**
 * 获取当前chunk最新code
 * @param format 打包格式
 * @param chunkCode 代码内容
 * @param cssPath 注入的组件样式路径
 * @returns
 */
export const getNewChunkCode = (
  format: string,
  chunkCode: string,
  cssPath: string,
): string => {
  const addCode =
    format === 'es' ? `import "${cssPath}";\n` : `require("${cssPath}");`
  if (format === 'cjs') {
    return chunkCode.replace(/"use strict";/, `"use strict";${addCode}`)
  } else {
    return `${addCode}${chunkCode}`
  }
}

/**
 * 获取当前文件使用的组件
 * @param chunk
 * @param libName
 * @returns
 */
export const getImportComponents = (
  libName: ResolverName,
  chunk: Record<string, any>,
): string[] => {
  if (!chunk.code) {
    return []
  }
  const el = chunk?.importedBindings?.[libName] ?? []
  const libComponents = Object.keys(ElementPlus).filter((key) =>
    key.includes('El'),
  )

  const importComponents = el.filter((name: string) =>
    libComponents.includes(name),
  )

  if (!importComponents.length) {
    return libComponents.filter((key) => {
      const formatKey = formatComponentName(key)
      return chunk.code.includes(key) || chunk.code.includes(formatKey)
    })
  }
  return importComponents
}

/**
 * 处理解析器
 * @param options
 */
export const handleChunks = (options: {
  resolvers: Resolver[]
  format: 'cjs' | 'es'
  chunks: Record<string, any>[]
  baseCss: boolean
  getChunkCode: (code?: string, index?: number) => void
}): void => {
  const { resolvers, chunks, format, baseCss } = options
  if (!resolvers.length || !chunks.length) {
    return
  }
  resolvers.forEach((resolver) => {
    chunks.forEach((chunk: Record<string, any>, index) => {
      if (chunk.viteMetadata?.importedCss) {
        const importedCss = Array.from(chunk.viteMetadata.importedCss)
        importedCss.forEach((filename) => {
          chunk.code = getNewChunkCode(format, chunk.code, `./${filename}`)
        })
      }
      const importComponents = getImportComponents(resolver.name, chunk)
      if (!importComponents.length) {
        return
      }
      importComponents.forEach((com: string) => {
        const path = resolver.inject(formatComponentName(com))
        if (typeof path === 'string') {
          chunk.code = getNewChunkCode(format, chunk.code, path)
          options.getChunkCode(chunk.code, index)
        }
        if (Array.isArray(path) && path.length) {
          path.forEach((p) => {
            if (!baseCss || (baseCss && !resolver.base.includes(p))) {
              options.getChunkCode(
                getNewChunkCode(format, chunk.code, p),
                index,
              )
            }
          })
        }
      })
      if (baseCss === true && resolver.base[0]) {
        const code = getNewChunkCode(format, chunk.code, resolver.base[0])
        options.getChunkCode(code, index)
      }
    })
  })
}
