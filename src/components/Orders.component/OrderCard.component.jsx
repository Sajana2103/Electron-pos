import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewOrder ,appendOrder,addItemsToOngoingOrder,addItemsToKitchOrders} from "../../redux/orderSlice";
import ItemCard from "./OrderedItem";
import Bill from "./Bill.Order";

const OrderCard = () => {

  const dispatch = useDispatch()
  const [disabled, setDisabled] = React.useState(false)
  const [tableNumber, setTableNumber] = React.useState('')
  const [discount, setDiscount] = React.useState({ type: '', amount: 0 })
  const [finalAmount,setFinalAmount] = React.useState(0)
  const newOrderNumber = useSelector(state => state.orders.orderNumber)
  const ongoingOrder = useSelector(state => state.orders.newOrder)
  const {canAddNewItems,orderNumber,table,appendedOrder} = useSelector(state => state.orders.appendOrder)
  const [error,setError] = React.useState({error:''})

  
  const createNewOrder = () => {
    if(tableNumber === ''){
      setError({error:'Choose a table or takeout.'})
      return
    } 
    if(ongoingOrder.length < 1){
      setError({error:'Add item to order.'})
    }else {
     dispatch(addNewOrder({
          orderNumber: newOrderNumber,
          data: ongoingOrder,
          table: tableNumber,
          appendedOrder: 0,
          status:'ongoing',
          dateAndTime: new Date().toLocaleString()
        }))
    }
  }
  const createNewOrderForExistingOrder = () => {
    if(ongoingOrder.length > 0){
       dispatch(addItemsToOngoingOrder({
          orderNumber: orderNumber,
          data: ongoingOrder,
          table: table,
          appendedOrder: appendedOrder,
           status:'ongoing',
           dateAndTime: new Date().toLocaleString()
        }))
    } else {
       setError({error:'Add item to order.'})
       return
    }
    
  }
  console.log('canAddNewItems,orderNumber,table',canAddNewItems,orderNumber,table,appendedOrder)
  let discountAmount = 0
  let amount = 0 

   ongoingOrder.map((item) => {

    amount += parseInt(item.price)*item.quantity
   })

  console.log(finalAmount,amount)

  const calculateDiscount = () => {
    if (discount.type === 'discount-percentage') {
      discountAmount = amount * (parseInt(discount.amount) / 100)
      amount = amount -discountAmount
       setFinalAmount(amount)
    } else {
      discountAmount = parseInt(discount.amount)
     amount = amount -discountAmount
    setFinalAmount(amount)
    }
  }
  
  let vat = Math.floor((amount * 1.08) - amount)
  return (
    <div className="order-card">
      <div className="order-headers">
     
        <span>Order :
          {
            canAddNewItems?
            <span>{orderNumber}/{appendedOrder}</span>
            : <span>{newOrderNumber}/{appendedOrder ? appendedOrder : 0}</span>
          } 
          </span>

        <span onClick={() => {
          setDisabled(false)
         setError({error:''})
         setTableNumber('')}} >Table :
          </span>
         {
           canAddNewItems?
           <div>{table}</div>
           :
           <div>
         <input disabled={disabled}
          onChange={(e) => setTableNumber(e.target.value)} style={{ width: '30px', borderRadius: '5px', padding: '2px' }}
          name="tableNumber" placeholder="ex:23" />
        <span onClick={() => {
          setTableNumber('takeout')
          setDisabled(true)
          setError({error:''})
        }} style={{
          border: `1px solid ${disabled ? '#ef6369' : '#313638'}`, fontSize: '15px'
          , borderRadius: '5px', color: `${disabled ? '#ef6369' : '#313638'}`, padding: '2px', alignItems: 'center', transitionDuration: '0.2s'
        }}>Takeout</span>
        </div>
         }

      </div>

      {
        ongoingOrder.length > 0 ?
          ongoingOrder.map((item, idx) => {
            return (
              <ItemCard key={idx} item={item} />
            )
          })
          : <></>
      }

      <div className="discount-section-main">
        <label className="font-small">Discount :</label> <input onChange=
          {(e) => { setDiscount({ type: e.target.name, amount: e.target.value }) }} className="discount-input" name="discount-percentage" placeholder="add %" />
        <input onChange=
          {(e) => { setDiscount({ type: e.target.name, amount: e.target.value }) }} className="discount-input" name="discount-amount" placeholder="Amount" />
        <button onClick={calculateDiscount}>Set Discount</button>
      </div>

      <div style={{ display: 'grid', gridTemplateRows: 'repeat(2,auto)', justifyItems: 'end' }}>
        <span
          className="font-small" >Rs.{amount} </span>
        <span className="font-small" >- Discount {discount.type === 'discount-percentage' ? `${discount.amount}%` : `Rs.${discount.amount}`} </span>
        <span className="font-small" >+ VAT 8.0% Rs.{vat} </span>
        <h3 className="highlight-font-color" style={{ paddingTop: '5px' }}> Rs.{Math.floor((finalAmount === 0? amount : finalAmount) * 1.08)}</h3>
      </div>
     
      <button onClick={ () => {
        if(canAddNewItems){
          createNewOrderForExistingOrder()
          dispatch(appendOrder({canAddNewItems:false}))
        } else {
        createNewOrder()
        }
      }
        }>
        {tableNumber === 'takeout' ? 'Order and charge' : 'Open new order '}</button>
       {
          error.error?
      <div className="error">{error.error}</div>
      : <></>
      }
    </div>
  )
}

export default OrderCard