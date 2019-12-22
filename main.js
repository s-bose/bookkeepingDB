const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");

function createWindow() {
    let quoteWidget = new BrowserWindow({
        title: "wallpapers",
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    quoteWidget.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: "true"
    }))

    quoteWidget.once('ready-to-show', () => {
        quoteWidget.show();
    })

    quoteWidget.on('closed', () => {
        quoteWidget = null
    })

}

app.on('ready', createWindow);
