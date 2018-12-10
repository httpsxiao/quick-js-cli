const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const execa = require('execa')
const { defaultPreset, manualConfig } = require('./options')
const { log } = require('./utils/logger')
const { logWithSpinner, stopSpinner } = require('./utils/spinner')
const { writeFileTree } = require('./utils/writeFile')
// const GeneratorConfig = require('./generatorConfig')

module.exports = class Creator {
  constructor (projectName, targetDir) {
    this.projectName = projectName
    this.targetDir = targetDir
  }
  async create (options = {}) {
    let preset = null
    const packageManager = 'npm'
    const targetDir = this.targetDir

    if (!preset) {
      if (options.default) {
        preset = defaultPreset
      } else if (options.preset) {
        preset = options.preset
      }
    }

    logWithSpinner(`✨`, `Creating project in ${chalk.yellow(targetDir)}.`)

    const pkgJson = {
      name: this.projectName,
      version: '1.0.0',
      devDependencies: {
      }
    }

    Object.keys(preset).forEach(name => {
      if (manualConfig[name].plugins) {
        manualConfig[name].plugins.forEach(plugin => {
          pkgJson.devDependencies[plugin] = 'latest'
        })
      }
      if (manualConfig[name].files) {
        manualConfig[name].files.forEach(file => {
          fs.copySync(path.join(__dirname, `./modules/${file}`), `${targetDir}/${file}`)
        })
      }
    })

    await writeFileTree(targetDir, {
      'package.json': JSON.stringify(pkgJson, null, 2)
    })

    logWithSpinner(`🗃`, `Initializing git repository...`)
    await this.run('git init')

    stopSpinner()
    log(`⚙  Installing CLI plugins. This might take a while...`)
    log()

    await this.installDeps(targetDir, packageManager, options.registry)

    log(`🎉  Successfully created project ${chalk.yellow(this.projectName)}.`)
    log()
  }
  run (command, args) {
    if (!args) { [command, ...args] = command.split(/\s+/) }
    return execa(command, args, { cwd: this.targetDir })
  }
  async installDeps (targetDir, command, registry) {
    const args = []
    if (command === 'npm') {
      args.push('install', '--loglevel', 'error')
    } else {
      throw new Error(`Unknow package manager: ${command}`)
    }

    if (registry) {
      args.push(`--registry=${registry}`)
    }

    await this.run(command, args)
  }
}
