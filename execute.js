var cp = require('child_process')
var path = require('path')

module.exports = function (env) {
  return execute.bind(null, env)
}

function execute(env, filename) {
  return new Promise((resolve, reject) => {
    var file = path.join(__dirname, 'tasks', `${filename}.sh`)
    var command = 'sh ' + file
    var ps = cp.exec(command, { env })
    var stderr = ''

    ps.stdout.pipe(process.stdout)
    ps.stderr.pipe(process.stderr)
    ps.stderr.on('data', data => { stderr += data })

    ps.on('close', code => {
      if (code == 0) {
        resolve({
          taskname: filename
        })

      } else {
        reject({
          taskname: filename,
          code,
          stderr
        })
      }
    })
  })
}
