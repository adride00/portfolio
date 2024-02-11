module.exports = {
	// ...
	extends: [
		// ...
		'plugin:astro/recommended',
	],
	// ...
	overrides: [
		{
			files: ['*.astro'],
			// ...
			processor: 'astro/client-side-ts', // <- Uses the "client-side-ts" processor.
			rules: {
				// ...
				'no-undef': 'on', // <- Disable the "no-undef" rule.
				semi: 'off', // <- Disable the "semi" rule.
				'prettier/prettier': 'error', // <- Enable the "prettier/prettier" rule.
			},
		},
		// ...
	],
}
