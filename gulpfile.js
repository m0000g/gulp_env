/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    haml = require('gulp-haml'),
    del = require('del');

// Styles
gulp.task('styles', function() {
  return sass('src/styles/main.sass', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Get and render all .haml files recursively
gulp.task('haml', function () {
  gulp.src('src/views/**/*.haml', {read: false}).
    pipe(haml().on('error', function(e) { console.log(e.message); })).
    pipe(gulp.dest('dist/'));
});

// Compile Haml into HTML with double quotes around attributes
// Same as haml -q
gulp.task('haml-double-quote', function() {
  gulp.src('src/views/**/*.haml', {read: false}).
       pipe(haml({doubleQuote: true})).
       pipe(gulp.dest('dist/'));
});

// Clean
gulp.task('clean', function() {
  return del(['dist/styles', 'dist/scripts', 'dist/images']);
  // Todo: Clean also haml files?
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images', 'haml');
  gulp.run('haml');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/styles/**/*.sass', ['styles']);

  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

  // Watch views files
  gulp.watch('src/views/**/*.haml', ['haml']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  // gulp.watch(['dist/**']).on('change', livereload.changed);
  gulp.watch(['dist/**']).on('change', function(file)
    {
      livereload.changed(file.path);
      console.log("Refresh Browser")
    }
    );

});