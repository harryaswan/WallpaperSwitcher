const ipc = require('electron').ipcRenderer

// Tell main process to show the menu when demo button is clicked
const button = document.getElementById('daBtn')
button.addEventListener('click', function () {
    ipc.send('da-btn-clicked')
})
