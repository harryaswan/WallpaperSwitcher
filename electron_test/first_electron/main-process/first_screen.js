const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
// const Menu = electron.Menu
// const MenuItem = electron.MenuItem
const ipc = electron.ipcMain
// const app = electron.app
const dialog = electron.dialog

ipc.on('da-btn-clicked', function (event) {
    console.log('clicked',event);
    const options = {
        type: 'info',
        title: 'Information',
        message: "This is an information dialog. Isn't it nice?",
        buttons: ['Yes', 'No']
    }
    dialog.showMessageBox(options, function (index) {
        let message = 'You selected '
        if (index === 0) message += 'yes.'
        else message += 'no.'
        console.log('msg',message);
    })
})
