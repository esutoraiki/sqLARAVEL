const
    fs = require("fs"),

    // args = process.argv.slice(2),
    dest_r = "./",
    dest_p = "../public",
    filesDir_r = "files/resources/"
    filesDir_p = "files/public/"
;

// Copy files to the project
fs.cp(filesDir_r, dest_r, {recursive: true, force: false}, (err, data) => {
    if (err) {
        console.error("Error Install");
        console.error(err);
    } else {
        console.log("successful resource installation");
    }
});

fs.cp(filesDir_p, dest_p, {recursive: true, force: false}, (err, data) => {
    if (err) {
        console.error("Error Install");
        console.error(err);
    } else {
        console.log("successful resource installation");
    }
});

