import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  height:window.innerHeight,
  width:window.innerWidth
}

const windowResizeSlice = createSlice({
 name: 'windowResize',
 initialState,
 reducers : {

    calculateWindowHeight(state,action){
      let {height} = action.payload
      state.height = height
      },
      calculateWindowWidth(state,action){
      let {width} = action.payload
      state.width = width
      }
  }
})

export const {calculateWindowHeight,calculateWindowWidth} = windowResizeSlice.actions
export default windowResizeSlice.reducer