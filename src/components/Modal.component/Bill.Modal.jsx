import React from 'react'
import Bill from '../Orders.component/Bill.Order'
import { useSelector,useDispatch } from 'react-redux'


const BillModal = () => {

   let currentAppendedOrder = 0
  const currentBill = useSelector(state => state.orders.currentBill)
  console.log(currentBill)
  return(
    <div>

      <div className='bill-close-modal'>
      {

        currentBill.data.map((item,id) =>{
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
    
      }
      </div>
      <Bill order={currentBill}/>
  
    </div>
  )
}

export default BillModal