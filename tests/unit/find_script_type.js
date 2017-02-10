var test = require('tape')
var fs = require('fs')
var supportedScriptTypes = require('../../lib/supported_script_types')
var findScriptType = require('../../lib/find_script_type')

test('findScriptType', t => {
  Promise
    .all([
      resolveSupportedType(t),
      rejectUnsupportedType(t),
      rejectNoSuchFile(t)
    ])
    .then(_ => t.end())
})

// When a script file is found with a supported extension, resolve the
// script type ({ cmd: 'commandName', ext: '.cmdextension' })
function resolveSupportedType(t) {
  return new Promise(resolve => {
    var randomScriptType = supportedScriptTypes[Math.floor(Math.random() * supportedScriptTypes.length)]
    var dummyFileName = `test-file-${process.hrtime().join('-')}`
    fs.writeFile(`${dummyFileName}.${randomScriptType.ext}`, '', err => {
      if (err) {
        throw err
      }
      var caseDescription = 'Should resolve the type, if there is a file with a supported extension.'
      resolve(findScriptType(dummyFileName)
        .then(scriptType => {
          t.deepEqual(scriptType, randomScriptType, caseDescription)
        })
        .catch(err => {
          t.fail(caseDescription, err)
        })
        .then(_ => {
          fs.unlinkSync(`${dummyFileName}.${randomScriptType.ext}`)
        }))
    })
  })
}

// Even if there's a file with the supplied name, if its extension isn't
// supported, reject with notFound flag set to true.
function rejectUnsupportedType(t) {
  return new Promise(resolve => {
    var nonSupportedType = process.hrtime().join('')
    var dummyFileName = `test-file-${process.hrtime().join('-')}`
    fs.writeFile(`${dummyFileName}.${nonSupportedType}`, '', err => {
      if (err) {
        throw err
      }
      var caseDescription = 'Should reject if no file is found with a supported extension.'
      resolve(findScriptType(dummyFileName)
        .then(scriptType => {
          t.fail(caseDescription)
        })
        .catch(err => {
          t.assert(err.notFound, caseDescription)
        })
        .then(_ => {
          fs.unlinkSync(`${dummyFileName}.${nonSupportedType}`)
        }))
    })
  })
}

// There's no such file with that path, reject with notFound: true
function rejectNoSuchFile(t) {
  return new Promise(resolve => {
    var dummyFileName = `test-file-${process.hrtime().join('-')}`
    var caseDescription = 'Should reject if no file with the given path is found.'
    resolve(findScriptType(dummyFileName)
      .then(scriptType => {
        t.fail(caseDescription)
      })
      .catch(err => {
        t.assert(err.notFound, caseDescription)
      }))
  })
}
