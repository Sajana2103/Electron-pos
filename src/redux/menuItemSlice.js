import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items:[],
  itemModal:'',
  dishes:[],
  updateItem:{
    update:false,
    item:''
  },
}

const menuItemSlice = createSlice({
 name: 'menuItems',
 initialState,
 reducers : {
    loadMenuItems(state,action){

      console.log('loadmenuitems slice',action.payload)
      if(action.payload && !state.items.length){
      action.payload.map((item,id) => {
     
        state.items.push(item)
      })

      }
    },
    addMenuItem(state,action){
      console.log(action.payload)
      let {data,result} = action.payload
   
      data._id = result.id
      state.items.push(data)
    },
    removeItemFromState(state,action){
      console.log('remove items',action.payload)
      state.items = state.items.filter((item) => {
        return item._id !== action.payload
      })
     return
    },
    currentItemModal(state,action){
      if(!action.payload) return
      const menuItem = action.payload
      state.itemModal = action.payload
    },
    resetCurrentItemModal(state,action){
      state.itemModal = ''
    },
    updateMenuItem(state,action){
      console.log(action.payload)
      state.updateItem = action.payload
    },
    modifyUpdateItem(state,action){
       console.log('modifyUpdateItem',action.payload)
    state.items.map((item) => {
        if(item._id===action.payload._id){
          for(let key in action.payload){
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
  removeItemFromState,
  currentItemModal,
  resetCurrentItemModal,
  addDishTypes,
  addDish,
  updateMenuItem,
  modifyUpdateItem
  } = menuItemSlice.actions
export default menuItemSlice.reducer