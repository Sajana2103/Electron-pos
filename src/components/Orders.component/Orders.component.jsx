import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderCard from "./OrderCard.component";
import { clearNewOrder } from "../../redux/orderSlice";
import OnGoingOrders from "./OnGoingOrders";
import KitchenOrders from "./KitchenOrders";
import './Orders.styles.css'

const Orders = ({props}) => {
 
  let {height} = props
const onGoingOrders = useSelector(state => state.orders.currentOrders)
const ongoingOrder = useSelector(state => state.orders.newOrder)
const {canAddNewItems} = useSelector(state => state.orders.appendOrder)
const ongoingKitchenOrders = useSelector(state => state.orders.kitchenOrders)
 
const [openNewOrder, setOpenNewOrder] = React.useState(false)
const [confirmCancelOrder, setConfirmCancelOrder] = React.useState(false)
const [billsOrKitchen,setBillsOrKitchen] = React.useState(true)

//window.orders.getLastOrder().then(data => console.log(data))
console.log()
const dispatch = useDispatch()
useEffect(() => {
   if(ongoingOrder.length > 0){
    setOpenNewOrder(true)
  } else {
    setOpenNewOrder(false)
  }
    
  
},[ongoingOrder])

  return(
    <div className="order-main" style={{height:`${height -40}px`}}>
      <div onClick={() => setOpenNewOrder(true)} className="create-order-btn sub-header-btn">Create Order +</div>
     <div style={{display:'grid',gridTemplateColumns:'repeat(2,50%)',margin:'5px',justifyItems:'center'}}>
      <button className="billsAndKitchen sub-header-btn" style={billsOrKitchen? {color:'#ef6963',fontWeight:'bold',border:'#ef6963 3px solid',boxShadow: '#1a1c1d 2px 5px 5px'}:{}} 
      onClick={()=>setBillsOrKitchen(true)}>BILLS</button>
      <button className="billsAndKitchen sub-header-btn" style={!billsOrKitchen? {color:'#ef6963',fontWeight:'bold',border:'#ef6963 3px solid',boxShadow: '#1a1c1d 2px 5px 5px'}:{}} 
       onClick={()=>setBillsOrKitchen(false)}>KITCHEN</button>
     </div>
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
          <div className="sub-header-btn do-actio">Are you sure?  
          <button className="do-action" style={{width:'40px',marginLeft:'3px',marginRight:'3px'}} onClick={() =>{
            setOpenNewOrder(false)
            setConfirmCancelOrder(false)
            dispatch(clearNewOrder())
          }}>Yes</button>
          <button className="cancel-action"  
          style={{width:'40px',marginLeft:'5px',marginRight:'5px'}} 
          onClick={() => setConfirmCancelOrder(false)}>No</button></div>
          :
          <></>
        }
        <div className="ongoing-orders">
        {
          onGoingOrders.length > 0 && billsOrKitchen?
          onGoingOrders.map((order,idx) => {
            return(
              
              <OnGoingOrders order={order} key={idx}/>
            
            )
          })
          : <></>
        }
        
        {
          ongoingKitchenOrders.length > 0 && !billsOrKitchen?
          ongoingKitchenOrders.map((order) => {
            // console.log(order)
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