#!/usr/bin/env node
var path = require('path')
var { tasks: tasksPath } = require('../paths')
var tasks = require(tasksPath)

var [ task, ...restArguments ] = process.argv.slice(2)

if (task in tasks) {
  tasks[task](...restArguments)
} else {
  throw new Error(`The task ${task} doesn't exist.`)
}
