const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

if (process.mas) app.setName('Electron APIs')

function createWindow () {

    mainWindow = new BrowserWindow({width: 800, height: 600, title: app.getName()})

    mainWindow.loadURL(`file://${__dirname}/index.html`)

    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

function startup() {
    createWindow();

}

app.on('ready', startup)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})

require('./main-process/wallpaperManager.js')
require('./main-process/first_screen.js')
