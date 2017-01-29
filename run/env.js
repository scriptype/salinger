var path = require('path')

var root = path.join(__dirname, '..')

var BIN = path.join(root, 'node_modules', '.bin')
var SRC = path.join(root, 'src')
var DIST = path.join(root, 'dist')
var RUN = path.join(root, 'run')

var STATIC_NAME = 'static'

var SERVER = path.join(root, 'server.js')

var HTML_INPUT = path.join(SRC, 'index.html')
var HTML_OUTPUT = path.join(DIST, 'index.html')

var PROD_JS_NAME = 'all.min.js'
var PROD_CSS_NAME = 'style.min.css'

var JS_INPUT_DIR = path.join(SRC, 'scripts')
var JS_INPUT = path.join(JS_INPUT_DIR, 'app.js')
var JS_OUTPUT = path.join(DIST, 'app.js')
var JS_OUTPUT_MIN = path.join(DIST, PROD_JS_NAME)

var CSS_INPUT_DIR = path.join(SRC, 'stylesheets')
var CSS_INPUT = path.join(CSS_INPUT_DIR, 'style.css')
var CSS_OUTPUT_MIN_DIR = DIST
var CSS_OUTPUT_MIN = path.join(CSS_OUTPUT_MIN_DIR, PROD_CSS_NAME)

var DEV_JS_NAME = path.relative(root, JS_OUTPUT)
var DEV_CSS_NAME = path.relative(root, CSS_INPUT)

module.exports = {
  BIN,
  SRC,
  DIST,
  RUN,

  STATIC_NAME,

  SERVER,

  HTML_INPUT,
  HTML_OUTPUT,

  PROD_JS_NAME,
  PROD_CSS_NAME,

  JS_INPUT_DIR,
  JS_INPUT,
  JS_OUTPUT,
  JS_OUTPUT_MIN,

  CSS_INPUT_DIR,
  CSS_INPUT,
  CSS_OUTPUT_MIN_DIR,
  CSS_OUTPUT_MIN,

  DEV_JS_NAME,
  DEV_CSS_NAME
}
