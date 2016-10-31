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
    haml = require('gulp-ruby-haml'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    coffee = require('gulp-coffee'),
    gutil = require('gulp-util'),
    slim = require("gulp-slim"),
    del = require('del');

// Styles
gulp.task('styles', function() {
  return sass('src/styles/**/*.sass', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'));
});
// m00g: remove .pipe(notify({ message: 'Styles task complete' }


// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
});
// m00g: remove .pipe(notify({ message: 'Scripts task complete' }));

// Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Get and render all .haml files recursively
gulp.task('haml', function () {
  gulp.src('src/haml/**/*.haml')
    .pipe(haml())
    .pipe(gulp.dest('dist/'));
});

// CoffeeScript
gulp.task('coffee', function() {
  gulp.src('src/scripts/**/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('dist/scripts'));
});

// Slim - Templateing engine

gulp.task('slim', function(){
  gulp.src("src/slim/**/*.slim")
    .pipe(slim({
      pretty: true
    }))
    .pipe(gulp.dest("dist/"));
});

// Clean
gulp.task('clean', function() {
  return del(['dist/css', 'dist/scripts', 'dist/images', 'dist']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images', 'coffee', 'slim');
  gulp.run('haml');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/styles/**/*.sass', ['styles']);

  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);

  gulp.watch('src/scripts/**/*.coffee', ['coffee']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

  // Watch haml files
  gulp.watch('src/haml/**/*.haml', ['haml']);

  // Watch slim files
  gulp.watch('src/slim/**/*.slim', ['slim']);

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