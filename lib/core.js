const request = require('request');
const Promise = require("bluebird");
const fs = require("fs");
const path = require('path');
const os = require("./os.js");

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
    downloadImage: function (url, dir, filename) {
        var opts = {
            url: url,
            encoding: 'binary'
        }
        console.log(filename, filename.lastIndexOf('.'));
        return new Promise(function(resolve, reject) {
            if (!filename || filename.lastIndexOf('.') === -1) {
                reject("No Filename");
            } else {

                var pathName = path.join(dir, filename);

                os.checkForFile(pathName)
                .then(function (exists) {
                    if(exists) {
                        console.log('Already downloaded...');
                        resolve(pathName);
                    } else {
                        console.log("Not downloaded, doing so now....");
                        this.getData(opts, false)
                        .then(function (data) {
                            os.saveFile(pathName, data)
                            .then(function (returnedFileName) {
                                resolve(returnedFileName);
                            })
                            .catch(function (err) {
                                reject(err);
                            });
                        })
                        .catch(function (err) {
                            reject(err);
                        });
                    }
                }.bind(this));
            }
        }.bind(this));

    }
}

module.exports = core;
