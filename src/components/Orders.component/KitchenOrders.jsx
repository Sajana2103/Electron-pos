import React from 'react'

const KitchenOrders = ({ order }) => {
  //  console.log(order)

  const [openOrder, setOpenOrder] = React.useState(false)

  let currentAppendedOrder = 0
  return (
    <div style={{backgroundColor:'white'}}>
      <div onClick={() => setOpenOrder(!openOrder)} className="ongoing-order-card sub-header-btn strong">
        <span>Order : {order.orderNumber}/{order.appendedOrder}</span>
        {
          order.table === 'takeout' ?
            <span >{order.table.toUpperCase()} </span>
            :
            <span >TABLE : {order.table} </span>
        }

        <span>(Kitchen)</span>
      </div>
      {/* {
        openOrder ?
          <div className="bg-white font-small " style={{ padding: '10px' }}>Time : {order.dateAndTime}</div>
          : <></>
      } */}
      {
        openOrder ?
          order.data.map((item, id) => {
            let { appendedOrder } = item
            if (appendedOrder > currentAppendedOrder) {
              currentAppendedOrder = appendedOrder
              // console.log(currentAppendedOrder)
              return (
                <div className="bg-white " key={`${id}-${item.item}`}>
                  <div>------------------------------</div>
                  <div className="font-small " style={{ padding: '10px' }}>Time : {new Date(order.dateAndTime[currentAppendedOrder]).toLocaleString()}</div>

                  <div className="ongoing-order-kitchen" key={id}>

                    <span className="ordered-quantity">{item.quantity}</span>
                    <div className="grid-row">
                      <div className="font-small strong" style={{ display: 'flex' }}>{item.item.toUpperCase()} ({item.portion ? item.portion : ''})</div>
                      <div className='font-small' style={{ display: 'flex', textAlign: 'start' }}>
                        {item.modifications ? item.modifications : ''}</div>


                  {
                   item.extras && item.extras.length ?
                    item.extras.map((item, idx) => {
                      return (
                        <span style={{ display: 'flex', alignItems: 'center', marginTop: 2 }} className='font-small' key={idx}>
                          {item.name}</span>
                      )
                    }) : <></>
                  }
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div >
                <div className="bg-white font-small " style={{ padding: '10px' }}>Time : {new Date(order.dateAndTime[currentAppendedOrder]).toLocaleString()}</div>

                <div className="ongoing-order-kitchen" key={id}>

                  <span className="ordered-quantity">{item.quantity}</span>
                  <div className="grid-row">
                    <div className="font-small strong" style={{ display: 'flex' }}>{item.item.toUpperCase()} ({item.portion ? item.portion : ''})</div>
                    <div className='font-small' style={{ display: 'flex', textAlign: 'start' }}>{item.modifications}</div>
                   {item.extras && item.extras.length  ?
                    item.extras.map((item, idx) => {
                      return (
                        <span style={{ display: 'flex', alignItems: 'center', marginTop: 2 ,fontWeight:'bold'}} className='font-small' key={idx}>
                          {item.name}</span>
                      )
                    }) : <></>
                  }
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
