import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setModalDisplay,changeModalForm, changeModalData } from '../../redux/modalSlice'
import { addOrUpdate } from '../../redux/tablesSlice'
import './tablesContent.styles.css'



const TablesContent = ({props}) => {
    const {width,height} = props
    const {tables,reservations} = useSelector(state => state.tables)
    const shrinkWidth = useSelector(state => state.windowResize.shrink.width)
    let maxCards = shrinkWidth === 200 ? Math.floor((width - (400)) / 150) : Math.floor(((width + shrinkWidth) - (400)) / 120)
    const dispatch = useDispatch()
    // console.log(reservations)
    return(
        <div className='item-content' style={{ height: `${height - 80}px`, width: `${width - 400}` }}>
          <div style={{display:'grid',gridTemplateRows:'1fr 1fr',justifyContent:'center'}}>
             <h1 className='sub-header-btn'>Tables</h1>
           <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',columnGap:10}}>
               <span className='create-order-btn sub-header-btn ' style={{width:150,justifyContent:'center'}}
            onClick={() =>{
                dispatch(setModalDisplay());dispatch(changeModalForm('addTable'));
                dispatch(addOrUpdate(true));dispatch(changeModalData({}));
            }}
            >Add Table +</span><span className='create-order-btn sub-header-btn ' style={{width:150,justifyContent:'center'}}
            onClick={() =>{
                dispatch(setModalDisplay());dispatch(changeModalForm('addReservation'));
                dispatch(addOrUpdate(true));dispatch(changeModalData({}));
            }}
            >Add Reservation</span>
               
               </div> 
            </div> 
            <div className='item-cards ' style={{ gridTemplateColumns: `repeat(${maxCards < 0 ? 1 : maxCards},1fr)` }}>
                {
                    tables.length?
                    tables.map((table,idx) => {
                        return(
                            <div onClick={() => {
                                dispatch(setModalDisplay());
                            dispatch(changeModalForm('addTable'));
                            dispatch(changeModalData(table))
                            dispatch(addOrUpdate(false))
                            }} key={idx}>
                                
                                <div className={table.status==='Occupied'?'tableOccupied tableCard':'tableCard'}>

                                <div>No : <span className='highlight-font-color strong'>{table.number}</span></div>
                                <div>Seats : <span className='font-color-orange strong'>{table.seats}</span></div>
                                <div className=''>{table.location}</div>
                                <div style={table.status==='Occupied'||table.status==='Reserved'?{color:'#ef6369',fontWeight:400}:{color:'#5ad85a',fontWeight:400}}>{table.status}</div>
                               
                                 {
                                     table.currentOrder?
                                     <div className=' font-color-lightGray'>Order: <span className='font-color-green'>{table.currentOrder}</span></div>
                                     :<></>

                                 }
                                </div>
                            </div>
                        )
                    }) : <div className='noData'>Add Tables.</div>
                }

               
            </div>
            <div>
                    <h2 className='sub-header-btn'>Reservations</h2>
                    <div className='item-cards ' style={{ gridTemplateColumns: `repeat(${maxCards < 0 ? 1 : maxCards},1fr)` }}>
                    {
                        reservations.length?
                        reservations.map((reservation,idx) => {
                            return(
                              
                                <div className="font-size-small tableCard" onClick={() => {
                                    dispatch(setModalDisplay());
                                dispatch(changeModalForm('addReservation'));
                                dispatch(changeModalData(reservation))
                                dispatch(addOrUpdate(false))
                                }} key={idx}>
    
                                        <span className=''>Table : {reservation.table}</span>
                                        <span className='strong highlight-font-color'>{new Date(reservation.time).toLocaleString()} </span>                             
                                        <span className=''>{reservation.customerName}</span>
                                        <span className=''>{reservation.contact}</span>
                            </div>
                            )
                        }) : <div className='noData'>No reservations</div>
                    }
                    </div>
                </div>
        </div>
    )
}

export default TablesContent