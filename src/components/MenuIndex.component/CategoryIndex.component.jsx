import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setModalDisplay,changeModalForm } from "../../redux/modalSlice";
import './CategoryIndex.styles.css'


const CategoryIndex = ({props}) =>{
  const dispatch = useDispatch()
let {height,width} = props
console.log(props)
 return(
   <div >
   <div className="index-category" style={{height:`${height-90}px`}} >

     <div className="index-item">Soups</div>
      <div className="index-item">Soups</div>
       <div className="index-item">Soups</div>
        <div className="index-item">Soups</div>
         <div className="index-item">Soups</div>
          <div className="index-item">Soups</div>
           <div className="index-item">Soups</div>
            <div className="index-item">Soups</div>
   </div>
    <div className="create-order-btn sub-header"
    onClick={() => {
      dispatch(setModalDisplay())
      dispatch(changeModalForm('createMenuItem'))
      }}
    >Create Menu item +</div>
    </div>
 )
}

export default CategoryIndex