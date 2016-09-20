
const application = require("./lib/app.js");
const checkFolders = require("./lib/os").checkFolders;
const path = require('path');
global.appRoot = path.resolve(__dirname);

var config = "test";

var app = new application(config);

checkFolders();
app.go(1);



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
