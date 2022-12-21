import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  height:window.innerHeight,
  width:window.innerWidth,
  shrink:{column:'',width:200}
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
      },
      shrinkColumn(state,action){
        // console.log('shrinkColumn',state.width)
        if(action.payload.column==='categories' ) {
          state.shrink={...action.payload}
        } 
        // else if(state.width<660){
        //   console.log('width<660',state.width)
        //   state.shrink={...action.payload}
        // }
      }
  }
})

export const {shrinkColumn,calculateWindowHeight,calculateWindowWidth} = windowResizeSlice.actions
export default windowResizeSlice.reducer