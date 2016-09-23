const electron = require('electron');
const WallpaperApp = require('../../lib/app.js');
const os = require("../../lib/os");
const path = require('path');
const ipc = electron.ipcMain;

global.appRoot = path.resolve(__dirname);

var app;

function setup() {
    os.loadFile(path.join(global.appRoot, "../../config.json"))
    .then(function (data) {
        var config = JSON.parse(data);
        //checkFolders
        console.log('got config');
        app = new WallpaperApp(config);
        gettingStarted();
    })
    .catch(function (err) {
        console.log("Could not load config", err);
    });
}

function gettingStarted() {
    app.getArrayOfLinks()
    .then(function (links) {
        console.log('good to here', links);
        ipc.send('data-recieved', links);
    })
    .catch(function (err) {
        console.log("Error:", err);
    })

}



setup();
