import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setModalDisplay } from '../../redux/modalSlice'
import { assignSettings,addUsers,removeUsers,addUser } from '../../redux/settingsSlice'

const initialSettings = {serviceCharge:0,currentUsers:[],printers:{bill:'',kitchen:''},user:{}}
const initialDisplayError = {display:'none',error:'',errorInput:'',opacity:0}
const initialCss = {button:'',css:''}

const SettingsModal = () => {

  const dispatch = useDispatch()
  let inputs = document.getElementsByTagName('input')
  let modal = document.getElementById("modal-main")
  let modalContent = document.getElementById("modal-content")
  window.onclick = function (e) {
    // console.log(e.target)
    if (e.target === modal && e.target !== modalContent) {
      // console.log(e.target)
      //     console.log(modal.style.display)
      dispatch(setModalDisplay())
    }
  }
  const settingsState = useSelector(state => state.settings)
  const {currentUsers} = useSelector(state => state.settings)

  const regNumbers = /\D/
  const [settings,setSettings] = React.useState(initialSettings)
  const [displayError,setDisplayError] = React.useState(initialDisplayError)
  const [css,setCss] = React.useState(initialCss)

  // console.log('settingsState',settingsState)
  useEffect(() => {
    // console.log(inputs)
    if(settingsState.printers || settingsState.serviceCharge){
      document.querySelector("input[name='serviceCharge']").value = settingsState.serviceCharge?settingsState.serviceCharge:0
      document.querySelector("input[name='bill']").value = settingsState.printers.bill?settingsState.printers.bill:''
      document.querySelector("input[name='kitchen']").value = settingsState.printers.kitchen?settingsState.printers.kitchen:''

    }

  },[settingsState])
  const userCredentials = (e) => {
    let user = initialSettings.user
   
    setSettings(prevState => {
    console.log(user)
    user[e.target.name] = e.target.value
    return {...prevState,user:{...user}}
    })}
  const settingPrinters = (e) => {
    setSettings(prevState => {
    let {printers} = prevState
    printers[e.target.name] = e.target.value
    return {...prevState,printers:{...printers}}
    })}
  const setRole = (e) => {
    setCss({button:e.target.id,css:{backgroundColor:'#313638',color:'#ef6369'}})
    setSettings(prevState => {
      let {user} = prevState
      return {...prevState,user:{...user,role:e.target.id}}
    })
  }
  const addNewUser = () => {
    let {_id,password,role,userName} = settings.user
    
    
    if(_id && password && role && userName) {
      window.settings.createUser(settings.user)
      .then(data => { if(data._id)dispatch(addUser(data))})
      console.log(inputs[1].value)
    inputs[1].value = ''
    inputs[2].value = ''
    inputs[3].value = ''
    settings.user = initialSettings.user
    // setCss(initialCss)
    return
    }
    else setDisplayError({error:'All the fields should be filled.',errorInput:'createUser',display:'block'});return    

  }
  // console.log(settings)
  const submitSettings = () => {
    window.settings.createSettings({
      printers:settings.printers,
      serviceCharge:settings.serviceCharge,
      _rev:settingsState._rev,
      _id:settingsState._id
    })
    .then(data => {if(data)dispatch(assignSettings(data))})
    
  }
  const getUserDetails = (e) => {
    let _id = e.target.id
    let clickedUser = currentUsers.filter((user) => {
      return user._id === _id
    })
    // console.log(clickedUser)
    inputs[1].value = clickedUser[0].userName
    inputs[2].value = clickedUser[0]._id
    inputs[3].value = clickedUser[0].password
  }
  const removeUser = (e) => {
    let _id = inputs[2].value
  
   if(_id){
    window.settings.removeDoc(_id)
    .then(res => {if(res.ok) dispatch(removeUsers(_id))})
   }   
}
  return (
    <div>
      <h3 className="sub-header font-size-large bg-black-header" 
    >SETTINGS</h3>
      <div>
        <div  className="input-section-box">
          <label className="modal-form-label">Service Charge:</label><br/>
          <input name="serviceCharge" className="modal-form-input"  placeholder='Service charge (%)'
          onChange={(e) => {
            let serviceChargeValue  = ( e.target.value)
            if(regNumbers.exec(serviceChargeValue) || serviceChargeValue>100) setDisplayError({display:'block',errorInput:'serviceCharge',error:'Only numbers are accepted & value is higher than 100%',opacity:1})
            else setDisplayError({display:'none',error:'',displayInput:'',opacity:0})
            setSettings(preState => {return {...preState,serviceCharge:parseInt(serviceChargeValue)}})
          }}/>
          <span style={{display:displayError.errorInput==='serviceCharge'?displayError.display:'none'}} className='error'>{displayError.error}</span>
        </div>
        <div  className="input-section-box">
          <label  className="modal-form-label">Current Users:</label><br/>
          <span>
            {
              currentUsers? currentUsers.map((user,id) => {
                return(
                  <span onClick={getUserDetails} id={user._id} className='users font-small' style={user.role==='admin'?{color:'#ef6369',border:'#ef6369 solid 1px'}:{}} key={id}>{user._id} {user.name}</span>
                )
              }) : <span>No users</span>
            }
          </span>
        </div>
        <div  className="input-section-box ">
          <label  className="modal-form-label">Create User:</label><br/>
          <label className='font-small bold'>Full Name:</label><br/>
          <input required className="modal-form-input" name="userName" placeholder='Full Name' onChange={userCredentials}/><br/>
         
          <label className='font-small bold'>User id:</label><br/>
          <input required className="modal-form-input" name="_id" placeholder='User id: Login credential'onChange={userCredentials} /><br/>
          
          <label className='font-small bold'>Password:</label><br/>
          <input required className="modal-form-input" name="password" placeholder='Password: Login credential' onChange={userCredentials} /><br/>
          <span  className='font-small bold'>Role:</span><button className='settings-role-btn font-small' id="admin" onClick={setRole}  style={css.button==='admin'?{...css.css}:{}}>Admin</button>
          <button onClick={setRole} id='cashier'  className='settings-role-btn font-small' style={css.button==='cashier'?{...css.css}:{}}>Cashier</button><br/>
          <button onClick={addNewUser} className="do-action do-action-bg">Add User</button>
          <button onClick={removeUser}  className="cancel-action cancel-action-bg">Remove User</button>
          <span style={{display:displayError.errorInput==='createUser'?displayError.display:'none'}} className='error'>{displayError.error}</span>

        </div>
        <div  className="input-section-box">
          <label  className="modal-form-label">Printer</label><br/>
          <span className='font-small'>Name of the printer as seen on your operating system's devices.</span><br/>
          <div style={{width:'100px'}}>
          <label>Bill:<input name="bill" className="modal-form-input" onChange={settingPrinters}/></label><br/>

          <label >Kitchen:<input onChange={settingPrinters} name="kitchen" className="modal-form-input" /></label>
          </div>
        </div>
        <button onClick={submitSettings} className="submit-btn">Submit</button>
      </div>
    </div>
  )
  

 
}

export default SettingsModal

  {/* <span>Service %:</span><br/> <input  onChange={(e) => {
            let priceRegex = regNumbers.exec(e.target.value)
            console.log('serviceCharge',e.target.name)
            if (priceRegex) {
              setError({ error: 'Only numbers are accepted.', input: e.target.name })
              return
            } else {
              setError({ error: '', input: '' })
              onChange(e)
            }
          }} className="modal-form-input " name='service' placeholder="ex:10" />
          {error.input === 'serviceCharge' ?
            <span className="error">{error.error}</span> : <></>} */}
