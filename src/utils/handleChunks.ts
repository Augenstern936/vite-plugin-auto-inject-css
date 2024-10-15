/*
 * @Description:
 * @Author: wangbowen936926
 * @Date: 2024-09-16 21:06:45
 * @LastEditTime: 2024-10-15 11:08:41
 * @FilePath: \vite-plugin-auto-inject-css\src\utils\handleChunks.ts
 */
import path from 'path'
import type { Resolver } from '../typing'
import { formatComponentName } from './common'
import getImportComponents from './getImportComponents'

const toRelativePath = (importedCss: string, fileName) => {
  const fileNameSplit = fileName.split('/')
  if (!fileNameSplit.length || fileNameSplit.length === 1) {
    return `./${importedCss}`
  }
  let relativePath = ''
  fileNameSplit.forEach((_, i) => {
    if (i < fileNameSplit.length - 1) {
      relativePath += '../'
    } else {
      relativePath += importedCss
    }
  })
  return relativePath
}

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
  const isHas = chunkCode.includes(addCode)
  if (isHas) {
    return chunkCode
  }
  if (format === 'es') {
    return `${addCode}${chunkCode}`
  }
  return chunkCode.replace(/"use strict";/, `"use strict";${addCode}`)
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
    let entry: any = chunks.find(
      (item) => item.isEntry && item.name === chunk.name,
    )
    let tergetIndex = -1
    if (!entry) {
      tergetIndex = chunks.findIndex((item) =>
        item.imports.includes(chunk.fileName),
      )
    }
    if (!entry && tergetIndex === -1) {
      entry = chunks.find((item) => item.isEntry)
      const index = entry.imports.findIndex((name) => name === chunk.fileName)
      const tergetFileName = entry.imports[index ? index - 1 : index]
      tergetIndex = chunks.findIndex(
        ({ fileName }) => fileName === tergetFileName,
      )
      if (tergetIndex === -1) {
        tergetIndex = chunks.findIndex(
          ({ fileName }) => fileName === entry.fileName,
        )
      }
    }
    importedCss.forEach((filename) => callback(filename, tergetIndex))
    return
  }
  const name = chunk.fileName
  if (name.includes('css') || name.includes('scss') || name.includes('less')) {
    const index = chunks.findIndex((item) => item.imports.includes(name))
    importedCss.forEach((filename) => callback(filename, index))
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
      handleChunkImportedCss(chunk, chunks, (imported, i) => {
        if (i === void 0 || i === -1) {
          chunk.code = getNewChunkCode(
            format,
            chunk.code,
            toRelativePath(imported, chunk.fileName),
          )
          return
        }
        const targetFile1 = path.relative(
          path.dirname(chunks[i]['facadeModuleId']),
          chunk.facadeModuleId,
        )
        const targetFile2 = path.relative(
          chunk.facadeModuleId,
          chunks[i]['facadeModuleId'],
        )
        chunks[i]['code'] = getNewChunkCode(
          format,
          chunks[i]['code'],
          toRelativePath(imported, chunks[i]['fileName']),
        )
      })
      if (!resolver) return
      const importComponents = getImportComponents(resolver.name, chunk)
      if (!importComponents.length) return
      importComponents.forEach((com: string) => {
        const injectPath = resolver.inject(formatComponentName(com))
        if (typeof injectPath === 'string') {
          chunk.code = getNewChunkCode(format, chunk.code, injectPath)
          options.getChunkCode(chunk.code, index)
        }
        if (Array.isArray(injectPath) && injectPath.length) {
          injectPath.forEach((p) => {
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
