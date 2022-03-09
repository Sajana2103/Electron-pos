import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: []
}

const itemCategoriesSlice = createSlice({
 name: 'itemCategories',
 initialState,
 reducers : {

    getCategories(state,action){
      if(!state.categories.length && action.payload){

      console.log('getCategories',action.payload)
      action.payload.map((category) => {
        state.categories.push(category)
      })
      }
    }
  }
})

export const {getCategories} = itemCategoriesSlice.actions
export default itemCategoriesSlice.reducer