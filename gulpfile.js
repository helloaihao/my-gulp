/**
 * gulp.src()	获取流
 * .pipe()		传导流
 * gulp.dest()	输出流
 * gulp.task()	定义任务
 * gulp.watch()	监视文件变化
 */

var gulp        = require('gulp');
var $           = require('gulp-load-plugins')({
	pattern: ['gulp-*','del']
});
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;


var web = './LinkEOL.Website/';

//路径
var globs = {
	js: web + 'script/**/*.js',
	css: web + 'css/**/*.css',
	less: web + 'less/**/*.less',
	html: web + '**/*.html',
	rev: web + 'rev/**/*.json',
	assets: [
		web + 'fonts/**/*',
		web + 'images/**/*'
	]
}

//编译less
gulp.task('less', function() {
	gulp.src(web + 'less/main.less')
	.pipe($.less())
	.pipe(gulp.dest(web + 'css'))
	.pipe(reload({stream: true}));
});

//资源文件
gulp.task('assets', function(){
	gulp.src(globs.assets[0])
	.pipe(gulp.dest(web + 'dist/fonts'));

	gulp.src(globs.assets[1])
	.pipe($.imagemin())
	.pipe(gulp.dest(web + 'dist/images'));

	gulp.src(web + 'script/header-footer.js')
	.pipe(gulp.dest(web + 'dist/script'));
});

//清理
gulp.task('clean', function(done){
	$.del(web + 'dist', done);
});

//压缩打包
gulp.task('dist', ['assets'], function() {
	gulp.src(globs.html)
    .pipe($.useref({ searchPath: 'LinkEOL.Website' })) 
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss()))
    .pipe($.if('*.js', $.rev()))
    .pipe($.if('*.css', $.rev()))
    .pipe($.revReplace())
    .pipe(gulp.dest(web + 'dist'));
});

// 静态服务器
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: web
        }
    });
    gulp.watch(globs.less, ['less']);
    gulp.watch(globs.html).on('change', reload);
    gulp.watch(globs.css).on('change', reload);
});

gulp.task('default', ['less', 'serve']);