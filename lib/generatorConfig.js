const fs = require('fs-extra')
const path = require('path')
const { manualConfig } = require('./options')
const { writeFileTree, writeCatalogTree } = require('./utils/writeFile')
const getVersion = require('./utils/getVersion')
module.exports = class GeneratorConfig {
  constructor (
    targetDir,
    projectName,
    presets = []
  ) {
    this.targetDir = targetDir
    this.presets = presets
    this.pkgJson = {
      name: projectName,
      description: '',
      version: '1.0.0',
      scripts: {},
      repository: {
        type: 'git',
        url: ''
      },
      keywords: [],
      license: 'ISC',
      devDependencies: {}
    }
  }
  async generate () {
    Object.keys(this.presets).forEach(name => {
      if (manualConfig[name].plugins) {
        manualConfig[name].plugins.forEach(plugin => {
          this.pkgJson.devDependencies[plugin] = 'latest'
        })
      }
      if (manualConfig[name].scripts) {
        Object.assign(this.pkgJson.scripts, manualConfig[name].scripts)
      }
      if (manualConfig[name].files) {
        manualConfig[name].files.forEach(file => {
          fs.copySync(path.join(__dirname, `./modules/${file}`), `${this.targetDir}/${file}`)
        })
      }
    })

    await this.changeVersion()

    await writeFileTree(this.targetDir, {
      'package.json': JSON.stringify(this.pkgJson, null, 2)
    })

    writeCatalogTree(this.targetDir, [
      'src'
    ])
  }

  changeVersion () {
    let devDep = this.pkgJson.devDependencies
    const promises = Object.keys(devDep).map(dev => {
      return (async () => {
        devDep[dev] = await getVersion(dev)
      })()
    })
    return Promise.all(promises)
  }
}
