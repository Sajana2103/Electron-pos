import React from "react";
import Bill from "./Bill.Order";
import BillCardOngoingOrder from "./BillCard.OngoingOrders";
import OrderCard from "./OrderCard.component";
import { changeModalForm, setModalDisplay } from "../../redux/modalSlice";
import { appendOrder, closeBill } from "../../redux/orderSlice";
import { useDispatch, useSelector } from "react-redux";

const OnGoingOrders = ({ order }) => {
  const [openOrder, setOpenOrder] = React.useState(false)
  const dispatch = useDispatch()
  const height = useSelector(state => state.windowResize.height)
  const { canAddNewItems, orderNumber } = useSelector(state => state.orders.appendOrder)


  let currentAppendedOrder = 0
  // console.log('currentstate',currentstate)


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
          openOrder ?
            order.data.map((item, id) => {
              let { appendedOrder } = item
              if (appendedOrder > currentAppendedOrder) {
                currentAppendedOrder = appendedOrder
                return (
                  <div>
                    <div className="nonClickable bg-dark-white" style={{ color: 'gray' }}>------------------------------</div>
                    <div className='bg-dark-white' key={id} style={{ padding: '5px 0px 5px 0px' }}>
                      <div className=" font-small" style={{ paddingTop: '5px', color: "#313638" }}>ORDERED : {order.dateAndTime[currentAppendedOrder]}</div>
                      <div className='ongoing-order-extended bg-dark-white' key={id}>
                        <span className="ordered-quantity">{item.quantity}</span>
                        <span>{item.item.toUpperCase()} ({item.portion ? item.portion : ''})</span>
                        <span className="price-tags">Rs.{item.price} </span>
                      </div>
                    </div>
                  </div>
                )
              }
              // console.log(appendedOrder)
              return (
              <div className="bg-dark-white " style={{ padding: '5px 0px 5px 0px' }}>
                <div className=" w100 font-small" style={{ paddingTop: '5px', color: "#313638" }}>ORDERED : {order.dateAndTime[0]}</div>

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
              <button className="do-action rounded-btn " onClick={() => {

                dispatch(appendOrder({
                  canAddNewItems: true, orderNumber: order.orderNumber,
                  table: order.table, appendedOrder: order.appendedOrder + 1, _id: order._id, _rev: order._rev
                }))
              }}>Add More Items</button>
              <button className="cancel-action rounded-btn " onClick={() => {
                dispatch(setModalDisplay())
                dispatch(changeModalForm('loadCloseBill'))
                dispatch(closeBill(order))
              }}>Close Bill</button>
              <button onClick={() => window.orders.removeOrder(order._id)}>Remove order</button>
            </div>

            <button className="minimize" onClick={() => setOpenOrder(!openOrder)} >Minimize</button>
          </div>
          : <></>
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