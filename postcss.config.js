const plugins = {
  tailwindcss: {},
  '@csstools/postcss-oklab-function': { preserve: true },
  autoprefixer: {},
}

if (process.env.HUGO_ENVIRONMENT == 'production') {
  plugins.cssnano = {
    preset: ['default', {
      discardComments: {
        removeAll: true,
      },
    }]
  };
}

export default {
  plugins: plugins,
}
