import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeModalForm, setModalDisplay, changeModalData } from "../../redux/modalSlice";
import { addOrderToday } from "../../redux/orderHistorySlice";
import OrderCard from "./OrderCards";

const SortByDate = ({ orders, today }) => {
    const dispatch = useDispatch()
    const { width } = useSelector(state => state.windowResize)
    const {ordersToday} = useSelector(state => state.sortItems)

    const shrinkWidth = useSelector(state => state.windowResize.shrink.width)
    let maxCards = shrinkWidth === 200 ? Math.floor((width - (400)) / 150) : Math.floor(((width + shrinkWidth) - (400)) / 120)
    let dateToday = new Date().toDateString()

    let currentDate = new Date(orders[0].dateAndTime[0]).toDateString()
    let totalPerDay = 0
    console.log(orders)
    orders.map((order, id) => {
        if (order.status === 'completed') {
            totalPerDay = totalPerDay + order.total
        }
    })
    
    const changeModal = () => {
        dispatch(setModalDisplay())
        dispatch(changeModalForm('salesReport'))
        dispatch(changeModalData(orders))
    }
    let subTotal = 0
    
    if (orders.length) {

        return (
            <div >

                {
                    dateToday === currentDate ?


                        <div>
                            <br />
                            <span className="font-small strong sub-header">Today</span>
                            <div style={{ display: 'grid', justifyContent: 'center' }}>

                                <div className="salesReport"
                                    onClick={changeModal}>Sales Total : Rs.{totalPerDay}</div>
                            </div>
                            <div className="underline" />
                            {
                                today.length?
                                <div className="font-color-dgreen" style={{border:'1px #4fc580 solid', borderRadius:'0.5rem',margin:'0.5rem'}}>Current Orders
                            <div className='item-cards ' style={{ gridTemplateColumns: `repeat(${maxCards < 0 ? 1 : maxCards},1fr)` }} >
                                {
                                    today.length?
                                    
                                    today.map((order, id) => {
                                        let subTotal = 0
                                        order.data.map((a) => subTotal += (parseInt(a.price) * a.quantity))
                                        console.log('today',subTotal)
                                        return (
                                            <OrderCard order={order} idx={id} subTotal={subTotal}/>
                                        )
                                    }) : <></>
                                }
                                  </div>
                                  </div> : <></>
                            }
                                  <div className='item-cards ' style={{ gridTemplateColumns: `repeat(${maxCards < 0 ? 1 : maxCards},1fr)` }} >

                                {

                                    orders.map((order, id) => {
                                        if(order.status === 'ongoing') {
                                            return <></>
                                        }
                                        return (
                                            <OrderCard order={order} idx={id} />
                                        )
                                    })
                                }
                            </div>
                        </div>
                        :
                        <div>
                            <br />
                            <span className="font-small strong sub-header">{new Date(orders[0].dateAndTime[0]).toDateString()}</span>
                            <div style={{ display: 'grid', justifyContent: 'center' }}>
                                <div className="salesReport"
                                    onClick={changeModal}>Total Sales : Rs.{totalPerDay}</div>
                            </div>
                            <div className="underline" />

                            <div className='item-cards ' style={{ gridTemplateColumns: `repeat(${maxCards < 0 ? 1 : maxCards},1fr)` }} >

                                {

                                    orders.map((order, id) => {
                                        return (
                                            <OrderCard order={order} idx={id} />
                                        )
                                    })
                                }
                            </div>
                        </div>
                }



            </div>
        )
    } else {
        return (
            <div></div>
        )
    }
}

export default SortByDate