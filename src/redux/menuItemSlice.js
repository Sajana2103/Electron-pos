import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  savedItems:[],
  itemModal: '',
  dishes: [],
  updateItem: {
    update: false,
    item: ''
  },
  itemCategories : []
}

const menuItemSlice = createSlice({
  name: 'menuItems',
  initialState,
  reducers: {
    loadMenuItems(state, action) {

      let category = new Set()
      console.log('loadmenuitems slice',action.payload)
      if (action.payload && !state.items.length && !state.itemCategories.length) {
        action.payload.sort((a, b) => {
          // console.log(a.category,b.category)
          if(a.category===undefined) a.category='Non Categorized'
          return a.category.localeCompare(b.category)})
        action.payload.map((item, id) => {
          category.add(item.category)
          state.items.push(item)
          state.savedItems.push(item)
        })
        category.forEach((item) => 
        state.itemCategories.push(item)
        )
        state.itemCategories.sort((a,b) => a.localeCompare(b))
        
      }
    },
    addCategory(state,action){
       
      if(action.payload){
        let hasItem  = state.itemCategories.find((item) => { return item===action.payload})
        if(!hasItem){
          state.itemCategories.push(action.payload)
          state.itemCategories.sort((a,b) => a.localeCompare(b))
        }
      }
    },
    filterByCategory(state,action){
      const id = action.payload
      console.log(action.payload)
      if(id==='allItems') {console.log('allItems'); state.items =  state.savedItems ;return}
      state.items =  state.savedItems 
      state.items = state.items.filter((item) => {
 
      if(item.category) return item.category.toLowerCase() === id.toLowerCase()
      
     })


    },
    addMenuItem(state, action) {
      console.log(action.payload)
      
      let { data, result } = action.payload

      data._id = result.id
      state.items.push(data)
      state.savedItems.push(data)
    },
    removeItemFromState(state, action) {
      console.log('remove items', action.payload)
      state.items = state.items.filter((item) => {
        return item._id !== action.payload
      })
      
      return
    },
    currentItemModal(state, action) {
      if (!action.payload) return
      const menuItem = action.payload
      state.itemModal = action.payload
    },
    resetCurrentItemModal(state, action) {
      state.itemModal = ''
    },
    updateMenuItem(state, action) {
      console.log(action.payload)
      state.updateItem = action.payload
    },
    modifyUpdateItem(state, action) {
      console.log('modifyUpdateItem', action.payload)
      state.items.map((item) => {
        if (item._id === action.payload._id) {
          for (let key in action.payload) {
            item[key] = action.payload[key]
          }
        }
      })
    

    }
  }
})

export const {
  loadMenuItems,
  addMenuItem,
  getCategories,
  addCategory,
  removeItemFromState,
  currentItemModal,
  resetCurrentItemModal,
  addDishTypes,
  addDish,
  updateMenuItem,
  modifyUpdateItem,
  filterByCategory
} = menuItemSlice.actions
export default menuItemSlice.reducer