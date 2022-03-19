const path = require("path");
require('update-electron-app')()
require('@electron/remote/main').initialize()
const {autoUpdater } = require('electron-updater')
const { app, BrowserWindow, ipcMain, dialog } = require("electron")
const isDev = require("electron-is-dev");
const log = require('electron-log');


let installExtension, REACT_DEVELOPER_TOOLS; 

let template = []
if (process.platform === 'darwin') {
  // OS X
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.quit(); }
      },
    ]
  })
}
function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});


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
let win2
function createDefaultWindow() {
  win2 = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
  win.loadURL(path.join(__dirname,`updater-#v${app.getVersion()}.html`));
  return win;
}
async function createWindow() {
  // Create the browser window.

  win = new BrowserWindow({
    width: 1024,
    height: 1024,
    autoHideMenuBar:true,
    webPreferences: {
         enableRemoteModule: false,
         nodeIntegration:true,
         contextIsolation:false,
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
  let {printItem,printer} = arg
  createChildWindow(printItem)

  childWindow.webContents.send('bill-window',arg)
  
	childWindow.webContents.once('did-finish-load', async() => {
    const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });


  }
		// console.log('webContents',win2.webContents)
  await childWindow.webContents.send('bill-window',arg)
try{

 		console.log('createChildWindow')
		await childWindow.webContents.print({
			deviceName:printer,
      silent:true,
			color: false,     

			landscape: false,
			
      collate:true,
      margins:{
        marginType:'none'
      }
		})
                
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
// autoUpdater.on('update-available', () => {
//   mainWindow.webContents.send('update_available');
// });
// autoUpdater.on('update-downloaded', () => {
//   mainWindow.webContents.send('update_downloaded');
// });