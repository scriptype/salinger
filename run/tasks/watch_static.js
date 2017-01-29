var fse = require('fs-extra')
var path = require('path')
var watch = require('watch')

var {
  SRC,
  DIST,
  STATIC_NAME
} = process.env

var srcStatic = path.join(SRC, STATIC_NAME)
var distStatic = path.join(DIST, STATIC_NAME)

watch.watchTree(srcStatic, (f, curr, prev) => {
  if (typeof f == "object" && prev === null && curr === null) {
    // Finished walking the tree
    return
  }

  var targetPath = f.replace(srcStatic, distStatic)

  if (curr.nlink === 0) {
    console.log('static: remove', targetPath)
    fse.remove(targetPath, err => { if (err) console.error(err) })

  } else {
    console.log('static: upsert', f)
    fse.copy(f, targetPath, err => { if (err) console.error(err) })
  }
})
