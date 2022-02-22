import React from "react";
import { useDispatch } from "react-redux";
import { setModalDisplay } from "../../redux/modalSlice";
import { changeModalForm,setMenuItemId } from "../../redux/modalSlice";
import './ItemContent.styles.css'

const ItemCard = ({_id,data}) => {

const dispatch = useDispatch()

   const openItemCardModal = (title) => {

    dispatch(setModalDisplay())
      dispatch(changeModalForm('loadMenuItem'))
      dispatch(setMenuItemId(title))
  }
  // console.log(data)
  return(
    <div onClick={(e) => {openItemCardModal(e.target.title)}} 
     className="item-card" title={_id}>
      <div  className="item-img">img</div>
      <h4 className="sub-header">{data.name}</h4>
      <h4 className="price-tags">Rs.{data.price}</h4>
    </div>
  )
}

export default ItemCard