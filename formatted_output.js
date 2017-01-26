var chalk = require('chalk')
var boldRed = chalk.bold.red
var boldGreen = chalk.bold.green

module.exports = {
  success({ taskname, stdout }) {
    var footer = '√ ' + taskname
    console.log(stdout, boldGreen(footer))
  },

  fail({ taskname, code, stderr }) {
    var header = 'x ' + taskname + ' exited with: ' + code
    console.error(boldRed(header), 'stderr:', stderr)
  }
}
