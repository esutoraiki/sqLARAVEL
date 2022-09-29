/* Update: 20220929 */

"use strict";

import gulp from "gulp";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import { deleteAsync } from "del";
import merge from "merge-stream";
import eslint from "gulp-eslint";
import uglify from "gulp-uglify";
import arg from "./config/arg.js";
import fn from "./config/fn.js";

const
    p = arg.arg,

    { series, parallel, src, dest, task, watch } = gulp,
    sass = gulpSass(dartSass),

    minjs = fn.stringToBoolean(p.minjs) || false,

/*
    svgmin = require("gulp-svgmin"),
    postcss = require("gulp-postcss"),
    postinlinesvg = require("postcss-inline-svg"),
    jsonlint = require("gulp-jsonlint"),
    */

    paths = {
        js: {
            src: [
                "js/*.js",
                "js/modules/*.js"

            ],
            dest: [
                "../public/js/",
                "../public/js/modules/",
            ],
            mindest: [
                "../public/js/min/",
                "../public/js/modules/min",
            ]
        }
    },

    // NOTE: foler core and sisass last element of array
    paths_scss = [
        "assets/scss/",
        "assets/scss/core/",
        "node_modules/sisass/src/scss/"
    ],
    paths_dest_css = [
        "../public/css/",
        "../public/css/modules/"
    ],
    paths_compile_scss = [
        "assets/scss/*.scss",
        "assets/scss/modules/*.scss"
    ],

    path_svg = "assets/scss/svg/*.scss",
    path_dest_svg = "assets/css/svg/",

    path_img_svg = "../public/img/svg/*.svg",
    path_orig_img_svg = "../public/img/svg/orig/*.svg",
    path_dest_img_svg = "../public/img/svg/",

    paths_js = [
        "assets/js/*.js",
        "assets/js/modules/*.js"
    ]
;

console.dir(minjs);

/*
gulp.task("delete_svg", function () {
    console.log("");
    console.log("---- SVG ----");

    return del(path_img_svg);
});

gulp.task("svgmin", function () {
    return gulp.src(path_orig_img_svg)
        .pipe(svgmin(
            { removeStyleElement: true },
            { removeComments: true }
        ))
        .pipe(gulp.dest(path_dest_img_svg));
})

gulp.task("process_svg", function () {
    return gulp.src(path_dest_svg + "*.css")
        .pipe(postcss([
            postinlinesvg({
                removeFill: true
            })
        ]))
        .pipe(gulp.dest(path_dest_svg));
})

gulp.task("css_svg", function () {
    console.log("");
    console.log("---- Styles SVG ----");

    return gulp.src(path_svg)
        .pipe(sass({
            outputStyle: "compressed",
            includePaths: paths_scss
        }).on("error", sass.logError))
        .pipe(gulp.dest(path_dest_svg));
});

gulp.task("scss", function () {
    console.log("");
    console.log("---- Styles ----");

    let task_array = [];

    for (let i = 0; i < paths_compile_scss.length; i++) {
        task_array[i] = gulp.src(paths_compile_scss[i])
            .pipe(sass({
                outputStyle: "compressed",
                includePaths: paths_scss
            }).on("error", sass.logError))
            .pipe(gulp.dest(paths_dest_css[i]));
    }

    console.log("");
    return merge(...task_array);
});
*/


/*
gulp.task("jsonlint", function () {
    console.log("");
    console.log("---- JSON-LINT ----");

    let
        myCustomReporter = function (file) {
            log("File " + file.path + " is not valid JSON.");
        }
    ;

    return gulp.src("assets/json/*.json")
        .pipe(jsonlint())
        .pipe(jsonlint.reporter(myCustomReporter));
});
*/

/*
task("watch", function () {
    console.log("");
    console.log("---- INICIADO WATCH ----");

    gulp.watch(paths_js, gulp.series("lint")).on("change");

    /*
    gulp.watch("assets/json/*.json", gulp.series("jsonlint")).on("change");

    gulp.watch(paths_compile_scss, gulp.series("scss")).on("change");
    gulp.watch(path_svg, gulp.series("css_svg", "process_svg")).on("change");
    gulp.watch(path_orig_img_svg, gulp.series(
        "delete_svg",
        "svgmin",
        "css_svg",
        "process_svg"
    )).on("change");

    gulp.watch("assets/scss/core/*.scss", gulp.parallel(
        "scss",
        gulp.series("css_svg", "process_svg")
    )).on("change");
    */
/*
});
*/

task("lint", function() {
    console.log("");
    console.log("---- ES-LINT ----");

    let task_array = [];

    for (let i = 0; i < paths.js.src.length; i++) {
        task_array[i] = src(paths.js.src[i])
            .pipe(eslint({}))
            .pipe(eslint.format())
            .pipe(eslint.results(results => {
                // Called once for all ESLint results.
                console.log(`Total Results: ${results.length}`);
                console.log(`Total Warnings: ${results.warningCount}`);
                console.log(`Total Errors: ${results.errorCount}`);
                console.log("");
            }));
    }

    console.log("");
    return merge(...task_array);
});

task("js", function () {
    console.log("");
    console.log("---- JS ----");

    let task_array = [];

    for (let i = 0; i < paths.js.src.length; i++) {
        if (minjs) {
            task_array[i] = src(paths.js.src[i])
                .pipe(uglify())
                .pipe(gulp.dest(paths.js.mindest[i]));
        } else {
            task_array[i] = src(paths.js.src[i])
                .pipe(gulp.dest(paths.js.dest[i]));
        }
    }

    console.log("");
    return merge(...task_array);
});

function watchFiles() {
    console.log("");
    console.log("---- INICIADO WATCH ----");

    watch(paths.js.src, series("lint", "js"));
//  gulp.watch(paths.styles.src, styles);
}

export { watchFiles as watch };
export default watchFiles;
