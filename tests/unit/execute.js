var fs = require('fs')
var test = require('tape')
var path = require('path')

// Take prerequisite actions before requiring 'paths' and 'execute' modules
var homePath = process.hrtime().join('-')
process.env.SALINGER_HOME_PATH = homePath

var paths = require('../../lib/paths')
var execute = require('../../lib/execute')

fs.mkdirSync(homePath)
fs.mkdirSync(paths.tasks)

test('execute', t => {
  Promise
    .all([
      executeTask(t),
      executeTask(t, { shouldScriptFail: true }),
      rejectOnNotFound(t)
    ])
    .then(_ => {
      fs.rmdirSync(paths.tasks)
      fs.rmdirSync(homePath)
      t.end()
    })
})

function executeTask(t, { shouldScriptFail = false } = {}) {
  var caseDescription = shouldScriptFail ?
    'Rejects if the executed script exits with non-zero code' :
    'Executes a properly located and supported script'

  return new Promise((resolve, reject) => {
    var taskName = process.hrtime().join('_')

    var env = {
      HELLO: `test environment variable value for ${taskName}`
    }

    var errorThrownInScript = 'This error is thrown on purpose, nothing went wrong'

    var fileContent = `
      if (${shouldScriptFail}) {
        throw new Error('${errorThrownInScript}')
      } else {
        require('assert')(process.env.HELLO === '${env.HELLO}')
      }
    `

    var filePath = path.join(paths.tasks, taskName + '.js')
    fs.writeFileSync(filePath, fileContent)

    resolve(execute(taskName, env)
      .then(({ taskname }) => {
        if (shouldScriptFail) {
          t.fail(caseDescription)

        } else {
          t.equal(taskname, taskName,
            'Supplies the correct task name on success')

          t.pass('Passing environment variables works')
          t.pass(caseDescription)
        }
      })
      .catch(({ taskname, code, stderr }) => {
        if (shouldScriptFail) {
          t.equal(taskname, taskName,
            'Supplies the correct task name on failure')

          t.equal(code, 1,
            'Exited with the code 1')

          t.assert(stderr.match(errorThrownInScript),
            'Stderr contains the error thrown on purpose')

          t.pass(caseDescription)

        } else {
          if (/AssertionError/.test(stderr)) {
            t.fail('Passing environment variables works')
          }
          t.fail(caseDescription)
        }
      })
      .then(_ => fs.unlinkSync(filePath)))
  })
}

function rejectOnNotFound(t) {
  var caseDescription = 'Rejects if no such task is found in the tasks folder'

  return new Promise((resolve, reject) => {
    resolve(execute(process.hrtime().join(''), {})
      .then(({ taskname }) => {
        t.fail(caseDescription)
      })
      .catch(({ taskname, code, stderr }) => {
        t.pass(caseDescription)
      }))
  })
}
