const MenuItemsDAO = require('../model/MenuItemsDAO')
const OrdersDAO = require('../model/OrdersDAO')
const SettingsDAO = require('../model/SettingsDAO')
const { ipcRenderer } = require('electron')


const printBill = async (data) => {
    await ipcRenderer.send('print-bill',data)
    ipcRenderer.on('bill',(event,arg) => {
        console.log('ipcRenderer bill',arg)
    })
}
let path
const addImage =  (data) => {
    ipcRenderer.send('add-image',data)
    console.log(data)
    // await ipcRenderer.on('add-image-path', arg => {
    //     console.log(arg)
    // })
//  ipcRenderer.on('add-image-path', (e,arg) => {
//         console.log('get image',arg)
//         path = arg
//         getImage(path)
//     })
}
console.log('path',path)
const getImage = async ( path) => {

    return path
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
        addImage:addImage,
        allDocs:MenuItemsDAO.getAll,
        getDishTypes:MenuItemsDAO.dishType,
        addDish:MenuItemsDAO.createDishType
    }
);
contextBridge.exposeInMainWorld(
    "orders",{
        createOrder:OrdersDAO.createOrder,
        getOngoingOrders:OrdersDAO.getOngoingOrders,
        timeAndOrderReset:OrdersDAO.timeAndOrderReset,
        getLastOrder:OrdersDAO.getLastOrder,
        removeOrder:OrdersDAO.removeOrder,
        completeOrCancelOrder:OrdersDAO.completeOrCancelOrder
    }
)
contextBridge.exposeInMainWorld(
    "settings",{
        createUser:SettingsDAO.createUser,
        createSettings:SettingsDAO.createSettings,
        getSettings:SettingsDAO.getSettings,
        getUsers:SettingsDAO.getUsers,
        removeDoc:SettingsDAO.removeDoc
    }
)