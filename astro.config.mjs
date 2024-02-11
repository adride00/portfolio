import { defineConfig } from 'astro/config'

/**
 * The function takes a filename as input and returns a modified version of the filename with certain
 * characters replaced or removed.
 * @param filename - The `filename` parameter is a string that represents the name of a file.
 * @returns a string with the filename converted to a JavaScript file format.
 */
function changeAstroComponentEntryFilenameToJs(filename) {
	const name = filename.split('.')[0]
	let sanitized = name
	if (/[A-Z]/.test(name)) {
		sanitized = name
			.replace(/([A-Z])/g, '-$1')
			.toLowerCase()
			.slice(1)
	}
	sanitized = sanitized.replace(/ /g, '-')
	return `${sanitized}.js`
}

/**
 * The function `clearPaths` filters out paths that include 'node_modules' or '\x00' and returns an
 * array of the last part of each path, without any query parameters.
 * @param paths - An array of file paths.
 * @returns an array of file paths after filtering out paths that include 'node_modules' or '\x00'
 * (null character) and then extracting the file name from each path.
 */
function clearPaths(paths) {
	return paths
		.filter((path) => !path.includes('node_modules') && !path.includes('\x00'))
		.map((path) => path.split('/').pop().split('?')[0])
}

/**
 * The function `extractTsFilePath` takes an array of module IDs, clears the paths, and returns the
 * first path that includes ".ts" after replacing ".ts" with ".js".
 * @param modulesIds - An array of module IDs.
 * @returns the path of the first module that includes the '.ts' extension, with the '.ts' extension
 * replaced by '.js'. If no such module is found, it returns null.
 */
function extractTsFilePath(modulesIds) {
	let path = clearPaths(modulesIds).find((path) => path.includes('.ts'))

	if (path) {
		path = path.replace('.ts', '.js')
		return path
	}

	return null
}

/**
 * The function `extractAstroFilePath` takes an array of module IDs, clears the paths, and returns the
 * first path that includes '.astro' after changing the filename to '.js'.
 * @param modulesIds - The parameter `modulesIds` is an array of module IDs.
 * @returns The function `extractAstroFilePath` returns the path of the first module in the
 * `modulesIds` array that includes the '.astro' extension, after applying some transformations to the
 * path. If no such path is found, it returns `null`.
 */
function extractAstroFilePath(modulesIds) {
	let path = clearPaths(modulesIds).find((path) => path.includes('.astro'))

	if (path) {
		path = changeAstroComponentEntryFilenameToJs(path)
		return path
	}

	return null
}

/**
 * The function `extractJsFilePath` takes an array of module IDs, clears the paths, and returns the
 * first path that includes the ".js" extension, or null if no such path is found.
 * @param modulesIds - An array of module IDs.
 * @returns The function `extractJsFilePath` returns the path of the first module ID that includes the
 * '.js' extension, or `null` if no such path is found.
 */
function extractJsFilePath(modulesIds) {
	const path = clearPaths(modulesIds).find((path) => path.includes('.js'))

	if (path) {
		return path
	}

	return null
}

// https://astro.build/config
export default defineConfig({
	site: 'https://voydeya-hcp-full.dev-jdoutstanding.com/',
	// Modify as you need
	compressHTML: false,
	build: {
		format: 'directory',
		assets: 'assets',
		inlineStylesheets: 'never',
	},
	vite: {
		css: {
			devSourcemap: true,
		},
		build: {
			cssCodeSplit: true,
			cssMinify: false,
			minify: false,
			rollupOptions: {
				output: {
					/**
					 * Function that generates the file name for assets.
					 *
					 * To set up a custom name for a styles files, you should add
					 * a regular comment as follow:
					 *
					 * {outputFileName:<file-name>}
					 *
					 * When <file-name> can be replaced for the name we want the final css file has
					 *
					 * @param {Object} asset - The object representing the asset.
					 * @returns {string} - The generated file name.
					 */
					assetFileNames: (asset) => {
						// Regular expression to search for custom file name
						const regex = /\{outputFileName:(.*?)\}/
						const name = asset.name
						const source = asset.source
						const ext = name.substring(name.lastIndexOf('.'), name.length)
						const hasCustomFilename = source.match(regex) // Check if the asset has a custom file name

						switch (ext) {
							case '.css':
								if (hasCustomFilename && hasCustomFilename.length > 0) {
									let customFilename = hasCustomFilename[1]
									customFilename = customFilename.replace(/ /g, '-')
									return `assets/css/${customFilename}${ext}`
								} else {
									return `assets/css/${name}`
								}
							case '.js':
								return `assets/js/${name}`
							default:
								return name
						}
					},
					/**
					 * Function that generates the file name for entry files.
					 *
					 * @param {Object} entry - The object representing the entry file.
					 * @returns {string} - The generated file name.
					 */

					entryFileNames: (entry) => {
						let name = '[name].[hash].js'
						const moduleIds = entry.moduleIds
						if (moduleIds && moduleIds.length > 0) {
							name =
								extractTsFilePath(moduleIds) ||
								extractAstroFilePath(moduleIds) ||
								extractJsFilePath(moduleIds) ||
								'[name].[hash].js'
						}
						return `assets/js/${name}`
					},

					// chunkFileNames: 'assets/js/[name].[hash].js'
				},
			},
		},
	},
})
