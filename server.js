var path = require('path')
var express = require('express')

var args = process.argv.slice(2)
var env = args[0]

var app = express()

app.use(express.static(path.resolve(env === 'dev' ? '.' : 'dist')))

app.get('/', (req, res, next) => {
  res.sendFile(path.resolve('dist/index.html'))
})

app.listen(8080, function() {
  console.log('Server started at 8080')
})
