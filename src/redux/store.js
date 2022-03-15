import {configureStore} from '@reduxjs/toolkit'
import modalReducer from './modalSlice'
import menuItemsReducer from './menuItemSlice'
import itemCategoriesReducer from './itemCategoriesSlice'
import createOrderReducer from './orderSlice'
import windowResizeReducer from './windowResize'
import settingsReducer from './settingsSlice'

export default configureStore({
  reducer:{
    modal : modalReducer,
    menuItems: menuItemsReducer,
    itemCategories: itemCategoriesReducer,
    orders:createOrderReducer,
    windowResize: windowResizeReducer,
    settings: settingsReducer
  }
})