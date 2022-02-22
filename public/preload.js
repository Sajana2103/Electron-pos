const MenuItemsDAO = require('../model/MenuItemsDAO')
const { ipcRenderer } = require('electron')


const printBill = async (data) => {
    await ipcRenderer.send('print-bill',data)
    ipcRenderer.on('bill',(event,arg) => {
        console.log('ipcRenderer bill',arg)
    })
}

const {
    contextBridge,
    
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        addMenuItem:MenuItemsDAO.addItem,
        getMenuItems:MenuItemsDAO.getMenuItems,
        replicateDB:MenuItemsDAO.replicateDB,
        removeItem:MenuItemsDAO.removeItem,
        updateItem:MenuItemsDAO.updateItem,
        findItems:MenuItemsDAO.findItems,
        createItemCategory:MenuItemsDAO.createMenuItemCategory,
        getItemCategories:MenuItemsDAO.getMenuItemCategories,
        printBill:printBill,      
      
    }
);