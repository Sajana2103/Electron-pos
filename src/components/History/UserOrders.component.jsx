import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SortOrders from './Sort'
import SortByDate from './SortByDate'
import './Client.styles.css'
import { expandCard } from '../../redux/sortItemsSlice'
import { changeSort } from '../../redux/sortItemsSlice'

const onClickCss = {
    color: '#f1f1f1',
    border: '1px solid #f1f1f1',
    transform : 'scale(105%)'
}

const UserOrders = ({props}) => {
    const dispatch = useDispatch()
    const { sortedOrdersByDate,todayOrders} = useSelector(state => state.ordersHistory)
    const {currentOrders} = useSelector(state => state.orders)
    const {ordersToday,sort,cardExpand} = useSelector(state => state.sortItems)
    const {height,width} = props
    // console.log(` %c${currentOrders[0].orderNumber}`,'color:blue;font-weight:bold;font-size:18px;')
    console.log("ordersToday",ordersToday,sort)
    console.log('heigth',window.innerHeight,sort,cardExpand)
  
    return (
        <div className='item-content' style={{ height: `${height - 40}px`, width: `${width - 400}` }}>
            <div className='salesHistoryBtns'>
            <div className="salesHistoryBtn" style={cardExpand? onClickCss : {}} onClick={() =>dispatch(expandCard())}>Expand Card</div>
            <div className="salesHistoryBtn" style={sort==='today'? onClickCss : {}}  onClick={() =>{
                dispatch(changeSort('today'))

                }}>Orders Today</div>
            <div className="salesHistoryBtn" style={sort==='all'? onClickCss : {}}  onClick={() =>{
                dispatch(changeSort('all')) 
            }}>All Orders</div>
            {/* <div className="salesHistoryBtn" onClick={() =>dispatch(expandCard())}>Expand</div> */}

            </div>

          
            <div style={{gridTemplateRows:'repeat(auto,auto)',overflow:'scroll',overflowY:'scroll',height:height-130}}>
            
            
              {
                  Object.keys(sortedOrdersByDate).length && sort==='all' ?
                  Object.keys(sortedOrdersByDate).map((key,idx) => {
                    let orders=sortedOrdersByDate[key]
                    
                    return(
                        <>
                       
                        <SortByDate orders={orders} today={currentOrders} idx={idx}/>
                        </>
                        
                    )
                    
                }) : <></>
              }
              
               {
                ordersToday.length && sort==='today'?
                        <>
                       
                        <SortByDate orders={ordersToday} today={currentOrders}/>
                        </> 
                        : <></>

               } 
                        
                    
                    
           
            </div>
        </div>
    )
}

export default UserOrders