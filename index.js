const fs = require('fs');
const request = require('request');
const Promise = require("bluebird");
const exec = require("child_process").exec;
const imgur = require("./lib/imgur.js");
const core = require("./lib/core.js");
const os = require("./lib/os.js");
const helper = require("./lib/imgur.js");

const TIMEDELAY = 3600000;
const DEBUGTIME = 15000;


var app = {
    imgurDownload: function(rawURL) {
        var code = imgur.getCode(rawURL);
        var opts = imgur.generateOpts(code);
        return new Promise(function(resolve, reject) {
            this.getData(opts)
            .then(function (data) {
                this.downloadImage(data.data.link, './imgs/iImages', this.getFilename(data.data.link), function (err, path) {
                    if(!err) {
                        console.log('Saved Imgur Image in ', path);
                        resolve(path);
                    } else {
                        reject("failed");
                    }
                });
            }.bind(this))
            .catch(function (err, res,body) {
                opts = imgur.generateOpts(code, true);
                this.getData(opts)
                .then(function (data) {
                    console.log('got data');
                    var number = this.pickRandomumber(data.data.length)
                    var link = data.data[number].link;
                    this.downloadImage(link, './imgs/iAlbums', this.getFilename(link), function (err, path) {
                        if(!err) {
                            console.log('Saved Imgur Image in ', path);
                            resolve(path);
                        } else {
                            reject("failed");
                        }
                    });
                }.bind(this))
                .catch(function (err, res, body) {
                    console.log("Not a valid imgur url!");
                    reject("failed")
                })
            }.bind(this))
        }.bind(this));
    },
    handleData: function (data) {

        console.log("number of children:", data.data.children.length);

        var number;
        var count = 0;
        var run = function () {
            if (count < 25) {
                number = this.pickRandomumber(data.data.children.length);
                count++;
                while(data.data.children[number].data.domain.indexOf("self.") !== -1) {
                    console.log('domain got self, picking new number');
                    number = this.pickRandomumber(data.data.children.length);
                }

                var url = this.cleanURL(data.data.children[number].data.url);

                console.log('Selected URL:', url);

                if (url.indexOf('imgur') > -1 && this.getFilename(url).indexOf('.') === -1) {
                    this.imgurDownload(url)
                    .then(function (path) {
                        this.setWallpaper(path);
                        console.log('set imgrwal');
                    }.bind(this))
                    .catch(function (err) {
                        if (err === "failed") {
                            console.log('imgr run');
                            run();
                        }
                    });
                } else {
                    this.downloadImage(url, './imgs/sImages', this.getFilename(url), function (err, path) {
                        if (!err) {
                            console.log('Saved in', path);
                            this.setWallpaper(path);
                        } else {
                            console.log('other run');
                            run();
                        }
                    }.bind(this));
                }
            }
        }.bind(this);

        run();

    },


    go: function (id) {
        console.log("Running run number " + id + "...");

        this.getData("https://reddit.com/r/wallpapers/.json").then(function (data) {
            this.handleData(data);
        }.bind(this))
        .catch(function (error, res) {
            console.log("ERROR:", error, res);
        });

        setTimeout(function() {
            this.go(id+1);
        }.bind(this), DEBUGTIME);
    }
}


os.checkFolders();




// app.go(1);



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
