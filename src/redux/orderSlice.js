import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderNumber : 1,
  currentOrders: [],
  kitchenOrders:[],
  newOrder:[],
  appendOrder:{
    canAddNewItems:false,
    orderNumber:'',
    table:'',
    appendedOrder:0
    },
  currentBill : {}
}

const createOrderSlice = createSlice({
 name: 'orders',
 initialState,
 reducers : {

    openNewOrder(state,action){
      console.log(action.payload)
     state.newOrder.push(action.payload)
      
    },
    addNewOrder(state,action){
     
      state.currentOrders.push(action.payload)
      state.kitchenOrders.push(action.payload)
      state.newOrder = []
      state.orderNumber++
    },
    clearNewOrder(state,action){
      state.newOrder= []
    },
    addOrRemoveItems(state,action){
      const {item,task} = action.payload
      const findItem = state.newOrder.find((orderItem) => item === orderItem.item)
      console.log('addOrRemoveItems',action.payload,findItem.price)
      if(task === 'add'){
        findItem.quantity++
      } else if(task === 'remove'){
        findItem.quantity--
      } else{
       state.newOrder = state.newOrder.filter((item) => {
          console.log(item.item)
          return item.item !== findItem.item})
      }
    },
    appendOrder(state,action){
        state.appendOrder = action.payload
    },
    addItemsToExistingOrder(state,action){
      state.newOrder.push(action.payload)
    },
    addItemsToOngoingOrder(state,action){
      console.log('addItemsToOngoingOrder',action.payload)
      const {data,orderNumber,appendedOrder} = action.payload 
      let ongoingOrder = state.currentOrders.find((item) => 
        item.orderNumber === orderNumber
      )
      data.map((item) => ongoingOrder.data.push(item))
      ongoingOrder.appendedOrder = appendedOrder
      state.kitchenOrders.push(action.payload)
      state.newOrder = []
    },
    addItemsToKitchOrders(state,action){
      console.log('addItemsToKitchOrders',action.payload)
      state.kitchenOrders.push(action.payload)
    },
    closeBill(state,action){
      state.currentBill = action.payload
    }
  }
})

export const {
  openNewOrder,
  addNewOrder,
  clearNewOrder,
  addOrRemoveItems,
  appendOrder,
  addItemsToExistingOrder,
  addItemsToOngoingOrder,
  addItemsToKitchOrders,
  closeBill
  } = createOrderSlice.actions
export default createOrderSlice.reducer