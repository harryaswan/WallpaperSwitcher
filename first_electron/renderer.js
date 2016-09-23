const ipc = require('electron').ipcRenderer

// Tell main process to show the menu when demo button is clicked
const button = document.getElementById('daBtn')
button.addEventListener('click', function () {
    ipc.send('da-btn-clicked')
})

const data_container = document.getElementById('container');

var createImg = function (url) {
    var img = document.createElement('img');
    img.setAttribute('src', url.data.link);
    return img;
}

ipc.on('data-recieved', function (event, data) {
    console.log('got data');
    if (data && data.length > 0) {
        for (url of data) {
            data_container.appendChild(createImg(url));
        }
    }
})
