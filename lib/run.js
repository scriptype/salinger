var paths = require('./paths')
var CommonEnv = require(paths.env)
var formattedOutput = require('./formattedOutput')
var execute = require('./execute')

module.exports = function run(taskname, SpecialEnv) {
  formattedOutput.start({ taskname })

  var _env = SpecialEnv ? Object.assign({}, CommonEnv, SpecialEnv) : CommonEnv
  var env = Object.assign({}, process.env, _env)

  return execute(taskname, env)
    .then(formattedOutput.success)
    .catch(formattedOutput.fail)
}
