var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
//var autoprefixer = require('gulp-autoprefixer');
var postcss = require('gulp-postcss');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var autoprefixer = require('autoprefixer');

var mainBowerFiles = require('main-bower-files');
var clean = require('gulp-clean');

var gulpFilter = require('gulp-filter');

var flatten = require('gulp-flatten');


gulp.task('clean', function () {
    return gulp.src('dist/*', {read: false})
        .pipe(clean());
});

gulp.task('fonts',function(){

return gulp.src(['./bower_components/bootstrap/fonts/*.{eot,svg,ttf,woff,woff2}', './bower_components/font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}'])
    .pipe(flatten())
    .pipe(gulp.dest('dist/fonts/'));

});

gulp.task('bower', function() {
    var filterJS = gulpFilter('**/*.js', { restore: true });
    var filterCss = gulpFilter('**/*.css',{restore: true });
    return gulp.src(mainBowerFiles(
        {
          overrides:  {
            bootstrap: {
              main: [
                    './dist/js/bootstrap.js',
                    './dist/css/bootstrap.css',
                    './dist/css/bootstrap-theme.css'
              ]
            }
          }
        }
      ))
    .pipe(filterJS)
    .pipe(concat('vendor.js'))
   // .pipe(uglify())
    .pipe(filterJS.restore)
    .pipe(filterCss)
    .pipe(concat('vendor.css'))
    .pipe(filterCss.restore)
    .pipe(gulp.dest('dist/lib/'))
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./dist/"
    }
  });
});

gulp.task('html', function(){
  gulp.src('src/*.html')
  .pipe(gulp.dest('dist/'))
});


gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('css', function(){
  gulp.src(['src/scss/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(gulp.dest('dist/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('js', function(){
  return gulp.src('src/app/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/app/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/app/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('default', ['browser-sync'], function(){
  gulp.watch("src/css/**/*.scss", ['css']);
  gulp.watch("src/app/**/*.js", ['js']);
  gulp.watch("src/*.html", ['bs-reload']);
});