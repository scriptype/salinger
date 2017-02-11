var cp = require('child_process')
var path = require('path')
var paths = require('./paths')
var findScriptType = require('./findScriptType')

module.exports = function execute(taskname, env) {
  return new Promise((resolve, reject) => {
    var file = path.join(paths.tasks, `${taskname}`)

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
