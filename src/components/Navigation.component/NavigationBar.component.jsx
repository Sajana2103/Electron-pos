import React from 'react'
import { useDispatch } from 'react-redux'
import { changeModalForm,setModalDisplay } from '../../redux/modalSlice'
import './nav-bar.styles.css'

const NavigationBar = ({width}) => {
    const dispatch = useDispatch()
  // console.log(width)
  return (
    <div className='nav-bar font-small' style={{gridTemplateColumns:`220px ${width-400}px 130px auto`,alignContent:'center'}}>
      <div className='logo'>LOGO</div>
      <div className="nav-btns" >
        <div className='nav-btn'>MENU</div>
        <div className='nav-btn'>TABLES</div>
        <div className='nav-btn'>HISTORY</div>
      </div>
     
        <div className='nav-btn'>LOGIN</div>
        <img className='settings-icon' src="settings.png" onClick={() => {
        dispatch(setModalDisplay())
         dispatch(changeModalForm('settings'))
        }}/>
     
    </div>
  )
}

export default NavigationBar