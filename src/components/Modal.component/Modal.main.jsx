import React,{memo} from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadModalDisplay, setModalDisplay,loadModalForm } from "../../redux/modalSlice";
import ModalFormMenuItem from "./modalForm.menuItem";
import MenuItemModal from "./modal.menuItem";
import BillModal from "./Bill.Modal";
import SettingsModal from "./Settings.Modal";
import OrderCardModal from "./OrderCard.Modal";
import Login from './Login.Modal'
import './ModalMain.styles.css'
import AddTableModal from "./Modal.Tables";
import AddReservationModal from "./Reservations.Modal";
import SalesReport from "./SalesReport.Modal";

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
// console.log('windowResize',windowResize)
const display = useSelector(loadModalDisplay)
const form = useSelector(state => state.modal.form)

let modalForm
// console.log(form)
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
  case 'settings':
    modalForm = <SettingsModal/>
    break;
  case 'login' :
    modalForm = <Login/>
    break;
  case 'orderCardModal' :
    modalForm = <OrderCardModal/>
  break;
  case 'addTable' :
    modalForm = <AddTableModal/>
  break;
  case 'addReservation' :
    modalForm = <AddReservationModal/>
  break;
  case 'salesReport' :
    modalForm = <SalesReport/>
    break;
  default:
    break;
}
// console.log(display)
  return(
    <div className="modal-main" id="modal-main" 
    style={{display:display,width:form==='loadCloseBill' || form==='settings' || form==='login'? windowResize.width : windowResize.width-300
    ,}}>
      <div className="modal-content" id="modal-content" >
      {modalForm}
        </div>
      </div>
  )
}

export default ModalMain