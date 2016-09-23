// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')
const ipcRenderer = require('electron').ipcRenderer;

console.log('Window Loaded', window);


var input_box = document.getElementById('input_bar');
var action_button = document.getElementById('action_button');
var win_button = document.getElementById('newWinBtn');

action_button.value = "Click Me";

action_button.addEventListener('click', function (event) {
    event.preventDefault();
    console.log("Button Presses");
    console.log("Input box contains:", input_box.value);
    ipcRenderer.send('addNum', Number(input_box.value))
});


win_button.addEventListener('click', function (event) {
    const modalPath = path.join('file://', __dirname, '../html_files/mini_window.html')
    let win = new BrowserWindow({ frame: false, width: 400, height: 320 })
    win.on('close', function () { win = null })
    win.loadURL(modalPath)
    win.show()
});


ipcRenderer.on('addedNum', function (e, d) {
    console.log('got num back', d);
})
