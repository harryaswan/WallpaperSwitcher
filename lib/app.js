const request = require('request');
const Promise = require("bluebird");
const imgur = require("./imgur.js");
const core = require("./core.js");
const os = require("./os.js");
const helper = require("./helper.js");

var app = function (config) {
    this.config = config
    this.imgurDownload = function(rawURL) {
        var code = helper.getFilename(rawURL);
        var opts = imgur.generateOpts(code);
        return new Promise(function(resolve, reject) {
            core.getData(opts)
            .then(function (data) {
                core.downloadImage(data.data.link, './imgs/iImages', helper.getFilename(data.data.link))
                .then(function (path) {
                    resolve(path);
                })
                .catch(function (err) {
                    reject(err)
                });
            }.bind(this))
            .catch(function (err, res,body) {
                opts = imgur.generateOpts(code, true);
                core.getData(opts)
                .then(function (data) {
                    console.log('got data');
                    var number = helper.pickRandomNumber(data.data.length)
                    var link = data.data[number].link;
                    core.downloadImage(link, './imgs/iAlbums', helper.getFilename(link))
                    .then(function (path) {
                        resolve(path);
                    })
                    .catch(function (err) {
                        reject(err);
                    });
                }.bind(this))
                .catch(function (err, res, body) {
                    console.log("Not a valid imgur url!");
                    reject("failed")
                })
            }.bind(this))
        }.bind(this));
    }
    this.handleData = function (data) {

        console.log("number of children:", data.data.children.length);

        var number;
        var count = 0;
        var run = function () {
            if (count < 25) {
                number = helper.pickRandomNumber(data.data.children.length);
                count++;
                while(data.data.children[number].data.domain.indexOf("self.") !== -1) {
                    console.log('domain got self, picking new number');
                    number = helper.pickRandomNumber(data.data.children.length);
                }

                var url = helper.cleanURL(data.data.children[number].data.url);

                console.log('Selected URL:', url);

                if (url.indexOf('imgur') > -1 && helper.getFilename(url).indexOf('.') === -1) {
                    this.imgurDownload(url)
                    .then(function (path) {
                        os.setWallpaper(path);
                        console.log('set imgrwal');
                    }.bind(this))
                    .catch(function (err) {
                        if (err === "failed") {
                            console.log('imgr run');
                            run();
                        }
                    });
                } else {
                    core.downloadImage(url, './imgs/sImages', helper.getFilename(url))
                    .then(function (path) {
                        os.setWallpaper(path);
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
                }
            }
        }.bind(this);

        run();

    }


    this.go = function (id) {
        console.log("Running run number " + id + "...");

        core.getData("https://reddit.com/r/wallpapers/.json").then(function (data) {
            this.handleData(data);
        }.bind(this))
        .catch(function (error, res) {
            console.log("ERROR:", error, res);
        });

        setTimeout(function() {
            this.go(id+1);
        }.bind(this), helper.pickRandomNumber(3600000, 60000));
    }
}

module.exports = app;
