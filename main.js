const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");

function createWindow() {
    let bookkeepingDB = new BrowserWindow({
        title: "wallpapers",
        show: false,
        webPreferences: {
            nodeIntegration: true,
            devTools: false
        }
    });

    bookkeepingDB.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: "true"
    }))

    bookkeepingDB.once('ready-to-show', () => {
        bookkeepingDB.maximize();
        bookkeepingDB.show();
    })

    bookkeepingDB.on('closed', () => {
        bookkeepingDB = null
    })

}

// starting the main process
app.on('ready', createWindow);
