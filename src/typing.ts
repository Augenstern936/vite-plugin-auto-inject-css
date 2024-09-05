/*
 * @Description:
 * @Date: 2024-09-05 14:26:22
 * @LastEditTime: 2024-09-05 16:40:53
 */
export type ResolverName = "element-ui" | "element-plus";

export interface ResolverOptions {
	inject: (componentName?: string) => string | string[];
}
