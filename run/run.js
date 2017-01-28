var cp = require('child_process')
var path = require('path')
var CommonEnv = require('./env')
var formattedOutput = require('./formatted_output')

module.exports = function run(taskname, SpecialEnv) {
  formattedOutput.start({ taskname })

  var env = SpecialEnv ? Object.assign({}, CommonEnv, SpecialEnv) : CommonEnv

  return execute(taskname, env)
    .then(formattedOutput.success)
    .catch(formattedOutput.fail)
}

function execute(taskname, env) {
  return new Promise((resolve, reject) => {
    var file = path.join(__dirname, 'tasks', `${taskname}.sh`)
    var command = 'sh ' + file
    var ps = cp.exec(command, { env })
    var stderr = ''

    ps.stdout.pipe(process.stdout)
    ps.stderr.pipe(process.stderr)
    ps.stderr.on('data', data => { stderr += data })

    ps.on('close', code => {
      if (code == 0) {
        resolve({ taskname })

      } else {
        reject({
          taskname,
          code,
          stderr
        })
      }
    })
  })
}
