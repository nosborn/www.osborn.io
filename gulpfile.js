(() => {
  "use strict";

  const gulp = require("gulp"),
    awspublish = require("gulp-awspublish"),
    pug = require("gulp-pug");

  function html() {
    return gulp
      .src("src/*.pug")
      .pipe(pug())
      .pipe(gulp.dest("dist/"));
  }
  exports.html = html;

  function plain() {
    return gulp.src("src/**/!(*.pug)", { dot: true }).pipe(gulp.dest("dist/"));
  }
  exports.plain = plain;

  function publish() {
    var headers = {
      "x-amz-acl": "private"
    };
    var publisher = awspublish.create({
      params: {
        Bucket: "osborn.io"
      },
      region: "ap-southeast-1"
    });
    return gulp
      .src("dist/**/*", { dot: true })
      .pipe(publisher.publish(headers))
      .pipe(publisher.sync())
      .pipe(awspublish.reporter());
  }
  exports.publish = publish;

  exports.build = gulp.series(html, plain);
  exports.default = exports.build;
  exports.deploy = gulp.series(publish);
})();
