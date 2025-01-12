import * as path from 'path';
import {
	JsxEmit,
	ScriptTarget,
	ModuleResolutionKind,
	parseJsonConfigFileContent,
	CompilerOptions,
	findConfigFile,
	sys,
	readJsonConfigFile,
	parseJsonSourceFileConfigFileContent,
	ModuleKind
} from 'typescript';
import {Config, RawConfig, RawCompilerOptions} from './interfaces';

/**
 * Load the configuration settings.
 *
 * @param pkg - The package.json object.
 * @returns The config object.
 */
export default (pkg: {tsd?: RawConfig}, cwd: string): Config => {
	const pkgConfig = pkg.tsd || {};

	const tsConfigCompilerOptions = getOptionsFromTsConfig(cwd);
	const packageJsonCompilerOptions = parseCompilerConfigObject(
		pkgConfig.compilerOptions || {},
		cwd
	);

	return {
		directory: 'test-d',
		...pkgConfig,
		compilerOptions: {
			strict: true,
			jsx: JsxEmit.React,
			lib: ['lib.es2017.d.ts'],
			module: ModuleKind.CommonJS,
			target: ScriptTarget.ES2017,
			...tsConfigCompilerOptions,
			...packageJsonCompilerOptions,
			moduleResolution: ModuleResolutionKind.NodeJs,
			skipLibCheck: false
		}
	};
};

function getOptionsFromTsConfig(cwd: string): CompilerOptions {
	const configPath = findConfigFile(cwd, sys.fileExists);

	if (!configPath) {
		return {};
	}

	return parseJsonSourceFileConfigFileContent(
		readJsonConfigFile(configPath, sys.readFile),
		sys,
		path.basename(configPath)
	).options;
}

function parseCompilerConfigObject(compilerOptions: RawCompilerOptions, cwd: string): CompilerOptions {
	return parseJsonConfigFileContent(
		{compilerOptions: compilerOptions || {}},
		sys,
		cwd
	).options;
}
