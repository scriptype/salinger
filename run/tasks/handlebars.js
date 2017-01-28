var fs = require('fs')
var Handlebars = require('handlebars')

var {
  HTML_INPUT, HTML_OUTPUT,
  DEV_JS_NAME, DEV_CSS_NAME,
  PROD_JS_NAME, PROD_CSS_NAME,
  IS_DEV
} = process.env

var html = fs.readFileSync(HTML_INPUT, 'utf-8')
var template = Handlebars.compile(html)

var output = template({
  SCRIPT_FILE: IS_DEV == 1 ? DEV_JS_NAME : PROD_JS_NAME,
  STYLE_FILE: IS_DEV == 1 ? DEV_CSS_NAME : PROD_CSS_NAME,
  LIVE_RELOAD: IS_DEV == 1
})

fs.writeFileSync(HTML_OUTPUT, output)
