import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    ordersToday:[],
    sort:'today',
    cardExpand:false
    
}

const sortItemsSlice = createSlice({
 name: 'sortItems',
 initialState,
 reducers : {
    getOrdersToday(state,action){
        state.ordersToday = []
        if(!state.ordersToday.length){
            state.ordersToday = action.payload
        }
    },
    changeSort(state,action){
        state.sort = action.payload
    },
    expandCard(state,action){
        state.cardExpand = !state.cardExpand
    }
    
  }
})

export const {getOrdersToday,changeSort,expandCard} = sortItemsSlice.actions
export default sortItemsSlice.reducer