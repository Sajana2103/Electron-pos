import React,{useEffect, useState} from "react"
import {useDispatch, useSelector} from 'react-redux'
import { setModalDisplay ,changeModalForm,changeModalData} from "../../redux/modalSlice"

const OrderCard = ({order,idx}) => {
 
    
    const dispatch = useDispatch()
  
    const openOrderCardModal = () =>{
     
        dispatch(setModalDisplay())
        dispatch(changeModalForm('orderCardModal'))
        dispatch(changeModalData(order))
    }
    const time = new Date(order.dateAndTime[0]).toLocaleString().split(',')[1]
    const endTime = new Date(order.billCloseTime).toLocaleString().split(',')[1]
// console.log(order)
    return (
        <div  title="click for details.">


            <div onClick={openOrderCardModal} >
                <div key={idx} className="orderCard font-small ">
                    <span className="orderCardTitle strong">Order: {order.orderNumber}</span>
                    {
                        order.table === 'takeout' ?
                            <span className="strong">Take-Away</span> : <span>Table: <span className="bold">{order.table}</span></span>
                    }

                    <span className="strong">{order.status}</span>
                    <span>Total : Rs.<span className="strong">{order.total}</span></span>

                    {
                        order.table === 'takeout' ?
                            <span>Time : <span className="">{endTime}</span></span>
                            : <div>Time :
                                <span className="strong">{time}</span><br />
                            </div>
                    }
                </div>
            </div>         
        </div>
    )

}
export default OrderCard