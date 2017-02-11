var path = require('path')

module.exports = {
  env: path.join(process.env.SALINGER_HOME_PATH, 'env'),
  tasks: path.join(process.env.SALINGER_HOME_PATH, 'tasks')
}
