'use strict';

var gulp = require('gulp');

var awspublish = require('gulp-awspublish');
var cloudfront = require('gulp-cloudfront');
var pug = require('gulp-pug');
var revAll = require('gulp-rev-all');

gulp.task('html', function() {
  return gulp.src('src/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('build/'))
});

gulp.task('text', function() {
  return gulp.src('src/*.txt')
    .pipe(gulp.dest('build/'))
});

gulp.task('deploy', function () {
  const publisher = awspublish.create({
    params: {
      Bucket: process.env.CONTENT_BUCKET
    }
  });

  const headers = {
    // 'Cache-Control': 'max-age=315360000, no-transform, public'
  };

  return gulp.src('build/**')
    .pipe(revAll.revision({
      dontGlobal: [
        'ping.txt',
        'robots.txt'
      ]
    }))
    //.pipe(awspublish.gzip())
    .pipe(publisher.publish(headers, {noAcl: true}))
    .pipe(awspublish.reporter({states: ['create', 'update', 'delete']}))
    .pipe(cloudfront({
      bucket: process.env.CONTENT_BUCKET,
      distributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID
    }));
    //.pipe(publisher.sync());
});

gulp.task('build', ['html', 'text']);
gulp.task('default', ['build']);
