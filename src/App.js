import React, { useEffect } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { setCurrentUser } from './redux/settingsSlice'
import Container from './Container'
import ModalMain from './components/Modal.component/Modal.main'
import './fonts.styles.css'

const App = () => {

  const dispatch = useDispatch()
useEffect(() =>{
  window.settings.getCurrentUser().then(currentUser => {
    if(currentUser.token) {
      console.log(currentUser);
      dispatch(setCurrentUser(currentUser))
    } else{
      console.log(currentUser)
    }})
},[])
  return(
  <>
    <ModalMain/>
    <Container/>
  </>
  )
}

export default App
