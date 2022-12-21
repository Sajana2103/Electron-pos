import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tables: [],
  vacantTables: [],
  addNewTables:false,
  reservations:[],
  reservationTime:null

}

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    loadTables(state, action) {
      if (!state.tables.length) {
        action.payload.map((table) => {
          state.tables.push(table)
          if (table.status === 'Vacant') state.vacantTables.push(table)
        })
      }
      state.tables.sort((a,b) => {
        return a.number - b.number
      })
      state.vacantTables.sort((a,b) => {
        return a.number - b.number
      })
   
    },
    addTable(state, action) {
      let hasTableNumber = state.tables.find((table) => {
        return( table.number === action.payload.number && table.location === action.payload.location)
      })
      if (!hasTableNumber) {
        // console.log(action.payload)
        state.tables.push(action.payload)
      }
    },
    removeTable(state,action){
      state.tables = state.tables.filter(table => {
        return table._id !== action.payload
      })
    },
    updateTableState(state,action){
      if(action.payload._id){
        state.tables.map((table) => {
          if (table._id === action.payload._id) {
            for (let key in action.payload) {
              table[key] = action.payload[key]
            }
          }
        })
      } 
    },
    addOrUpdate(state,action){
      state.addNewTables = action.payload
    
    },
    loadReservations(state,action){
      console.log(action.payload)
      if(!state.reservations.length){

        action.payload.map(reservation => {
          state.reservations.push(reservation)
        })
      }
    },
    addReservations(state,action){
      state.reservations.push(action.payload)
    },
    removeReservation(state,action){
      // console.log(action.payload)
      state.reservations = state.reservations.filter(reservation => {
        return reservation._id !== action.payload
      })
    },
    updateReservationState(state,action){
      if(action.payload._id){
        state.reservations.map((reservation) => {
          if (reservation._id === action.payload._id) {
            for (let key in action.payload) {
              reservation[key] = action.payload[key]
            }
          }
        })
      }
    },
    getReservationTime(state,action){
      state.reservationTime =action.payload
    }
  },

})

export const { addTable,
  loadTables,
  addOrUpdate,
  loadReservations,
  addReservations,
  removeTable,
  updateTableState,
  getReservationTime,
  updateReservationState,
  removeReservation
 } = tablesSlice.actions
export default tablesSlice.reducer