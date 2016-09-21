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
    this.handleURL = function (url) {
        url = helper.cleanURL(url);
        if (url.indexOf('imgur') > -1 && helper.getFilename(url).indexOf('.') === -1) { //if the url is a imgur one that does not have a file extention use the imgur api
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
        } else { //otherwise assume that it is a valid image url (TODO: NEED VALIDATION / MORE APIS)
            core.downloadImage(url, './imgs/sImages', helper.getFilename(url))
            .then(function (path) {
                os.setWallpaper(path);
            })
            .catch(function (err) {
                console.error(err);
            });
        }
    }
    this.handleData = function (data) {
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

                this.handleURL(data.data.children[number].data.url);

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

        var restartTime = helper.pickRandomNumber(3600000, 60000);

        console.log("Will be restarting in: ", restartTime/1000, " seconds");

        setTimeout(function() {
            this.go(id+1);
        }.bind(this), restartTime);
    }
}

module.exports = app;
