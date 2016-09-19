const exec = require("child_process").exec;
const fs = require('fs');

var os = {
    setWallpaper: function (path) {
        // console.log('Setting wallpaper, ', path);
        // exec("ruby setBG.rb " + path);
        console.log("file://"+__dirname+"/"+path);
        switch (process.platform) {
            case "linux":
                console.log("Setting for linux");
                exec("gsettings set org.gnome.desktop.background picture-uri file://"+__dirname+"/"+path);
                exec("gsettings set org.gnome.desktop.background picture-options centered");
                break;
            case "darwin":
                console.log("Setting for mac");
                exec("mkdir test");
                exec("sqlite3 ~/Library/Application\ Support/Dock/desktoppicture.db \"update data set value = '"+__dirname+"/"+path+"'\"; killall Dock;")
                break;
            default:

        }

    },
    checkFolders: function() {
        console.log('cur dir', __dirname);
        fs.stat('./imgs', function(err, stat) {
            console.log('stat',stat);
            if(err == null) {
                console.log('File exists');
            } else if(err.code == 'ENOENT') {
                // file does not exist
                console.log("Create folders");
            } else {
                console.log('Some other error: ', err.code);
            }
        });
    }
}


module.exports = os;
