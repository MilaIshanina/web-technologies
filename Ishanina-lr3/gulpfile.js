const gulp = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const pug = require('gulp-pug');
const del = require('del');

gulp.task('make_js', function(){
    return gulp.src('./public/scripts/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./public/gulp_scripts/'))
});

gulp.task('make_css', function(){
    return gulp.src('./public/stylesheets/*.less')
        .pipe(less())
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest('./public/stylesheets/'))
});


gulp.task("default",gulp.parallel((gulp.series('make_js')),(gulp.series('make_css'))));