var chalk = require('chalk')
var boldRed = chalk.bold.red
var boldGreen = chalk.bold.green
var boldCyan = chalk.bold.cyan

module.exports = {
  start({ taskname }) {
    console.log(boldCyan('-> ' + taskname))
  },

  success({ taskname }) {
    console.log(boldGreen('√ ' + taskname))
  },

  fail({ taskname, code, stderr }) {
    var header = 'x ' + taskname + ' exited with: ' + code
    console.error(boldRed(header))
  }
}
