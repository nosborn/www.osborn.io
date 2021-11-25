(() => {
  'use strict'

  const gulp = require('gulp')
  const pug = require('gulp-pug')

  function html () {
    return gulp
      .src('src/*.pug')
      .pipe(pug())
      .pipe(gulp.dest('dist/'))
  }
  exports.html = html

  function plain () {
    return gulp.src('src/**/!(*.pug)', { dot: true }).pipe(gulp.dest('dist/'))
  }
  exports.plain = plain

  exports.build = gulp.series(html, plain)
  exports.default = exports.build
})()
