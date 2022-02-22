import React from "react";
import { useDispatch } from "react-redux";
import {addMenuItem} from '../../redux/menuItemSlice'
import { setModalDisplay } from "../../redux/modalSlice";

const ModalFormMenuItem = () => {
const [radioBtn,setRadioBtn] = React.useState('none')
let modal = document.getElementById("modal-main")
const dispatch = useDispatch()
let item = {title:'menuItem', clientId : 'client123'}
const onChange = (e) => {
  item[e.target.name] = e.target.value
console.log(item)

}
const radioBtns = (e) =>{
  console.log('radioBtns',e.target.title,e.target.name)
   item.dishType = e.target.title
   
 console.log(item)
}


 const submitMenuItem = async () => {

let result = await window.api.addMenuItem(item)
console.log(result)
  
let category = await window.api.createItemCategory(item.category,'client123')
console.log(category)
dispatch(setModalDisplay())
dispatch(addMenuItem(result))

  console.log('submit menu item',modal)


}
  return (
    <div>
      <h3 className="highlight-font-color">Create Menu Item Form.</h3>
      <form onClick={(e) => {e.preventDefault()}}className="grid-row font-small strong">

        <div>
          <span >Name: </span><input onChange={onChange}
          className="w100" name="name" placeholder="Menu Item Name." />
        </div>

        <div>
        <label>Add category or Select a category : </label>
        <input className="w100" name="category" placeholder="Ex : Soups. Add only one category per item."
              onChange={onChange}/>
        
        </div>

          <div>
         <span>Description: </span> <br />
          <textarea onChange={onChange} className="w100" name="description" placeholder="Description about the dish." />
        </div>

        <div>
          <span>Ingradients: </span> <br />
          <textarea onChange={onChange} className="w100" name="ingredients" placeholder="Ingradients. Comma seperated. ex: ingradient 1, ingradient 2, " />
        </div>

        <div >
          <span>Select dish type:</span>
          <div className="grid-column">
          <span className="dish-type"  onClick={radioBtns} name="dishType" title="meat">Meat</span>
          <p className="dish-type"  onClick={radioBtns} name="dishType" title="fish">Fish</p>
          <p className="dish-type"  onClick={radioBtns} name="dishType" title="vegetarian">Vegetarian</p>
          <p className="dish-type" onClick={radioBtns} name="dishType" title="vegan">Vegan</p>
          </div>
        </div>

        <div>
          <span>Price: </span><input onChange={onChange} className="w100" name="price" placeholder="price" />
        </div>

        <div>
          <span>Preparation time: </span><input onChange={onChange}  className="w100" name="preparation" placeholder="In minutes ex:15" />
        </div>


        <div>
          <span >Add Image: </span><button className="btn-color sub-header " id='uploadMenuItemImg'>Upload</button>
        </div>

        <button  onClick={submitMenuItem} className="btn-color sub-header-btn">Submit</button>

      </form>
    </div>
  )
}

export default ModalFormMenuItem