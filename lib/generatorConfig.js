module.exports = class GeneratorConfig {
  constructor (targetDir, {
    pkgJson = {},
    preset = []
  } = {}) {
    this.targetDir = targetDir
    this.pkgJson = Object.assign({}, pkg)
    this.presets = presets
  }

  async generate () {
  }
}
