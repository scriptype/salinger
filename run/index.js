var tasks = require('./tasks')

var [ task, ...restArguments ] = process.argv.slice(2)

if (task in tasks) {
  tasks[task](...restArguments)
} else {
  console.error(`The task ${task} doesn't exist.`)
  process.exit(1)
}
