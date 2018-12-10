const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const { clearConsole, log } = require('./utils/logger')
const Creator = require('./creator')
const { manualConfig } = require('./options')

async function init (name, options) {
  const cwd = options.cwd || process.cwd()
  const inCurrent = name === '.'
  const projectName = inCurrent ? path.relative('../', cwd) : name
  const targetDir = path.resolve(cwd, name || '.')

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      // await clearConsole()
      if (inCurrent) {
        const { inCurOK } = await inquirer.prompt([
          {
            name: 'inCurOK',
            type: 'confirm',
            message: 'Generate project in current directory?'
          }
        ])
        if (!inCurOK) {
          return
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action`,
            choices: [
              { name: 'Overwrite', value: 'overwrite' },
              { name: 'Merge', value: 'merge' },
              { name: 'Cancel', value: false }
            ]
          }
        ])
        if (!action) {
          return
        } else if (action === 'overwrite') {
          log(`\nRemoving ${chalk.cyan(targetDir)}...`)
          await fs.remove(targetDir)
        }
      }
    }
  }
  
  const { confs } = await inquirer.prompt([
    {
      name: 'confs',
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: Object.keys(manualConfig).map(name => {
        return {
          name: name,
          value: name
        }
      }),
      pageSize: 10
    }
  ])
  options.preset = {}
  confs.forEach(name => {
    options.preset[name] = manualConfig[name]
  })

  const creator = new Creator(projectName, targetDir)
  await creator.create(options)
}

module.exports = (...args) => {
  return init(...args).catch(err => {
    process.stderr.write(err)
    process.exit(1)
  })
}
