

import logo from './logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import NavigationBar from './components/Navigation.component/NavigationBar.component';
import CategoryIndex from './components/MenuIndex.component/CategoryIndex.component';
import ItemContent from './components/ItemContent.component/ItemContent.component';
import Orders from './components/Orders.component/Orders.component';
import { calculateWindowHeight,calculateWindowWidth, shrinkColumn } from './redux/windowResize';
import { addDishTypes } from './redux/menuItemSlice';
import { loadOngoingOrders,updateOrderNumber } from './redux/orderSlice';

import './App.css';
import { useEffect, useState } from 'react';

const Container = () => {
  console.time()
  const dispatch = useDispatch()
  const [resizeWindowHeight, setResizeWindowHeight] = useState(window.innerHeight)
  const [resizeWindowWidth, setResizeWindowWidth] = useState(window.innerWidth)
  const shrinkWidth = useSelector(state => state.windowResize.shrink.width)
  console.log(shrinkWidth)

  useEffect(() =>{                    

    window.orders.timeAndOrderReset(new Date().toLocaleString(),'6:00:00 AM').then(number => dispatch(updateOrderNumber(number)))
    window.orders.getOngoingOrders().then(data => dispatch(loadOngoingOrders(data)))
    // window.api.allDocs().then(data => console.log(data))
  },[])

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
console.log(shrinkWidth)
console.timeEnd()
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