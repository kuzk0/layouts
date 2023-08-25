'use strict';

const _browserSync = require('browser-sync').create(); // Сервер
const _delete = require('del'); // Удаление папок и файлов
const _gulp = require('gulp'); // Gulp
const _gulpRename = require('gulp-rename'); // Переименование папок и файлов
const _gulpPlumber = require('gulp-plumber'); // Проверка CSS на валидность
const _gulpSourcemaps = require('gulp-sourcemaps'); // Ресурсные карты
const _gulpSass = require('gulp-sass')(require('sass')); // Sass
const _gulpAutoprefixer = require('gulp-autoprefixer'); // Автопрефиксер
const _gulpCSSOptimizing = require('gulp-csso'); // Сжатие CSS
const _gulpUglify = require('gulp-uglify-es').default; // Сжатие JS
const _gulpConcat = require('gulp-concat'); // Сшивание файлов в один


_gulp.task('style-min', function () {
  return _gulp.src('../static/styles/uni.scss')
    .pipe(_gulpPlumber())
    .pipe(_gulpSourcemaps.init())
    .pipe(_gulpSass())
    .pipe(_gulpAutoprefixer())
    .pipe(_gulpCSSOptimizing())
    .pipe(_gulpRename('style.min.css'))
    .pipe(_gulpSourcemaps.write('.'))
    .pipe(_gulp.dest('../../public'))
    .pipe(_browserSync.stream());
});

_gulp.task('scripts-min-preload', function () {
  return _gulp.src(
      [
        '../static/scripts/global/**/*.js'
      ], {
        allowEmpty: true
      }
    )
    .pipe(_gulpSourcemaps.init())
    .pipe(_gulpUglify())
    .pipe(_gulpConcat('scripts-preload.min.js'))
    .pipe(_gulpSourcemaps.write('.'))
    .pipe(_gulp.dest('../../public'))
    .pipe(_browserSync.stream());
});

_gulp.task('scripts-min', function () {
  return _gulp.src(
      [
        '../static/scripts/parts/swiper-6.5.7.js',
        '../static/scripts/parts/**/*.js'
      ], {
        allowEmpty: true
      }
    )
    .pipe(_gulpSourcemaps.init())
    .pipe(_gulpUglify())
    .pipe(_gulpConcat('scripts.min.js'))
    .pipe(_gulpSourcemaps.write('.'))
    .pipe(_gulp.dest('../../public'))
    .pipe(_browserSync.stream());
});

_gulp.task('clean', function () {
  return _delete('../../public', {force: true});
});

_gulp.task('build', _gulp.series('clean', 'style-min', 'scripts-min-preload', 'scripts-min'));

_gulp.task('refresh', function (done) {
  _browserSync.reload();
  done();
});

_gulp.task('server', function () {
  _browserSync.init({
    server: {
      baseDir: '../../', 
      index: 'index.html' 
    },
    notify: false,
    open: true,
    cors: true,
    ui: false
  })

  _gulp.watch('../static/styles/**/*.{css,scss}', _gulp.series('style-min', 'refresh'));
  _gulp.watch('../static/scripts/**/*.js', _gulp.series('scripts-min-preload', 'scripts-min', 'refresh'));
  _gulp.watch('../../**/*.{html,pug,php}', _gulp.series('refresh'));
})

_gulp.task('dev', _gulp.series('build', 'server'));