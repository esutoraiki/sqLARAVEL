/* Update: 20221011 */

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
import postcss from "gulp-postcss";
import postinlinesvg from "postcss-inline-svg";
import svgmin from "gulp-svgmin";

import arg from "./config/arg.js";
import fn from "./config/fn.js";

const
    p = arg.arg,

    { series, parallel, src, dest, task, watch } = gulp,
    sass = gulpSass(dartSass),

    minjs = fn.stringToBoolean(p.minjs) || false,

    paths = {
        svg: {
            img: [
                "../public/img/svg/orig/*.svg"
            ],
            img_dest: [
                "../public/img/svg/"
            ],
            src: [
                "scss/svg/*.scss"
            ],
            dest: [
                "../public/css/svg/"
            ]
        },
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
            depen: [
                "scss/",
                "scss/core/",
                "../node_modules/sisass/src/scss/"
            ],
            core: "scss/core/*.scss"
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
    }
;

task("svgdel", function (done) {
    console.log("");
    console.log("---- SVG-DELETE-FILES ----");

    console.log("SVG Files deleted: \n");

    let array_del = [];

    for (let i of paths.svg.img_dest) {
        array_del.push(i + "*svg")
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

task("svgmin", function () {
    console.log("");
    console.log("---- SVGO ----");

    let task_array = [];

    for (let i = 0; i < paths.svg.img.length; i++) {
        task_array[i] = src(paths.svg.img[i])
            .pipe(svgmin(
                { removeStyleElement: true },
                { removeComments: true }
            ))
            .pipe(gulp.dest(paths.svg.img_dest[i]));
    }

    console.log("");
    return merge(...task_array);
})

task("jsdel", function (done) {
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
                includePaths: paths.scss.depen
            }).on("error", sass.logError))
            .pipe(dest(paths.scss.dest[i]));
    }

    console.log("");
    return merge(...task_array);
});

task("scsssvg", function () {
    console.log("");
    console.log("---- Styles SVG ----");

    let task_array = [];


    for (let i = 0; i < paths.svg.src.length; i++) {
        task_array[i] = src(paths.svg.src[i])
            .pipe(sass({
                outputStyle: "compressed",
                includePaths: paths.scss.depen
            }).on("error", sass.logError))
            .pipe(dest(paths.svg.dest[i]));
    }

    console.log("");
    return merge(...task_array);
});

task("process_svg", function () {
    console.log("");
    console.log("---- Process SVG ----");

    let task_array = [];

    for (let i = 0; i < paths.svg.dest.length; i++) {
        task_array[i] = src(paths.svg.dest + "*.css")
            .pipe(postcss([
                postinlinesvg({
                    removeFill: false
                })
            ]))
            .pipe(dest(paths.svg.dest));
    }

    console.log("");
    return merge(...task_array);
});

function list_files(path) {
    console.log("");
    console.log("-----------------------------");
    console.log(path);
    console.log("-----------------------------");
}

function watchFiles() {
    console.log("");
    console.log("---- INICIADO WATCH ----");

    // JS //
    watch(paths.js.src, series(
        "jsdel",
        "jslint",
        "js",
    )).on("change", list_files);

    // JSON //
    watch(paths.json.src, series(
        "jsonlint",
    )).on("change", list_files);

    // SCSS //
    watch(paths.scss.src, series("scss")).on("change", list_files);
    watch(paths.scss.core, parallel(
        "scss",
        series(
            "scsssvg",
            "process_svg",
        )
    )).on("change", list_files);

    // SVG //
    watch(paths.svg.img, series(
        "svgdel",
        "svgmin",
        "scsssvg",
        "process_svg",
    )).on("change", list_files);
    watch(paths.svg.src, series(
        "scsssvg",
        "process_svg",
    )).on("change", list_files);
}

export { watchFiles as watch };
export default watchFiles;
