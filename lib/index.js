var run = require('./run')
var { tasks: tasksPath } = require('../lib/paths')
var tasks = require(tasksPath)

module.exports = {
  run,
  tasks
}
