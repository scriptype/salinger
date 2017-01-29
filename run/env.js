const path = require('path')

const root = path.join(__dirname, '..')

const BIN = path.join(root, 'node_modules', '.bin')
const SRC = path.join(root, 'src')
const DIST = path.join(root, 'dist')

const HTML_INPUT = path.join(SRC, 'index.html')
const HTML_OUTPUT = path.join(DIST, 'index.html')

const JS_FULL_NAME = 'app.js'
const JS_MIN_NAME = 'app.min.js'
const JS_INPUT_PATH = path.join(SRC, 'scripts', JS_FULL_NAME)
const JS_OUTPUT_PATH = path.join(DIST, JS_FULL_NAME)
const JS_MIN_PATH = path.join(DIST, JS_MIN_NAME)

const STATIC_NAME = 'static'

const CSS_FULL_NAME = 'style.css'
const CSS_MIN_NAME = 'style.min.css'
const CSS_DIR = path.join(DIST, STATIC_NAME, 'stylesheets')
const CSS_INPUT_PATH = path.join(CSS_DIR, CSS_FULL_NAME)
const CSS_MIN_PATH = path.join(CSS_DIR, CSS_MIN_NAME)
const CSS_FULL_RUNTIME = path.relative(DIST, CSS_INPUT_PATH)
const CSS_MIN_RUNTIME = path.relative(DIST, CSS_MIN_PATH)

module.exports = {
  BIN,
  SRC,
  DIST,

  HTML_INPUT,
  HTML_OUTPUT,

  JS_FULL_NAME,
  JS_MIN_NAME,
  JS_INPUT_PATH,
  JS_OUTPUT_PATH,
  JS_MIN_PATH,

  STATIC_NAME,

  CSS_FULL_NAME,
  CSS_MIN_NAME,
  CSS_DIR,
  CSS_INPUT_PATH,
  CSS_MIN_PATH,
  CSS_FULL_RUNTIME,
  CSS_MIN_RUNTIME
}
