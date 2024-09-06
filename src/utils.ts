/*
 * @Description:
 * @Date: 2024-09-05 16:09:04
 * @LastEditTime: 2024-09-06 18:20:43
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
 * 获取要添加的代码
 * @param format
 * @param path
 * @returns
 */
export const getAppendCode = (format: 'es' | 'cjs', path: string): string => {
  return format === 'es' ? `import "${path}";\n` : `require("${path}");\n`
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
  return importComponents
}
