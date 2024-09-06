/*
 * @Description:
 * @Date: 2024-09-04 17:57:27
 * @LastEditTime: 2024-09-06 14:43:05
 */
import plugin from './plugin'

export * from './typing'

export * from './resolvers/index'

export const createAutoInjectCssPlugin = plugin

export default createAutoInjectCssPlugin
