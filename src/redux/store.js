import {configureStore} from '@reduxjs/toolkit'
import modalReducer from './modalSlice'
import menuItemsReducer from './menuItemSlice'
import itemCategoriesReducer from './itemCategoriesSlice'
import createOrderReducer from './orderSlice'
import windowResizeReducer from './windowResize'
import settingsReducer from './settingsSlice'
import ordersHistorySlice from './orderHistorySlice'
import navigationSlice from './navigationSlice'
import tablesSlice from './tablesSlice'

export default configureStore({
  reducer:{
    modal : modalReducer,
    menuItems: menuItemsReducer,
    itemCategories: itemCategoriesReducer,
    orders:createOrderReducer,
    windowResize: windowResizeReducer,
    settings: settingsReducer,
    ordersHistory: ordersHistorySlice,
    navigation:navigationSlice,
    tables:tablesSlice
  }
})