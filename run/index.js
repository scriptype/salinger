var tasks = require('./tasks')

var [ command, ...restArguments ] = process.argv.slice(2)

if (command in tasks) {
  tasks[command](...restArguments)
} else {
  console.error(`The task ${command} doesn't exist.`)
  process.exit(1)
}
