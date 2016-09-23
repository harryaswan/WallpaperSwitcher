const request = require('request');
const Promise = require("bluebird");
const imgur = require("./imgur.js");
const core = require("./core.js");
const os = require("./os.js");
const helper = require("./helper.js");

var app = function (config) {
    this.config = config;

    this.getArrayOfLinks = function (inSub) {
        return new Promise(function(resolve, reject) {
            var ops = this.pickSubreddit(inSub);
            core.getData(ops)
            .then(function (data) {
                resolve(data.data.children);
            })
            .catch(function (err) {
                reject(err);
            });
        }.bind(this));
    }

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
        return new Promise(function(resolve, reject) {
            url = helper.cleanURL(url);
            //if the url is a imgur one that does not have a file extention use the imgur api
            if (url.indexOf('imgur') > -1 && helper.getFilename(url).indexOf('.') === -1) {
                this.imgurDownload(url)
                .then(function (path) {
                    os.setWallpaper(path);
                    console.log('set imgrwal');
                    resolve();
                }.bind(this))
                .catch(function (err) {
                    if (err === "failed") {
                        console.log('imgr run');
                        reject();
                    }
                });
            } else {
                //otherwise assume that it is a valid image url (TODO: NEED VALIDATION / MORE APIS)
                core.downloadImage(url, './imgs/sImages', helper.getFilename(url))
                .then(function (path) {
                    os.setWallpaper(path);
                    resolve();
                })
                .catch(function (err) {
                    console.error(err);
                    reject();
                });
            }
        });
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

                console.log('random number chosen:', number);
                this.handleURL(data.data.children[number].data.url)
                .then(function () {
                    this.restart();
                }.bind(this))
                .catch(function () {
                    run()
                });

            }
        }.bind(this);

        run();
    }

    this.runNumber = 0;

    this.pickSubreddit = function(inSub) {
        var sub = inSub? inSub : this.config.subreddits[helper.pickRandomNumber(this.config.subreddits.length)];
        return {
            url: "https://reddit.com/r/" + sub + "/.json",
            headers: {
                'User-Agent':'HASWallpaperManager'
            }
        }
    }

    this.go = function () {

        this.runNumber++;

        console.log(" ");
        console.log("-------------------------------------");
        console.log(" ");
        console.log("Running run number " + this.runNumber + "...");

        core.getData(this.pickSubreddit()).then(function (data) {
            this.handleData(data);
        }.bind(this))
        .catch(function (error, res) {
            console.log("ERROR:", error, res);
        });
    }

    this.restart = function () {
        var restartTime = helper.pickRandomNumber(3600000, 60000);
        // var restartTime = helper.pickRandomNumber(30000, 5000);

        console.log("Will be restarting in: ", Math.round(((restartTime/1000)/60) * 100) / 100, " minutes");

        setTimeout(function() {
            this.go();
        }.bind(this), restartTime);
    }

}

module.exports = app;
