const exec = require("child_process").exec;
const fs = require('fs');
const os = require('os');
const path = require('path');
const wallpaper = require("wallpaper");
const Promise = require("bluebird");

var my_os = {
    setWallpaper: function (dir, fileName) {

        // fileName = path.join(dir, fileName);
        console.log(fileName);
        switch (process.platform) {
            case "linux":
                console.log("Setting for linux");
                exec("gsettings set org.gnome.desktop.background picture-uri file://"+fileName);
                exec("gsettings set org.gnome.desktop.background picture-options \"zoom\"");
                break;
            case "darwin":
                wallpaper.set(fileName).then(() => {
                    console.log('set wallpaper');
                })
                .catch(function (err) {
                    console.log('FAILED:', err);
                });
        }

        // console.log('Setting wallpaper, ', fileName);
        // exec("ruby setBG.rb " + fileName);
        // console.log("file://"+fileName);
        // switch (process.platform) {
        //     case "linux":
        //         console.log("Setting for linux");
        //         exec("gsettings set org.gnome.desktop.background picture-uri file://"+fileName);
        //         exec("gsettings set org.gnome.desktop.background picture-options centered");
        //         break;
        //     case "darwin":
        //         console.log("Setting for mac");
        //         exec("mkdir test");
        //         exec("sqlite3 ~/Library/Application\ Support/Dock/desktoppicture.db \"update data set value = '"+__dirname+"/"+fileName+"'\"; killall Dock;")
        //         break;
        //     default:
        //
        // }

    },
    checkFolders: function(dir, usersData) {
        if (usersData && dir.indexOf(os.homedir()) === -1) {
            dir = path.join(os.homedir(), dir);
        }

        fs.stat(dir, (err, stat) => {
            if(err && err.code == 'ENOENT') fs.mkdir(dir, (err) => {
                if (err) {
                    console.log('err', err);
                }
            });
        });
    },
    checkForFile: function (dir, usersData) {
        if (usersData && dir.indexOf(os.homedir()) === -1) {
            dir = path.join(os.homedir(), dir);
        }
        return new Promise(function(resolve, reject) {
            fs.access(dir, fs.F_OK, (err) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    },
    saveFile: function (fileName, data, usersData) {
        if (usersData && fileName.indexOf(os.homedir()) === -1) {
            fileName = path.join(os.homedir(), fileName);
        }
        return new Promise(function(resolve, reject) {
            fs.writeFile(fileName, data, 'binary', function (err) {
                if(err) {
                    reject(err);
                } else {
                    resolve(fileName);
                }
            });
        });

    },
    loadFile: function (fileName, usersData) {
        if (usersData && fileName.indexOf(os.homedir()) === -1) {
            fileName = path.join(os.homedir(), fileName);
        }
        return new Promise(function(resolve, reject) {
            fs.readFile(fileName, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.toString());
                }
            });
        });
    }
}


module.exports = my_os;
