import { createSlice } from "@reduxjs/toolkit";

const initialState = { display: 'none', form: '' }

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setModalDisplay(state) {
            let modal = document.getElementById("modal-main")
            console.log('modalCreateThread', modal)
            if (modal.style.display  === 'none') {
                 modal.style.display = "grid"   
                
            } else {
              
                window.onclick = function (e) {
                    console.log(e.target)
                    if (e.target === modal) {
                    //     console.log(modal.style.display)
                        modal.style.display = "none"
                    }
                }
            }
        },
        changeModalForm(state, action) {
            console.log('changeModalForm', action.payload)
           state.form = action.payload
        }
    }

})
export const loadModalDisplay = state => state.modal.display
export const loadModalForm = state => state.modal.form
export const { setModalDisplay, changeModalForm } = modalSlice.actions
export default modalSlice.reducer