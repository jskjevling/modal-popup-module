var gulp = require('gulp');
var sass = require('gulp-sass');
var changed = require('gulp-changed');
var sassdoc = require('sassdoc');
var connect = require('gulp-connect');

gulp.task('styles', function() {
	gulp.src('sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./css/'))
		.pipe(connect.reload());
});

//html change
gulp.task('htmlChange', function() {
	gulp.src('./*.html')
		.pipe(changed('/**/*.html'))
		.pipe(connect.reload());
});

//js change
gulp.task('jsChange', function() {
	gulp.src('script/*.js')
		.pipe(changed('/**/*.js'))
		.pipe(connect.reload());
});

//watch task
gulp.task('watch', function() {
	gulp.watch('sass/**/*.scss', ['styles']);
	gulp.watch('./*.html', ['htmlChange']);
	gulp.watch('script/*.js', ['jsChange']);
});

//connect server
gulp.task('connect', function(){
	connect.server({
		livereload: true
	});
});

//default

gulp.task('default', ['watch','connect']);