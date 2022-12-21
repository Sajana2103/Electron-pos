import React from 'react'
import { useSelector } from 'react-redux'

const BillCardOngoingOrder = ({ order }) => {
  const {vat} = useSelector(state => state.settings)
  let amount = 0
  let vatAmount = 0
  let extras = 0

  // console.log(vat)

  order.data.map((item) => {

  if(item.vat){
    // console.log('vat',item.vat,currentVat,item.price)
    vatAmount += Math.floor(((parseInt(item.price*item.quantity )+extras)* (vat/100)))
  }
  if(item.extras && item.extras.length){
    item.extras.map((item,id) => extras += parseInt(item.price))
  }
    amount += (item.price * item.quantity)
  })
  // console.log(vatAmount)
  // let vat = Math.floor((amount * 1.08) - amount)
  return (
    <div className="order-card-side">

      <div style={{ display: 'grid', gridTemplateRows: 'repeat(2,auto)', justifyItems: 'end' }}>
        <span
          className="font-small" >Sub-total : Rs.{amount+extras} </span>
        
        <span className="font-small" >+ VAT {vat}% Rs.{vatAmount} </span>
            <span className="font-small" >+ EXTRAS Rs.{extras} </span>

        <div style={{ display: 'grid',marginTop:'5px', gridTemplateColumns:'repeat(2,auto)',justifyContent:'end' }}>
          <h3 style={{ color: '#313638' }}>Total :&nbsp;</h3>
          <span className="highlight-font-color strong font-size-large">Rs.{Math.floor(amount + vatAmount+extras)}</span>

        </div>
      </div>

    </div>

  )
}

export default BillCardOngoingOrder