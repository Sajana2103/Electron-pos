import React from "react";
import Bill from "./Bill.Order";
import BillCardOngoingOrder from "./BillCard.OngoingOrders";
import OrderCard from "./OrderCard.component";
import { changeModalForm ,setModalDisplay} from "../../redux/modalSlice";
import { appendOrder,closeBill } from "../../redux/orderSlice";
import { useDispatch, useSelector } from "react-redux";

const OnGoingOrders = ({order}) => {
  const [openOrder,setOpenOrder]= React.useState(false)
  const currentstate = useSelector(state => state)
  const dispatch = useDispatch()
  const {canAddNewItems,orderNumber} = useSelector(state => state.orders.appendOrder)

  const sendBillToPrint = (e) => {
    e.preventDefault()
          window.api.printBill(order)
          
          console.log('printBill',order)
    
  }
  let currentAppendedOrder = 0
  console.log('currentstate',currentstate)
  return(
    <div>
    <div onClick={() => setOpenOrder(!openOrder)} className="ongoing-order-card sub-header-btn strong">
      <span>Order : {order.orderNumber}</span>
      <span >Table : {order.table}</span>
      </div>

      {
        openOrder?
        order.data.map((item,id) =>{
          let {appendedOrder} = item
          if(appendedOrder> currentAppendedOrder){
            currentAppendedOrder = appendedOrder
            return(
              <div>
              <div className="bg-white ">-------------------------------------------------------</div>
               <div className="ongoing-order-extended" key={id}>
              <span className="ordered-quantity">{item.quantity}</span>
              <span>{item.item}</span>
              <span className="price-tags">Rs.{item.price}.00</span>
            </div>
            </div>
            )
          }
          console.log(appendedOrder)
          return(
            <div className="ongoing-order-extended" key={id}>
              
              <span className="ordered-quantity">{item.quantity}</span>
              <span>{item.item}</span>
              <span className="price-tags">Rs.{item.price}.00</span>
            </div>
          )
        })
        : <></>
      }
      {
          openOrder && canAddNewItems && orderNumber === order.orderNumber?
         <OrderCard />
          : <></>
      }
      {
        openOrder && orderNumber !== order.orderNumber ?
        <div>
        <BillCardOngoingOrder order={order}/>
      <button onClick={() => {
       
        dispatch(appendOrder({canAddNewItems:true, orderNumber:order.orderNumber, table: order.table, appendedOrder:order.appendedOrder+1}))
      }}>Add More Items</button>
    <button onClick={() => {
      dispatch(setModalDisplay())
      dispatch(changeModalForm('loadCloseBill'))
      dispatch(closeBill(order))
      }}>Close Bill</button>

        </div>
       : <></>
      }
        {
        canAddNewItems && orderNumber === order.orderNumber ?
        <div>
        <BillCardOngoingOrder order={order}/>
      {/* <button onClick={() => {
        setAddMoreItemsOrder(false)
        dispatch(appendOrder({canAddNewItems:false}))
      }}>Update Order</button> */}
    <button onClick={() => {
      
       dispatch(appendOrder({canAddNewItems:false}))
    }}>Cancel</button>

        </div>
       : <></>
      }
      </div>
  )
}

export default OnGoingOrders