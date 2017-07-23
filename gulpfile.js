const gulp = require('gulp');
const minifyCSS = require('gulp-csso');
const purifyCSS = require('gulp-purifycss');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const bootstrapPath = 'node_modules/bootstrap/dist';
const publicPath = 'public';

gulp.task('css', () => {
  return gulp.src([
    `${bootstrapPath}/css/bootstrap.css`,
    'node_modules/font-awesome/css/font-awesome.css'
  ])
    .pipe(purifyCSS([
      'layouts/**/*.html',
      `${bootstrapPath}/js/bootstrap.js`,
    ]))
    .pipe(concat('vendor.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(`${publicPath}/css`));
});

gulp.task('js', () => {
  return gulp.src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/tether/dist/js/tether.js',
    `${bootstrapPath}/js/bootstrap.js`,
  ])
  .pipe(concat('vendor.js'))
  .pipe(uglify())
  .pipe(gulp.dest(`${publicPath}/js`));
});

gulp.task('copy-fonts', () => {
  return gulp.src('node_modules/font-awesome/fonts/**/*.*').
    pipe(gulp.dest(`${publicPath}/fonts`));
});

gulp.task('default', ['css', 'js', 'copy-fonts']);
