import * as ElementPlus from 'element-plus'
import type { ResolverName } from '../typing'
import { formatComponentName } from './common'

/**
 * 获取当前文件使用的组件
 * @param chunk
 * @param libName
 * @returns
 */
export default (
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
