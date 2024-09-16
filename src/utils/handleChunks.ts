/*
 * @Description:
 * @Author: wangbowen936926
 * @Date: 2024-09-16 21:06:45
 * @LastEditTime: 2024-09-17 00:10:04
 * @FilePath: \vite-plugin-auto-inject-css\src\utils\handleChunks.ts
 */
import type { Resolver } from '../typing'
import { formatComponentName } from './common'
import getImportComponents from './getImportComponents'

/**
 * 获取当前chunk最新code
 * @param format 打包格式
 * @param chunkCode 代码内容
 * @param cssPath 注入的组件样式路径
 * @returns
 */
const getNewChunkCode = (
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
 * 处理
 * @param chunk
 * @param chunks
 * @param callback
 * @returns
 */
const handleChunkImportedCss = (
  chunk: Record<string, any>,
  chunks: { [x: string]: any }[],
  callback: (filename: string, index?: number) => void,
) => {
  if (!chunk.viteMetadata?.importedCss?.size) {
    return
  }
  const isEmptyChunk = !chunk.code
    .replace('\n', '')
    .replace(/"use strict";/, '')
  const importedCss = Array.from(chunk.viteMetadata.importedCss) as string[]
  if (isEmptyChunk) {
    const entry = chunks.find(
      (item) => item.isEntry && item.name === chunk.name,
    ) as Record<string, any>
    const index = entry.imports.findIndex(
      (name: string) => name === chunk.fileName,
    )
    const tergetFileName = entry.imports[index ? index - 1 : index]
    let tergetIndex = chunks.findIndex(
      ({ fileName }) => fileName === tergetFileName,
    )
    if (tergetIndex === -1) {
      tergetIndex = chunks.findIndex(
        ({ fileName }) => fileName === entry.fileName,
      )
    }
    importedCss.forEach((filename) => callback(filename, tergetIndex))
    return
  }
  importedCss.forEach((filename) => callback(filename))
}

/**
 * 处理解析器
 * @param options
 */
export default (options: {
  resolvers: Resolver[]
  format: 'cjs' | 'es'
  chunks: Record<string, any>[]
  baseCss: boolean
  getChunkCode: (code?: string, index?: number) => void
}): void => {
  const { resolvers, chunks, format, baseCss } = options
  if (!chunks.length) {
    return
  }
  const handleChunks = (resolver?: Resolver) => {
    chunks.forEach((chunk: Record<string, any>, index) => {
      handleChunkImportedCss(chunk, chunks, (filename, i) => {
        if (i === void 0 || i === -1) {
          chunk.code = getNewChunkCode(format, chunk.code, `./${filename}`)
          return
        }
        chunks[i]['code'] = getNewChunkCode(
          format,
          chunks[i]['code'],
          `./${filename}`,
        )
      })
      if (!resolver) return
      const importComponents = getImportComponents(resolver.name, chunk)
      if (!importComponents.length) return
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
  }
  if (resolvers && resolvers.length) {
    return resolvers.forEach(handleChunks)
  }
  handleChunks()
}
