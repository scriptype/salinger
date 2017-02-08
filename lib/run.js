var fs = require('fs')
var cp = require('child_process')
var path = require('path')
var formattedOutput = require('./formatted_output')
var CommonEnv = require(path.join(process.env.SALINGER_HOME_PATH, 'env'))

var scripts = [
  { ext: 'sh', cmd: 'sh' },
  { ext: 'js', cmd: 'node' },
  { ext: 'py', cmd: 'python' },
  { ext: 'rb', cmd: 'ruby' },
  { ext: 'pl', cmd: 'perl' },
  { ext: 'lua', cmd: 'lua' }
]

module.exports = function run(taskname, SpecialEnv) {
  formattedOutput.start({ taskname })

  var _env = SpecialEnv ? Object.assign({}, CommonEnv, SpecialEnv) : CommonEnv
  var env = Object.assign({}, process.env, _env)

  return execute(taskname, env)
    .then(formattedOutput.success)
    .catch(formattedOutput.fail)
}

function findScript(_path, scriptIndex = 0) {
  return new Promise((resolve, reject) => {
    var script = scripts[scriptIndex]
    var name = `${_path}.${script.ext}`
    fs.stat(name, err => {
      if (err) {
        if (scripts.length > scriptIndex + 1) {
          return resolve(findScript(_path, scriptIndex + 1))
        }
        return reject({ err, notFound: true })
      }
      resolve(script)
    })
  })
}

function execute(taskname, env) {
  return new Promise((resolve, reject) => {
    var file = path.join(process.env.SALINGER_HOME_PATH, 'tasks', `${taskname}`)

    findScript(file).then(script => {
      var command = `${script.cmd} ${file}.${script.ext}`
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
