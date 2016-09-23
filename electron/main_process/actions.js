const ipcMain = require('electron').ipcMain;


ipcMain.on('testing', function (e, d) {
    console.log("Other get", d);

});


ipcMain.on('addNum', function (e, d) {

    // let win = BrowserWindow.get
    // ipcMain.send('addedNum', (d + 1));

    global.mainWindow.webContents.send('addedNum', (d + 1))

});
