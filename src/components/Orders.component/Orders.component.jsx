import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderCard from "./OrderCard.component";
import { clearNewOrder } from "../../redux/orderSlice";
import OnGoingOrders from "./OnGoingOrders";
import KitchenOrders from "./KitchenOrders";
import './Orders.styles.css'

const Orders = ({props}) => {
  let {height,width} = props
const onGoingOrders = useSelector(state => state.orders.currentOrders)
const ongoingOrder = useSelector(state => state.orders.newOrder)
const {canAddNewItems} = useSelector(state => state.orders.appendOrder)
const ongoingKitchenOrders = useSelector(state => state.orders.kitchenOrders)
 
const [openNewOrder, setOpenNewOrder] = React.useState(false)
const [confirmCancelOrder, setConfirmCancelOrder] = React.useState(false)

const dispatch = useDispatch()
useEffect(() => {
   if(ongoingOrder.length > 0){
    setOpenNewOrder(true)
  } else {
    setOpenNewOrder(false)
  }
},[ongoingOrder])
console.log(window.api)
  return(
    <div className="order-main" style={{height:`${height -40}px`}}>
      <div onClick={() => setOpenNewOrder(true)} className="create-order-btn sub-header-btn">Create Order +</div>
      <div className="order-cards">
        
        {
          openNewOrder && !canAddNewItems ?
          <>
          <OrderCard/>
          <div onClick={() => setConfirmCancelOrder(true)}
           className="create-order-btn sub-header-btn">Cancel Order</div>
          </>
          : <></>
        }
        {
          confirmCancelOrder? 
          <div className="sub-header-btn">Are you sure?  
          <button  onClick={() =>{
            setOpenNewOrder(false)
            setConfirmCancelOrder(false)
            dispatch(clearNewOrder())
          }}>Yes</button>
          <button onClick={() => setConfirmCancelOrder(false)}>No</button></div>
          :
          <></>
        }
        <div className="ongoing-orders">
        {
          onGoingOrders.length > 0 ?
          onGoingOrders.map((order,idx) => {
            return(
              
              <OnGoingOrders order={order} key={idx}/>
            
            )
          })
          : <></>
        }
        
        {
          ongoingKitchenOrders.length > 0 ?
          ongoingKitchenOrders.map((order) => {
            console.log(order)
            return(

            <KitchenOrders order={order}/>
            )
          })
          : <></>
        }
        </div>
      </div>
    </div>
  )
}

export default Orders