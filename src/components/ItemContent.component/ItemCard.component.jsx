import React from "react";
import './ItemContent.styles.css'

const ItemCard = ({_id,title}) => {
  // console.log(title)
  return(
    <div className="item-card">
      <div className="item-img">img</div>
      <h4 className="sub-header">{title ? title : 'Item'}</h4>
      <h4 className="price-tags">Rs.999</h4>
    </div>
  )
}

export default ItemCard