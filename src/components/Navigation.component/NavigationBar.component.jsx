import React from 'react'
import { useDispatch ,useSelector} from 'react-redux'
import { changeModalForm,setModalDisplay } from '../../redux/modalSlice'
import { unsetCurrentUser } from '../../redux/settingsSlice'

import './nav-bar.styles.css'

const NavigationBar = ({width}) => {
    const dispatch = useDispatch()
    const {currentUser} = useSelector(state => state.settings)
    const [logout,setLogout] = React.useState(false)

    
  // console.log(width)
  return (
    <div className='nav-bar font-small' style={{gridTemplateColumns:`220px ${width-400}px 130px auto`,alignContent:'center'}}>
      <div className='logo'>LOGO</div>
      <div className="nav-btns" >
        <div className='nav-btn'>MENU</div>
        <div className='nav-btn'>TABLES</div>
        <div className='nav-btn'>HISTORY</div>
      </div>
     {
      currentUser && currentUser.user_id?
       <div  >
         {
           logout? 
           
           <div onMouseLeave={() =>setLogout(false)} onClick={() => {
             let date = new Date()
             window.settings.logout(date).then(res =>{ 
               if(res.res.ok) dispatch(unsetCurrentUser())
             })
           }} className='login-btn'  >LOGOUT</div>
           : 
           <div onMouseEnter={() =>setLogout(true)} className='login-btn' >{currentUser.user_id.toUpperCase()}</div>
         }

       </div>
       :

        <button onClick={() => {
          dispatch(setModalDisplay())
          dispatch(changeModalForm('login'))
        }} className='login-btn '>LOGIN</button>
     }
        <img className='settings-icon' src="settings.png" onClick={() => {
        dispatch(setModalDisplay())
         dispatch(changeModalForm('settings'))
        }}/>
     
    </div>
  )
}

export default NavigationBar