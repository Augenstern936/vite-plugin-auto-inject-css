/*
 * @Description:
 * @Date: 2024-09-05 16:09:04
 * @LastEditTime: 2024-09-05 16:51:18
 */

import { ResolverName } from "./typing";

/**
 * 大驼峰转短横线格式
 * @param v
 * @returns
 */
export const formatComponentName = (v: string) => v.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

/**
 * 获取要添加的代码
 * @param format
 * @param path
 * @returns
 */
export const getAppendCode = (format: "es" | "cjs", path: string) => {
	return format === "es" ? `import ${path};\n` : `require(${path});\n`;
};

/**
 * 获取当前组件路径
 * @param ResolverName
 * @param name
 * @returns
 */
export const getCurrComponentStylePath = (libName: ResolverName, name: string) => {
	return `"${libName}/theme-chalk/${name}.css"`;
};

/**
 * 获取当前文件使用的组件
 * @param chunk
 * @param libName
 * @returns
 */
export const getImportComponents = (chunk: Record<string, any>, libName: ResolverName) => {
	const el = chunk?.importedBindings?.[libName] ?? [];
	const ElementPlus = [] as any[];
	const libComponents = Object.keys(ElementPlus).filter((key) => key.includes("El"));
	const importComponents = el.filter((name: string) => libComponents.includes(name));
	return importComponents;
};
