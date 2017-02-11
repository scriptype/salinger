var fs = require('fs')
var supportedScriptTypes = require('./supportedScriptTypes')

module.exports = function findScriptType(filePath, scriptTypeIndex = 0) {
  return new Promise((resolve, reject) => {
    var scriptType = supportedScriptTypes[scriptTypeIndex]
    var name = `${filePath}.${scriptType.ext}`
    fs.stat(name, err => {
      if (err) {
        if (supportedScriptTypes.length > scriptTypeIndex + 1) {
          return resolve(findScriptType(filePath, scriptTypeIndex + 1))
        }
        return reject({ err, notFound: true })
      }
      resolve(scriptType)
    })
  })
}
