"use strict";
var gulp = require('gulp'),
	csslint = require('gulp-csslint'),
	cssreporter = require('gulp-csslint-report'),
	concatcss = require('gulp-concat-css'),
	uglifycss = require('gulp-uglifycss'),
	jshint = require('gulp-jshint'),
	//reporter = require('reporter'),
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
    webReporter = require('gulp-hint-web-reporter'),
	config = require('./config.json');

//기본 & 관찰
gulp.task('default', ['clean', 'styles', 'scripts', 'fileinclude', 'watch']);

//제거
gulp.task('clean', function(){
	del(config.devSrc + config.path.clean.src);
});

//css 검사 > 병합 > 압축
gulp.task('styles', function(){
	gulp
		.src(config.input + config.path.css.src)
		.pipe(gulpif(config.lint, csslint(config.cssLintRules)))
		.pipe(gulpif(config.lint, cssreporter(config.cssReporterOption)))
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
	gulp.watch(config.input + config.path.css.srcWatch, ['styles']);
	gulp.watch(config.path.js.src, ['scripts']);
	gulp.watch(config.path.include.src, ['fileinclude']);
});

//인클루드
gulp.task('fileinclude', function(){
	gulp
		.src(config.devSrc + config.path.include.src)
		.pipe(fileinclude(config.includeOption))
		.pipe(gulp.dest(config.devSrc + config.path.include.dest));
});

//웹서버
gulp.task('server', ['watch'], function () {
	var options = {
		uri: "http://localhost:8000/html/index.html",
		app: 'chrome'
	};
	return gulp.src("app/dist/")
		.pipe(webserver({
			livereload : true
		}))
		.pipe(open(options));
});


