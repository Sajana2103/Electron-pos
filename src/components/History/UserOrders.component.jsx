import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SortOrders from './Sort'
import SortByDate from './SortByDate'
import './Client.styles.css'

const UserOrders = ({props}) => {
   
    const dispatch = useDispatch()
    const { sortedOrdersByDate} = useSelector(state => state.ordersHistory)
    const {sort} = useSelector(state => state.orders)
    const {width,height} = useSelector(state => state.windowResize)
    console.log(sortedOrdersByDate)
  
    return (
        <div className='item-content' style={{ height: `${height - 80}px`, width: `${width - 400}` }}>
            
            <SortOrders />

           
            <div style={{gridTemplateRows:'repeat(auto,auto)',overflow:'scroll',overflowY:'scroll',height:height-130}}>
              {
                  Object.keys(sortedOrdersByDate).length?
                  Object.keys(sortedOrdersByDate).map((key,idx) => {
                    let orders=sortedOrdersByDate[key]
                    return(
                  
                        <SortByDate orders={orders}/>
                        
                    )
                    
                }) : <div className='noData'>Nothing to load.</div>
              }
            </div>
        </div>
    )
}

export default UserOrders