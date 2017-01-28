var path = require('path')
var [ command, ...restArguments ] = process.argv.slice(2)

var root = path.join(__dirname, '..')

var execute = require('./execute')({
  BIN: path.join(root, 'node_modules', '.bin'),
  JS_INPUT: path.join(root, 'src', 'app.js'),
  JS_OUTPUT: path.join(root, 'dist', 'bundle.js')
})

var formattedOutput = require('./formatted_output')

function run(task) {
  formattedOutput.start({ taskname: task })
  return execute(task)
    .then(formattedOutput.success)
    .catch(formattedOutput.fail)
}

var tasks = {
  js() {
    run('browserify')
  },
  watch_js() {
    run('watchify')
  }
}

if (command in tasks) {
  tasks[command](restArguments)
} else {
  console.error(`The task ${command} doesn't exist.`)
  process.exit(1)
}

module.exports = run
