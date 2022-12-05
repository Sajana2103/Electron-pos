import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  content:'menuitems'
}

const navigationSlice = createSlice({
 name: 'navigation',
 initialState,
 reducers : {

    navigate(state,action){
      if(action.payload){
          console.log(action.payload)
        state.content = action.payload
      }
    }
  },
  
})

export const {navigate} = navigationSlice.actions
export default navigationSlice.reducer