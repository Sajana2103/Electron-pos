import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setModalDisplay } from "../../redux/modalSlice";
import { changeModalForm,setMenuItemId } from "../../redux/modalSlice";
import './ItemContent.styles.css'

const ItemCard = ({_id,data}) => {
  if(data.category === "") console.log('itemcard runs',_id,data)

  const {showImage} = useSelector(state => state.navigation)
console.log('itemCard runs')
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
     className="item-card" style={{gridTemplateRows: showImage? '100px auto auto' : ''}} id={_id} title={data.name}>
       {
         data.image && showImage?
         <img src={data.image? data.image : ''} className="item-img"/>
         :
         <></>

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