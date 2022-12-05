const MenuItemsDAO = require('../model/MenuItemsDAO')
const OrdersDAO = require('../model/OrdersDAO')
const SettingsDAO = require('../model/SettingsDAO')
const TablesReservationsDAO = require('../model/TablesReservationsDAO')

const { ipcRenderer } = require('electron')


const printBill = async (data) => {
    await ipcRenderer.send('print-bill',data)
    ipcRenderer.on('bill',(event,arg) => {
        console.log('ipcRenderer bill',arg,data)
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
    
        getDishTypes:MenuItemsDAO.dishType,
        addDish:MenuItemsDAO.createDishType,
   
    }
);
contextBridge.exposeInMainWorld(
    "orders",{
        createOrder:OrdersDAO.createOrder,
        getOngoingOrders:OrdersDAO.getOngoingOrders,
        timeAndOrderReset:OrdersDAO.timeAndOrderReset,
        getLastOrder:OrdersDAO.getLastOrder,
        removeOrder:OrdersDAO.removeOrder,
        completeOrCancelOrder:OrdersDAO.completeOrCancelOrder,
        getAllOrders:OrdersDAO.getAllOrders,
        addNewTable:OrdersDAO.addNewTable,
        getAllTables:OrdersDAO.getAllTables,
        removeTable:OrdersDAO.removeTable
    }
)
contextBridge.exposeInMainWorld(
    "settings",{
        createUser:SettingsDAO.createUser,
        createSettings:SettingsDAO.createSettings,
        getSettings:SettingsDAO.getSettings,
        getUsers:SettingsDAO.getUsers,
        removeDoc:SettingsDAO.removeDoc,
        login:SettingsDAO.login,
        getCurrentUser:SettingsDAO.getCurrentUser,
        logout:SettingsDAO.logout,
        setClientInfo:SettingsDAO.setClientInfo,
        getClientInfo:SettingsDAO.getClientInfo
    }

)
contextBridge.exposeInMainWorld(
    "tablesReservations", {
        addNewTable:TablesReservationsDAO.addNewTable,
        getAllTables:TablesReservationsDAO.getAllTables,
        removeTable:TablesReservationsDAO.removeTable,
        updateTable:TablesReservationsDAO.updateTable,
        addReservation:TablesReservationsDAO.addReservation,
        updateReservation:TablesReservationsDAO.updateReservation,
        loadReservations:TablesReservationsDAO.loadReservations,
        loadReservations:TablesReservationsDAO.loadReservations
    })