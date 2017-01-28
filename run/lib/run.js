var cp = require('child_process')
var path = require('path')
var CommonEnv = require('../env')
var formattedOutput = require('./formatted_output')

var scripts = [
  {
    ext: 'sh',
    cmd: 'sh',
    error: /No such file or directory/i
  },
  {
    ext: 'js',
    cmd: 'node',
    error: /Cannot find module/i
  }
]

module.exports = function run(taskname, SpecialEnv) {
  formattedOutput.start({ taskname })

  var env = SpecialEnv ? Object.assign({}, CommonEnv, SpecialEnv) : CommonEnv

  return execute(taskname, env)
    .then(formattedOutput.success)
    .catch(formattedOutput.fail)
}

function execute(taskname, env, scriptIndex = 0) {
  return new Promise((resolve, reject) => {
    var script = scripts[scriptIndex]
    var file = path.join(__dirname, '..', 'tasks', `${taskname}.${script.ext}`)
    var command = script.cmd + ' '+ file
    var ps = cp.exec(command, { env })
    var stderr = ''

    ps.stdout.pipe(process.stdout)
    ps.stderr.pipe(process.stderr)
    ps.stderr.on('data', data => { stderr += data })

    ps.on('close', code => {
      if (code == 0) {
        resolve({ taskname })

      } else if (script.error.test(stderr) && scripts.length > scriptIndex + 1) {
        resolve(execute(taskname, env, scriptIndex + 1))

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
