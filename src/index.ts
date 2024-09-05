/*
 * @Description:
 * @Date: 2024-09-04 17:57:27
 * @LastEditTime: 2024-09-05 16:25:18
 */
import vitePlugiAutoInjectCss from "./plugin";

export * from "./typing";

export * from "./resolvers";

export const createAutoInjectCssPlugin = vitePlugiAutoInjectCss;

export default createAutoInjectCssPlugin;
