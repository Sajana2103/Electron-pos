import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { setModalDisplay,changeModalForm } from "../../redux/modalSlice";
import { shrinkColumn } from "../../redux/windowResize";
import './CategoryIndex.styles.css'


const CategoryIndex = ({props}) =>{
const categories = useSelector(state => state.itemCategories.categories)
const shrinkWidth = useSelector(state => state.windowResize.shrink.width)
// console.log(categories)
  const dispatch = useDispatch()
let {height,width} = props
// console.log(props)


 return(
   <div style={{width:shrinkWidth,transitionDuration:'0.2s'}} >
   <div className="index-category" style={{height:`${height-90}px`,}} >
     <button className="back-btn" onClick={() => {

       shrinkWidth===200?dispatch(shrinkColumn({column:'categories',width:30}))
      : dispatch(shrinkColumn({column:'categories',width:200}))
      }}><img style={{width:10}} src='left-arrow.png'/></button>
     {
       categories.length > 0 ?
       categories.map((category,idx) => {
        //  console.log('category index',category)
         return(
     <div style={{display:shrinkWidth===200?'grid':'none',transitionDelay:'0.3s'}} key={category._id} className="index-item">{category.category ? category.category : '(unnamed)'}</div>

         )
       })
       : <p>Loading categories</p>
     }
     
   </div>
    <div style={{transitionDuration:'0.2s'}} className="create-order-btn sub-header-btn"
    onClick={() => {
      dispatch(setModalDisplay())
      dispatch(changeModalForm('createMenuItem'))
      }}
    >{shrinkWidth===200?
      <p style={{margin:0,display:shrinkWidth===200?'':'none',transitionDelay:'0.6s'}}>Create Menu item +</p>
   : '+' }</div>
    </div>
 )
}

export default CategoryIndex