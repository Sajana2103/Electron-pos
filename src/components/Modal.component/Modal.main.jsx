import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadModalDisplay, setModalDisplay,loadModalForm } from "../../redux/modalSlice";
import ModalFormMenuItem from "./modalForm.menuItem";
import './ModalMain.styles.css'

const ModalMain = () => {

const display = useSelector(loadModalDisplay)
const form = useSelector(loadModalForm)
const dispatch = useDispatch()
let modalForm

switch (form) {
  case 'createMenuItem':
    modalForm = <ModalFormMenuItem/>
    break;

  default:
    break;
}

  return(
    <div onClick={() =>{dispatch(setModalDisplay())}} className="modal-main" id="modal-main" style={{display:display}}>
      <div className="modal-content">
      {modalForm}
        </div>
      </div>
  )
}

export default ModalMain