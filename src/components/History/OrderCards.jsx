import React,{useEffect, useState} from "react"
import {useDispatch, useSelector} from 'react-redux'
import { setModalDisplay ,changeModalForm,changeModalData} from "../../redux/modalSlice"



const OrderCard = ({order,idx, subTotal}) => {
 
    
    const dispatch = useDispatch()
    const {cardExpand} = useSelector(state => state.sortItems)
    const openOrderCardModal = () =>{
     
        dispatch(setModalDisplay())
        dispatch(changeModalForm('orderCardModal'))
        dispatch(changeModalData(order))
    }
    console.log(cardExpand)
    const time = new Date(order.dateAndTime[0]).toLocaleString().split(',')[1]
    const endTime = new Date(order.billCloseTime).toLocaleString().split(',')[1]
 
    return (
        <div  title="click for details.">


            <div onClick={openOrderCardModal} >
                <div key={idx} className="orderCard font-small ">
                    <span className="orderCardTitle strong">Order: {order.orderNumber}</span>
                    <span>Rs.<span className="strong">{order.total? order.total : subTotal}</span></span>
                 {
                    cardExpand?
                 <>
                  
                    {
                        order.table === 'takeout'?
                            <span className="strong">Take-Away</span> : <span>Table: <span className="bold">{order.table}</span></span>
                    }

                    <span className="strong">{order.status}</span>

                    {
                        order.table === 'takeout' ?
                            <span><span className="">{endTime}</span></span>
                            : <div>
                                <span className="strong">{time}</span><br />
                            </div>
                    }
                  </> :<></>
                 } 
                </div>
            </div>         
        </div>
    )

}
export default OrderCard