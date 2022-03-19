
import React,{ useEffect, useState } from 'react';

import logo from './logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import NavigationBar from './components/Navigation.component/NavigationBar.component';
import CategoryIndex from './components/MenuIndex.component/CategoryIndex.component';
import ItemContent from './components/ItemContent.component/ItemContent.component';
import Orders from './components/Orders.component/Orders.component';
import { calculateWindowHeight,calculateWindowWidth,  } from './redux/windowResize';
import { loadOngoingOrders,updateOrderNumber } from './redux/orderSlice';
import {changeModalForm,setModalDisplay} from './redux/modalSlice'

import './App.css';
import { addUsers, assignSettings,setCurrentUser, unsetCurrentUser } from './redux/settingsSlice';

const Container = () => {

  const dispatch = useDispatch()
  const [resizeWindowHeight, setResizeWindowHeight] = useState(window.innerHeight)
  const [resizeWindowWidth, setResizeWindowWidth] = useState(window.innerWidth)
  const shrinkWidth = useSelector(state => state.windowResize.shrink.width)
  const {currentUser} = useSelector(state => state.settings )
  console.log('Autoupdater on 0.1.4')

  useEffect(() =>{                    
    if(!currentUser){
      // console.log('no user',currentUser)
      dispatch(setModalDisplay())
      dispatch(unsetCurrentUser())
      dispatch(changeModalForm('login'))
    } else {
      dispatch(setModalDisplay())
    }
 
    let checkDate = new Date()
    // let splitDate = checkDate.split(',').shift()
    checkDate.setHours(6)
    checkDate.setMinutes(0)
    checkDate.setSeconds(0)
   
    let getDate = checkDate.getDate()
    let adddate = new Date(checkDate).setDate(getDate+1)
    let endDate = new Date(adddate)
 
    // console.log('resetTime',checkDate,getDate,endDate,stringToDate.toLocaleString())
    window.orders.timeAndOrderReset(checkDate,endDate).then(data => {
      if(data.orderNumber){
        // console.log(data)
        dispatch(updateOrderNumber(data.orderNumber))
      } else {
        // console.log(data)
      }
    })
    .catch(error => console.log('get time reset error',error))
    if(currentUser){

      window.orders.getOngoingOrders().then(orders =>{if(orders) dispatch(loadOngoingOrders(orders))})
      window.settings.getSettings().then(settings => {dispatch(assignSettings(settings))})
      window.settings.getUsers().then(users => {dispatch(addUsers(users))})
    }
    // window.orders.timeAndOrderReset(new Date().toLocaleString(),'6:00:00 AM').then(number => dispatch(updateOrderNumber(number)))

  },[currentUser])

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    window.addEventListener('resize', handleWindowResizeWidth)
      dispatch(calculateWindowHeight({height:resizeWindowHeight}))
     dispatch(calculateWindowWidth({width:resizeWindowWidth}))

    function handleWindowResize(e) {
      setResizeWindowHeight(window.innerHeight)
      window.removeEventListener('resize', handleWindowResize)
    }
    function handleWindowResizeWidth(e) {
      setResizeWindowWidth(window.innerWidth)
      window.removeEventListener('resize', handleWindowResizeWidth)
    }

  }, [resizeWindowHeight, resizeWindowWidth])
//   console.log(resizeWindowWidth - 500)
// console.log(window.api)
// console.log(shrinkWidth)
// console.timeEnd()
  return (
    <div className="App">
      <NavigationBar width={resizeWindowWidth} />
      <div className='content' style={{
        display: 'grid',
        gridTemplateColumns: `${shrinkWidth}px ${resizeWindowWidth - (shrinkWidth===200?500:500-170)}px 300px`,
      
      }}>
        <CategoryIndex props={{ height: resizeWindowHeight, width: resizeWindowWidth }} />
        <ItemContent props={{ height: resizeWindowHeight, width: resizeWindowWidth }} />
        <Orders props={{ height: resizeWindowHeight, width: resizeWindowWidth }} />


      </div>

    </div>
  );
}

export default Container;
//eywuloci
//8496f460-e6c0-4cce-bafa-4a15702cc78b