  {/* <span>Service %:</span><br/> <input  onChange={(e) => {
            let priceRegex = regNumbers.exec(e.target.value)
            console.log('serviceCharge',e.target.name)
            if (priceRegex) {
              setError({ error: 'Only numbers are accepted.', input: e.target.name })
              return
            } else {
              setError({ error: '', input: '' })
              onChange(e)
            }
          }} className="modal-form-input " name='service' placeholder="ex:10" />
          {error.input === 'serviceCharge' ?
            <span className="error">{error.error}</span> : <></>} */}
            import React, { useEffect,useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { openNewOrder, addItemsToExistingOrder } from '../../redux/orderSlice'
import { removeItemFromState, currentItemModal, resetCurrentItemModal } from '../../redux/menuItemSlice'
import { setModalDisplay } from '../../redux/modalSlice'



const MenuItemModal = () => {

  let modal = document.getElementById("modal-main")
  let modalContent = document.getElementById("modal-content")
  window.onclick = function (e) {
    // console.log(e.target)
    if (e.target === modal && e.target !== modalContent) {
      // console.log(e.target)
      //     console.log(modal.style.display)
      
      setModifications('')
      setCount(1)
      setError({ error: '' })
      dispatch(resetCurrentItemModal())
      dispatch(setModalDisplay('none'))
      if (modificationsText.value) {
        modificationsText.value = ''
      } else { return }
    }
  }


  let modificationsText = document.getElementById('modifications')
  const dispatch = useDispatch()

  const [deleteWarning, setDeleteWarning] = useState({ warning: '' })
  const [count, setCount] = useState(1)
  const [modifications, setModifications] = useState('')
  const [error, setError] = useState({ error: '' })
  const [portionSize,setPortionSize] = useState('')
  const menuItemId = useSelector(state => state.modal._id)

  dispatch(currentItemModal(useSelector(state => state.menuItems.items)
    .find((item) => item._id === menuItemId)))

  const menuItem = useSelector(state => state.menuItems.itemModal)
  const ongoingOrders = useSelector(state => state.orders.newOrder)
  const { canAddNewItems, orderNumber, appendedOrder } = useSelector(state => state.orders.appendOrder)
  const ongoingCurrentOrders = useSelector(state => state.orders.currentOrders)
  
  
  let currentOrderExists = ongoingCurrentOrders.find((item) => item.orderNumber === orderNumber)
  let newOrder = {
    item: menuItem.name,
    quantity: count,
    modifications: modifications,
    price: menuItem.price,
    appendedOrder: appendedOrder,

  }
  const [newOrderState,setNewOrderState] = useState({
    item:menuItem.name,
    appendedOrder:appendedOrder,
    price:menuItem.price,
    portion:'',
    quantity:1,
    modifications:'',
  })

  console.log('menuitemModal',menuItemId,menuItem)
  console.log('newOrderState ', newOrderState,newOrder)
 
  const addItemToOrder = () => {
    let itemExists = ongoingOrders.find((item) => (item.item === newOrder.item))
    if (itemExists) {
      setError({ error: 'Item is already added to the ongoing order. Cancel and add quantity on the Order Card.' })
      return
    }
    dispatch(openNewOrder(newOrderState))
    dispatch(setModalDisplay())
    setCount(1)
    setModifications('')
    modificationsText.value = ''

  }
  const addItemsToOngoingOrder = () => {

    console.log(currentOrderExists, canAddNewItems)
    if (currentOrderExists && canAddNewItems) {
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
  const removeItemWithId = () => {
    console.log(menuItemId)
    window.api.removeItem(menuItemId).then(res => {
      if (res.ok) {
        dispatch(removeItemFromState(menuItemId))
        dispatch(setModalDisplay())
        setDeleteWarning({ warning: '' })
        setCount(1)
        setModifications('')
        modificationsText.value = ''
      }
    })


  }
  return (
    <div style={{ width: '200px' }}>

      <div style={{ width: '100%', display: 'grid', justifyContent: 'end' }}>
        <button className='close-btn' title="Cancel" onClick={() => {
          onCancel()
          setError({ error: '' })
        }}>X</button>
      </div>
      
      <div>
        {
          menuItem.image ?
            <img className='menuitem-modal' src={menuItem.image} />
            :
            <img className='menuitem-modal' src="maxresdefault.jpg" />
        }
      </div>

      <div style={{ paddingTop: '10px', paddingBottom: '10px', width: '200px' }}>
        <span className='strong font-size-large' >{menuItem.name ? menuItem.name.toUpperCase() : 'Unnamed'} </span>
        <br />
        <span style={{ opacity: '0.5' }}> ({menuItem.category}) </span>

      </div>

      <div style={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <span style={{ opacity: '0.7' }}>{menuItem.ingredients ? menuItem.ingredients : 'No ingredient details.'}</span>
        <br /><span style={{ opacity: '0.7' }}>{menuItem.dishType}</span>
      </div>
      {
        menuItem.portionSizes && menuItem.portionSizes.length>0 ?
        menuItem.portionSizes.map((portion) => {
          if(portion.portionSize === portionSize.portionSize){
          return(
            <div onClick={() =>{setPortionSize(portion);}} className='strong font-size-large' style={{display:'grid',gridTemplateColumns:'50% 1rem',color:'#ef6369',cursor:'pointer'}}>
            <span>{portion.portionSize}</span><span>Rs.{portion.portionPrice}</span>
          </div>
          )} 

          return(
            <div onClick={() =>{setPortionSize(portion);
            
            setNewOrderState(prevState => {
            
              return {...prevState,portion:portion.portionSize,price:portion.portionPrice}
            })}} className='strong font-size-large' style={{display:'grid',gridTemplateColumns:'50% 1rem',cursor:'pointer'}}>
            <span>{portion.portionSize}</span><span>Rs.{portion.portionPrice}</span>
          </div>
          )})
        :
      <div className='strong font-size-large' style={{ paddingTop: '5px', paddingBottom: '5px', opacity: '0.7' }}>
        Rs.{menuItem.price}
      </div>
      }

      <div className='grid-column' style={{ paddingTop: '5px', paddingBottom: '5px', }}>

        <div>Quantity : </div>
        <div style={{ marginLeft: '10px', display: 'grid', gridTemplateColumns: 'repeat(3,30px)', alignItems: 'center' }}>
          <div onClick={() => {
              setNewOrderState((prevState) => {
                
                if(newOrderState.quantity>1) { let {quantity} = prevState;console.log(quantity);
                return {...prevState,quantity:quantity-1};
                }
                return {...prevState}
              })
          }} className='quantity black-red-bg'>-</div>
          <div className='quantity'>{newOrderState.quantity}</div>
          <div onClick={() => {
              setNewOrderState((prevState) => { let {quantity} = prevState;
                return {...prevState,quantity:quantity+1};
              })
          }}  className='quantity black-red-bg'>+</div>
        </div>
      </div>
      
      <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>

        <textarea id="modifications" onChange={(e) =>
        setNewOrderState(prevState=>{return {...prevState,modifications:e.target.value}})
        } name="modifications"
          className="w100 modifications" placeholder="Modifications to the order" type="textarea" />
      </div>
      <div style={{ justifyContent: "center", display: 'grid' }}>
        <button className='do-action strong font-size-med' style={{ border: '3px #313638 solid', width: '100px' }} onClick={() => {
          if (canAddNewItems) {
            addItemsToOngoingOrder()
          } else {
            addItemToOrder() 
          }
        }}>ADD TO ORDER</button>

      </div>
      {
        error.error ?
          <div className='error' style={{ marginTop: '10px' }}>{error.error}</div>
          : <></>
      }
      {
        deleteWarning.warning ?
          <div >
            <span className="error" style={{ marginTop: '10px' }}>{deleteWarning.warning}</span>
            <div style={{ display: 'grid', columnGap: '3px', justifyContent: 'center', gridTemplateColumns: 'repeat(2,auto)', marginTop: '5px' }}>
              <button onClick={removeItemWithId} className='cancel-action bg-red'>Yes</button>
              <button onClick={() => {
                setDeleteWarning({ warning: '' })
              }} className='do-action bg-grey'>Cancel</button>
            </div>
          </div>
          : <></>
      }
      <div style={{
        paddingTop: '10px', paddingBottom: '10px', display: 'grid', justifyContent: 'end',
        gridTemplateColumns: 'repeat(2,auto'
      }}>
        <img className='small-icon' src='edit.png' alt='edit' title='edit-item' />
        <img onClick={() => setDeleteWarning({ warning: 'This action will permanently delete this item. Are you sure?' })} className='small-icon' src='delete.png' alt='delete' title='delete-item' />

      </div>
    </div>
  )
}

export default MenuItemModal