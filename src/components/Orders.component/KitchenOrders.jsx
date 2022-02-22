import React from 'react'

const KitchenOrders = ({order}) => {
   console.log(order)
 
  const [openOrder,setOpenOrder]= React.useState(false)

  let currentAppendedOrder = 0
  return(
    <div>
    <div onClick={() => setOpenOrder(!openOrder)} className="ongoing-order-card sub-header-btn strong">
      <span>Order : {order.orderNumber}/{order.appendedOrder}</span>
      <span >Table : {order.table}</span>
      <span>(Kitchen)</span>
      </div>
      {
        openOrder?
              <div className="bg-white font-small " style={{padding:'10px'}}>Time : {order.dateAndTime}</div>
        : <></>
      }
      {
        openOrder ?
        order.data.map((item,id) =>{
          console.log(item)
          let {appendedOrder} = item
          if(appendedOrder> currentAppendedOrder){
            currentAppendedOrder = appendedOrder
            return(
              <div>
              <div className="bg-white ">-------------------------------------------------------</div>
               <div className="ongoing-order-kitchen" key={id}>
              <span className="ordered-quantity">{item.quantity}</span>
              <div className="grid-row">
          <div className="font-small strong" style={{ display: 'flex' }}>{item.item}</div>
          <div className='font-small' style={{ display: 'flex', textAlign: 'start' }}>{item.modifications}</div>
        </div>
            </div>
            </div>
            )
          }

          return(
            <div >
            <div className="ongoing-order-kitchen" key={id}>
              
              <span className="ordered-quantity">{item.quantity}</span>
              <div className="grid-row">
          <div className="font-small strong" style={{ display: 'flex' }}>{item.item}</div>
          <div className='font-small' style={{ display: 'flex', textAlign: 'start' }}>{item.modifications}</div>
        </div>
            </div>
            </div>
          )
        })
        : <></>
      }
   
    
      </div>
  )
}


export default KitchenOrders
