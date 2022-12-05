import React from 'react'
import { useDispatch ,useSelector} from 'react-redux'
import { changeModalForm,setModalDisplay } from '../../redux/modalSlice'
import { unsetCurrentUser } from '../../redux/settingsSlice'
import { navigate } from '../../redux/navigationSlice'
import './nav-bar.styles.css'

const NavigationBar = ({width}) => {
    const dispatch = useDispatch()
    const {currentUser,shopDetails} = useSelector(state => state.settings)
    const [logout,setLogout] = React.useState(false)

    
  // console.log(currentUser)
  return (
    <div className='nav-bar font-small' style={{gridTemplateColumns:`200px ${width-400}px 130px auto`,alignContent:'center',alignItems:'center'}}>
    {
      shopDetails && shopDetails.logo ?
     <div className=' logoMain'>
      <img className="invert sizeSmall" src={shopDetails.logo?shopDetails.logo:''}/>
     </div>
     :
  
       <span style={{color:'white'}}>Logo</span>


    }

      <div className="nav-btns" >
        <div onClick={() => dispatch(navigate('menuitems'))}  className='nav-btn'>MENU</div>
        <div onClick={() => dispatch(navigate('tables'))}  className='nav-btn'>TABLES</div>
        <div onClick={() => dispatch(navigate('history'))} className='nav-btn'>HISTORY</div>
      </div>
     {
      currentUser && currentUser.user_id?
       <div  >
         {
           logout? 
           
           <div onMouseLeave={() =>setLogout(false)} onClick={() => {
             let date = new Date()
             window.settings.logout(date).then(res =>{ 
              //  console.log(res)
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
     {
       currentUser && currentUser.role==='admin'?
       <img className='settings-icon invert' src="settings.png" onClick={() => {
       dispatch(setModalDisplay())
        dispatch(changeModalForm('settings'))
       }}/>
       : <></>

     }
     
    </div>
  )
}

export default NavigationBar