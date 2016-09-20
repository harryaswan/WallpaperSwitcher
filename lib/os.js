const exec = require("child_process").exec;
const fs = require('fs');
const path = require('path');
const wallpaper = require("wallpaper");

var os = {
    setWallpaper: function (fileName) {

        switch (process.platform) {
            case "linux":
                console.log("Setting for linux");
                fileName = path.join(global.appRoot, fileName);
                exec("gsettings set org.gnome.desktop.background picture-uri file://"+fileName);
                exec("gsettings set org.gnome.desktop.background picture-options centered");
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
    checkFolders: function() {
        fs.stat('./tmp', (err, stat) => {
            if(err && err.code == 'ENOENT') fs.mkdirSync('./tmp');
        });
        fs.stat('./tmp/iAlbums', (err, stat) => {
            if(err && err.code == 'ENOENT') fs.mkdirSync('./tmp/iAlbums');
        });
        fs.stat('./tmp/iImages', (err, stat) => {
            if(err && err.code == 'ENOENT') fs.mkdirSync('./tmp/iImages');
        });
        fs.stat('./tmp/sImages', (err, stat) => {
            if(err && err.code == 'ENOENT') fs.mkdirSync('./tmp/sImages');
        });
    },
    saveFile: function (fileName, data, callback) {
        fs.writeFile(fileName, data, 'binary', function (err) {
            if(err) {
                console.log("ERROR:", err);
            } else {
                if(callback) {
                    callback(null, fileName);
                }
            }
        });
    }
}


module.exports = os;
