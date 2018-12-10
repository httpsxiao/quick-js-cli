const defaultPreset = {
  babel: {}
}

const manualConfig = {
  babel: {
    files: ['babel.config.js'],
    plugins: ['@babel/cli', '@babel/core', '@babel/preset-env']
  },
  eslint: {
    files: ['.eslintrc', '.eslintignore'],
    plugins: ['eslint', 'eslint-config-standard']
  }
}

module.exports = {
  defaultPreset,
  manualConfig
}
