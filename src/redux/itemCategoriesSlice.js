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
    },
    addNewCategory(state,action){
      console.log(action.payload)
     
      let hasCategory =  state.categories.find((category) => {
        return category === action.payload
      })
      if(!hasCategory) state.categories.push(action.payload)
    }
  },
  
})

export const {getCategories,addNewCategory} = itemCategoriesSlice.actions
export default itemCategoriesSlice.reducer