var fse = require('fs-extra')
var fs = require('fs')
var Handlebars = require('handlebars')

var {
  DIST,
  HTML_INPUT,
  HTML_OUTPUT,
  JS_FULL_NAME,
  JS_MIN_NAME,
  CSS_FULL_RUNTIME,
  CSS_MIN_RUNTIME,
  IS_DEV
} = process.env

var html = fs.readFileSync(HTML_INPUT, 'utf-8')
var template = Handlebars.compile(html)

var output = template({
  SCRIPT_FILE: IS_DEV == 1 ? JS_FULL_NAME : JS_MIN_NAME,
  STYLE_FILE: IS_DEV == 1 ? CSS_FULL_RUNTIME : CSS_MIN_RUNTIME,
  LIVE_RELOAD: IS_DEV == 1
})

fse.ensureDirSync(DIST)
fs.writeFileSync(HTML_OUTPUT, output)
