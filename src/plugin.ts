/*
 * @Description:
 * @Date: 2024-09-05 14:51:42
 * @LastEditTime: 2024-09-05 16:50:28
 */

import { formatComponentName, getAppendCode, getCurrComponentStylePath, getImportComponents } from "./utils";

export default (options: Record<string, any>) => {
	return {
		name: "vite-plugin-auto-inject-css",
		generateBundle({ format }: Record<string, any>, bundle: Record<string, string>) {
			const keys = Object.keys(bundle);
			Object.values(bundle).forEach((chunk: any, index) => {
				const importComponents = getImportComponents(chunk, options.libName);
				if (importComponents.length) {
					if (options.baseStyle === true) {
						(bundle[keys[index]] as any).code =
							getAppendCode(format, getCurrComponentStylePath(options.libName, "base")) + chunk.code;
					}
					importComponents.forEach((com: string) => {
						const path = getCurrComponentStylePath(options.libName, formatComponentName(com));
						(bundle[keys[index]] as any).code = getAppendCode(format, path) + chunk.code;
					});
				}
			});
		},
	};
};
