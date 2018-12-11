const manualConfig = {
  babel: {
    files: ['babel.config.js'],
    plugins: ['@babel/cli', '@babel/core', '@babel/preset-env']
  },
  eslint: {
    files: ['.eslintrc', '.eslintignore'],
    plugins: ['eslint', 'eslint-config-standard'],
    scripts: {
      lint: 'eslint --ext .js src'
    }
  },
  webpack: {
    files: ['webpack.config.js', 'index.html'],
    plugins: ['webpack', 'webpack-cli', 'babel-loader', 'file-loader', 'html-loader', 'html-webpack-plugin', 'path', 'webpack-dev-server'],
    scripts: {
      dev: 'webpack-dev-server --mode development --config webpack.config.js',
      build: 'webpack --mode production --config webpack.config.js'
    }
  }
}

const defaultPreset = {
  babel: manualConfig.babel
}

module.exports = {
  manualConfig,
  defaultPreset
}
