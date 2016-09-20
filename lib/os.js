const exec = require("child_process").exec;
const fs = require('fs');
const wallpaper = require("wallpaper");

var os = {
    setWallpaper: function (path) {

        wallpaper.set(path).then(() => {
            console.log('set wallpaper');
        });

        // console.log('Setting wallpaper, ', path);
        // exec("ruby setBG.rb " + path);
        // console.log("file://"+path);
        // switch (process.platform) {
        //     case "linux":
        //         console.log("Setting for linux");
        //         exec("gsettings set org.gnome.desktop.background picture-uri file://"+path);
        //         exec("gsettings set org.gnome.desktop.background picture-options centered");
        //         break;
        //     case "darwin":
        //         console.log("Setting for mac");
        //         exec("mkdir test");
        //         exec("sqlite3 ~/Library/Application\ Support/Dock/desktoppicture.db \"update data set value = '"+__dirname+"/"+path+"'\"; killall Dock;")
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
    saveFile: function (path, data, callback) {
        fs.writeFile(path, data, 'binary', function (err) {
            if(err) {
                console.log("ERROR:", err);
            } else {
                if(callback) {
                    callback(null, path);
                }
            }
        });
    }
}


module.exports = os;
