var path = require('path')

var configKey = process.env['npm_package_config_salinger_home']
var homePath = path.resolve(process.cwd(), configKey || 'scripts')

module.exports = {
  env: path.join(homePath, 'env'),
  tasks: path.join(homePath, 'tasks')
}
