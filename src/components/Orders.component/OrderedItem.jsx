import React from 'react'
import { addOrRemoveItems } from '../../redux/orderSlice'
import { useDispatch } from 'react-redux'
import { orderBy } from 'lodash'

const OrderedItem = ({ item }) => {
  
  const dispatch = useDispatch()
  return (
    <div className='grid-row'>

      <div className='grid-ordered-items'>

        <div style={{display: 'grid',
        gridTemplateColumns: 'repeat(3,10px)', alignItems: 'center',columnGap:'5px'}}>
          <div onClick={() => {
            if (item.quantity === 0) {
               dispatch(addOrRemoveItems({task:'removeItem',item: item.item,portion:item.portion? item.portion:'',appendedOrder:item.appendedOrder}))
            } else {
               dispatch(addOrRemoveItems({task:'remove',item: item.item,portion:item.portion? item.portion:'',appendedOrder:item.appendedOrder}))
            }
          }} className='quantity font-size-large'>-</div>
          <div className='quantity'>{item.quantity}</div>
        

          <div onClick={() => 
          dispatch(addOrRemoveItems({task:'add',item: item.item,portion:item.portion? item.portion:'',appendedOrder:item.appendedOrder}))} 
          className='quantity font-size-large'>+</div>
        </div>


        <div className="grid-row">
          <div className="strong" style={{ display: 'flex',paddingBottom:'10px',textAlign:'left' }} >{item.item.toUpperCase()} ({item.portion? item.portion: ''})</div>
          <span></span>
          <div className='font-small' style={{ display: 'flex', textAlign: 'start' }}>{item.modifications}</div>
          {item.extras.length && item.extras?
          item.extras.map((item,idx) => {
            return(
              <span style={{display:'flex',alignItems:'center',marginTop:2}} className='font-small' key={idx}>
                {item.name}:<span style={{fontWeight:'bold',color:'#ef6369'}}>{item.price}</span></span>
            )
          }) : <></>
          }
        </div>

        <div className='strong highlight-font-color'>{item.price * item.quantity}</div>

      </div>


    </div>
  )
}

export default OrderedItem