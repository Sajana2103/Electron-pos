import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const itemCategoriesSlice = createSlice({
 name: 'itemCategories',
 initialState,
 reducers : {

    getCategories(state,action){
      console.log('getCategories',action.payload)
      action.payload.map((category) => {
        state.push(category)
      })
    }
  }
})

export const {getCategories} = itemCategoriesSlice.actions
export default itemCategoriesSlice.reducer