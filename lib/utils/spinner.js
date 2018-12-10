const ora = require('ora')
const chalk = require('chalk')

const spinner = ora()
let lastText = null


exports.logWithSpinner = (symbol, text) => {
  if (!text) {
    text = symbol
    symbol = chalk.green('√')
  }
  if (lastText) {
    spinner.stopAndPersist({
      symbol: lastText.symbol,
      text: lastText.text
    })
  }
  spinner.text = ` ${text}`
  lastText = {
    symbol,
    text
  }
  spinner.start()
}

exports.stopSpinner = persist => {
  if (lastText && persist !== false) {
    spinner.stopAndPersist({
      symbol: lastText.symbol,
      text: lastText.text
    })
  } else {
    spinner.stop()
  }
  lastText = null
}

exports.pauseSpinner = () => {
  spinner.stop()
}

exports.resumeSpinner = () => {
  spinner.start()
}
