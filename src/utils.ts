/*
 * @Description:
 * @Date: 2024-09-05 16:09:04
 * @LastEditTime: 2024-09-09 11:20:20
 */
import * as ElementPlus from 'element-plus'
import type { ResolverName } from './typing'

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
