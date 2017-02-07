var path = require('path')
var fs = require('fs')

var [
  packageJSON,
  ...scripts
] = process.argv.slice(2)

var packageJSONPath = path.join(process.cwd(), packageJSON)
var pJSON = require(packageJSONPath)

var scriptKeys = scripts.filter((s, i) => i % 2 === 0)
var scriptValues = scripts.filter((s, i) => i % 2)

pJSON.scripts = scriptKeys.reduce((prev, curr, index) => {
  return Object.assign({}, prev, {
    [curr]: scriptValues[index]
  })
}, {})

fs.writeFileSync(packageJSONPath, JSON.stringify(pJSON, null, 2))
