import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewOrder, appendOrder, addItemsToOngoingOrder } from "../../redux/orderSlice";
import { updateTableState } from "../../redux/tablesSlice";
import { addOrderToday } from "../../redux/orderHistorySlice";
import ItemCard from "./OrderedItem";
import BillCardOngoingOrder from "./BillCard.OngoingOrders";

const initialServerCustomer = { server: '', customer: '' }

const OrderCard = () => {

  const user = useSelector(state => state.settings.currentUser.userName)
  const { tables } = useSelector(state => state.tables)
  const dispatch = useDispatch()
  const [disabled, setDisabled] = React.useState(false)
  const [tableNumber, setTableNumber] = React.useState('')
  const [tableId, setTableId] = React.useState('')

  const {todayOrders} = useSelector(state => state.ordersHistory)
  const settingsState = useSelector(state => state.settings)
  const newOrderNumber = useSelector(state => state.orders.orderNumber)
  const ongoingOrder = useSelector(state => state.orders.newOrder)
  const { canAddNewItems, orderNumber, table, appendedOrder, _id, _rev } = useSelector(state => state.orders.appendOrder)
  const [error, setError] = React.useState({ error: '' })
  const [serverAndCustomer, setServerAndCustomer] = React.useState(initialServerCustomer)

 
  // console.log(todayOrders)
  const createNewOrder = () => {
    if (tableNumber === '') {
      setError({ error: 'Choose a table or takeout.' })
      return
    }
    if (ongoingOrder.length < 1) {
      setError({ error: 'Add item to order.' })
    } else {
      let newDate = new Date()
      let addOrder = {
        orderNumber: newOrderNumber,
        data: ongoingOrder,
        table: tableNumber,
        appendedOrder: 0,
        status: 'ongoing',
        dateAndTime: [newDate],
        server: serverAndCustomer.server,
        user: user,
        customerId: serverAndCustomer.customer,
        title: 'order',
        client: settingsState.shopDetails.client,
        printItem: 'kitchen',
        printer: settingsState.printers.kitchen,
        table_id:tableId._id

      }
      // console.log('addorder', addOrder)
      window.orders.createOrder(addOrder).then(data =>{ 
        if(data._id)  {
          dispatch(addNewOrder(data))
          dispatch(addOrderToday(data))
        }
        })
      
      updateTable()
      window.api.printBill(addOrder)
    }
  }
  const createNewOrderForExistingOrder = () => {
    let newDate = new Date()
    if (ongoingOrder.length > 0) {
      let addOrder = {
        data: ongoingOrder,
        dateAndTime: newDate,
        appendedOrder: appendedOrder,
        _id: _id,
        _rev: _rev,
        orderNumber: orderNumber,
  
      }
      let extraProps = {
        printItem: 'kitchen',
        table: tableNumber,
        printer: settingsState.printers.kitchen,
        server: serverAndCustomer.server
      }
      window.orders.createOrder(addOrder).then(data => {
        if (data) {
          console.log('ordercard',data)
          dispatch(addItemsToOngoingOrder(data))
          dispatch(addOrderToday(data))
          window.api.printBill({ ...addOrder, ...extraProps })
        }
      })
    } else {
      setError({ error: 'Add item to order.' })
      return
    }

  }
  const updateTable = () => {
    let updateSelected = {
      ...tableId,
      status:'Occupied',
      currentOrder:newOrderNumber,
      server:serverAndCustomer.server,
      customer:serverAndCustomer.customer
    }
    window.tablesReservations.updateTable(updateSelected).then(data => {
      if(data._rev){
        updateSelected._rev = data._rev
          dispatch(updateTableState(updateSelected))
        
      } else {
          // console.log(data)
      }
  }
  )
  }
  // console.log('canAddNewItems,orderNumber,table',canAddNewItems,orderNumber,table,appendedOrder)

  let amount = 0
  let newOrder = { data: [] }

  ongoingOrder.map((item) => {

    amount += parseInt(item.price) * item.quantity
  })

  // console.log(finalAmount,amount)

  // console.log(tableNumber)

  return (
    <div className="order-card-side bg-white">
      <div className="order-headers strong">

        <span style={{ fontSize: 14 }}>Order:
          {
            canAddNewItems ?
              <span>{orderNumber}/{appendedOrder}</span>
              : <span>{newOrderNumber}/{appendedOrder ? appendedOrder : 0}</span>
          }
        </span>
        <div>
          <span className="tablesDropdown " style={{ fontSize: 14 }}>{tableNumber ? `Table:${tableNumber}` : 'Table'}
           {
             !canAddNewItems?
            <div className="dropdownTable">
              {
                tables.length ?
                tables.map((table) => {
                   if(table.status==='Vacant'){ return (
                      <div onClick={() => {
                        setTableNumber(table.number); setDisabled(false)
                        setTableId(table)
                      }} className="vacantTable font-size-small">
                        <span>{table.number} </span><span className="font-size-xsmall strong">{table.location}</span></div>
                    )}
                  }) : <div>---</div>
              }
            </div> : <></>
           }
          </span>
          {/* <span onClick={() => {
          setDisabled(false)
         setError({error:''})
         setTableNumber('')}} >{table==='takeout'? '':'Table:'}
          </span> */}
          {/* <input className="inputs discount-input" disabled={disabled}
       
          onChange={(e) => setTableNumber(e.target.value)} 
          name="tableNumber" placeholder="ex:23" /> */}

        </div>
        {
          canAddNewItems ?
            <div>{table === 'takeout' ? table.toUpperCase() : table}</div>
            :
            <div>

              <span className="font-small" onClick={() => {
                setTableNumber('takeout')
                setDisabled(true)
                // console.log(disabled)
                setError({ error: '' })
              }} style={{
                border: `2px solid ${disabled ? '#ef6369' : '#313638'}`, padding: '5px', cursor: 'pointer',
                borderRadius: '5px', color: `${disabled ? '#ef6369' : '#313638'}`, padding: '2px', alignItems: 'center', transitionDuration: '0.2s'
              }}>Takeout</span>
            </div>
        }
        <div style={{ marginTop: 7 }} className="font-small grid2col">
          <div className="grid2col">
            <label>Server:</label>
            <input onChange={(e) => {
              setServerAndCustomer(ps => { return { ...ps, server: e.target.value } })
            }} className="inputs " style={{ width: '70px' }} name="server" />
          </div>
          <div className="grid2col" >
            <label>Customer:</label>
            <input onChange={(e) => {
              setServerAndCustomer(ps => { return { ...ps, customer: e.target.value } })
            }} className="inputs " name="customer_id" style={{ width: '70px' }} />
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
          <BillCardOngoingOrder order={newOrder} />
          : <></>
      }

      <button className="do-action" onClick={() => {

        if (canAddNewItems) {
          createNewOrderForExistingOrder()
          dispatch(appendOrder({ canAddNewItems: false }))
        } else {
          createNewOrder()
        }
      }
      }>
        {tableNumber === 'takeout' ? 'Order and charge' : 'Open new order '}</button>
      {
        error.error ?
          <div className="error">{error.error}</div>
          : <></>
      }
    </div>
  )
}

export default OrderCard