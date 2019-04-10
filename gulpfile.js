(() => {
  "use strict";

  const gulp = require("gulp"),
    pug = require("gulp-pug"),
    sitemap = require("gulp-sitemap");

  function html() {
    return gulp
      .src("src/*.pug")
      .pipe(pug())
      .pipe(gulp.dest("build/"));
  }
  exports.html = html;

  function plain() {
    return gulp.src("src/*.txt").pipe(gulp.dest("build/"));
  }
  exports.plan = plain;

  /*
  function sitemap() {
    return gulp.src('build/index.html', {
      read: false
    })
    .pipe(sitemap({
      siteUrl: 'https://osborn.io'
    }))
    .pipe(gulp.dest('build/'));
  }
  exports.sitemap = sitemap
  */

  exports.build = gulp.series(html, plain /*, sitemap*/);
  exports.default = exports.build;
})();
