import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loadMenuItems } from '../../redux/menuItemSlice'
import { getCategories } from '../../redux/itemCategoriesSlice'
import { filterByCategory } from '../../redux/menuItemSlice'
import ItemCard from './ItemCard.component'



const ItemContent = ({ props }) => {

  const { filteredMenuItems, items,itemCategories } = useSelector(state => state.menuItems)
  const menuItems = useSelector(state => state.menuItems.items)
  const shrinkWidth = useSelector(state => state.windowResize.shrink.width)
  const { categories } = useSelector(state => state.itemCategories)
  const [searchValue, setSearchValue] = useState('')
  let sortedCategories = []
  const dispatch = useDispatch()
  console.log(itemCategories)
  if (categories.length) {
    categories.map((category) => {
      sortedCategories.push(category.category)
    })

  }
  const [search, setSearch] = useState([])
  let itemArray = []
  if (search.length) {
    search.map(item => {
      itemArray.push(item)
    })
    itemArray.sort((a, b) => a.category.localeCompare(b.category))
    console.log(itemArray)
  }
  let { height, width } = props
  let item


  const onSearch = (e) => {
    setSearchValue(e.target.value)
    e.preventDefault()

    let searchItem = filteredMenuItems.filter((item) => {
      //  console.log(item.name)
      return item.name.toLowerCase().includes(e.target.value.toLocaleLowerCase())
    })

    setSearch(searchItem)
  }

  useEffect(() => {

    async function fetchData() {

      window.api.getMenuItems().then(data => {
        dispatch(loadMenuItems(data.docs));
        setSearch(filteredMenuItems)
        if (!filteredMenuItems.length) dispatch(filterByCategory('allItems'))
      })
      window.api.replicateDB().then(data => console.log(data))
      window.api.getItemCategories('itemCategories').then(data => {
        // console.log(data.docs)
        dispatch(getCategories(data.docs))
      })
    }
    fetchData()
  }, [filteredMenuItems, items])
  // console.log(shrinkWidth)
  let maxCards = shrinkWidth === 200 ? Math.floor((width - (400)) / 150) : Math.floor(((width + shrinkWidth) - (400)) / 120)

  // console.log("SEARCH", search, items)
  let category = ''
  return (
    <div>

      <div className='sub-header-btn' style={{ padding: '10px' }}>Search Item : <input onChange={onSearch} name="search" /></div>
      <div className='item-content' style={{ height: `${height - 80}px`, width: `${width - 400}` }}>
       
        {

            itemCategories.length ?
            itemCategories.map(cat => {

              if (category !== cat) {
                category = cat
                return (
                  <div>
                    <div className='categoryTitles'>{category}</div>
                    <div className='item-cards ' style={{ gridTemplateColumns: `repeat(${maxCards < 0 ? 1 : maxCards},1fr)` }}>
                      {
                        itemArray.map((item, idx) => {
                          if (category === item.category) {
                            // let spliced = itemArray.splice(idx, 1)[0]
                            return (
                              <ItemCard key={item._id} _id={item._id} data={item} />

                            )
                          }
                        })
                      }
                    </div>
                  </div>
                )
              }

            }
            ) : <div>Loading</div>
        }
      </div>


    </div>
  )
}

export default ItemContent