import React, {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModalDisplay, changeModalForm } from "../../redux/modalSlice";
import { shrinkColumn } from "../../redux/windowResize";
import { filterByCategory } from "../../redux/menuItemSlice";
import './CategoryIndex.styles.css'


const CategoryIndex = ({ props }) => {
  let { height, width } = props
  
  const dispatch = useDispatch()

  const {filteredMenuItems} = useSelector(state => state.menuItems)
  const categories = useSelector(state => state.menuItems.itemCategories)
  const shrinkWidth = useSelector(state => state.windowResize.shrink.width)
  
  const { currentUser } = useSelector(state => state.settings)
  // console.log(categories)
  // console.log(props)
  const [filteredItems, setFilteredItems] = useState([])

  const filterCategory = (e) => {
    e.preventDefault()
    dispatch(filterByCategory(e.target.id))
    // console.log(searchItem)
  }
  useEffect(()=>{
    if(width<660){
      dispatch(shrinkColumn({ column: 'categories', width: 30 }))
    } else {
      dispatch(shrinkColumn({ column: 'categories', width: 200 }))
    }
  },[width])
// console.log("CATEGORIES",categories)
  return (
    <div style={{ width: shrinkWidth, transitionDuration: '0.2s' }} >
      <div className="index-category" style={{ height: `${height - 90}px`, }} >
        <button className="back-btn  font-size-large" onClick={() => {

          shrinkWidth === 200 ? dispatch(shrinkColumn({ column: 'categories', width: 30 }))
            : dispatch(shrinkColumn({ column: 'categories', width: 200 }))
        }}>&#60;</button>
        <div  className="index-item" onClick={() => dispatch(filterByCategory('allItems'))}>All Categories</div>
        {
          categories.length ?
            categories.map((category, idx) => {
              
              return (
                <div style={{ display: shrinkWidth === 200 || width<700? 'grid' : 'none'}} id={category} key={idx} 
                className={`index-item ${idx%2===0? 'catBag2' : ''}`} onClick={filterCategory}>{category }</div>

              )
            })
            : <p className='noData'>Loading categories</p>
        }

      </div>
      {
        currentUser && currentUser.role === 'admin' ?
          <div style={{ transitionDuration: '0.2s' }} className="create-order-btn sub-header-btn"
            onClick={() => {
              dispatch(setModalDisplay())
              dispatch(changeModalForm('createMenuItem'))
            }}>
            {shrinkWidth === 200 ?
              <p style={{ margin: 0, display: shrinkWidth === 200 ? '' : 'none',}}>Create Menu item +</p> : '+'}

          </div> : <></>
      }
    </div>
  )
}

export default CategoryIndex