/* eslint-env node */

'use strict';

const gulp = require('gulp');

const pug = require('gulp-pug');
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

// LOCAL TASKS

gulp.task('build', ['html', 'plain', 'sitemap']);
gulp.task('default', ['build']);
