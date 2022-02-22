import React from 'react'
import { addOrRemoveItems } from '../../redux/orderSlice'
import { useDispatch } from 'react-redux'

const OrderedItem = ({ item }) => {
  const [count, setCount] = React.useState(item.quantity)
  const dispatch = useDispatch()
  return (
    <div className='grid-row'>

      <div className='grid-ordered-items'>

        <div style={{display: 'grid',
        gridTemplateColumns: 'repeat(3,10px)', alignItems: 'center',columnGap:'5px',}}>
          <div onClick={() => {
            if (item.quantity === 0) {
               dispatch(addOrRemoveItems({task:'removeItem',item: item.item}))
            } else {
               dispatch(addOrRemoveItems({task:'remove',item: item.item}))
            }
          }} className='quantity '>-</div>
          <div className='quantity'>{item.quantity}</div>
        

          <div onClick={() => dispatch(addOrRemoveItems({task:'add',item: item.item}))} className='quantity '>+</div>
        </div>


        <div className="grid-row">
          <div className="font-small strong" style={{ display: 'flex' }}>{item.item}</div>
          <div className='font-small' style={{ display: 'flex', textAlign: 'start' }}>{item.modifications}</div>
        </div>

        <div className='strong highlight-font-color'>{item.price * item.quantity}</div>

      </div>


    </div>
  )
}

export default OrderedItem