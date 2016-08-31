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

var angularFilesort  = require('gulp-angular-filesort');


var bower_folder = './bower_components/'

var cssFiles = [
bower_folder + 'bootstrap/dist/css/bootstrap-theme.css',
bower_folder + 'bootstrap/dist/css/bootstrap.css',
bower_folder + 'font-awesome/css/font-awesome.css',
bower_folder + 'angular-tooltips/dist/angular-tooltips.css'


]

var ngFiles = [
  bower_folder + 'jquery/dist/jquery.js',
  bower_folder + 'angular/angular.js',
  bower_folder + 'angular-animate/angular-animate.js',
  bower_folder + 'angular-ui-router/release/angular-ui-router.js',
  bower_folder + 'angular-tooltips/dist/angular-tooltips.js'
]


gulp.task('clean-all', function () {
    return gulp.src('dist/*', {read: false})
        .pipe(clean());
});

gulp.task('clean-fonts', function () {
    return gulp.src('dist/fonts/*', {read: false})
        .pipe(clean());
});

gulp.task('clean-js', function () {
    return gulp.src('dist/app/*', {read: false})
        .pipe(clean());
});

gulp.task('clean-css', function () {
    return gulp.src('dist/css/*', {read: false})
        .pipe(clean());
});

gulp.task('clean-lib', function () {
    return gulp.src('dist/lib/*', {read: false})
        .pipe(clean());
});


gulp.task('fonts',function(){

return gulp.src(['./bower_components/bootstrap/fonts/*.{eot,svg,ttf,woff,woff2}', './bower_components/font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}'])
    .pipe(flatten())
    .pipe(gulp.dest('dist/fonts/'));

});

gulp.task('lib-css', function() {
    //var filterJS = gulpFilter('**/*.js', { restore: true });
    //var filterCss = gulpFilter('**/*.css',{restore: true });

    return gulp.src(cssFiles)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('dist/lib/'))
});


gulp.task('lib-js', function() {
    //var filterJS = gulpFilter('**/*.js', { restore: true });
    //var filterCss = gulpFilter('**/*.css',{restore: true });

    return gulp.src(ngFiles)
    //.pipe(filterJS)
    //.pipe(angularFilesort())
    .pipe(concat('vendor.js'))
   // .pipe(uglify())
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
    .pipe(angularFilesort())
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('app.js')) //crea el app.js
    .pipe(gulp.dest('dist/app/')) //lo copia a dist/app
    .pipe(rename({suffix: '.min'})) //lo renombra
    .pipe(uglify()) //lo uglifyca
    .pipe(gulp.dest('dist/app/')) // lo copia a dist/app
    .pipe(browserSync.reload({stream:true}))
});


gulp.task('compile-all', ['html','bower','css','js']);


gulp.task('default', ['browser-sync'], function(){
  gulp.watch("src/css/**/*.scss", ['css']);
  gulp.watch("src/app/**/*.js", ['js']);
  gulp.watch("src/*.html", ['html','bs-reload']);
});