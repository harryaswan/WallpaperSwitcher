const request = require('request');
const Promise = require("bluebird");

var core = {
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

    }
}

module.exports = core;