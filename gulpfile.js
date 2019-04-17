(() => {
  "use strict";

  const gulp = require("gulp"),
    pug = require("gulp-pug");

  function html() {
    return gulp
      .src("src/*.pug")
      .pipe(pug())
      .pipe(gulp.dest("build/"));
  }
  exports.html = html;

  function plain() {
    return gulp.src("src/**/*.txt", { dot: true }).pipe(gulp.dest("build/"));
  }
  exports.plan = plain;

  exports.build = gulp.series(html, plain);
  exports.default = exports.build;
})();
