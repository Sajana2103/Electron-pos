import React, { useEffect,memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { openNewOrder, addItemsToExistingOrder } from '../../redux/orderSlice'
import { removeItemFromState, currentItemModal, resetCurrentItemModal,updateMenuItem } from '../../redux/menuItemSlice'
import { setModalDisplay,changeModalForm } from '../../redux/modalSlice'

const initialError = { error: '',input:'' }
const initialExtras ={item:{name:'',price:0},extraItems:[]}
const initialPortionSize ={portionSize:'',portionPrice:''}

const MenuItemModal = () => {
  const regNumbers = /\D/
  const {currentUser} = useSelector(state => state.settings)
  let modal = document.getElementById("modal-main")
  let modalContent = document.getElementById("modal-content")
  window.onclick = function (e) {
    // console.log(e.target)
    if (e.target === modal && e.target !== modalContent) {
      // console.log(e.target)
      //     console.log(modal.style.display)
      setPortionSize({portionSize:'',portionPrice:''})
      setModifications('')
      setCount(1)
      setError(initialError)
      dispatch(resetCurrentItemModal())
      dispatch(setModalDisplay('none'))
      if (modificationsText.value) {
        modificationsText.value = ''
      } else { return }
    }
  }


  let modificationsText = document.getElementById('modifications')
  const dispatch = useDispatch()

  const [extras,setExtras] = React.useState(initialExtras)
  const [deleteWarning, setDeleteWarning] = React.useState({ warning: '' })
  const [count, setCount] = React.useState(1)
  const [modifications, setModifications] = React.useState('')
  const [error, setError] = React.useState(initialError)
  const [portionSize,setPortionSize] = React.useState(initialPortionSize)
  const menuItemId = useSelector(state => state.modal._id)

  dispatch(currentItemModal(useSelector(state => state.menuItems.items)
    .find((item) => item._id === menuItemId)))

  const menuItem = useSelector(state => state.menuItems.itemModal)
  const ongoingOrders = useSelector(state => state.orders.newOrder)
  const { canAddNewItems, orderNumber, appendedOrder } = useSelector(state => state.orders.appendOrder)
  const ongoingCurrentOrders = useSelector(state => state.orders.currentOrders)
  
  // console.log('MENU ITEMS ', menuItem.name)
  let currentOrderExists = ongoingCurrentOrders.find((item) => item.orderNumber === orderNumber)
  let newOrder = {
    item: menuItem.name,
    quantity: count,
    modifications: modifications,
    price: menuItem.price ? menuItem.price : portionSize.portionPrice,
    appendedOrder: appendedOrder,
    portion:portionSize.portionSize? portionSize.portionSize : 'Normal',
    vat:menuItem.vat,
    extras:extras.extraItems

  }
 

  const addItemToOrder = () => {
    console.log(newOrder)
    if(!newOrder.price) {setError({input:'portion', error:'Select a portion before ordering.'}); return}
    let itemExists = ongoingOrders.find((item) => (item.item === newOrder.item && item.portion === newOrder.portion))
    if (itemExists) {
      setError({input:'duplicateItem', error: 'Item is already added to the ongoing order. Cancel and add quantity on the Order Card.' })
      return
    }
    setError(initialError)
    setPortionSize({portionSize:'',portionPrice:''})
    dispatch(openNewOrder(newOrder))
    dispatch(setModalDisplay())
    setCount(1)
    setExtras(initialExtras)
    setModifications('')
    clearInputs()
    modificationsText.value = ''

  }
  const addItemsToOngoingOrder = () => {
    if(!newOrder.price) {setError({input:'portion', error:'Select a portion before ordering.'}); return}
     let itemExists = ongoingOrders.find((item) => (item.item === newOrder.item && item.portion === newOrder.portion && item.appendedOrder === newOrder.appendedOrder))
    if (itemExists) {
      setError({input:'duplicateItem', error: 'Item is already added to the ongoing order. Cancel and add quantity on the Order Card.' })
      return
    }
    console.log(currentOrderExists, canAddNewItems)
    if (currentOrderExists && canAddNewItems) {
      clearInputs()
      setError(initialError)
      setPortionSize({portionSize:'',portionPrice:''})
      dispatch(addItemsToExistingOrder(newOrder))
      dispatch(setModalDisplay())
      setCount(1)
      setExtras(initialExtras)
      setModifications('')
      modificationsText.value = ''
    }
  }
  const onCancel = () => {
    clearInputs()
    dispatch(setModalDisplay())
    setCount(1)
    setExtras(initialExtras)
    setModifications('')
    setPortionSize({portionSize:'',portionPrice:''})
    modificationsText.value = ''
  }
  const removeItemWithId = () => {
    console.log(menuItemId)
    window.api.removeItem(menuItemId).then(res => {
      if (res.ok) {
        clearInputs()
        setPortionSize({portionSize:'',portionPrice:''})
        dispatch(removeItemFromState(menuItemId))
        dispatch(setModalDisplay())
        setDeleteWarning({ warning: '' })
        setCount(1)
        setExtras(initialExtras)
        setModifications('')
        modificationsText.value = ''
      }
    })
  }
  const updateItem = () => {
    dispatch(updateMenuItem({update:true,item:menuItem}))
    dispatch(changeModalForm('createMenuItem'))
  }
  const clearInputs = () => {
     const getInputs  = document.getElementsByTagName('input')
     for(let i = 0; i<2;i++){
       getInputs[i].value = ''
     }
  }
  return (
    <div style={{ width: '300px', }}>

      <div style={{ width: '100%', display: 'grid', justifyContent: 'end' }}>
        <button className='close-btn' title="Cancel" onClick={() => {
          onCancel()
          setError(initialError)
        }}>X</button>
      </div>
      
      <div>
        {
          menuItem.image ?
            <img className='menuitem-modal' src={menuItem.image} />
            :
            <img className='menuitem-modal' src="noimage.jpeg" />
        }
      </div>

      <div style={{ paddingTop: '10px', paddingBottom: '10px', width: '200px' }}>
        <span className='strong font-size-large' >{menuItem.name ? menuItem.name.toUpperCase() : 'Unnamed'} </span>
        <br />
        <span style={{ opacity: '0.5' }}> ({menuItem.category}) </span>

      </div>

      <div style={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <span style={{ opacity: '0.7'}}>{menuItem.ingredients ? menuItem.ingredients : 'No ingredient details.'}</span>
        <div className='font-small' style={{ opacity: '0.7', paddingTop:5}}>{menuItem.dishType?menuItem.dishType.toUpperCase():''}</div>
      </div>
      {
        menuItem.portionSizes && menuItem.portionSizes.length>0 ?
        menuItem.portionSizes.map((portion,idx) => {
          if(portion.portionSize === portionSize.portionSize){
          return(
            <div key={idx} onClick={() =>{setPortionSize(portion);}} className='strong font-size-large' style={{display:'grid',gridTemplateColumns:'50% 1rem',color:'#ef6369',cursor:'pointer'}}>
            <span>{portion.portionSize}</span><span>Rs.{portion.portionPrice}</span>
          </div>
          )} 

          return(
            <div key={idx} onClick={() =>{setPortionSize(portion); newOrder.price = portion.portionPrice
            }} className='strong font-size-large' style={{display:'grid',gridTemplateColumns:'50% 1rem',cursor:'pointer'}}>
            <span>{portion.portionSize}</span><span>Rs.{portion.portionPrice}</span>
          </div>
          )})
        :
      <div className='strong font-size-large' style={{ paddingTop: '5px', paddingBottom: '5px', opacity: '0.7' }}>
        Rs.{menuItem.price}
      </div>
      }
       {
          error.input==='portions'?
          <span className='error'>{error.error}</span> : <></>
        }
      <div className='grid-column' style={{ paddingTop: '5px', paddingBottom: '5px', }}>

        <div>Quantity : </div>
        <div style={{ marginLeft: '10px', display: 'grid', gridTemplateColumns: 'repeat(3,30px)', alignItems: 'center' }}>
          <div onClick={() => {
            if (count === 1) {
              setCount(1)
            } else {
              setCount(count - 1)
            }
          }} className='quantity black-red-bg'>-</div>
          <div className='quantity'>{count}</div>
          <div onClick={() => setCount(count + 1)} className='quantity black-red-bg'>+</div>
        </div>
      </div>
      <div>
        <label >Extras </label><br/>
      <section  style={{display:'grid',gridTemplateColumns:'repeat(2,auto) 1fr'}}>

        <div >
        <label className='font-size-small'>Name</label>
        <input className='inputs ' name='inputExtrasName' style={{width:'5rem'}} maxLength="17" onChange={(e) => {

          setExtras((prevState) => {
            let {item:{price}} = prevState
            return {...prevState,item:{name:e.target.value,price:price}}
          })
          }}/>
        </div>

        <div>
        <label className='font-size-small'>Price</label>
          <input maxLength="5" name='inputExtrasPrice'  onChange={(e) => {
          if(!regNumbers.exec(e.target.value)){
                  setError(initialError)
          setExtras((prevState) => {
            let {item:{name}} = prevState
            return {...prevState,item:{price:e.target.value,name:name}}
          })} else {setError({input:'extras',error:'Only numbers are accepted.' }); return}
          }}  className='inputs' style={{width:'5rem'}}/>
        </div>
        <button onClick={(e) => {
          let extrasInputs = document.getElementsByClassName('inputs')
          extrasInputs[0].value = ''
          extrasInputs[1].value = ''
          // console.log(extras.item.price,extras.item.name)
          if(extras.item.name && extras.item.price ){

            setError(initialError)
          setExtras((prevState)=>{
            let {extraItems} = prevState
             return {...prevState,extraItems:[...extraItems,extras.item]}})
          } else{ setError({error:'Name or price is missing.',input:'extras'})}
        }} className='extraPlus'>+</button>
      </section>
        {
          error.input==='extras'?
          <span className='error'>{error.error}</span> : <></>
        }
           <section style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(50px,auto)) ',columnGap:2}}>
      {
        extras.extraItems.length?
        extras.extraItems.map((extra,index) =>{
         return(
           <div className='extra-items' id={index} onClick={(e) => { 
             let idx = parseInt(e.target.id)
             setExtras(prevState => {
               let extraItems = prevState.extraItems
              console.log(extraItems)
                console.log('removing items',idx===index)
                extraItems= extraItems.filter((item,id) =>{return idx !== id})
                  return {...prevState,extraItems:[...extraItems]}
               })
           }}>
             <label className='extra-item nonClickable'>{extra.name}</label><label className='extra-item nonClickable' >{extra.price}</label>
             </div>
         )
        }) : <></>
      }
           </section>
      </div>
      <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>

        <textarea id="modifications" onChange={(e) =>
        setModifications(e.target.value)
        } name="modifications"
          className="modifications" placeholder="Modifications to the order" type="textarea" />
      </div>
      <div style={{ justifyContent: "center", display: 'grid' }}>
        <button className='redBtn ' style={{ fontSize:'18px',width:100,background:'transparent'}} onClick={() => {
          if (canAddNewItems) {
            addItemsToOngoingOrder()
          } else {
            addItemToOrder()
          }
        }}>ADD TO ORDER</button>

      </div>
      {
        error.input === 'duplicateItem' ?
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
      {
        currentUser && currentUser.role==='admin'?

      <div style={{
        paddingTop: '10px', paddingBottom: '10px', display: 'grid', justifyContent: 'end',
        gridTemplateColumns: 'repeat(2,auto'
      }}>
        <img onClick={() => updateItem()} className='small-icon' src='edit.png' alt='edit' title='edit-item' />
        <img onClick={() => setDeleteWarning({ warning: 'This action will permanently delete this item. Are you sure?' })} className='small-icon' src='delete.png' alt='delete' title='delete-item' />

      </div> : <></>
      }
    </div>
  )
}

export default MenuItemModal