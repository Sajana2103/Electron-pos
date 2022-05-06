import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  filteredMenuItems:[],
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
      // console.log('loadmenuitems slice',action.payload)
      if (action.payload && !state.items.length) {
        action.payload.map((item, id) => {
          category.add(item.category)
          state.items.push(item)
          
        })
        category.forEach((item) => 
        state.itemCategories.push(item)
        )
        state.itemCategories.sort((a,b) => a.localeCompare(b))
        
      }
    },
    filterByCategory(state,action){
      const id = action.payload
      console.log(action.payload)
      if(id==='allItems') {console.log('allItems'); state.filteredMenuItems = state.items;return}
      state.filteredMenuItems = state.items
      state.filteredMenuItems = state.filteredMenuItems.filter((item) => {
 
      if(item.category) return item.category.toLowerCase() === id.toLowerCase()
      
     })


    },
    addMenuItem(state, action) {
      console.log(action.payload)
      
      let { data, result } = action.payload

      data._id = result.id
      state.items.push(data)
      state.filteredMenuItems = []
      state.filteredMenuItems = state.items
    },
    removeItemFromState(state, action) {
      console.log('remove items', action.payload)
      state.items = state.items.filter((item) => {
        return item._id !== action.payload
      })
      state.filteredMenuItems = state.items
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
      state.filteredMenuItems = state.items

    }
  }
})

export const {
  loadMenuItems,
  addMenuItem,
  getCategories,
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