import React from "react";
import OrderCard from "./OrderCard.component";
import './Orders.styles.css'

const Orders = ({props}) => {
  let {height,width} = props
 
  return(
    <div className="order-main" style={{height:`${height -40}px`}}>
      <div className="create-order-btn sub-header">Create Order +</div>
      <div className="order-cards">
        <OrderCard/>
      </div>
    </div>
  )
}

export default Orders