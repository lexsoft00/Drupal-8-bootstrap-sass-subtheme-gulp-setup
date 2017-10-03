/rest//*global -$ */
'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Error notifications
var reportError = function(error) {
  $.notify({
    title: 'Gulp Task Error',
    message: 'Check the console.'
  }).write(error);
  console.log(error.toString());
  this.emit('end');
}
var config = {
    bootstrapDir: 'bootstrap',

};

// Sass processing
gulp.task('sass', function() {
  return gulp.src('scss/**/*.scss')
    // Convert sass into css.pipe(sass({outputStyle: 'compressed'}))
    .pipe($.sass({
      outputStyle: 'compressed', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: [config.bootstrapDir + 'assets/stylesheets/bootstrap']
    }))
    // Show errors
    .on('error', reportError)
    // Autoprefix properties
    .pipe($.autoprefixer({
      browsers: ['last 2 versions']
    }))
    // Save css
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe($.notify({
      title: "SASS Compiled",
      message: "Your CSS files are ready sir.",
      onLast: true
    }));
});

// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('js/**/*.js')
        .pipe(gulp.dest('js'));
});

// Optimize Images
gulp.task('images', function() {
  return gulp.src('images/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{
        cleanupIDs: false
      }]
    }))
    .pipe(gulp.dest('images'));
});

// JS hint
gulp.task('jshint', function() {
  return gulp.src('js/app.js')
    .pipe(reload({
      stream: true,
      once: true
    }))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.notify({
      title: "JS Hint",
      message: "JS Hint Done",
      onLast: true
    }));
});

// Beautify JS
gulp.task('beautify', function() {
  gulp.src('js/_custom.js')
    .pipe($.beautify({indentSize: 2}))
    .pipe(gulp.dest('scripts'))
    .pipe($.notify({
      title: "JS Beautified",
      message: "JS files in the theme have been beautified.",
      onLast: true
    }))
    .pipe(gulp.dest('js/app.min.js'));
});

// Compress JS
gulp.task('compress', function() {
  return gulp.src('js/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest('js/min'))
    .pipe($.notify({
      title: "JS Minified",
      message: "JS files ",
      onLast: true
    }));
});

//* BrowserSync
//gulp.task('browser-sync', function() {
  //watch files
//  var files = [
//    'styles/main.css',
//    'js/**/*.js',
//    'images/**/*',
//    'templates/**/*.twig'
//  ];
//  browserSync.init({
//    proxy: "test-d8.o5245189844.v1.s8.lon.boa.io" ,
//    online: true
//  });
  //initialize browsersync

//});

// Default task to be run with `gulp`
gulp.task('default', ['sass', 'js', 'jshint', 'compress'], function() {
  
  gulp.watch("scss/**/*.scss", ['sass']);
  gulp.watch("js/**/*.js", ['js', 'jshint', 'compress']);
  gulp.watch("templates/*.twig");
  gulp.watch("**/*.yml");
  gulp.watch("**/*.theme");
  gulp.watch("src/*.php");
});