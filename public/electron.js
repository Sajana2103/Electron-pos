const path = require("path");
const cp = require('child_process')
const fs = require('fs')
require('@electron/remote/main').initialize()
const { app, BrowserWindow, ipcMain, dialog } = require("electron")
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
let childWindow
async function createWindow() {
  // Create the browser window.

  win = new BrowserWindow({
    width: 1024,
    height: 1024,
    autoHideMenuBar:true,
    webPreferences: {
         enableRemoteModule: false,
         nodeIntegration:true,
         contextIsolation:true,
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

async function createChildWindow (printItem){
  childWindow = new BrowserWindow({
		width: 300,
		height: 800,
		modal: true,
		show: false,
		parent: win,
		webPreferences: {
			contextIsolation: false,
			enableRemoteModule: true,
      nodeIntegrationInSubFrames:true,
      nodeIntegration:true
		}
	})

	childWindow.loadFile(path.join(__dirname,`${printItem}.html`))

	childWindow.webContents.getPrintersAsync().then(data => data.map((device) => console.log(device.name)))
	childWindow.once('ready-to-show', () => {
		childWindow.show()
		console.log('printerName')
	})
}

app.whenReady().then(() => {

  createWindow()

  if(isDev){
    installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log(`Added Extension : ${name}`))
    .catch(error => console.log(`An error occurred : ${error}`))
  }
});

app.on("window-all-closed", (e) => {
  e.preventDefault()

  if (process.platform !== "darwin") {
    app.quit();
  }
});


ipcMain.on('print-bill',(e,arg) =>{
  console.log('print-bill',arg)
  e.sender.send('bill',{not_right:false})
  console.log(arg)
  let {printItem,printer} = arg.printItem
  createChildWindow(printItem)

  childWindow.webContents.send('bill-window',arg)
  
	childWindow.webContents.once('did-finish-load', async() => {
		// console.log('webContents',win2.webContents)
  await childWindow.webContents.send('bill-window',arg)
try{

 		console.log('createChildWindow')
		// await childWindow.webContents.print({
		// 	deviceName:printer,
    //   silent:true,
		// 	color: false,     

		// 	landscape: false,
		// 	scale:200,
    //   collate:true,
  
		// })
                
}catch(error){
  console.log(error)
}
})
})

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
