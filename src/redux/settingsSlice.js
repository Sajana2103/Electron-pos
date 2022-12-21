import { createSlice } from "@reduxjs/toolkit";
let count = 0
const initialState = {
  printers:{bill:'',kitchen:''},
  currentUsers:[],
  _rev:'',
  _id:'',
  vat:0,
  serviceCharge:0,
  currentUser:null,
  syncDB:null,
  shopDetails:{ phone: '', openHours: '', address: '', logo: '' ,clientName:'My Client'}
}

const settingsSlice = createSlice({
 name: 'settings',
 initialState,
 reducers : {
  assignSettings(state,action){
    // console.log(action.payload)
    if(!action.payload) {
      // console.log('settings not found');
      return}
    state._rev = action.payload._rev?action.payload._rev:action.payload.rev
    state._id = action.payload._id
    state.printers = action.payload.printers
    state.serviceCharge = action.payload.serviceCharge
    state.vat = action.payload.vat? action.payload.vat : 0
    state.shopDetails = action.payload.shopDetails
  },
 
  addUsers(state,action){
    count++
    // console.log('COUNT',count)
    // console.log(action.payload)
    if((action.payload || action.payload.ok) && !state.currentUsers.length) {
      action.payload.map((user,id) =>  state.currentUsers.push(user))}
  },
  addUser(state,action){
    // console.log(action.payload)
    if(action.payload._id ) {
       state.currentUsers.push(action.payload)
      }
  },
  removeUsers(state,action){
    if(action.payload){
      // console.log(action.payload)
      state.currentUsers = state.currentUsers.filter((user) => {
        // console.log(user._id)
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
  },
  setClientInfo(state,action){
    if(action.payload.error){ 
      // console.log(action.payload);
      return}
    
    state.syncDB = action.payload
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
  unsetCurrentUser,
  setClientInfo
} = settingsSlice.actions
export default settingsSlice.reducer