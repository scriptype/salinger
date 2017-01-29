var path = require('path')
var run = require('./lib/run')

module.exports = {
  start() {
    run('clean').then(_ => {
      run('copy_static')
      run('watch_static')
      run('handlebars', { IS_DEV: 1 })
      run('browserify').then(_ => {
        run('watchify')
        run('livereload')
        run('http-server')
      })
    })
  },

  release() {
    run('clean').then(_ => {
      run('copy_static')
      run('handlebars', { IS_DEV: 0 })
        .then(_ => run('post_html'))
      run('post_css')
      run('browserify')
        .then(_ => run('uglify'))
        .then(_ => run('http-server'))
    })
  },

  server() {
    run('http-server')
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

  handlebars(IS_DEV) {
    run('handlebars', { IS_DEV })
  },

  post_html() {
    run('post_html')
  },

  post_css() {
    run('post_css')
  },

  watch_static() {
    run('watch_static')
  },

  clean() {
    run('clean')
  }
}
