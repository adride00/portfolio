export default {
	singleQuote: true,
	semi: false,
	tabWidth: 2, // Puedes eliminar esta línea si decides usar pestañas
	useTabs: true, // Puedes eliminar esta línea si decides usar espacios
	plugins: ['prettier-plugin-astro'],
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
	],
}
