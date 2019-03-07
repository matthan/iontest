/**
 * Gulp.js configuration
 */
'use strict';

const
	gulp = require('gulp'), // Gulp
    util = require('gulp-util'), // Gulp utility plugin, enabling messages, errors and allows the ability to pass in flags
	twig = require('gulp-twig'), // Twig compilation
    sass = require('gulp-sass'), // Gulp plugin for Sass compilation
    sassGlob = require('gulp-sass-glob'), // Glob Sass imports
    sassLint = require('gulp-sass-lint'), // Sass linting
    autoprefixer = require('gulp-autoprefixer'), // Autoprefixing magic
    jsLint = require('gulp-jshint'), // JS linting
    phpLint = require('gulp-phplint'), // PHP linting
    browserSync = require('browser-sync').create(),
    del = require('del'), // Delete files and folders using globs
	ext_replace = require('gulp-ext-replace'), // Renames files (E.g. style.css -> style.min.css)
    sourcemaps = require('gulp-sourcemaps'), // Maps code in a compressed file back to it's original position in a source file
    notify = require('gulp-notify'), // Sends message notification to you
	config = require('./manifest.json');

/**
 * Fonts
 */
// `gulp clean-fonts`
gulp.task('clean-fonts', () => {
    return del(['dist/fonts/*'], {
        force: true
    });
});

// `gulp build-fonts` - Build everything in the fonts directory
gulp.task('build-fonts', () => {
    return gulp.src(['src/fonts/**/*'])
        .pipe(gulp.dest('dist/fonts/'));
});

/**
 * Images
 */
// `gulp clean-images`
gulp.task('clean-images', () => {
    return del(['dist/images/*'], {
        force: true
    });
});

// `gulp build-fonts` - Build everything in the images directory
gulp.task('build-images', () => {
    return gulp.src(['src/images/**/*'])
        .pipe(gulp.dest('dist/images/'));
});


/**
 * Sass/CSS
 */
// `gulp build-sass` - Build everything in the sass directory
gulp.task('build-sass', () => {
    return gulp.src(['src/sass/style.scss'])
        .pipe(sassGlob())
        .pipe(sass().on('error', notify.onError('<%= error.message %>')))
        .pipe(autoprefixer({
            // https://css-tricks.com/css-grid-in-ie-css-grid-and-the-new-autoprefixer/
            grid: true,
            browsers: ['>1%']
        }))
        .pipe(sourcemaps.write('.')) // Write to same directory where CSS will live (allows for the proper reference to Sourcemap in CSS file!)
        .pipe(gulp.dest('dist/css/'))
        .pipe(browserSync.stream({ match: '**/*.css' }));
});

// `gulp sass-lint`
gulp.task('sass-lint', () => {
    return gulp.src(['src/sass/**/*.s+(a|c)ss'])
        .pipe(sassLint({ configFile: 'sass-lint.yml' }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError());
});

// `gulp build-css`
gulp.task('build-css', ['build-sass'], () => {
    return gulp.src(['src/css/**/*.css'])
        .pipe(gulp.dest('dist/css/'))
        .pipe(browserSync.stream({ match: '**/*.css' }));
});

/**
 * Javascript
 */
// `gulp clean-js`
gulp.task('clean-js', () => {
    return del(['dist/js/*'], {
        force: true
    });
});

// `gulp build-js` - Build everything in the sass directory
gulp.task('build-js', () => {
    return gulp.src(['src/js/**/*.js'])
	    .pipe(gulp.dest('dist/js/'));
});

// `gulp js-lint`
gulp.task('js-lint', () => {
    return gulp.src(['src/js/**/*.js', '!src/js/**/*.min.js'])
        .pipe(jsLint())
        .pipe(jsLint.reporter('default'));
});

/**
 * PHP
 */
// `gulp php-lint`
gulp.task('php-lint', () => {
    return gulp.src(['./**/*.php'])
        .pipe(phpLint());
});

// Compile Twig templates to HTML
gulp.task('build-templates', function() {
    return gulp.src('src/*.html') // run the Twig template parser on all .html files in the "src" directory
        .pipe(twig())
		.pipe(ext_replace('.html', '.twig.html'))
        .pipe(gulp.dest('dist')); // output the rendered HTML files to the "dist" directory
});

/**
 * Gulp Clean
 */
// `gulp clean` - Clean generated assets
gulp.task('clean', ['clean-fonts', 'clean-images', 'clean-js']);

/**
 * Gulp Build
 */
// `gulp build` - Add any other build processes down the road
gulp.task('build', ['build-templates', 'build-fonts', 'build-images', 'build-js', 'build-css']);

/**
 * Gulp Watch
 */
// `gulp watch`
gulp.task('watch', ['build'], () => {
	
    // Watch Sass files
    gulp.watch('src/sass/**/*.scss', ['build-sass'])
        .on('change', file => {
            util.log(util.colors.yellow(`SCSS changed (${file.path}), streaming to browser...`));
        });

    // Watch JS
    gulp.watch('src/js/**/*.js', ['build-js'])
        .on('change', file => {
            util.log(util.colors.yellow(`Javascript changed (${file.path}), reloading page...`));
            browserSync.reload();
        });

    // Watch PHP/Twig files
    gulp.watch([
        '*.html',
		'*.twig',
        'src/template-parts/**/*.html',
        'src/template-parts/**/*.twig'
    ], ['build-templates']).on('change', file => {
        util.log(util.colors.yellow(`Template changed (${file.path}), reloading page...`));
        browserSync.reload();
    });
});

/**
 * Gulp
 */
// `gulp` - Run a complete build
// `gulp --production` - Compile for production run.
gulp.task('default', ['clean'], () => {
    return gulp.start('build');
});
