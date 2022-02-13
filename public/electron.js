const path = require("path");
const cp = require('child_process')
const server = require('../server/index')
require('@electron/remote/main').initialize()
const { app, BrowserWindow } = require("electron")
// const fs = require("@electron/get/node_modules/fs-extra/lib/fs/index")
async function startServer(){
  cp.execFile('node', [`${path.join(__dirname,'../server/index.js')}`])
}
const isDev = require("electron-is-dev");

let installExtension, REACT_DEVELOPER_TOOLS; 


if (isDev) {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

if (require("electron-squirrel-startup")) {
  app.quit();
}
let win
async function createWindow() {
  // Create the browser window.

  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
         enableRemoteModule: false,
         
    preload: path.resolve(__dirname,'preload.js')
    },
    
  });
    win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
    if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

app.whenReady().then(() => {

  startServer()
  createWindow()

  if(isDev){
    installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log(`Added Extension : ${name}`))
    .catch(error => console.log(`An error occurred : ${error}`))
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});


app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
