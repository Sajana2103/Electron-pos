import { createSlice } from "@reduxjs/toolkit";
import OrderedItem from "../components/Orders.component/OrderedItem";

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
    loadOngoingOrders(state,action){
      // console.log('loadONgoing orders',action.payload)
      if(!state.currentOrders.length && !state.kitchenOrders.length){

      action.payload.map((order) => {
        if(order.status ==='ongoing'  ){
            state.currentOrders.push(order)
            state.kitchenOrders.push(order)
         
        }})
      }
    },
    openNewOrder(state,action){
      // console.log(action.payload)
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
      const {item,task,portion,appendedOrder} = action.payload
      const findItem = state.newOrder.find((orderItem) => (item === orderItem.item && portion===orderItem.portion && orderItem.appendedOrder ===appendedOrder))
      console.log('addOrRemoveItems',action.payload,findItem)
      if(task === 'add'){
        findItem.quantity++
      } else if(task === 'remove'){
        findItem.quantity--
      } else{
       state.newOrder = state.newOrder.filter((item) => {
          console.log(item.item)
          return (item.item !== findItem.item || item.portion !== findItem.portion)
          })
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
      const {data,orderNumber,appendedOrder,dateAndTime} = action.payload 
      let ongoingOrder = state.currentOrders.find((item) => 
        item.orderNumber === orderNumber
      )
      console.log('ongoingOrder',ongoingOrder,'data',data)
      data.map((item) => ongoingOrder.data.push(item))
      ongoingOrder.appendedOrder = appendedOrder
      ongoingOrder.dateAndTime.push(dateAndTime)
      state.kitchenOrders.push(action.payload)
      state.newOrder = []
    },
    addItemsToKitchOrders(state,action){
      console.log('addItemsToKitchOrders',action.payload)
      state.kitchenOrders.push(action.payload)
    },
    closeBill(state,action){
      state.currentBill = action.payload
      
    },
    updateOrderNumber(state,action){
      console.log('updateOrderNumber',action.payload)
      state.orderNumber = action.payload
    },
    completeCloseBill(state,action){
      console.log(action.payload)
      state.currentOrders = state.currentOrders.filter((order) => {
        console.log(order.orderNumber)
        return (order.orderNumber !== action.payload.orderNumber)
      })
      state.kitchenOrders = state.kitchenOrders.filter((order) => {
        return order.orderNumber !== action.payload.orderNumber
      })
    },
    cancelOrder(state,action){
      console.log(action.payload)
      state.currentOrders = state.currentOrders.filter(order => {
       return order._id !== action.payload.id
      })
      state.kitchenOrders = state.kitchenOrders.filter(order => {
        return order._id !== action.payload.id
      })
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
  closeBill,
  loadOngoingOrders,
  updateOrderNumber,
  completeCloseBill,cancelOrder
  } = createOrderSlice.actions
export default createOrderSlice.reducer