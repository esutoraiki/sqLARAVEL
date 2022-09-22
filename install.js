const
    fs = require("fs"),

    // args = process.argv.slice(2),
    dest = "../../",
    filesDir = "files/"
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

