import React, { useEffect } from 'react'
import Bill from '../Orders.component/Bill.Order'
import { setModalDisplay } from '../../redux/modalSlice'
import { useSelector,useDispatch } from 'react-redux'


const BillModal = () => {
const dispatch =useDispatch()
let modal = document.getElementById("modal-main")
   let modalContent = document.getElementById("modal-content")
  window.onclick = function (e) {
    // console.log(e.target)
    if (e.target === modal && e.target !== modalContent) {
      // console.log(e.target)
      //     console.log(modal.style.display)
      dispatch(setModalDisplay('none'))
      setHeight({bill:0,modal:0})
    }
  }

   let currentAppendedOrder = 0
  const currentBill = useSelector(state => state.orders.currentBill)
  const height = useSelector(state => state.windowResize.height)
  const [billHeight,setHeight] = React.useState(0)

  // console.log(currentBill)

  useEffect(() => {
  
  setHeight({bill:document.getElementById('billComponent').offsetHeight,
  modal:document.getElementById('billModal').offsetHeight})
  },[height,currentBill.orderNumber])

  console.log(currentBill.orderNumber,billHeight.modal)
    const splitReducerTotal = (e) => {
      let id = e.target.ariaLabel
       console.log(id)
    currentBill.data.find((item,idx) => {
         
      if(id == idx) {
        console.log(item)
      }
    })
  }

  return(
    <div id="billModal" >
      <div className='bill-close-modal'>
      <div className='font-small strong bg-white' style={{padding:'10px',display:'grid',
      gridTemplateColumns:'70px 70px auto',backgroundColor:'#313638',color:'white'}}>
       <span>ORDER {currentBill.orderNumber} </span>
       {
         currentBill.table === 'takeout'?
         <span>TAKEOUT &nbsp;</span>
         : <span>TABLE : {currentBill.table}</span>
       }
       <span style={{opacity:'0.5',paddingLeft:'10px'}}>{currentBill.dateAndTime[0]}</span>
       </div>
      
        <div style={{overflowX:billHeight.modal>height?'scroll':'',
        display:'grid',gridTemplateColumns:'repeat(2,auto)',columnGap:'10px'
        }}>
      {

        currentBill.data.map((item,id) =>{
           console.log(item.extras)
          let {appendedOrder} = item
          if(appendedOrder> currentAppendedOrder){
            currentAppendedOrder = appendedOrder
           
            return(
              <div aria-label={id} className='bg-dark-white' style={{padding:'5px 0px 5px 0px'}} onClick={splitReducerTotal}>
       {/* <div className="nonClickable bg-dark-white" style={{color:'gray'}}>------------------------------</div> */}

              <div className="w100 font-small noPointerEvents" 
              style={{color:'#a1a1a1',paddingTop:'2px',paddingBottom:'2px',display:'grid',alignItems:'center',justifyContent:'start'}}>
                ORDERED : {currentBill.dateAndTime[currentAppendedOrder]}</div>

               <div className='ongoing-order-extended noPointerEvents bg-dark-white' key={id} >
              <span className="ordered-quantity">{item.quantity}</span>
              <div>
              <span className='strong '>{item.item} ({item.portion?item.portion:''})</span>
              {
                item.extras && item.extras.length?
                item.extras.map((extras,id) =>{
                return (
                  <span className='strong '>{extras.name} {extras.price}</span>
                )}) : <></>
              } 
              </div>
              <span className="price-tags strong" style={{textAlign:'right',display:'grid',justifyContent:'end'}}>Rs.{item.price*item.quantity}</span>
            </div>
            </div>
            )
          }
          // console.log(appendedOrder)
          return(
            <div className='bg-dark-white 'aria-label={id} onClick={splitReducerTotal}  style={{padding:'5px 0px 5px 0px'}}>
             <div className="w100 font-small noPointerEvents" 
              style={{color:'#a1a1a1',paddingTop:'2px',paddingBottom:'2px',display:'grid',alignItems:'center',justifyContent:'start'}}>
                ORDERED : {currentBill.dateAndTime[0]}</div>

            <div className="ongoing-order-extended bg-dark-white noPointerEvents" key={id}>
              
              <span className="ordered-quantity">{item.quantity}</span>
              <div>

              <span className='strong ' >{item.item}<span className="font-small">({item.portion?item.portion:''})</span> </span>
                   <br/>
                    {
                item.extras && item.extras.length?
                item.extras.map((extras,id) =>{
                return (
                  <span style={{color:'gray'}} >[{extras.name} <span className='bold ' style={{color:'#ef6369',opacity:0.7}}>{extras.price}</span>]</span>
                )}) : <></>
              } 
              </div>
              <span className="price-tags strong" style={{display:'grid',justifyContent:'end'}}>Rs.{item.price*item.quantity}</span>
            </div>
            </div>
          )
        })
    
      }
      </div>
      <div id="billComponent">

      <Bill  order={currentBill}/>
      </div>
      </div>
   
  
    </div>
  )
}

export default BillModal