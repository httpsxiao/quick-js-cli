#!/usr/bin/env node
const program = require('commander')
const init = require('../lib/init')

program
  .version(require('../package.json').version)
  .usage('<command> [options]')

program
  .command('init <js-name>')
  .description('create a new project powered by quick-js-cli')
  .option('-d, --default', 'Skip prompts and use default preset')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .option('-r, --registry', 'Use specified npm registry when installing dependencies')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)

    init(name, options)
  })

program.parse(process.argv)

function camelize (str) {
  return str.replace(/-(\w)/g, (_, $1) => $1 ? $1.toUpperCase() : '')
}

function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(option => {
    const key = camelize(option.long.replace(/^--/, ''))

    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}
