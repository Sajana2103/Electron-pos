import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { setModalDisplay,changeModalForm } from "../../redux/modalSlice";
import './CategoryIndex.styles.css'


const CategoryIndex = ({props}) =>{
const categories = useSelector(state => state.itemCategories.categories)
// console.log(categories)
  const dispatch = useDispatch()
let {height,width} = props
// console.log(props)
 return(
   <div >
   <div className="index-category" style={{height:`${height-90}px`}} >
     {
       categories.length > 0 ?
       categories.map((category,idx) => {
        //  console.log('category index',category)
         return(
     <div key={category._id} className="index-item">{category.category ? category.category : '(unnamed)'}</div>

         )
       })
       : <p>Loading categories</p>
     }
     
   </div>
    <div className="create-order-btn sub-header-btn"
    onClick={() => {
      dispatch(setModalDisplay())
      dispatch(changeModalForm('createMenuItem'))
      }}
    >Create Menu item +</div>
    </div>
 )
}

export default CategoryIndex