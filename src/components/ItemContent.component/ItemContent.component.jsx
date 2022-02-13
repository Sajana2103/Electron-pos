import React,{useState,useEffect} from 'react'
import ItemCard from './ItemCard.component'



const ItemContent = ({props}) => {
let {height,width} = props
   let item
  const [items, setItems] = useState([])
 

  useEffect(() => {
    async function fetchData() {

      window.api.getMenuItems().then(data => { setItems(data.rows) })
      window.api.replicateDB().then(data => console.log(data))
      window.api.findItems()

    }
    fetchData()

  }, [item])
  let maxCards = Math.floor((width-400)/120)
  // console.log(maxCards)
  return(
    <div className='item-content' style={{height:`${height -40}px`,width:`${width-400}`}}>
      <div className='item-cards' style={{gridTemplateColumns:`repeat(${maxCards},1fr)`}}>
          
          {
            items.length > 0 ? items.map((item) => {
              // console.log(item.doc)
              return (
                <ItemCard key={item.doc._id} _id={item.doc._id} title={item.doc.title}/>
              )
            })
              : <div>waiting for items</div>
          }
        </div>
       
    </div>
  )
}

export default ItemContent