/* eslint-env node */

'use strict';

const gulp = require('gulp');

const awspublish = require('gulp-awspublish');
const cloudfront = require('gulp-cloudfront');
const pug = require('gulp-pug');
const revAll = require('gulp-rev-all');
const sitemap = require('gulp-sitemap');

// BUILD TASKS

gulp.task('html', () => {
  gulp.src('src/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('build/'));
});

gulp.task('plain', () => {
  gulp.src('src/*.txt')
    .pipe(gulp.dest('build/'));
});

gulp.task('sitemap', () => {
  gulp.src('build/index.html', {
    read: false
  })
  .pipe(sitemap({
    siteUrl: 'https://osborn.io'
  }))
  .pipe(gulp.dest('build/'));
});

// DEPLOY TASKS

gulp.task('deploy', () => {
  const publisher = awspublish.create({
    region: process.env.AWS_DEFAULT_REGION,
    params: {
      Bucket: process.env.CONTENT_BUCKET
    }
  });

  const headers = {
    // 'Cache-Control': 'max-age=315360000, no-transform, public',
    'x-amz-acl': 'private'
  };

  gulp.src('build/**')
    .pipe(revAll.revision({
      dontGlobal: [
        'ping.txt',
        'robots.txt',
        'sitemap.xml'
      ]
    }))
    .pipe(publisher.publish(headers))
    .pipe(awspublish.reporter())
    .pipe(cloudfront({
      bucket: process.env.CONTENT_BUCKET,
      distributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID
    }));
});

// LOCAL TASKS

gulp.task('build', ['html', 'plain', 'sitemap']);
gulp.task('default', ['build']);
