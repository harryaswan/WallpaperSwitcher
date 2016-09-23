
const application = require("./lib/app.js");
const os = require("./lib/os");
const path = require('path');
global.appRoot = path.resolve(__dirname);

var inArg = process.argv[2];
var configFile = inArg === 'debug' ? "/debug.json" : "/config.json";

os.loadFile(global.appRoot + configFile)
.then(function (data) {
    var config = JSON.parse(data);
    console.log('config loaded');
    var app = new application(config);

    os.checkFolders();

    if (inArg && inArg !== "debug") {
        app.handleURL(inArg)
    } else {
        app.go(1);
    }

})
.catch(function (err) {
    console.log("Could not load config", err);
})



// app.downloadImage("http://i.imgur.com/TAK4bet.jpg", '.', 'test.jpg', function (err, path) {
//     if(err) {
//         console.error(err);
//     } else {
//         console.log('Path', path);
//     }
// });

// var spoofData = {
//     data: {
//         children: [
//             {
//                 data: {
//                     domain: "imgur.com",
//                     url: "http://imgur.com/a/7tTEJ"
//                 }
//             }
//         ]
//     }
// }
//
// app.handleData(spoofData);
//
// console.log("curr dir", __dirname);



// app.imgurDownload("http://imgur.com/a/7tTEJ")
// .then(function (path) {
//     console.log("GOT PATH:", path);
// })
// .catch(function (err) {
//     console.error(err);
// })
