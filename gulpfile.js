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

//压缩CSS
gulp.task('css', function() {
	gulp.src(globs.css)
	.pipe($.minifyCss())
	.pipe($.rename({suffix: '.min'}))
	.pipe($.rev())
	.pipe(gulp.dest(web + 'css/'))
	.pipe($.rev.manifest())
	.pipe(gulp.dest(web + 'rev/css'))
});


gulp.task('js', function() {
	gulp.src(globs.js)
	.pipe($.uglify())
	.pipe($.rename({suffix: '.min'}))
	.pipe(gulp.dest(''));
});

//编译less
gulp.task('less', function() {
	gulp.src(web + 'less/main.less')
	.pipe($.less())
	.pipe(gulp.dest(web + 'css'))
	.pipe(reload({stream: true}));
});

gulp.task('rev', function(){
	gulp.src([globs.rev, web + 'index.html'])
	.pipe($.revCollector({
		replaceReved: true
	}))
	.pipe(gulp.dest(web + ''));
});

gulp.task('index', function() {
	var jsFilter = $.filter(globs.js, {restore: true});
	var cssFilter = $.filter(globs.css, {restore: true});

	//var userefAssets = $.useref.assets();

	return gulp.src(web + 'index.html')
    //.pipe(userefAssets)  // 解析html中build:{type}块，将里面引用到的文件合并传过来
    .pipe(jsFilter)
    .pipe($.uglify())             // 压缩Js
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.minifyCss())               // 压缩Css
    .pipe(cssFilter.restore)
    .pipe($.rev())                // 重命名文件
    //.pipe(userefAssets.restore())
    .pipe($.useref())
    .pipe($.revReplace())         // 重写文件名到html
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