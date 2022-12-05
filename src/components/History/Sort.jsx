import React from "react";
import { useSelector, useDispatch } from 'react-redux'
import { sortOrdersByNo, sortOrdersByStatus,sortOrdersByType,sortOrdersByLatest } from '../../redux/orderHistorySlice'


const SortOrders = () => {
    const dispatch = useDispatch()
    
    return(
        <div>
            <div className='ordersSortDropdown'>
                <span className="strong">Sort by</span>
                <div className='dropdownSort font-small'>

                    <div className='dropdownItem status'>
                        Status
                        <div className='statusSideMenu'>
                            <p onClick={() => dispatch(sortOrdersByStatus('completed'))} className='dropdownItem'>Completed</p>
                            <p onClick={() => dispatch(sortOrdersByStatus('ongoing'))} className='dropdownItem'>Ongoing</p>
                            <p onClick={() => dispatch(sortOrdersByStatus('cancelled'))} className='dropdownItem'>Canceled</p>
                        </div>
                    </div>

                    <div onClick={() => dispatch(sortOrdersByNo('order'))} className='dropdownItem'>Order No</div>


                    <div className='dropdownItem status'>
                        Type
                        <div className='statusSideMenu' >
                            <p  onClick={() => dispatch(sortOrdersByType('dineIn'))} className='dropdownItem'>Dine-In</p>
                            <p  onClick={() => dispatch(sortOrdersByType('takeout'))} className='dropdownItem'>Take-Away</p>
                        </div>
                    </div>
                    <div className='dropdownItem status'>
                        Time
                        <div className='statusSideMenu' >
                          <p onClick={() => dispatch(sortOrdersByLatest('latest'))} className='dropdownItem'>Latest</p>
                            <p  onClick={() => dispatch(sortOrdersByLatest('oldest'))} className='dropdownItem'>Oldest</p>
                           
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SortOrders