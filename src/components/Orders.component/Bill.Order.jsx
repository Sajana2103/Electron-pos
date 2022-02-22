import React from 'react'

const Bill = ({ order }) => {
  const [discount, setDiscount] = React.useState({ type: '', amount: 0 })
  const [finalAmount, setFinalAmount] = React.useState(0)
  const [paymentSplitCustomers, setPaymentSplitCustomers] = React.useState(0)
  const [error, setError] = React.useState({ error: '', discount: '', split: '' })
  const [splitAmount, setSplitAmount] = React.useState(0)

  let discountAmount = 0
  let amount = 0

  order.data.map((item) => {

    amount += (item.price * item.quantity)
  })
  console.log(finalAmount, amount)

  const calculateDiscount = () => {
    if (discount.type === 'discount-percentage') {
      discountAmount = amount * (parseInt(discount.amount) / 100)
      amount = amount - discountAmount
      setFinalAmount(amount)
    } else {
      discountAmount = parseInt(discount.amount)
      amount = amount - discountAmount
      setFinalAmount(amount)
    }
  }
  const paymentSplitByCustomers = () => {
    let totalAmount = finalAmount ? Math.floor((finalAmount) * 1.08) : Math.floor((amount) * 1.08)
    console.log(totalAmount,amount)
    let splitPerPayer = totalAmount / paymentSplitCustomers
    setSplitAmount(splitPerPayer)
  }
  console.log(paymentSplitCustomers)
  const onChangePaymentSplit = (e) => {
    if (isNaN(e.target.value) || isNaN(parseInt(e.target.value))) {
      setError({ split: 'Enter a proper number for split' })
      return
    } else {
      setError({ split: '' })
      setPaymentSplitCustomers(e.target.value)
    }
  }

  let vat = Math.floor((amount * 1.08) - amount)
  return (
    <div className="order-card ">
      <div className="discount-section-main" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,auto)', alignItems: 'center' }}>
        <label className="font-small">Discount :</label> <input onChange=
          {(e) => {
            console.log(isNaN((parseInt(e.target.value))), isNaN(e.target.value))
            if (isNaN(e.target.value) || isNaN(parseInt(e.target.value))) {
              setError({ discount: 'Enter a proper number for to add a discount' })
              return
            } else {
              setError({ discount: '' })
              setDiscount({ type: e.target.name, amount: e.target.value })
            }
          }}
          className="discount-input" name="discount-percentage" placeholder="add %" />
        <input onChange=
          {(e) => {
            if (isNaN(e.target.value) || isNaN(parseInt(e.target.value))) {
              console.log('error')
              setError({ discount: 'Enter a proper number for discount' })
              return
            } else {
              setError({ discount: '' })
              setDiscount({ type: e.target.name, amount: e.target.value })
            }
          }} className="discount-input" name="discount-amount" placeholder="Amount" />
        <button className='font-small' onClick={calculateDiscount}>Discount</button>
      </div>
      {
        error.discount ?
          <div className='error'>{error.discount}</div> : <></>
      }

      <div style={{ display: 'grid', gridTemplateRows: 'repeat(2,auto)', justifyItems: 'end' }}>
        <span
          className="font-small" >Rs.{amount} </span>
        <span className="font-small" >- Discount {discount.type === 'discount-percentage' ? `${discount.amount}%` : `Rs.${discount.amount}`} </span>
        <span className="font-small" >+ VAT 8.0% Rs.{vat} </span>
        <h3 className="highlight-font-color" style={{ paddingTop: '5px' }}>
           Rs.{Math.floor((finalAmount === 0 ? amount : finalAmount) * 1.08)}</h3>
      </div>
      <div>
        <div>
        <div>Payment Split : <input name="customers" placeholder='Ex:4' onChange={onChangePaymentSplit} style={{ width: '30px' }} />
          <button onClick={paymentSplitByCustomers}>Split</button>
          </div>
          {
            splitAmount ?
              <div ><span className='highlight-font-color strong'>
                {splitAmount}</span>
                <span> Per Payer.</span></div>
              : <></>
          }
          {
            error.split ?
              <div className='error'>{error.split}</div> : <></>
          }
        </div>
        <div>
          <div>Cash</div><div>Card</div>
        </div>
      </div>
    </div>
  )
}
//Add Bill open time & close time
//hoook for setTotalAmount so it will change immediatly

export default Bill