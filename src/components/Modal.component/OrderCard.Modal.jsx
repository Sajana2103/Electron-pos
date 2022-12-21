import React from "react";
import { useSelector } from "react-redux";

const OrderCardModal = () => {
    const {modalData} = useSelector(state => state.modal)
    // console.log(modalData)
    const startTime = new Date(modalData.dateAndTime[0]).toLocaleString()
    const endTime = modalData.billCloseTime? new Date(modalData.billCloseTime).toLocaleString().split(',')[1] : 'Ongoing'
    let subTotal = 0
     modalData.data.map(item => {
       subTotal += item.price * item.quantity
    })
    return (
        <div >
            <h3 className="title">Order Details</h3>
           <div className="orderFields">Order No <span className="strong"> : {modalData.orderNumber}</span></div>
           {
               modalData.table==='takeout'?
               <div className="orderFields"><span className="strong"> : {modalData.table}</span></div> :
               <div className="orderFields">Table <span className="strong"> : {modalData.table}</span></div>

           }
           <div style={{padding:5}} className="font-small">
               <span  >All orders :</span>
               {modalData.data?
                modalData.data.map((item,idx) =>{
                    // console.log(item)
                    return(
                        <div key={idx} style={{padding:2}}>
                            <p></p>
                            <span >Item : {item.item}</span>
                            <br/>
                            <span>Qty : {item.quantity}</span>
                           
                            </div>
                    )
                }) : <></>
            }
           </div>
           {
               modalData.total?
               <div className="orderFields">Total <span className="strong">: {modalData.total}</span></div>
               : <div className="orderFields">Subtotal <span className="strong">: {subTotal}</span></div>

           }
           <div className="orderFields">Status <span className="strong">: {modalData.status}</span></div>
           <div className="orderFields">Customer <span className="strong">: {modalData.customerId}</span></div>
           <div className="orderFields">Server <span className="strong">: {modalData.server}</span></div>
           <div className="orderFields">Date <span className="strong">: {startTime.split(',')[0]}</span></div>
           <div className="orderFields">Start <span className="strong">: {startTime.split(',')[1]}</span></div>

           <div className="orderFields">End <span className="strong">: {endTime}</span></div>
        </div>
    )
}

export default OrderCardModal