var path = require('path')
var command = process.argv[2]
var restArguments = process.argv.slice(2)

var root = path.join(__dirname, '..')

var execute = require('./execute')({
  BIN: path.join(root, 'node_modules', '.bin'),
  JS_OUTPUT: path.join(root, '__js_out.js'),
  JS_INPUT: path.join(root, '__js_in.js')
})

var formattedOutput = require('./formatted_output')

function run(task) {
  return execute(task)
    .then(formattedOutput.success)
    .catch(formattedOutput.fail)
}

var tasks = {
  browserify() {
    run('browserify')
      .then(_ => run('lorem'))
  }
}

if (command in tasks) {
  tasks[command](restArguments)
} else {
  console.error(`The task ${command} doesn't exist.`)
  process.exit(1)
}

module.exports = run
