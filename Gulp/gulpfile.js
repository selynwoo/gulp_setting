"use strict";
var gulp = require('gulp'),
    htmlhint = require('gulp-htmlhint'),
    csslint = require('gulp-csslint'),
    cssreporter = require('gulp-csslint-report'),
    concatcss = require('gulp-concat-css'),
    csslintstyle = require('csslint-stylish'),
    uglifycss = require('gulp-uglifycss'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    gulpif = require('gulp-if'),
    watch = require('gulp-watch'),
    del = require('del'),
    connect = require('gulp-connect'),
    fileinclude = require('gulp-file-include'),
    webserver = require('gulp-webserver'),
    open = require('gulp-open'),
    config = require('./config.json');


//html 인클루드 > 검사
gulp.task('html', function() {
    gulp
        .src([config.input + config.path.html.src, config.includePath + config.path.include.srcNo])
        .pipe(fileinclude(config.includeOption))
        .pipe(gulp.dest(config.output + config.path.html.dest))
        .pipe(gulpif(config.lint, htmlhint(config.htmlLintRules)))
        .pipe(gulpif(config.lint, htmlhint.reporter('htmlhint-stylish')));
});

//css 검사 > 병합 > 압축
gulp.task('styles', function(){
    gulp
        .src(config.input + config.path.css.src)
        .pipe(gulpif(config.lint, csslint(config.cssLintRules)))
        .pipe(gulpif(config.lint, csslint.formatter(csslintstyle)))
        .pipe(gulpif(config.concat, concatcss(config.path.css.filename)))
        .pipe(gulpif(config.rename, gulp.dest(config.output + config.path.css.dest)))
        .pipe(gulpif(config.uglify, uglifycss()))
        .pipe(gulpif(config.rename, rename({ suffix : '.min' })))
        .pipe(gulp.dest(config.output + config.path.css.dest));
});

//js 검사 > 병합 > 압축
gulp.task('scripts', function(){
    gulp
        .src(config.input + config.path.js.src)
        .pipe(gulpif(config.lint, jshint()))
        .pipe(gulpif(config.lint, jshint.reporter('jshint-stylish')))
        .pipe(gulpif(config.concat, concat(config.path.js.filename)))
        .pipe(gulpif(config.rename, gulp.dest(config.output + config.path.js.dest)))
        .pipe(gulpif(config.uglify, uglify(config.jsUglifyOptions)))
        .pipe(gulpif(config.rename, rename({ suffix: '.min' })))
        .pipe(gulp.dest(config.output + config.path.js.dest));
});

//관찰
gulp.task('watch', ['clean'], function(){
    gulp.watch(config.input + config.path.html.src, ['html']);
    gulp.watch(config.input + config.path.css.srcWatch, ['styles']);
    gulp.watch(config.input + config.path.js.src, ['scripts']);
});

//제거
gulp.task('clean', function(){
    del(config.devSrc + config.path.clean.src);
});

//기본 & 관찰
gulp.task('default', ['clean', 'html', 'styles', 'scripts', 'watch']);

//웹서버 > 브라우저 오픈
gulp.task('server', ['watch'], function () {
    var options = {
        uri: 'http://localhost:'+config.port+'/html',
        app: config.browser
    };
    gulp
        .src(config.output)
        .pipe(webserver({livereload : config.livereload}))
        .pipe(open(options));
});









