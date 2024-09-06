/*
 * @Description:
 * @Date: 2024-09-04 17:57:27
 * @LastEditTime: 2024-09-06 11:17:15
 */
import vitePlugiAutoInjectCss from './plugin'

export * from './typing'

export * from './resolvers/index'

export const createAutoInjectCssPlugin = vitePlugiAutoInjectCss

export default createAutoInjectCssPlugin
