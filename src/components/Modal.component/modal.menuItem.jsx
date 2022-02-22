import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { openNewOrder ,addItemsToExistingOrder} from '../../redux/orderSlice'
import { setModalDisplay } from '../../redux/modalSlice'


const MenuItemModal = () => {
  let modificationsText = document.getElementById('modifications')
  const dispatch = useDispatch()
  const [count,setCount] = React.useState(1)
  const [modifications,setModifications] = React.useState('')
  const [error,setError] = React.useState({error:''})
  const menuItemId = useSelector(state => state.modal._id)
  const menuItem = useSelector(state => state.menuItems)
  .find((item) => item._id === menuItemId)
   const ongoingOrders = useSelector(state => state.orders.newOrder)
   const {canAddNewItems,orderNumber,appendedOrder} = useSelector(state => state.orders.appendOrder)
  const ongoingCurrentOrders = useSelector(state => state.orders.currentOrders)
   
     let currentOrderExists = ongoingCurrentOrders.find((item) => item.orderNumber === orderNumber)
  let newOrder = {
    item:menuItem.name,
    quantity:count,
    modifications:modifications,
    price:menuItem.price,
    appendedOrder: appendedOrder
  }
 
  console.log('appendedOrder',appendedOrder)
 

  const addItemToOrder = () => {
    let itemExists = ongoingOrders.find((item) => item.item === newOrder.item)
    if(itemExists){
      setError({error:'Item is already added to the ongoing order. Cancel and add quantity on the Order Card.'})
      return
    }
    dispatch(openNewOrder(newOrder))
    dispatch(setModalDisplay())
    setCount(1)
    setModifications('')
    modificationsText.value = ''

  }
  const addItemsToOngoingOrder = () => {
    console.log(currentOrderExists,canAddNewItems)
    if(currentOrderExists && canAddNewItems){
      dispatch(addItemsToExistingOrder(newOrder))
       dispatch(setModalDisplay())
    setCount(1)
    setModifications('')
    modificationsText.value = ''
    }
  }
  const onCancel = () => {
    dispatch(setModalDisplay())
    setCount(1)
    setModifications('')
    modificationsText.value = ''
  }
  return(
    <div>
      <div>
        {menuItem.name}
      </div>

      <div>
        {menuItem.category}
      </div>

       <div>
        {menuItem.description ? menuItem.description : 'No description.'}
      </div>

       <div>
        {menuItem.ingredients? menuItem.ingredients : 'No ingredient details.'}
      </div>

      <div>
        {menuItem.dishType}
      </div>

      <div>
        Rs.{menuItem.price}
      </div>

  <div className='grid-column'>
     
     <div>Quantity : </div>
      <div style={{marginLeft:'10px',display:'grid',gridTemplateColumns:'repeat(3,30px)',alignItems:'center'}}>
      <div onClick={() => {
        if(count === 0){
          setCount(0)
          } else {
            setCount(count-1)
          }}} className='quantity border-black-red'>-</div>
      <div className='quantity'>{count}</div>
      <div  onClick={() => setCount(count+1)}  className='quantity border-black-red'>+</div>
      </div>
      </div>
      
      <div>
        <div>Modifications: </div>
      <textarea id="modifications" onChange={(e) => setModifications(e.target.value)} name="modifications" className="w100" placeholder="Modifications to the order" type="textarea"/>
      </div>

         <button onClick={() => {
           if(canAddNewItems){
             addItemsToOngoingOrder()
           } else {
             addItemToOrder()
           }
         }}>Add to order</button>
         <button onClick={() => {
           onCancel()
           setError({error:''})
           }}>Cancel</button>
         {
           error.error ?
           <div className='error'>{error.error}</div>
           : <></>
         }
      <div style={{marginTop:'20px'}}>
       <button>Delete</button>

        <button>Update</button>
        </div>
      </div>
  )
}

export default MenuItemModal