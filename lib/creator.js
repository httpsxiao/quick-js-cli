const chalk = require('chalk')
const execa = require('execa')
const { defaultPreset } = require('./options')
const { log } = require('./utils/logger')
const { logWithSpinner, stopSpinner } = require('./utils/spinner')
const GeneratorConfig = require('./generatorConfig')

module.exports = class Creator {
  constructor (projectName, targetDir) {
    this.projectName = projectName
    this.targetDir = targetDir
  }
  async create (options = {}) {
    let presets = null
    const packageManager = 'npm'
    const targetDir = this.targetDir

    if (!presets) {
      if (options.default) {
        presets = defaultPreset
      } else if (options.presets) {
        presets = options.presets
      }
    }

    logWithSpinner(`✨`, `Creating project in ${chalk.yellow(targetDir)}.`)

    const generatorConfig = new GeneratorConfig(targetDir, this.projectName, presets)
    await generatorConfig.generate()

    logWithSpinner(`🗃`, `Initializing git repository...`)

    await this.run('git init')

    stopSpinner()
    logWithSpinner(`⚙  Installing CLI plugins. This might take a while...`)

    await this.installDeps(targetDir, packageManager, options.registry)

    stopSpinner()
    log(`🎉  Successfully created project ${chalk.yellow(this.projectName)}.`)
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
