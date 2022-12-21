import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewCategory } from "../../redux/itemCategoriesSlice";
import { addMenuItem, updateMenuItem,modifyUpdateItem,addCategory} from '../../redux/menuItemSlice'
import { setModalDisplay,changeModalForm, } from "../../redux/modalSlice";


const ModalFormMenuItem = () => {
  const {shopDetails,vat} = useSelector(state => state.settings)
  const initialMenuItemState = {
    clientId: shopDetails.clientName ? shopDetails.clientName : 'My Client',
    title: 'menuItem',
    vat: false,
    dishType: '',
    portionSizes:[]
  }

  
  const [menuItemState, setMenuItemState] = React.useState(initialMenuItemState)
  const updateItemSelector = useSelector(state => state.menuItems.updateItem)
  const itemCategoryState = useSelector(state => state.menuItems.itemCategories)
  const [portion,setPortion] = React.useState({portionSize:'',portionPrice:0})
  const [error, setError] = React.useState({ error: '', input: '' })
  const dishes = ['meat', 'fish','egg', 'vegetarian', 'vegan','mixed']

  const dispatch = useDispatch()

  const regNumbers = /\D/
 
  let itemComparison

useEffect(() => {

  if(updateItemSelector.update){
    itemComparison = updateItemSelector.item
    setMenuItemState(updateItemSelector.item)
    let inputs = document.getElementsByName('createMenuItemInput')
    inputs[0].setAttribute('value',updateItemSelector.item.name)
    inputs[2].innerText = updateItemSelector.item.ingredients? updateItemSelector.item.ingredients:''
    inputs[3].setAttribute('value',updateItemSelector.item.price?updateItemSelector.item.price : '')
    inputs[6].setAttribute('value',updateItemSelector.item.prepTime?updateItemSelector.item.prepTime:'')
  }
 
},[updateItemSelector.update])

  const clearInputs = () => {
    let inputs = document.getElementsByName('createMenuItemInput')
    for(let i = 0;i<inputs.length;i++){
      
      inputs[i].value = ''
    }
  }
  
  const onChangeImage = (e) => {

    let file = e.target.files[0]
    console.log(file)
    const reader = new FileReader()

    if (e.target.files && e.target.files[0]) {
      reader.addEventListener("load", () => {
       
        setMenuItemState((prevState) => {
          return {
            ...prevState,
            image: reader.result,

          }
        })
      }, false)
      reader.readAsDataURL(e.target.files[0])
    }

  }

  const submitMenuItem = async () => {
    if (!menuItemState.name) {
      // console.log('name error', menuItemState.name)
      setError({ error: 'Item name is required.', input: 'name' })
      return
    } else if (!menuItemState.price && menuItemState.portionSizes.length<1) {
      console.log('price error',menuItemState.portionSizes)
      setError({ error: 'Price or Portion is requried.', input: 'price' })
      return
    }
 
    let result = await window.api.addMenuItem(menuItemState)
    console.log(result,menuItemState.category)
    console.log(menuItemState.category)
   
    dispatch(setModalDisplay())
    dispatch(addMenuItem(result))
    dispatch(addCategory(menuItemState.category))
    clearInputs()
    setMenuItemState(initialMenuItemState)
  }

   const onCancel = () => {
     let inputs = document.getElementsByName('createMenuItemInput')
     for(let key in inputs){
       if(inputs[key].name==='createMenuItemInput') inputs[key].value = ''
     }
     setMenuItemState(initialMenuItemState)
    dispatch(setModalDisplay())  
  }
  const cancelUpdate = () => {
    dispatch(updateMenuItem({update:false,item:{}}))
    dispatch(changeModalForm('loadMenuItem'))
    setMenuItemState(initialMenuItemState)
  }
  
  const updateCurrentItem = async () => {
  
    if (!menuItemState.name) {
      // console.log('name error', menuItemState.name)
      setError({ error: 'Item name is Required.', input: 'name' })
      return
    } else if (!menuItemState.price && menuItemState.portionSizes.length<1) {
      console.log('price error',menuItemState.portionSizes)
      setError({ error: 'Price or Portion is requried.', input: 'price' })
      return
    }

    let category = await window.api.createItemCategory(menuItemState.category, 'itemCategories')
  
    if(category.result && category.result.ok){
    
      dispatch(addNewCategory(category.category))
    } else if(category.response){
      // console.log('category exists')
    }

    let response = await window.api.updateItem(menuItemState)
    if(response.res.ok || response.update){
      let {res,data} = response
      dispatch(modifyUpdateItem(data))
      dispatch(setModalDisplay())
     
     return
    } else  {
      setError({error:'Error updating item.'})
    }
  
  }
  return (
    <div >
      <div style={{marginBottom:'1ch',display:'grid',columnGap:'5px',alignItems:'center',gridTemplateColumns:'1fr auto',margin:'0px',alignContent:'center'}}>
      <h3 className="sub-header font-size-large bg-black-header" 
    >CREATE MENU ITEM FORM.</h3>
            <button className='close-btn' style={{margin:'0px',display:'grid',justifyContent:'center',height:'2rem'}} title="Cancel" onClick={() => { onCancel();setError({ error: '',input:'' });}}>X</button>

     </div>
      <form onClick={(e) => { e.preventDefault() }}
        className="strong" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,auto)', columnGap: '10px', }}>

        <div className="input-section-box">


          <label className="modal-form-label">Name: </label> <br />
          <input onChange={(e) => setMenuItemState((prevState) => {
            return { ...prevState, name: e.target.value }
          })} className="modal-form-input"
            name="createMenuItemInput" placeholder="Menu Item Name." />
          {
            error.input === 'name' ?
              <span className="error">{error.error}</span> : <></>
          }
        </div>

        <div className="input-section-box">
          <label className="modal-form-label">Add New Category : </label><br />
          <input className="modal-form-input" name="createMenuItemInput" placeholder="Add a new category for your menu items."
            onChange={(e) => setMenuItemState((prevState) => {
              return { ...prevState, category: e.target.value }
            })} />
        </div>

        <div className="input-section-box">
          <label className="modal-form-label" >Select Category : </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,auto)', width: '200px', marginTop: '5px' }}>
            {
              itemCategoryState.length ?
                itemCategoryState.map((item, idx) => {
                  const cssForSelectedCategory = {
                    backgroundColor: '#ef6369', color: 'white',
                  }
                  if (menuItemState.category === item) {
                    return (
                      <div style={{ margin: '2px 0px 2px 0px' }} key={idx}>
                        <label className="font-small" onClick={(e) => setMenuItemState((prevState) => {
                          return { ...prevState, category: e.target.id }
                        })} style={cssForSelectedCategory}
                          id={item}>{item? item.toUpperCase() : ''}</label>
                      </div>
                    )

                  } else {
                    return (
                      <div style={{ margin: '2px 0px 2px 0px' }} key={idx}>
                        <label className="font-small" onClick={(e) => setMenuItemState((prevState) => {
                          return { ...prevState, category: e.target.id }
                        })}
                          id={item}>{item ? item.toUpperCase() : ''}</label>
                      </div>
                    )
                  }
                })
                : <label>No categories found.</label>
            }
          </div>
        </div>

        <div className="input-section-box">
          <label className="modal-form-label">Ingredients: </label> <br />
          <textarea onChange={(e) => {
            setError({ error: '', input: '' })
            setMenuItemState((prevState) => {
              return { ...prevState, ingredients: e.target.value }
            })
          }}
            className="modal-form-input" name="createMenuItemInput" placeholder="Ingradients. Comma seperated. ex: ingradient 1, ingradient 2, " />
        </div>

        <div className="input-section-box"  >
          <label className="modal-form-label">Select dish type:</label>
          <div className="grid-row modal-form-input">
            {/* <div style={{display:'grid',alignItems:'center',gridTemplateColumns:'90% auto',columnGap:'3px'}}>
              <input className="modal-form-input" name="createMenuItemInput" 
            onChange={setDish}/>
            <label className="plus-btn" onClick={addDishes} >+</label>
            </div> */}
            {

              dishes.map((dish, idx) => {
                let selectedStyle = { backgroundColor: '#ef6369', color: 'white' }
            
                if (menuItemState.dishType === dish) {
                  return (
                    <label key={idx} id={`${dish}-dishType`} style={selectedStyle} className="dish-type" 
                    onClick={(e) => {setMenuItemState((prevState) => {
                      return {...prevState,dishType:e.target.title}
                    })}} name="dishType" title={dish}>{dish.toUpperCase()}</label>

                  )
                }
                return (
                  <label key={idx} id={`${dish}-dishType`} className="dish-type" 
                  onClick={(e) => {setMenuItemState((prevState) => {
                      return {...prevState,dishType:e.target.title}
                    })}} name="dishType" title={dish}>{dish.toUpperCase()}</label>
                )

              })
            }

          </div>
        </div>

        <div className="input-section-box">
          <label className="modal-form-label">Price: </label><br />
          <input className="modal-form-input" onChange={(e) => {
            let priceRegex = regNumbers.exec(e.target.value)
            if (priceRegex) {
              setError({ error: 'Only numbers are accepted.', input: 'price' })
              return
            } else {
              setError({ error: '', input: '' })
              setMenuItemState((prevState) => {
                return { ...prevState, price: e.target.value }
              })
            }

          }} name="createMenuItemInput" placeholder="price" /><br />
           <label className="modal-form-label">Portions: </label>
           <div style={{display:'grid',gridTemplateColumns:'repeat(2,5rem) 1rem',columnGap:'5px'}}>
             
            <label>Size</label><label>Price</label>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(2,5rem) 1rem',columnGap:'5px',alignItems:'center'}}>
            <input className="modal-form-input" name="createMenuItemInput" aria-label="portionName"
            onChange={(e) => {
              setPortion(prevState => { return {...prevState, portionSize : e.target.value}})
            }}/> 
            <input className="modal-form-input" name="createMenuItemInput" aria-label="portionPrice"
            onChange={(e) => {
              if(!regNumbers.exec(e.target.value)){
                // console.log(e.target.value)
                setError({error:'',input:''})
              setPortion(prevState => { return {...prevState, portionPrice : parseInt(e.target.value)}})
              } else {
                setError({error:'Add numbers only.',input:'portions'})
              }
            }}/>
            <label className="plus-btn" onClick={() => {
     
              setMenuItemState((prevState) => {
             let {portionSizes} = prevState
             if(portionSizes) return {...prevState, portionSizes:[...portionSizes,portion]}
              return {...prevState,portionSizes:[portion]} 
            }) 
            }} >+</label>
           </div>
            { error.input==='portions'? <span className="error">{error.error}</span> : <></> }
           
            {
             menuItemState.portionSizes && menuItemState.portionSizes.length > 0 ?
              menuItemState.portionSizes.map((portion) => {
                console.log(portion)
                return (
                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,5rem) 1rem',columnGap:'5px',alignItems:'center',marginBottom:'3px',}}>
                    <span style={{backgroundColor:'white'}}>{portion.portionSize}</span>
                    <span style={{backgroundColor:'white'}}>{portion.portionPrice}</span>
                    <label className="plus-btn" onClick={() => setMenuItemState((prevState) => {
             let {portionSizes} = prevState
              return {...prevState, portionSizes:[...portionSizes.filter((item) => item.portionSize != portion.portionSize)]}
             
            }) } >-</label>
                    </div>
                )
              })
              : <></>
            }
          {
            error.input === 'price' ?
              <span className="error">{error.error}</span> : <></>
          }
        </div>

        <div className="input-section-box">
          <label className="modal-form-label">Preparation time: </label>
          <br />
          <input onChange={(e) => {
            let priceRegex = regNumbers.exec(e.target.value)
            if (priceRegex) {
              setError({ error: 'Only numbers are accepted.', input:'prepTime' })
              return
            } else {
              setError({ error: '', input: '' })
              setMenuItemState((prevState) => {
                return { ...prevState, prepTime: e.target.value }
              })
            }
          }} className="modal-form-input " name="createMenuItemInput" placeholder="In minutes ex:15" />
          {
            error.input === 'prepTime' ?
              <span className="error">{error.error}</span> : <></>
          }
        </div>

        <div className="input-section-box">

          <span style={{fontWeight:'600'}}>Add Vat(current-{vat}%)</span><br />
          <button className="do-action modal-form-input bg-grey"
            name="vat" onClick={() => {
              setMenuItemState((prevState) => {
                return {
                  ...prevState,
                  vat: true,

                }
              })
            }} style={{ marginRight: '5px', opacity: menuItemState.vat ? '1' : '0.6' }}>Yes</button>

          <button style={{ opacity: menuItemState.vat ? '0.4' : '1' }}
            onClick={() => {
              setMenuItemState((prevState) => {
                return {
                  ...prevState,
                  vat: false,

                }
              })
             
            }} className="cancel-action modal-form-input bg-red" name="vat">No</button>
          {error.input === 'vatAmount' ?
            <span className="error">{error.error}</span> : <></>}
          <br />

        
        </div>

      </form>
      <div style={{ display: 'grid', gridTemplateRows: 'repeat(2,auto)', marginBottom: '1ch', padding: '1ch' }} >
        <input className="inputs btn-color sub-header-btn" style={{ width: '200px' }}
          onChange={onChangeImage}
          type="file"
          accept="image/jpeg,image/png" name="createMenuItemInput"
        />

        {
          menuItemState.image ?
            <img className="menuitem-modal" src={menuItemState.image} id="previewImage" />
            : <></>
        }
      </div>
      <div style={{ padding: '1ch' }}>
        {
          updateItemSelector.update?
          <div>
          <button onClick={updateCurrentItem} className="submit-btn">UPDATE</button>
          <button onClick={cancelUpdate} className="submit-btn">CANCEL</button>
            </div>
            :
        <button onClick={submitMenuItem} className="submit-btn">SUBMIT</button>
        }
      </div>
    </div>
  )
}

export default ModalFormMenuItem