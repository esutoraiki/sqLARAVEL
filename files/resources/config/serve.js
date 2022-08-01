const
    http = require("http"),
    fs = require("fs"),
    path = require("path"),

    arg = require("./arg.js").arg,
    fn = require("./fn.js"),

    // Arguments
    port =  Number(arg.port) || Number(arg.p) || 8125,
    view = fn.stringToBoolean(arg.log) || false
;

http.createServer(function (request, response) {
    if (view) {
        let
            timeElapsed = Date.now(),
            t = new Date(timeElapsed),
            hour = t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds()
        ;

        console.log("["+ hour + "]", request.url);
    }


    var filePath = "." + request.url;

    if (filePath == "./") {
        filePath = "./index.html";
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var contentType = "text/html";
    var mimeTypes = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpg",
        ".gif": "image/gif",
        ".wav": "audio/wav",
        ".mp4": "video/mp4",
        ".woff": "application/font-woff",
        ".ttf": "applilcation/font-ttf",
        ".eot": "application/vnd.ms-fontobject",
        ".otf": "application/font-otf",
        ".svg": "application/image/svg+xml",
        ".scss": "text/x-scss"
    };

    contentType = mimeTypes[extname] || "application/octect-stream";
    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code === "ENOENT"){
                fs.readFile("./404.html", function (error, content) {
                    response.writeHead(200, { "Content-Type": contentType });
                    response.end(content, "utf-8");
                });
            } else {
                response.writeHead(500);
                response.end("Sorry, check with the site admin for error: "+error.code+" ..\n");
                response.end();
            }
        } else {
            response.writeHead(200, { "Content-Type": contentType });
            response.end(content, "utf-8");
        }
    });
}).listen(port);

console.log("Server running at http://localhost:" + port + "/");
