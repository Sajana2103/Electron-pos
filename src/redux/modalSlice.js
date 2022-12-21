import { createSlice } from "@reduxjs/toolkit";

const initialState = { display: 'none', form: '',_id:'',modalData:{},billStatus:false }

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setModalDisplay(state,action) {

            let modal = document.getElementById("modal-main")
        
            if(action.payload) {
                modal.style.display = action.payload
                return
                }
            // console.log('modalCreateThread', modal.style.display)
           
            if(modal.style.display === 'grid')   {
                // console.log('turning off modal')
                modal.style.display = 'none'

            } else {
                //    console.log('turning off modal')
                 modal.style.display = 'grid'
            }
               
        },
       
        changeModalForm(state, action) {
            // console.log('changeModalForm', action.payload)
             state.form = action.payload
          
        },
        changeModalData(state,action){
            state.modalData = action.payload
        },
        setMenuItemId(state,action){
            // console.log('MenuItem _id',action.payload)
            state._id = action.payload
        },
        changeBillStatus(state,action){
            console.log('change bill status',action.payload)
            state.billStatus = action.payload
        }
    }

})
export const loadModalDisplay = state => state.modal.display
export const loadModalForm = state => state.modal.form
export const {
    changeBillStatus, setModalDisplay, changeModalForm ,setDisplay,setMenuItemId,changeModalData} = modalSlice.actions
export default modalSlice.reducer