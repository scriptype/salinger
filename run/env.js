var path = require('path')

var root = path.join(__dirname, '..')

var BIN = path.join(root, 'node_modules', '.bin')
var SRC = path.join(root, 'src')
var DIST = path.join(root, 'dist')
var RUN = path.join(root, 'run')

var SERVER = path.join(root, 'server.js')

var HTML_INPUT = path.join(SRC, 'index.html')
var HTML_OUTPUT = path.join(DIST, 'index.html')

var JS_FULL_NAME = 'app.js'
var JS_MIN_NAME = 'app.min.js'
var JS_INPUT_PATH = path.join(SRC, 'scripts', JS_FULL_NAME)
var JS_OUTPUT_PATH = path.join(DIST, JS_FULL_NAME)
var JS_MIN_PATH = path.join(DIST, JS_MIN_NAME)

var STATIC_NAME = 'static'

var CSS_FULL_NAME = 'style.css'
var CSS_MIN_NAME = 'style.min.css'
var CSS_DIR = path.join(DIST, STATIC_NAME, 'stylesheets')
var CSS_INPUT_PATH = path.join(CSS_DIR, CSS_FULL_NAME)
var CSS_MIN_PATH = path.join(CSS_DIR, CSS_MIN_NAME)
var CSS_FULL_RUNTIME = path.relative(DIST, CSS_INPUT_PATH)
var CSS_MIN_RUNTIME = path.relative(DIST, CSS_MIN_PATH)

module.exports = {
  BIN,
  SRC,
  DIST,
  RUN,

  STATIC_NAME,

  SERVER,

  HTML_INPUT,
  HTML_OUTPUT,

  JS_FULL_NAME,
  JS_MIN_NAME,
  JS_INPUT_PATH,
  JS_OUTPUT_PATH,
  JS_MIN_PATH,

  CSS_FULL_NAME,
  CSS_MIN_NAME,
  CSS_DIR,
  CSS_INPUT_PATH,
  CSS_MIN_PATH,
  CSS_FULL_RUNTIME,
  CSS_MIN_RUNTIME
}
