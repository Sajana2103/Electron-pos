import React from "react";

const ModalFormMenuItem = () => {

let item = {}
const onChange = (e) => {
  item[e.target.name] = e.target.value
console.log(item)
}

  return (
    <div>
      <h3 className="highlight-font-color">Create Menu Item Form.</h3>
      <form onClick={(e) => {e.preventDefault()}}className="grid-row font-small strong">

        <div>
          <span >Name: </span><input onChange={onChange}
          className="w100" name="name" placeholder="Name" />
        </div>

        <span >Item Category</span>

          <div>
         <span>Description: </span> <br />
          <textarea onChange={onChange} className="w100" name="ingradients" placeholder="Ingradients. Comma seperated. ex: ingradient 1, ingradient 2, " />
        </div>

        <div>
          <span>Ingradients: </span> <br />
          <textarea onChange={onChange} className="w100" name="ingradients" placeholder="Ingradients. Comma seperated. ex: ingradient 1, ingradient 2, " />
        </div>

        <div>
          <span>Select dish type: Meat Fish Vegetarian Vegan</span>
        </div>

        <div>
          <span>Price: </span><input onChange={onChange} className="w100" name="price" placeholder="price" />
        </div>

        <div>
          <span>Preparation time: </span><input onChange={onChange}  className="w100" name="preparation" placeholder="In minutes ex:15" />
        </div>


        <div>
          <span >Add Image: </span><button className="btn-color sub-header ">upload</button>
        </div>

        <button className="btn-color sub-header ">Submit</button>

      </form>
    </div>
  )
}

export default ModalFormMenuItem