import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loadMenuItems } from '../../redux/menuItemSlice'
import { getCategories } from '../../redux/itemCategoriesSlice'
import { filterByCategory } from '../../redux/menuItemSlice'
import ItemCard from './ItemCard.component'
import { setImage } from '../../redux/navigationSlice'

const imageCss = {
  border: '#d8595f 1px solid',
  cursor: 'pointer',
  color: '#d9f1fa',
  backgroundColor : '#d8595f',
  opacity: 1,
}

const ItemContent = ({ props }) => {

  const { filteredMenuItems, items, itemCategories } = useSelector(state => state.menuItems)
  const shrinkWidth = useSelector(state => state.windowResize.shrink.width)
  const {showImage} = useSelector(state => state.navigation)
  const dispatch = useDispatch()
  const [search, setSearch] = useState([])
  
  console.log('itemContent runs')
  let { height, width } = props
  
  const onSearch = (e) => {
    
    e.preventDefault()
    
    let searchItem = items.filter((item) => {
      //  console.log(item.name)
      return item.name.toLowerCase().includes(e.target.value.toLocaleLowerCase())
    })
    
    setSearch(searchItem)
  }
  // console.log('ITEM CONTENT',filteredMenuItems,search,itemCategories)

  useEffect(() => {

    async function fetchData() {

      window.api.getMenuItems().then(data => {
        dispatch(loadMenuItems(data.docs));
        console.log('getMenuItems',data.docs)
        setSearch(items)
        if (!items.length) dispatch(filterByCategory('allItems'))
      })
      window.api.replicateDB().then(data => console.log(data))
      
     
    }
   
      fetchData()

  
   
  }, [filteredMenuItems, items])
  // console.log(shrinkWidth)
  let maxCards = shrinkWidth === 200 ? Math.floor((width - (400)) / 150) : Math.floor(((width + shrinkWidth) - (400)) / 120)

  // console.log("SEARCH", search, items)
  let category = ''



  return (
    <div>
      <div style={{display:'grid', gridTemplateColumns:'80% 20%',alignItems:'center'}}>
      <div className='sub-header-btn' style={{ padding: '10px',}}>Search Item : <input onChange={onSearch} name="search" />
      </div>
      <div className='set-visibility' style={showImage? imageCss : {}} 
      onClick={() => {dispatch(setImage(showImage))}}>Image</div>

      </div>
      <div className='item-content' style={{ height: `${height - 80}px`, width: `${width - 400}` }}>

        {

          itemCategories.length && search.length ?
            search.map((item, idx) => {
              if (category !== item.category) {
             
                category = item.category
                // console.log(category !== item.category)
                return (
                  <div>
                    <div className='categoryTitles'>{category}</div>
                    <div className='item-cards ' style={{ gridTemplateColumns: `repeat(${maxCards < 0 ? 1 : maxCards},1fr)` }}>
                      {
                        search.map((item, idx) => {
                          
                          if (category === item.category ) {
                            // console.log(idx,category,item.category,catLen,itemCategories.length)
                            
                            // let removed = itemArray.splice(idx,1)[0]
                            

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
            ) : <div className='noData'>Loading</div>
        }
      </div>


    </div>
  )
}

export default ItemContent