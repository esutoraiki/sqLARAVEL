/* Update: 20221005 */

"use strict";

import gulp from "gulp";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import { deleteAsync } from "del";
import merge from "merge-stream";
import eslint from "gulp-eslint";
import uglify from "gulp-uglify";
import rename from "gulp-rename";
import jsonlint from "gulp-jsonlint";

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
    */

    paths = {
        scss: {
            src: [
                "scss/*.scss",
                "scss/modules/*.scss"
            ],
            dest: [
                "../public/css/",
                "../public/css/modules/"
            ],
            // NOTE: The core directory and sisass should be the last items in the array
            core: [
                "scss/",
                "scss/core/",
                "../node_modules/sisass/src/scss/"
            ]
        },
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
        },
        json: {
            src: [
                "json/*.json"
            ],
            dest: [
                "../public/json/"
            ]
        },
        clean: [
            "**/.gitkeep",
            "**/.**.*.swp",
            "**/.**.*.swo",
            "**/*.*~",
            "**/Thumbs.db",
            "**/.DS_Store",
            "**/.vscode",
            "../public/**/.gitkeep",
            "../public/**/*.*~",
            "../public/**/.**.*.swp",
            "../public/**/.**.*.swo",
            "../public/**/Thumbs.db",
            "../public/**/.DS_Store",
            "../public/**/.vscode"
        ]
    },

    path_svg = "assets/scss/svg/*.scss",
    path_dest_svg = "assets/css/svg/",

    path_img_svg = "../public/img/svg/*.svg",
    path_orig_img_svg = "../public/img/svg/orig/*.svg",
    path_dest_img_svg = "../public/img/svg/"
;

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


task("deljs", function (done) {
    console.log("");
    console.log("---- JS-DELETE-FILES ----");

    console.log("JS Files deleted: \n");

    const all_paths_js = [...paths.js.dest, ...paths.js.mindest];
    let array_del = [];

    for (let i of all_paths_js) {
        array_del.push(i + "*js")
    }

    deleteAsync(array_del, {
        force: true
    }).then(function (files) {
        for (let file of files) {
            console.log(file);
        }
        console.log("");
        done();
    });
});

task("jslint", function() {
    console.log("");
    console.log("---- JS-ES-LINT ----");

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
                .pipe(rename(function (path) {
                    return {
                        dirname: path.dirname,
                        basename: path.basename + ".min",
                        extname: ".js"
                    };
                }))
                .pipe(dest(paths.js.mindest[i]));
        } else {
            task_array[i] = src(paths.js.src[i])
                .pipe(dest(paths.js.dest[i]));
        }
    }

    console.log("");
    return merge(...task_array);
});

task("jsonlint", function () {
    console.log("");
    console.log("---- JSON-LINT ----");

    let task_array = [];

    for (let i = 0; i < paths.json.src.length; i++) {
        task_array[i] = src(paths.json.src[i])
            .pipe(jsonlint())
            .pipe(jsonlint.reporter())
            .pipe(dest(paths.json.dest[i]));
    }

    console.log("");
    return merge(...task_array);
});

task("cleanfiles", function (done) {
    console.log("");
    console.log("---- CLEAN FILES ----");

    deleteAsync(paths.clean, {
        force: true
    }).then(function (files) {
        console.log("Files and directories that would be deleted: ");
        for (let file of files) {
            console.log(file);
        }

        console.log("");
        done();
    });
});

task("scss", function () {
    console.log("");
    console.log("---- Styles ----");

    let task_array = [];

    for (let i = 0; i < paths.scss.src.length; i++) {
        task_array[i] = src(paths.scss.src[i])
            .pipe(sass({
                outputStyle: "compressed",
                includePaths: paths.scss.core
            }).on("error", sass.logError))
            .pipe(dest(paths.scss.dest[i]));
    }

    console.log("");
    return merge(...task_array);
});

function watchFiles() {
    console.log("");
    console.log("---- INICIADO WATCH ----");

    // JS //
    watch(paths.js.src, series(
        "deljs",
        "jslint",
        "js"
    ));

    // JSON //
    watch(paths.json.src, series("jsonlint"));

    // SCSS //
    watch(paths.scss.src, series("scss"));
}

/*
task("watch", function () {
    console.log("");
    console.log("---- INICIADO WATCH ----");

    gulp.watch(paths_js, gulp.series("lint")).on("change");

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
});
*/

export { watchFiles as watch };
export default watchFiles;
