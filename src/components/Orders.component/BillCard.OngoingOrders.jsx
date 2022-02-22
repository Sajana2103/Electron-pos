import React from 'react'

const BillCardOngoingOrder = ({order}) => {


  let amount = 0 

   order.data.map((item) => {

    amount += (item.price*item.quantity)
   })



  
  let vat = Math.floor((amount * 1.08) - amount)
  return(
       <div className="order-card ">
    

      <div style={{ display: 'grid', gridTemplateRows: 'repeat(2,auto)', justifyItems: 'end' }}>
        <span
          className="font-small" >Sub-total : Rs.{amount} </span>
    
        <span className="font-small" >+ VAT 8.0% Rs.{vat} </span>
        <h3>Total</h3>
        <h3 className="highlight-font-color" style={{ paddingTop: '5px' }}> Rs.{Math.floor(amount* 1.08)}</h3>
      </div>
      
    </div>
  )
}

export default BillCardOngoingOrder