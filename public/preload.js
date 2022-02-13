const MenuItemsDAO = require('../model/MenuItemsDAO')



const {
    contextBridge,
    
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        addMenuItems:MenuItemsDAO.addItem,
        getMenuItems:MenuItemsDAO.getItems,
        replicateDB:MenuItemsDAO.replicateDB,
        removeItem:MenuItemsDAO.removeItem,
        updateItem:MenuItemsDAO.updateItem,
        findItems:MenuItemsDAO.findItems
    }
);