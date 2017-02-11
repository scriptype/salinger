var fs = require('fs')
var cp = require('child_process')
var path = require('path')
var formattedOutput = require('./formattedOutput')
var findScriptType = require('./findScriptType')
var CommonEnv = require(path.join(process.env.SALINGER_HOME_PATH, 'env'))

module.exports = function run(taskname, SpecialEnv) {
  formattedOutput.start({ taskname })

  var _env = SpecialEnv ? Object.assign({}, CommonEnv, SpecialEnv) : CommonEnv
  var env = Object.assign({}, process.env, _env)

  return execute(taskname, env)
    .then(formattedOutput.success)
    .catch(formattedOutput.fail)
}

function execute(taskname, env) {
  return new Promise((resolve, reject) => {
    var file = path.join(process.env.SALINGER_HOME_PATH, 'tasks', `${taskname}`)

    findScriptType(file).then(scriptType => {
      var command = `${scriptType.cmd} ${file}.${scriptType.ext}`
      var ps = cp.exec(command, { env })
      var stderr = ''

      ps.stdout.pipe(process.stdout)
      ps.stderr.pipe(process.stderr)
      ps.stderr.on('data', data => { stderr += data })

      ps.on('close', code => {
        if (code === 0) {
          resolve({ taskname })

        } else {
          reject({
            taskname,
            code,
            stderr
          })
        }
      })
    }).catch(e => reject({
      taskname,
      code: 1,
      stderr: e.notFound ? `Couldn't find the task "${taskname}".` : e
    }))
  })
}
