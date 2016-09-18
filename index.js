const fs = require('fs');
const request = require('request');
const Promise = require("bluebird");
const exec = require("child_process").exec;
const TIMEDELAY = 3600000;
const DEBUGTIME = 15000;



var imgur = {
    getCode: function (url) {
        if (url.lastIndexOf('/') + 1 === url.length) {
            url.substring(0, url.lastIndexOf('/'));
        }

        return url.substring(url.lastIndexOf('/')+1);
    },
    generateOpts: function (code, album) {
        var url;
        if (album) {
            url = "https://api.imgur.com/3/album/"+code+"/images";
        } else {
            url = "https://api.imgur.com/3/image/"+code;
        }
        return {
            url: url,
            headers: {
                'Authorization': 'Client-ID 905f8623e29ae6a'
            }
        }
    }
}
var app = {
    getData: function (opts, json) {
        console.log("Getting data:", opts);
        if (json === undefined) json = true;
        return new Promise(function(resolve, reject) {
            request(opts, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (json) {
                        resolve(JSON.parse(body));
                    } else {
                        resolve(body);
                    }
                } else {
                    reject(error, response, body);
                }
            });
        });
    },
    downloadImage: function (url, path, filename, callback) {
        var opts = {
            url: url,
            encoding: 'binary'
        }
        console.log(filename, filename.lastIndexOf('.'));
        if (!filename || filename.lastIndexOf('.') === -1) {
            callback("No File Name");
        } else {
            var fullPath = path + '/' + filename;
            this.getData(opts, false)
            .then(function (data) {
                fs.writeFile(fullPath, data, 'binary', function (err) {
                    if(err) {
                        console.log("ERROR:", err);
                    } else {
                        if(callback) {
                            callback(null, fullPath);
                        }
                    }
                });
            })
            .catch(function (err, res) {
                console.error(err);
                callback(err, null)
            });
        }

    },

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
    setWallpaper: function (path) {
        // console.log('Setting wallpaper, ', path);
        // exec("ruby setBG.rb " + path);
        console.log("file://"+__dirname+"/"+path);
        exec("gsettings set org.gnome.desktop.background picture-uri file://"+__dirname+"/"+path);
        exec("gsettings set org.gnome.desktop.background picture-options centered");
    },
    pickRandomumber: function (max) {
         return Math.floor(Math.random() * (max - 1));
    },
    getFilename: function (url) {
        return url.substring(url.lastIndexOf('/') + 1);
    },
    cleanURL: function (url) {
        var modifiers = [
            {
                o: "&amp;",
                n: "&"
            }
        ];
        for (var i =0; i < modifiers.length; i++) {
            while(url.indexOf(modifiers[i].o) > -1) {
                console.log('changing url');
                url = url.replace(modifiers[i].o, modifiers[i].n);
            }
        }
        return url;
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
