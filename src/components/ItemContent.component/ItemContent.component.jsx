import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loadMenuItems} from '../../redux/menuItemSlice'
import { getCategories } from '../../redux/itemCategoriesSlice'
import ItemCard from './ItemCard.component'



const ItemContent = ({ props }) => {


  const menuItems = useSelector(state => state.menuItems.items)
  
  const [search,setSearch] = useState([])
  useEffect(() => {
    setSearch(menuItems)
  },[menuItems])
  const dispatch = useDispatch()


  let { height, width } = props
  let item

 
 const onSearch = (e) => {

   e.preventDefault()
   let searchItem = menuItems.filter((item) => {
    //  console.log(item.name)
     return item.name.toLowerCase().includes(e.target.value.toLocaleLowerCase())})
    // console.log(searchItem)
     setSearch(searchItem)
 } 

  useEffect(() => {
    async function fetchData() {
      console.log('useEffect runs')
      window.api.getMenuItems().then(data => { dispatch(loadMenuItems(data.docs)) })
      window.api.replicateDB().then(data => console.log(data))
      window.api.getItemCategories('client123').then(data => {dispatch(getCategories(data.docs))})
    }
    fetchData()

  }, [item])
  let maxCards = Math.floor((width - 400) / 150)
  // console.log(maxCards)
  return (
    <div>
      <div className='sub-header-btn' style={{padding:'10px'}}>Search Item : <input onChange={onSearch} name="search"/></div>
    <div className='item-content' style={{ height: `${height - 80}px`, width: `${width - 400}` }}>
      <div className='item-cards' style={{ gridTemplateColumns: `repeat(${maxCards},1fr)` }}>

        {
          menuItems.length > 0 ? search.map((item) => {
            // console.log(item)
            // console.log('search',item)
            return (
              <ItemCard key={item._id} _id={item._id} data={item} />
            )
          })
            : <div>waiting for items</div>
        }
      </div>

    </div>
    </div>
  )
}

export default ItemContent