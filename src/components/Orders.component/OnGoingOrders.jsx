import React from "react";
import Bill from "./Bill.Order";
import BillCardOngoingOrder from "./BillCard.OngoingOrders";
import OrderCard from "./OrderCard.component";
import { changeBillStatus, changeModalForm, setModalDisplay } from "../../redux/modalSlice";
import { appendOrder, cancelOrder, clearNewOrder, closeBill } from "../../redux/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateTableState } from "../../redux/tablesSlice";

const OnGoingOrders = ({ order }) => {
  const [openOrder, setOpenOrder] = React.useState(false)
  const dispatch = useDispatch()
  const height = useSelector(state => state.windowResize.height)
  const [confirmCancelOrder, setConfirmCancelOrder] = React.useState(false)

  const { canAddNewItems, orderNumber } = useSelector(state => state.orders.appendOrder)
  const {tables} = useSelector(state => state.tables)

  let currentTable = tables.find(table => table.currentOrder === order.orderNumber)

  let currentAppendedOrder = 0
  // console.log('currentstate',currentstate)
// console.log(order,currentTable)
  const removeOrder = () => {
    let updateTable = {
      ...currentTable,
      currentOrder : '',
      customer:'',
      server:'',
      status:'Vacant'
    }
    window.orders.removeOrder(order._id)
    .then(removed =>{
      // console.log(removed)
      if(removed.success){
        dispatch(cancelOrder(removed.success))
        dispatch(clearNewOrder())

          setConfirmCancelOrder(false)
        
      }
    })
    window.tablesReservations.updateTable(updateTable).then(data => {
      if(data._rev){
          updateTable._rev = data._rev
          dispatch(updateTableState(updateTable))
       
      } else {
          // console.log(data)
      }
  })
  }

  return (
    <div id="">
      <div onClick={() => setOpenOrder(!openOrder)} className="ongoing-order-card sub-header-btn strong">
        <span>ORDER : {order.orderNumber}</span>

        {
          order.table === 'takeout' ? <span>TAKEOUT</span>
            :
            <span>TABLE :&nbsp;{order.table}</span>

        }

      </div>


      <div >
        {
          openOrder? 
          <div className="nonClickable bg-dark-white w100 font-small" style={{ paddingTop: '5px', color: "#313638" }}>ORDERED : {new Date(order.dateAndTime[0]).toLocaleString()}</div>
            : <></>
        }
        {
          openOrder ?
            order.data.map((item, id) => {
              
              let { appendedOrder } = item
              if (appendedOrder > currentAppendedOrder) {
                currentAppendedOrder = appendedOrder
                return (
                  <div>
                    <div className="nonClickable bg-dark-white" style={{ color: 'gray' }}>------------------------------</div>
                    <div className='bg-dark-white' key={id} style={{ padding: '5px 0px 5px 0px' }}>
                      <div className=" font-small" style={{ paddingTop: '5px', color: "#313638" }}>ORDERED : {new Date(order.dateAndTime[currentAppendedOrder]).toLocaleString()}</div>
                      <div className='ongoing-order-extended bg-dark-white' key={id}>
                        <span className="ordered-quantity">{item.quantity}</span>
                        <span>{item.item.toUpperCase()} ({item.portion ? item.portion : ''})</span>
                        <span className="price-tags">Rs.{item.price} </span>
                      </div>
                    </div>
                  </div>
                )
              } 
              
              return (
              <div className="bg-dark-white " style={{ padding: '5px 0px 5px 0px' }}>

                <div className="ongoing-order-extended bg-dark-white " key={id}>

                  <span className="ordered-quantity">{item.quantity}</span>
                  <span>{item.item.toUpperCase()} ({item.portion ? item.portion : ''})</span>
                  <span className="price-tags">Rs.{item.price}</span>
                </div>
              </div>
              )
            })
            : <></>
        }
      </div>
      {
        openOrder && canAddNewItems && orderNumber === order.orderNumber ?
          <OrderCard />
          : <></>
      }

      {
        openOrder && orderNumber !== order.orderNumber ?
          <div>
            {/* <div className="highlight-font-color bg-white nonClickable" >------------------------------</div> */}

            <BillCardOngoingOrder order={order} />
            <div className="bg-white" style={{ padding: '10px' }}>
              <button className="blackBtn bold" style={{width:120,margin:2}} onClick={() => {

                dispatch(appendOrder({
                  canAddNewItems: true, orderNumber: order.orderNumber,
                  table: order.table, appendedOrder: order.appendedOrder + 1, _id: order._id, _rev: order._rev
                }))
              }}>Add More Items</button>
              <button className="redBtn bold " style={{width:120,margin:2,backgroundColor:'white'}} onClick={() => {
                dispatch(setModalDisplay())
                dispatch(changeModalForm('loadCloseBill'))
                dispatch(closeBill(order))
                dispatch(changeBillStatus(true))
              }}>Close Bill</button>
              <button className=" redSubmitBtn bold font-size-xsmall" onClick={() => 
                setConfirmCancelOrder(true)}>Cancel order</button>
            </div>

            <button className="minimize" onClick={() => setOpenOrder(!openOrder)} >Minimize</button>
          </div>
          : <></>
      }
      {
          confirmCancelOrder? 
          <div className="sub-header-btn do-actio">Are you sure?  
          <button className="do-action" style={{width:'40px',marginLeft:'3px',marginRight:'3px'}} 
           onClick={removeOrder}>Yes</button>
          <button className="cancel-action"  
          style={{width:'40px',marginLeft:'5px',marginRight:'5px'}} 
          onClick={() => setConfirmCancelOrder(false)}>No</button></div>
          :
          <></>
        }
      {
        canAddNewItems && orderNumber === order.orderNumber ?
          <div>
            <BillCardOngoingOrder order={order} />

            <button className="cancel-action" onClick={() => {

              dispatch(appendOrder({ canAddNewItems: false }))
            }}>Cancel</button>

          </div>
          : <></>
      }
    </div>
  )
}

export default OnGoingOrders