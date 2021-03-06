import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewOrder ,appendOrder,addItemsToOngoingOrder} from "../../redux/orderSlice";
import ItemCard from "./OrderedItem";
import BillCardOngoingOrder from "./BillCard.OngoingOrders";

const initialServerCustomer = {server:'',customer:''}

const OrderCard = () => {

  const user = useSelector(state=> state.settings.currentUser.userName)
 
  const dispatch = useDispatch()
  const [disabled, setDisabled] = React.useState(false)
  const [tableNumber, setTableNumber] = React.useState('')
  const [finalAmount,setFinalAmount] = React.useState(0)

  const settingsState = useSelector(state => state.settings)
  const newOrderNumber = useSelector(state => state.orders.orderNumber)
  const ongoingOrder = useSelector(state => state.orders.newOrder)
  const {canAddNewItems,orderNumber,table,appendedOrder,_id,_rev} = useSelector(state => state.orders.appendOrder)
  const [error,setError] = React.useState({error:''})
  const [serverAndCustomer,setServerAndCustomer] = React.useState(initialServerCustomer)

  const createNewOrder = () => {
    if(tableNumber === ''){
      setError({error:'Choose a table or takeout.'})
      return
    } 
    if(ongoingOrder.length < 1){
      setError({error:'Add item to order.'})
    }else {
      let newDate = new Date()
      let addOrder ={
          orderNumber: newOrderNumber,
          data: ongoingOrder,
          table: tableNumber,
          appendedOrder: 0,
          status:'ongoing',
          dateAndTime: [newDate],
          server:serverAndCustomer.server,
          user:user,
          customerId:serverAndCustomer.customer,
          title:'order',
          client:'client123',
          printItem:'kitchen',
          printer:settingsState.printers.kitchen,

        }
        console.log('addorder',addOrder)
      window.orders.createOrder(addOrder).then(data => data._id? dispatch(addNewOrder(data)):[])
        window.api.printBill(addOrder)
    }
  }
  const createNewOrderForExistingOrder = () => {
    let newDate = new Date()
    if(ongoingOrder.length > 0){
     let addOrder = {
        data: ongoingOrder,
           dateAndTime: newDate,
               appendedOrder: appendedOrder,
                 _id:_id,
           _rev:_rev,
           orderNumber:newOrderNumber,
          
     }
      //  dispatch(addItemsToOngoingOrder({
      //     orderNumber: orderNumber,
      //     data: ongoingOrder,
      //     table: table,
      //     appendedOrder: appendedOrder,
      //      status:'ongoing',
      //      dateAndTime: newDate
      //   }))
      let extraProps ={
        printItem:'kitchen',
        table: tableNumber,
        printer:settingsState.printers.kitchen,
        server:serverAndCustomer.server
      }
    window.orders.createOrder(addOrder).then(data => {
      if(data){
      // console.log(data)
    dispatch(addItemsToOngoingOrder(data))
    window.api.printBill({...addOrder,...extraProps})}})
    } else {
       setError({error:'Add item to order.'})
       return
    }
    
  }
  // console.log('canAddNewItems,orderNumber,table',canAddNewItems,orderNumber,table,appendedOrder)

  let amount = 0 
  let newOrder = {data:[]}

   ongoingOrder.map((item) => {

    amount += parseInt(item.price)*item.quantity
   })

  // console.log(finalAmount,amount)


  
  let vat = Math.floor((amount * 1.08) - amount)
  return (
    <div className="order-card-side bg-white">
      <div className="order-headers strong">
     
        <span>Order:
          {
            canAddNewItems?
            <span>{orderNumber}/{appendedOrder}</span>
            : <span>{newOrderNumber}/{appendedOrder ? appendedOrder : 0}</span>
          } 
          </span>
        <div>
        <span onClick={() => {
          setDisabled(false)
         setError({error:''})
         setTableNumber('')}} >{table==='takeout'? '':'Table:'}
          </span>
          <input className="inputs discount-input" disabled={disabled}
          onChange={(e) => setTableNumber(e.target.value)} 
          name="tableNumber" placeholder="ex:23" />
          </div>
         {
           canAddNewItems?
           <div>{table==='takeout'? table.toUpperCase():table}</div>
           :
           <div>
         
        <span className="do-action do-action-bg font-small" onClick={() => {
          setTableNumber('takeout')
          setDisabled(true)
          setError({error:''})
        }} style={{
          border: `2px solid ${disabled ? '#ef6369' : '#313638'}`, fontSize: '15px',letterSpacing:0, padding:'5px',
          borderRadius: '5px', color: `${disabled ? '#ef6369' : '#313638'}`, padding: '2px', alignItems: 'center', transitionDuration: '0.2s'
        }}>Takeout</span>
        </div>
         }
         <div style={{marginTop:7}} className="font-small grid2col">
        <div  className="grid2col">
        <label>Server:</label>
        <input onChange={(e) => {
          setServerAndCustomer(ps=> {return {...ps,server:e.target.value}})}} className="inputs " style={{width:'70px'}} name="server"/>
        </div>
        <div className="grid2col" >
        <label>Customer:</label>
        <input onChange={(e) => {
          setServerAndCustomer(ps=> {return {...ps,customer:e.target.value}})
        }} className="inputs "  name="customer_id" style={{width:'70px'}}/>
        </div>
         </div>
      </div>

      {
        ongoingOrder.length > 0 ?
          ongoingOrder.map((item, idx) => {
            newOrder.data.push(item)
            return (
              <ItemCard key={idx} item={item} />
            )
          })
          : <></>
      }

       {/* <div className="highlight-font-color" >---------------------------</div> */}
      {
        ongoingOrder.length > 0 ?
        <BillCardOngoingOrder order={newOrder}/>
        : <></>
      }

      <button className="do-action" onClick={ () => {
       
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