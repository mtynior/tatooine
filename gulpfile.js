// Based on https://github.com/Alecaddd/gulp-es6/blob/master/gulpfile.js
const { src, dest, task, watch, series, parallel } = require("gulp");

// CSS related plugins
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");

// Utility plugins
var rename = require("gulp-rename");
var sourcemaps = require("gulp-sourcemaps");
var notify = require("gulp-notify");
var plumber = require("gulp-plumber");

// Browers related plugins
var browserSync = require("browser-sync").create();

// Project related variables
var styleSRC = "./src/scss/styles.scss";
var styleURL = "./dist/css/";
var mapURL = "./";

var svgSRC = "./src/svg/*.svg";
var svgURL = "./dist/svg/";

var htmlSRC = "./src/**/*.html";
var htmlURL = "./dist/";


var styleWatch = "./src/scss/**/*.scss";
var svgWatch = "./src/**/*.svg";
var htmlWatch = "./src/**/*.html";

// Tasks
function browser_sync() {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });
}

function reload(done) {
  browserSync.reload();
  done();
}

function css(done) {
  src([styleWatch])
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errLogToConsole: true,
       
      })
    )
    .on("error", console.error.bind(console))
    .pipe(
      autoprefixer({ browsers: ["last 2 versions", "> 5%", "Firefox ESR"] })
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write(mapURL))
    .pipe(dest(styleURL))
    .pipe(browserSync.stream());
  done();
}

function triggerPlumber(src_file, dest_file) {
  return src(src_file)
    .pipe(plumber())
    .pipe(dest(dest_file));
}

function svg() {
  return triggerPlumber(svgSRC, svgURL);
}

function html() {
  return triggerPlumber(htmlSRC, htmlURL);
}

function watch_files() {
  watch(styleWatch, series(css, reload));
  watch(svgWatch, series(svg, reload));
  watch(htmlWatch, series(html, reload));
  src(htmlURL + "index.html").pipe(
    notify({ message: "Gulp is Watching, Happy Coding!" })
  );
}

task("css", css);
task("svg", svg);
task("default", parallel(css, svg, html));
task("watch", parallel(browser_sync, watch_files));
