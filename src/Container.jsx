

import logo from './logo.svg';
import NavigationBar from './components/Navigation.component/NavigationBar.component';
import CategoryIndex from './components/MenuIndex.component/CategoryIndex.component';
import ItemContent from './components/ItemContent.component/ItemContent.component';
import Orders from './components/Orders.component/Orders.component';



import './App.css';
import { useEffect, useState } from 'react';


const Container = () => {


    const [resizeWindowHeight, setResizeWindowHeight] = useState(window.innerHeight)
    const [resizeWindowWidth, setResizeWindowWidth] = useState(window.innerWidth)
 
    useEffect(() => {

        window.addEventListener('resize', handleWindowResize)
        window.addEventListener('resize', handleWindowResizeWidth)

        function handleWindowResize(e) {
            setResizeWindowHeight(window.innerHeight)
            window.removeEventListener('resize', handleWindowResize)
        }
        function handleWindowResizeWidth(e) {
            setResizeWindowWidth(window.innerWidth)
            window.removeEventListener('resize', handleWindowResizeWidth)
        }

    }, [resizeWindowHeight, resizeWindowWidth])
  console.log(resizeWindowHeight,window.innerHeight)

 
  console.log(window.api)

  return (
    <div className="App">
      <NavigationBar width={resizeWindowWidth}/>
      <div className='content' style={{
        display: 'grid',
        gridTemplateColumns: `200px ${resizeWindowWidth-400}px 200px`,
        columnGap: '10px'
      }}>
        <CategoryIndex props={{height:resizeWindowHeight,width:resizeWindowWidth}}/>
        <ItemContent props={{height:resizeWindowHeight,width:resizeWindowWidth}}/>
        <Orders props={{height:resizeWindowHeight,width:resizeWindowWidth}}/>
      

      </div>

    </div>
  );
}

export default Container;
//eywuloci
//8496f460-e6c0-4cce-bafa-4a15702cc78b