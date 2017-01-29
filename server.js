var express = require('express')
var app = express()

app.use(express.static('dist'))

app.listen(8080, function() {
  console.log('Server started at 8080')
})
