var path = require('path')
var run = require('./run')

module.exports = {
  start() {
    run('clean').then(_ => {
      run('copy_static')
      run('html')
      run('browserify').then(_ => {
        run('watchify')
        run('livereload')
        run('nodemon')
      })
    })
  },

  release() {
    run('clean').then(_ => {
      run('copy_static')
      run('post_html')
      run('post_css')
      run('browserify')
        .then(_ => run('uglify'))
        .then(_ => run('server'))
    })
  },

  js() {
    run('browserify')
  },

  watch_js() {
    run('watchify')
  },

  post_js() {
    run('uglify')
  },

  html() {
    run('html')
  },

  post_html() {
    run('post_html')
  },

  post_css() {
    run('post_css')
  },

  replace_path(SCRIPT_FILE, STYLE_FILE, LIVE_RELOAD) {
    run('replace_path', {
      SCRIPT_FILE,
      STYLE_FILE,
      LIVE_RELOAD
    })
  }
}
