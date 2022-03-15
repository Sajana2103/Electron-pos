import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  printers:{bill:'',kitchen:''},
  currentUsers:[],
  _rev:'',
  _id:'',
  serviceCharge:0,

}

const settingsSlice = createSlice({
 name: 'settings',
 initialState,
 reducers : {
  assignSettings(state,action){
    console.log(action.payload)
    state._rev = action.payload._rev
    state._id = action.payload._id
    state.printers = action.payload.printers
    state.serviceCharge = action.payload.serviceCharge
  },
 
  addUsers(state,action){
    console.log(action.payload)
    if(action.payload || action.payload.ok) {
      action.payload.map((user,id) =>  state.currentUsers.push(user))}
  },
  addUser(state,action){
    console.log(action.payload)
    if(action.payload._id) {
       state.currentUsers.push(action.payload)}
  },
  removeUsers(state,action){
    if(action.payload){
      console.log(action.payload)
      state.currentUsers = state.currentUsers.filter((user) => {
        console.log(user._id)
        return user._id !== action.payload
      })
    }
  }
  }
})

export const {
  assignSettings,
  assignServiceCharge,
  addUsers,
  addUser,
  removeUsers
} = settingsSlice.actions
export default settingsSlice.reducer