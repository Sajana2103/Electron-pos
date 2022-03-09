import React from 'react'

const BillCardOngoingOrder = ({ order }) => {

  let amount = 0
  let vat = 0
  let currentVat = 0.08
  let extras = 0
  order.data.map((item) => {

  if(item.vat){
    // console.log('vat',item.vat,currentVat,item.price)
    vat += Math.floor(((parseInt(item.price*item.quantity )+extras)* currentVat))
  }
  if(item.extras && item.extras.length){
    item.extras.map((item,id) => extras += parseInt(item.price))
  }
    amount += (item.price * item.quantity)
  })
  console.log(vat)
  // let vat = Math.floor((amount * 1.08) - amount)
  return (
    <div className="order-card-side">

      <div style={{ display: 'grid', gridTemplateRows: 'repeat(2,auto)', justifyItems: 'end' }}>
        <span
          className="font-small" >Sub-total : Rs.{amount+extras} </span>

        <span className="font-small" >+ VAT 8.0% Rs.{vat} </span>
            <span className="font-small" >+ EXTRAS Rs.{extras} </span>

        <div style={{ display: 'grid',marginTop:'5px', gridTemplateColumns:'repeat(2,auto)',justifyContent:'end' }}>
          <h3 style={{ color: '#313638' }}>Total :&nbsp;</h3>
          <span className="highlight-font-color strong font-size-large">Rs.{Math.floor(amount + vat+extras)}</span>

        </div>
      </div>

    </div>

  )
}

export default BillCardOngoingOrder