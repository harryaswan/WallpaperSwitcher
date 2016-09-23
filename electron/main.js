const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = require('electron').ipcMain;

// let global.mainWindow

function createWindow () {
    global.mainWindow = new BrowserWindow({width: 800, height: 600})

    global.mainWindow.loadURL(`file://${__dirname}/html_files/index.html`)
    global.mainWindow.webContents.openDevTools()

    global.mainWindow.on('closed', function () {
        global.mainWindow = null
    });


}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    // if (process.platform !== 'darwin') {
    app.quit()
    // }
})

app.on('activate', function () {
    if (global.mainWindow === null) {
        createWindow()
    }
})

ipcMain.on('testing', function (event, data) {
    console.log('on test');
    console.log(data);
});

require("./main_process/actions.js")
