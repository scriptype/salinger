#!/usr/bin/env node
var path = require('path')
var configKey = 'npm_package_config_salinger_tasks'
var homePath = path.resolve(process.cwd(), process.env[configKey] || 'run')
process.env.SALINGER_HOME_PATH = homePath

var tasks = require(path.join(homePath, 'tasks'))

var [ task, ...restArguments ] = process.argv.slice(2)

if (task in tasks) {
  tasks[task](...restArguments)
} else {
  console.error(`The task ${task} doesn't exist.`)
  process.exit(1)
}
