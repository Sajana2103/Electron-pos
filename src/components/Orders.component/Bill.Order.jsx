import React from 'react'
import { setModalDisplay } from '../../redux/modalSlice'
import { useDispatch, useSelector } from 'react-redux'
import { completeCloseBill } from '../../redux/orderSlice'

const initialDiscount ={ type: '', discountedAmount: 0 }
const  initialFinalAmount = 0
const initialPaymentSplit = 0
const initialErrorState = { error: '', discount: '', split: '', payByCash: '',unpaid:'',print:''}
const initialPaymentMethod = { method: '' }
const initialPaidAmountBalance = { cash: 0, balance: 0, payPortions: [],paidAmount:0 }
const initialCss = {button:'',css:{color:'#ef6369',border:'2px #ef6369 solid',opacity:1}}
const initialPrint = false

const Bill = ({ order }) => {
  const getInputs = document.getElementsByTagName('input')
  const dispatch =useDispatch()
let modal = document.getElementById("modal-main")
   let modalContent = document.getElementById("modal-content")
  // window.onclick = function (e) {
  //   // console.log(e.target)
  //   if (e.target === modal && e.target !== modalContent) {
  //     // console.log(e.target)
  //     //     console.log(modal.style.display)
      
  //     dispatch(setModalDisplay('none'))
  //     cancelCloseBill()
  //   }
  // }

  const [discount, setDiscount] = React.useState(initialDiscount)
  const [finalAmount, setFinalAmount] = React.useState(initialFinalAmount)
  const [paymentSplitCustomers, setPaymentSplitCustomers] = React.useState(initialPaymentSplit)
  const [error, setError] = React.useState(initialErrorState)
  const [paymentSplitByItems, setPaymentSplitByItems] = React.useState({ items: [], total: 0, split: false })
  const [splitAmount, setSplitAmount] = React.useState(0)
  const [paymentMethod, sePaymentMethod] = React.useState(initialPaymentMethod)
  const [paidAmountAndBalance, setPaidAmountAndBalance] = React.useState(initialPaidAmountBalance)
  const [css,setCss] = React.useState(initialCss)
  const [print,setPrint] = React.useState(initialPrint)

  const settingsState = useSelector(state => state.settings)
  const regNumbers = /\D/
  
  console.log(paidAmountAndBalance.payPortions)
  let clientName = 'Lotus'
  let finalBill
  let currentVat = 0.08
  let discountAmount = 0
  let amount = 0
  let subTotal = 0
  let vat = 0
   let extras = 0
   let serviceCharge = settingsState.serviceCharge
  order.data.map((item) => {
     if(item.vat){
    // console.log('vat',item.vat,currentVat,item.price)
    vat += Math.floor(((parseInt(item.price*item.quantity )+extras)* currentVat))
  }
  if(item.extras && item.extras.length){
    item.extras.map((item,id) => extras += parseInt(item.price))
    
  }
    amount += (item.price * item.quantity) 
    subTotal += (item.price * item.quantity)  
  })
  // let vat = finalAmount? Math.floor((finalAmount * 1.08) - finalAmount) : Math.floor((amount * 1.08) - amount)
  console.log('finalAmount.paidAmountAndBalance balance',paidAmountAndBalance,(finalAmount+vat+extras))
  const calculateDiscount = () => {

    if (regNumbers.exec(discount.discountedAmount)) {
      setDiscount({ type: '', discountedAmount: 0 })
      setFinalAmount(subTotal)
      return
    }
    if (discount.type === 'discount-percentage') {
      discountAmount = amount * (discount.discountedAmount / 100)
      amount = amount - discountAmount 
      setFinalAmount(amount)
    } else if (discount.type === 'discount-amount') {

      discountAmount = discount.discountedAmount
      amount = amount - discountAmount 
      setFinalAmount(amount)
    }
  }

  const cancelDiscount = () => {
    setDiscount({ type: '', discountedAmount: 0 })
    setFinalAmount(subTotal)
    return
  }
  const paymentSplitByCustomers = () => {
    let totalAmount = finalAmount ? Math.floor((finalAmount+ extras+vat) ) : Math.floor(amount+vat+extras)
    console.log(totalAmount, amount)
    let splitPerPayer = Math.floor(totalAmount / paymentSplitCustomers)
    if(splitPerPayer===Infinity) {setSplitAmount(totalAmount); return;}
    setSplitAmount(splitPerPayer)
  }
  console.log(paymentSplitCustomers)
  const onChangePaymentSplit = (e) => {
    if (regNumbers.exec(e.target.value)) {
      setError({ split: 'Enter a proper number for split' })
      return
    } else {
      setError({ split: '' })
      setPaymentSplitCustomers(e.target.value)
    }
  }
  console.log(error.print)
  const closeBill = () => {
    let serviceChargeAmount = subTotal*(serviceCharge/100)
    let total = finalAmount? (finalAmount+ vat+extras) : (amount+vat+extras)
    let discountedBalance = finalAmount ? Math.abs(Math.floor(finalAmount+vat+extras)-paidAmountAndBalance.paidAmount) : paidAmountAndBalance.balance
    let discountedTotal = discount.type === 'discount-percentage'? ((amount+vat+extras)/100) * discount.discountedAmount : discount.discountedAmount
      console.log(total>paidAmountAndBalance.paidAmount )

    if(total>paidAmountAndBalance.paidAmount ){
      console.log('error',finalAmount,total,paidAmountAndBalance.paidAmount)
      setError({error:'Unpaid amount left.',unpaid:true})
      return
    }
    if(!print){
      console.log('print error')
      setError({print:'Print bill before closing.'})
      return
    }

    finalBill = {...order,...paidAmountAndBalance,...discount,
    total:total,
    discountedTotal:discountedTotal? Math.floor(discountedTotal) :0,
    balance : discountedBalance,
    vat:vat,
    status:'completed',
    billCloseTime: new Date(),
    
    extras:extras,
    serviceCharge:serviceChargeAmount,
    subTotal:amount,
    printer:settingsState.printers.bill,
    ...settingsState.shopDetails
    }
    window.orders.completeOrCancelOrder(finalBill)
    .then(data => {
      if(data.ok){
        dispatch(completeCloseBill(finalBill))
    dispatch(setModalDisplay())
    cancelCloseBill()
    console.log(finalBill)
      } else {
        setError({error:data.error,update:'update'})
      }
       })
  }
  const sendBillToPrint = (e) => {
    e.preventDefault()
let serviceChargeAmount = subTotal*(serviceCharge/100)
     let total = finalAmount? (finalAmount+ vat+extras) : (amount+vat+extras)
    let discountedBalance = finalAmount ? Math.abs(Math.floor(finalAmount+vat+extras)-paidAmountAndBalance.paidAmount) : paidAmountAndBalance.balance
    let discountedTotal = discount.type === 'discount-percentage'? ((amount+vat+extras)/100) * discount.discountedAmount : discount.discountedAmount
      console.log(total>paidAmountAndBalance.paidAmount )

    if(total>paidAmountAndBalance.paidAmount ){
      console.log('error',finalAmount,total,paidAmountAndBalance.paidAmount)
      setError({error:'Unpaid amount left.',unpaid:true})
      return
    }

finalBill = {...order,...paidAmountAndBalance,...discount,
    total:total,
    discountedTotal:discountedTotal? discountedTotal :0,
    balance : discountedBalance,
    vat:vat,
    status:'completed',
    billCloseTime: new Date(),
    extras:extras,
    serviceCharge:serviceChargeAmount,
    subTotal:amount,
    printItem:'bill',
    printer:settingsState.printers.bill,
    ...settingsState.shopDetails
    }

    setPrint(true)
    setError({error:''})
    window.api.printBill(finalBill)

    console.log('printBill', order)
  }
  const cancelCloseBill = () => {
    for(let i =0; i <4;i++){
        getInputs[i].value = ''
      }
    setDiscount(initialDiscount)
    setFinalAmount(initialFinalAmount)
    setPaymentSplitCustomers(initialPaymentSplit)
    setError(initialErrorState)
    setSplitAmount(initialPaymentSplit)
    setPaidAmountAndBalance(initialPaidAmountBalance)
    setCss(initialCss)
    setPrint(initialPrint)
  }
  console.log(discount.amount)

  return (
    <div className="order-card-billModal ">
      {/* <div className="highlight-font-color" >------------------------------</div> */}
      <div style={{borderRight:'1px solid #d3d3d3'}}>

        <div>
          <h3 className='font-large bold'>PAYMENT:</h3>
          <div style={{marginTop:10}} className='font-small'>Payment Split : <input className='inputs' inputTag="billCloseModal" placeholder='Ex:4' onChange={onChangePaymentSplit} style={{ width: '30px' }} />
            <button className='do-action' onClick={paymentSplitByCustomers}>Split</button>
          </div>
          {
            splitAmount ?
              <div>Rs.<span className='highlight-font-color strong'>
                {splitAmount}</span>
                <span className='font-small'> Per Payer.</span></div>
              : <></>
          }
          {
            error.split ?
              <div className='error'>{error.split}</div> : <></>
          }
          {/* <button onClick={() => {setPaymentSplitByItems({split:true})}}>Payment Split By Item</button> */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,4rem)', marginTop: '1ch',columnGap:5 }}>

            <div onClick={() => { sePaymentMethod({ method: 'card' }); setCss(prev => { return { ...prev, button: 'card' } }) }} style={css.button === 'card' ? { ...css.css } : { cursor: 'pointer', }} className='bold paymentBtn'>CARD </div>
            <div onClick={() => { sePaymentMethod({ method: 'cash' }); setCss(prev => { return { ...prev, button: 'cash' } }) }} style={css.button === 'cash' ? { ...css.css } : { cursor: 'pointer' }} className='bold paymentBtn' >CASH</div>
          </div>

        {
          
            paymentMethod.method === 'cash' || paymentMethod.method === 'card' ?
              <div style={{  display: 'grid', gridTemplateRows: '1rem 1rem 1.5rem',marginTop:'0.5rem', }} className="font-small">
              
                <div style={{ display: 'grid', gridTemplateColumns: '100px 70px 20px 20px', }}><label>Paid Amount </label>

                  <input placeholder='paid amount' className='inputs'inputTag="billCloseModal" 
                    onChange={(e) => {
                      if (!regNumbers.exec(e.target.value)) {
                        console.log(e.target.value)
                        setError({ payByCash: '' })
                        setPaidAmountAndBalance(prevState => {
                          let cash = parseInt(e.target.value)
                          let balance = (amount + vat+extras) - cash
                          
                          console.log(balance)
                          if (balance < 0) {
                            return { ...prevState, cash: cash, balance: Math.abs(balance), }
                          }
                          return { ...prevState, cash: cash, balance: 0,}
                        })

                      } else {
                        setError({ payByCash: 'Only numbers are accepted.' })
                      }

                    }} />
                  <button title="add amount" onClick={() => { 
                    if (paidAmountAndBalance.cash !== 0 && (paidAmountAndBalance.paidAmount <= (amount + vat+extras) || paidAmountAndBalance.paidAmount <= (finalAmount + vat+extras))) {
                      setPaidAmountAndBalance(prevState => {
                        console.log('setPaiD runs')
                        let { payPortions } = prevState
                   
                        let paidAmount = paidAmountAndBalance.cash + paidAmountAndBalance.paidAmount
                        let balance = paidAmount - (amount + vat +extras)
                        if (paidAmountAndBalance.cash !== 0) {
                          return {
                            ...prevState,
                            payPortions: [...payPortions, { method: paymentMethod.method, amount: paidAmountAndBalance.cash }],
                            balance: balance,
                            paidAmount:paidAmount
                          }
                        } else {
                          console.log('setPaiD dont run')
                          return
                        }
                      })
                    } else {
                      console.log('setPaiD dont run')
                      return
                    }
                  }} className="plus-btn" style={{width:'20px'}}>+</button>
                  <button title="reset" className="plus-btn" style={{backgroundColor:'#ef636'}} onClick={()=> setPaidAmountAndBalance((prevState)=>{
                    return {...prevState, payPortions:[],paidAmount:0,balance:0}
                  })}>x</button>
                </div>
              
                <div style={{display:'grid',gridTemplateColumns:'repeat(2,auto)'}}>
              
                </div>
                
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,60px)',alignItems:'center',height:50,overflow:'scroll',overflowX:'hidden',columnGap:'1ch'}}>
                  {
                  paidAmountAndBalance.payPortions.length?
                  paidAmountAndBalance.payPortions.map((portion,idx)=> {
                    return(
                        <div style={{border:'1px solid #d3d3d3',color:'#6f6f6f',width:'60px',textAlign:'start',padding:2,}} id={idx}
                        onClick={() => {setPaidAmountAndBalance(prevState => {
                          let {payPortions,paidAmount,balance} = prevState
                          let amount =  payPortions[idx].amount
                            
                          payPortions = payPortions.filter((portion,index) => {
                            return idx !== index})
                          return {...prevState,payPortions:[...payPortions],paidAmount:paidAmount-amount,balance:balance-amount}
                        })}}>
                        <label className='font-small nonClickable'>{idx+1}.{portion.method.toUpperCase()}</label><br />
                        <span className='font-small nonClickable '>Rs.{portion.amount}</span>
                      </div>
                    )
                  } )
                  : <></>
                }
                </div>
                  {
                  error.payByCash ?
                    <div className="error">{error.payByCash}</div>
                    : <></>
                }
              </div>
              : <></>
          }
        </div>
      </div>

      <div>
        <div className="discount-section-main" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,auto)', alignItems: 'center' }}>
          <label className="font-small">Discount :</label> <input onChange=
            {(e) => {
              // console.log('e.target.value',Boolean(e.target.value.length),discount.amount)
              let isNumber = regNumbers.exec(e.target.value)
              if (isNumber && e.target.value.length) {
                setError({ discount: 'Enter a proper number for to add a discount' })
                setDiscount({ type: '', discountedAmount: 0 })
                return
              } else {
                setError({ discount: '' })
                setDiscount({ type: e.target.name, discountedAmount: parseInt(e.target.value) })
              }
            }}
            className="discount-input inputs" name="discount-percentage" placeholder="%" inputTag="billCloseModal" />
          <input onChange=
            {(e) => {

              if (regNumbers.exec(e.target.value) && e.target.value.length) {
                console.log('error')
                setError({ discount: 'Enter a proper number for discount' })
                return
              } else {
                setError({ discount: '' })
                setDiscount({ type: e.target.name, discountedAmount: parseInt(e.target.value) })

              }
            }} className="discount-input inputs" name="discount-amount" placeholder="Rs." inputTag="billCloseModal"/>
          <button className='font-small do-action' onClick={calculateDiscount}>Discount</button>
          <button className='font-small cancel-action' onClick={cancelDiscount}>Cancel</button>
        </div>
        {
          error.discount ?
            <div className='error'>{error.discount}</div> : <></>
        }
        <div style={{ display: 'grid', gridTemplateRows: 'repeat(2,auto)', justifyItems: 'end' }}>
          <span style={{marginTop:3}}
            className="font-small" >SUB-TOTAL Rs.{amount+extras} </span>
          {
            discount.discountedAmount ?
              <span className="font-small font-color-orange" >- Discount {discount.type === 'discount-percentage' ? `${discount.discountedAmount}%` : `Rs.${discount.discountedAmount}`} </span>
              : <></>
          }
          <span className="font-small" >+ EXTRAS {extras} </span>
          <span className="font-small" >+ VAT 8.0% Rs.{vat} </span>
          <h3 className="highlight-font-color font-size-large bold"  style={{padding:'5px 0px 6px 0px'}}>
            Rs.{Math.floor((finalAmount === 0 ? amount : finalAmount) + vat+extras)}</h3>
        </div>
        <div>

          <div className='bill-icons-main' >
          {
            finalAmount?
            <>
                              <label style={{marginBottom:'1ch'}}>Balance:<span className='bold '>Rs.{(finalAmount+vat+extras)-paidAmountAndBalance.paidAmount<0? Math.abs(Math.floor(finalAmount+vat+extras)-paidAmountAndBalance.paidAmount) : 0}</span></label>
                  <label style={{marginBottom:'1ch'}}>Unpaid:<span className='bold highlight-font-color'>
                    Rs.{(finalAmount+vat+extras)>paidAmountAndBalance.paidAmount?Math.floor(finalAmount+vat+extras)-paidAmountAndBalance.paidAmount:0}</span></label>

            </>
            :
            <>
            
                  <label style={{marginBottom:'1ch'}}>Balance:<span className='bold '>Rs.{paidAmountAndBalance.balance<0? 0 : paidAmountAndBalance.balance}</span></label>
                  <label style={{marginBottom:'1ch'}}>Unpaid:<span className='bold highlight-font-color'>
                    Rs.{(amount+vat+extras)>paidAmountAndBalance.paidAmount?(amount+vat+extras)-paidAmountAndBalance.paidAmount:0}</span></label>
            </>
          }

            <div onClick={sendBillToPrint} className='bill-icons-bg' ><img className='bill-icons' src="printer.png" /></div>
            <div onClick={() => closeBill()} className='bill-icons-bg'><img className='bill-icons' src="tick.png" /></div>
          </div>
         {
           error.unpaid? <span className='error'>{error.error}</span> : <></>
         }
         {
           !print && error.print? <span className='error'>{error.print}</span> : <></>
         }
         {
           error.update? <span className='error'>{error.error}</span> : <></>
         }
        </div>
      </div>

    </div>
  )
}
//Add Bill open time & close time
//hoook for setTotalAmount so it will change immediatly

export default Bill