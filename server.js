var path = require('path')
var express = require('express')
var app = express()

var staticfiles = process.argv[2] === 'dev' ? '.' : 'dist'
app.use(express.static(path.resolve(staticfiles)))

app.get('/', (req, res, next) => {
  res.sendFile(path.resolve('dist/index.html'))
})

app.listen(8080, function() {
  console.log('Server started at 8080')
})
