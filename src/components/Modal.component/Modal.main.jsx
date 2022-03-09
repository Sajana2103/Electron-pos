import React,{memo} from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadModalDisplay, setModalDisplay,loadModalForm } from "../../redux/modalSlice";
import ModalFormMenuItem from "./modalForm.menuItem";
import MenuItemModal from "./modal.menuItem";
import BillModal from "./Bill.Modal";
import './ModalMain.styles.css'

const ModalMain = () => {
const dispatch = useDispatch()
   let modal = document.getElementById("modal-main")
   let modalContent = document.getElementById("modal-content")
  window.onclick = function (e) {
    // console.log(e.target)
    if (e.target === modal && e.target !== modalContent) {
      // console.log(e.target)
      //     console.log(modal.style.display)
      dispatch(setModalDisplay('none'))
    }
  }
const windowResize = useSelector(state => state.windowResize)
console.log('windowResize',windowResize)
const display = useSelector(loadModalDisplay)
const form = useSelector(loadModalForm)

let modalForm

switch (form) {
  case 'createMenuItem':
    modalForm = <ModalFormMenuItem/>
    break;
  case 'loadMenuItem':
    modalForm = <MenuItemModal/>
    break;
  case 'loadCloseBill':
    modalForm = <BillModal/>
    break;
  default:
    break;
}
console.log(display)
  return(
    <div className="modal-main" id="modal-main" 
    style={{display:display,width:form==='loadCloseBill'? windowResize.width : windowResize.width-300
    ,}}>
      <div className="modal-content" id="modal-content" >
      {modalForm}
        </div>
      </div>
  )
}

export default ModalMain