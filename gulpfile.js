'use strict';

var gulp = require('gulp');

var awspublish = require('gulp-awspublish');
var cloudfront = require('gulp-cloudfront');
var pug = require('gulp-pug');
var revAll = require('gulp-rev-all');
var sitemap = require('gulp-sitemap');

gulp.task('html', function() {
  return gulp.src('src/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('build/'))
});

gulp.task('plain', function() {
  return gulp.src('src/*.txt')
    .pipe(gulp.dest('build/'))
});

gulp.task('sitemap', function () {
  gulp.src('build/index.html', {
    read: false
  })
  .pipe(sitemap({
    siteUrl: 'https://osborn.io'
  }))
  .pipe(gulp.dest('build'));
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
        'robots.txt',
        'sitemap.xml'
      ]
    }))
    //.pipe(awspublish.gzip())
    .pipe(publisher.publish(headers, {noAcl: true}))
    .pipe(awspublish.reporter())
    .pipe(cloudfront({
      bucket: process.env.CONTENT_BUCKET,
      distributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID
    }))
    .pipe(publisher.sync());
});

gulp.task('build', ['html', 'plain', 'sitemap']);
gulp.task('default', ['build']);
