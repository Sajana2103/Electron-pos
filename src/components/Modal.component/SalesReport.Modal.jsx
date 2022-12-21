import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sortItemsSales } from "../../redux/orderHistorySlice";

const SalesReport = () => {

    
    const { modalData } = useSelector(state => state.modal)
    const {sortSales,sortedSales} = useSelector(state => state.ordersHistory)
    const {sortBy, totalPerDay,totalOrders} = sortSales

    const dispatch = useDispatch()
    console.log('salesReport runs',sortedSales)
    useEffect(() => {
        
        if(modalData.length ){
            console.log('%csort useeffect runs','color:blue;font-weight:bold',modalData)
            dispatch(sortItemsSales({sort:'total',items:modalData}))
        }
    },[modalData.length])

    
    console.log(sortedSales)
    
    return (
        <>
            <div className="strong">SALES REPORT</div>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 100px' }}>
                <div>Total Sales : </div><div style={{ textAlign: 'right' }}> Rs. {totalPerDay}</div>
                <div>Completed Orders : </div><div style={{ textAlign: 'right' }}> {totalOrders}</div>
            </div>
            <div className="grid-salesReport  font-small strong">
                <span>Item</span>
                <span onClick={()=>dispatch(sortItemsSales({sort:'quantity',items:modalData}))}  className="qty-total" >Qty</span>
                <span onClick={()=>dispatch(sortItemsSales({sort:'total',items:modalData}))} className='qty-total' >Total</span>
            </div>
            <div style={{ overflow: 'scroll', overflowX: 'scroll', height: '20rem' }}>
                {
                    sortedSales.length ?
                    sortedSales.map((item, idx) => {

                            return (
                                <>

                                    <div className="grid-salesReport" style={{
                                        background: idx % 2 === 0 ? '#d9d9d9' : '', fontSize: '0.7rem',
                                    }}>
                                        <div>{idx + 1}.<span className="strong"> {item.item.toUpperCase()}</span></div>
                                        <div style={{ textAlign: 'right' }}>{item.quantity}</div>
                                        <div style={{ textAlign: 'right' }} className="strong">{item.quantity * item.price}</div>

                                    </div>
                                </>
                            )
                        }) : <></>
                }
            </div>

        </>
    )
}

export default SalesReport