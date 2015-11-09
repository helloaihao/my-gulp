/**
 * gulp.src()	获取流
 * .pipe()		传导流
 * gulp.dest()	输出流
 * gulp.task()	定义任务
 * gulp.watch()	监视文件变化
 */

var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

var globs = {
	js: 'app/js/**/*.js',
	css: 'app/css/**/*.less',
	less: 'app/less/**/*.less',
	html: 'app/**/*.html',
	assets: [
		'app/fonts/**/*',
		'app/images/**/*'
	]
}

gulp.task('css', function() {
	gulp.src(globs.css)
	.pipe($.minifyCss())
	.pipe($.rename(function(path) {
		path.basename = path.basename.replace(path.basename, path.basename + '.min');
	}))
	.pipe(gulp.dest(''));
});

gulp.task('js', function() {
	gulp.src(globs.js)
	.pipe($.uglify())
	.pipe($.rename(function(path) {
		path.basename = path.basename.replace(path.basename, path.basename + '.min');
	}))
	.pipe(gulp.dest(''));
});

gulp.task('less', function() {
	gulp.src(globs.less)
	.pipe($.less())
	.pipe(gulp.dest('app/css'))
	.pipe(reload({stream: true}));
});

// 静态服务器
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: './app'
        }
    });

    gulp.watch(globs.less, ['less']);
    gulp.watch(globs.html).on('change', reload);
    gulp.watch(globs.css).on('change', reload);
});

gulp.task('default', ['less', 'serve']);