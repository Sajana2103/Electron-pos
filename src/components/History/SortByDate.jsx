import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import OrderCard from "./OrderCards";

const SortByDate = ({ orders }) => {
    const { width, height } = useSelector(state => state.windowResize)
    // const [maxCards, setMaxCards] = useState(1)
    // useEffect(() => {

    //     setMaxCards(Math.floor((width - 186) / 150))
    // }, [width])
    const shrinkWidth = useSelector(state => state.windowResize.shrink.width)
    let maxCards = shrinkWidth === 200 ? Math.floor((width - (400)) / 150) : Math.floor(((width + shrinkWidth) - (400)) / 120)
    let dateToday = new Date().toDateString()
    let currentDate = new Date(orders[0].dateAndTime[0]).toDateString()
    console.log('dateToday', dateToday === currentDate)

    // console.log(sortedOrdersByDate)
    if (orders.length) {
        return (
            <div >
                {
                    dateToday === currentDate ?
                        <div>
                            <br />
                            <span className="font-small strong sub-header">Today</span>
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
                        :
                        <div>
                            <br />
                            <span className="font-small strong sub-header">{new Date(orders[0].dateAndTime[0]).toDateString()}</span>
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