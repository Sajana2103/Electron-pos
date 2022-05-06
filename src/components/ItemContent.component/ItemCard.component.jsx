import React from "react";
import { useDispatch } from "react-redux";
import { setModalDisplay } from "../../redux/modalSlice";
import { changeModalForm,setMenuItemId } from "../../redux/modalSlice";
import './ItemContent.styles.css'

const ItemCard = ({_id,data}) => {
// console.log('itemcard runs')

const dispatch = useDispatch()

   const openItemCardModal = (id) => {
    //  console.log(title)
    dispatch(setModalDisplay())
      dispatch(changeModalForm('loadMenuItem'))
      dispatch(setMenuItemId(id))
  }
  // console.log(data)
  return(
    <div onClick={(e) => {openItemCardModal(e.target.id)}} 
     className="item-card" id={_id} title={data.name}>
       {
         data.image?
         <img src={data.image} className="item-img"/>
         :
        <img className="item-img"src="noimage.jpeg"/>

       }
   
      <span className="sub-header" style={{paddingTop:'10px',letterSpacing:'0px',fontSmooth:'2em'}}>{data.name}</span>
      {
        data.portionSizes && data.portionSizes.length > 0 ?
        <div>
         <span className="price-tags strong">Rs.{data.portionSizes[0].portionPrice}</span>
        <br />
        <span className="sub-header light-font" >({data.portionSizes[0].portionSize})</span>
        </div>
        :
      <span className="price-tags strong">Rs.{data.price}</span>
      }
    </div>
  )
}

export default ItemCard