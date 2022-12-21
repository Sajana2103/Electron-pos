import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  content:'menuitems',
  showImage:false
}

const navigationSlice = createSlice({
 name: 'navigation',
 initialState,
 reducers : {

    navigate(state,action){
      if(action.payload){
          // console.log(action.payload)
        state.content = action.payload
      }
    },
    setImage(state,action){
   
      state.showImage = !state.showImage
    }
  },
  
})

export const {navigate,setImage} = navigationSlice.actions
export default navigationSlice.reducer