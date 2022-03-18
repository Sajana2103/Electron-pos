import { createSlice } from "@reduxjs/toolkit";
let count = 0
const initialState = {
  printers:{bill:'',kitchen:''},
  currentUsers:[],
  _rev:'',
  _id:'',
  serviceCharge:0,
  currentUser:null
}

const settingsSlice = createSlice({
 name: 'settings',
 initialState,
 reducers : {
  assignSettings(state,action){
    // console.log(action.payload)
    state._rev = action.payload._rev?action.payload._rev:action.payload.rev
    state._id = action.payload._id
    state.printers = action.payload.printers
    state.serviceCharge = action.payload.serviceCharge
  },
 
  addUsers(state,action){
    count++
    console.log('COUNT',count)
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
  },
  setCurrentUser(state,action){
    console.log(action.payload)
    state.currentUser = action.payload.token
  },
  unsetCurrentUser(state,action){
    state.currentUser = null
  }
  }
})

export const {
  assignSettings,
  assignServiceCharge,
  addUsers,
  addUser,
  removeUsers,
  setCurrentUser,
  unsetCurrentUser
} = settingsSlice.actions
export default settingsSlice.reducer