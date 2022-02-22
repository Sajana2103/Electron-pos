import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const menuItemSlice = createSlice({
 name: 'menuItems',
 initialState,
 reducers : {
    loadMenuItems(state,action){

      console.log('loadmenuitems slice',action.payload)
      if(action.payload){
      action.payload.map((item,id) => {
     
        state.push(item)
      })

      }
    },
    addMenuItem(state,action){
      console.log(action.payload)
      let {data,result} = action.payload
   
      data._id = result.id
      state.push(data)
    },
    
  }
})

export const {loadMenuItems,addMenuItem,getCategories} = menuItemSlice.actions
export default menuItemSlice.reducer