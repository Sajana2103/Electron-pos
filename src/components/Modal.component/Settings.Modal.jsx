import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setModalDisplay } from '../../redux/modalSlice'
import { assignSettings, setClientInfo, removeUsers, addUser } from '../../redux/settingsSlice'

const initialSettings = {
  serviceCharge: 0,vat: 0 , currentUsers: [],
  printers: { bill: '', kitchen: '' }, user: {},
  shopDetails: { phone: '', openHours: '', address: '', logo: '' ,clientName:''}
}
const initialDisplayError = { display: 'none', error: '', errorInput: '', opacity: 0 }
const initialCss = { button: '', css: '' }
const initialSyncDatabase = { email: '', password: '', token: '' }
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
  const { currentUsers } = useSelector(state => state.settings)
  const { syncDB } = useSelector(state => state.settings)
  const regNumbers = /\D/
  const [settings, setSettings] = React.useState(initialSettings)
  const [displayError, setDisplayError] = React.useState(initialDisplayError)
  const [syncDatabase, setSyncDatabase] = React.useState(initialSyncDatabase)
  const [css, setCss] = React.useState(initialCss)

  console.log('settings', settings,settingsState)
  useEffect(() => {
    // console.log(inputs)
    if (settingsState.printers || settingsState.serviceCharge || settingsState.shopDetails) {
      document.querySelector("input[name='serviceCharge']").value = settingsState.serviceCharge ? settingsState.serviceCharge : 0
      document.querySelector("input[name='vat']").value = settingsState.vat ? settingsState.vat : 0
      document.querySelector("input[name='bill']").value = settingsState.printers.bill ? settingsState.printers.bill : ''
      document.querySelector("input[name='kitchen']").value = settingsState.printers.kitchen ? settingsState.printers.kitchen : ''
      document.querySelector("input[name='phone']").value = settingsState.shopDetails.phone ? settingsState.shopDetails.phone : ''
      document.getElementById('address').value = settingsState.shopDetails.address ? settingsState.shopDetails.address : ''
      document.querySelector("input[name='openHours']").value = settingsState.shopDetails.openHours ? settingsState.shopDetails.openHours : ''
      document.querySelector("input[name='clientName']").value = settingsState.shopDetails.clientName ? settingsState.shopDetails.clientName : ''

      setSettings(prevState => { 
       
        return {
          ...prevState,
          serviceCharge:settingsState.serviceCharge,
          shopDetails:{...settingsState.shopDetails},
          printers:{...settingsState.printers},
        }
      })
    }
    if (syncDB) {
      setSyncDatabase({ ...syncDB })
      document.querySelector("input[name='email']").value = syncDB.email ? syncDB.email : ''
      document.querySelector("input[id='subscriptionPassword']").value = syncDB.password ? syncDB.password : ''
      document.querySelector("input[name='token']").value = syncDB.token ? syncDB.token : ''
      document.querySelector("input[name='client']").value = syncDB.client ? syncDB.client : ''

    }

  }, [settingsState, syncDB])
  const userCredentials = (e) => {
    let user = initialSettings.user

    setSettings(prevState => {
      console.log(user)
      user[e.target.name] = e.target.value
      return { ...prevState, user: { ...user } }
    })
  }

  const setLogo = (e) => {
    let file = e.target.files[0]
    console.log(file)
    const reader = new FileReader()
    if (e.target.files && e.target.files[0]) {
      reader.addEventListener("load", () => {
        setSettings((prevState) => {
          let {shopDetails} = prevState
          shopDetails.logo =  reader.result
          return {
            ...prevState,
            shopDetails:{...shopDetails},
          }
        })
      }, false)
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const settingPrinters = (e) => {
    setSettings(prevState => {
      let { printers } = prevState
      printers[e.target.name] = e.target.value
      return { ...prevState, printers: { ...printers } }
    })
  }

  const settingShopDetails = (e) => {
    setSettings(prevState => {
      let { shopDetails } = prevState
      shopDetails[e.target.name] = e.target.value
      return { ...prevState, shopDetails: { ...shopDetails } }
    })
  }


  const setRole = (e) => {
    setCss({ button: e.target.id, css: { backgroundColor: '#313638', color: '#ef6369' } })
    setSettings(prevState => {
      let { user } = prevState
      return { ...prevState, user: { ...user, role: e.target.id } }
    })
  }

  const setSyncDatabaseCredentials = (e) => {
    let key = e.target.name
    let value = e.target.value
    let field = {}
    setSyncDatabase(prevState => {
      field[key] = value
      return { ...prevState, ...field }
    })
  }

  const syncDatabaseOnSubmit = () => {
    fetch(`${process.env.REACT_APP_API_URL}v1/users/sync-database`, {
      method: "POST",
      body: JSON.stringify(syncDatabase),
      headers: {
        "Content-type": "application/json"
      }
    }).then(res => res.json()).then(data => {
      if (data.success) {
        window.settings.setClientInfo(syncDatabase)
        dispatch(setClientInfo(syncDatabase))
      }
    })
  }

  const addNewUser = () => {
    let { _id, password, role, userName } = settings.user
    if (_id && password && role && userName) {
      window.settings.createUser(settings.user)
        .then(data => { if (data._id) dispatch(addUser(data)) })
      console.log(inputs[1].value)
      inputs[1].value = ''
      inputs[2].value = ''
      inputs[3].value = ''
      settings.user = initialSettings.user
      // setCss(initialCss)
      return
    }
    else setDisplayError({ error: 'All the fields should be filled.', errorInput: 'createUser', display: 'block' }); return

  }
  // console.log(settings)
  const submitSettings = () => {
    let settingsSubmit = {
      shopDetails: settings.shopDetails,
      printers: settings.printers,
      serviceCharge: settings.serviceCharge,
      vat: settings.vat,
      _rev: settingsState._rev,
      _id: settingsState._id
    }
    console.log(settingsSubmit)
    window.settings.createSettings(settingsSubmit)
      .then(data => {
        if (data) {
          dispatch(assignSettings(data))
          dispatch(setModalDisplay())
        }
      })

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

    if (_id) {
      window.settings.removeDoc(_id)
        .then(res => { if (res.ok) dispatch(removeUsers(_id)) })
    }
  }
  return (
    <div >
      <h3 className="sub-header font-size-large bg-black-header"
      >SETTINGS</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 300px' }}>
        <div className="input-section-box">
          <div>
          <label className="modal-form-label">Service Charge:</label><br />
          <input name="serviceCharge" className="modal-form-input" placeholder='Service charge (%)'
            onChange={(e) => {
              let serviceChargeValue = (e.target.value)
              if (regNumbers.exec(serviceChargeValue) || serviceChargeValue > 100) setDisplayError({ display: 'block', errorInput: 'serviceCharge', error: 'Invalid value or value is higher than 100%', opacity: 1 })
              else setDisplayError({ display: 'none', error: '', displayInput: '', opacity: 0 })
              setSettings(preState => { return { ...preState, serviceCharge: parseInt(serviceChargeValue) } })
            }} />
          <span style={{ display: displayError.errorInput === 'serviceCharge' ? displayError.display : 'none' }} className='error'>{displayError.error}</span>
          </div>
          <div>
          <label className="modal-form-label">VAT:</label><br />
          <input name="vat" className="modal-form-input" placeholder='vat (%)'
            onChange={(e) => {
              let vat = (e.target.value)
              if (regNumbers.exec(vat) || vat > 100) setDisplayError({ display: 'block', errorInput: 'vat', error: 'Invalid value or value is higher than 100%', opacity: 1 })
              else setDisplayError({ display: 'none', error: '', displayInput: '', opacity: 0 })
              setSettings(preState => { return { ...preState, vat: parseInt(vat) } })
            }} />
          <span style={{ display: displayError.errorInput === 'serviceCharge' ? displayError.display : 'none' }} className='error'>{displayError.error}</span>
          <span style={{ display: displayError.errorInput === 'vat' ? displayError.display : 'none' }} className='error'>{displayError.error}</span>

          </div>
        </div>
        
        <div className="input-section-box">
          <label className="modal-form-label">Current Users:</label><br />
          <span>
            {
              currentUsers ? currentUsers.map((user, id) => {
                return (
                  <span onClick={getUserDetails} id={user._id} className='users font-small' style={user.role === 'admin' ? { color: '#ef6369', border: '#ef6369 solid 1px' } : {}} key={id}>{user._id} {user.name}</span>
                )
              }) : <span>No users</span>
            }
          </span>
        </div>
        <div className="input-section-box ">
          <label className="modal-form-label">Create User:</label><br />
          <label className='font-small bold'>Full Name:</label><br />
          <input required className="modal-form-input" name="userName" placeholder='Full Name' onChange={userCredentials} /><br />

          <label className='font-small bold'>User id:</label><br />
          <input required className="modal-form-input" name="_id" placeholder='User id: Login credential' onChange={userCredentials} /><br />

          <label className='font-small bold'>Password:</label><br />
          <input required className="modal-form-input" name="password" placeholder='Password: Login credential' onChange={userCredentials} /><br />
          <span className='font-small bold'>Role:</span><button className='settings-role-btn font-small' id="admin" onClick={setRole} style={css.button === 'admin' ? { ...css.css } : {}}>Admin</button>
          <button onClick={setRole} id='cashier' className='settings-role-btn font-small' style={css.button === 'cashier' ? { ...css.css } : {}}>Cashier</button><br />
          <button onClick={addNewUser} className="do-action do-action-bg">Add User</button>
          <button onClick={removeUser} className="cancel-action cancel-action-bg">Remove User</button>
          <span style={{ display: displayError.errorInput === 'createUser' ? displayError.display : 'none' }} className='error'>{displayError.error}</span>

        </div>
        <div className="input-section-box">
          <label className="modal-form-label">Printer</label><br />
          <span className='font-small'>Name of the printer as seen on your operating system's devices.</span><br />
          <div style={{ width: '100px' }}>
            <label className='font-small bold'>Bill:<input name="bill" className="modal-form-input" onChange={settingPrinters} /></label><br />

            <label className='font-small bold' >Kitchen:<input onChange={settingPrinters} name="kitchen" className="modal-form-input" /></label>
          </div>
        </div>
        <div className="input-section-box">
          <label className="modal-form-label">Sync Database</label><br />
          <span className='font-small'>Add online database user credentials to connect.</span><br />
          <div style={{ width: '100px' }}>
            <label htmlFor='subscriptionEmail' className='font-small bold'>Email:<input id="subscriptionEmail" type="email" name="email" className="modal-form-input" required onChange={setSyncDatabaseCredentials} /></label><br />

            <label htmlFor='subscriptionPassword' className='font-small bold'>Password:<input id="subscriptionPassword" onChange={setSyncDatabaseCredentials} type="password" name="password" className="modal-form-input" required /></label>
            <label htmlFor='subscriptionToken' className='font-small bold'>Token:<input id="subscriptionToken" onChange={setSyncDatabaseCredentials} name="token" type="password" className="modal-form-input" required /></label>
            <label htmlFor='subscriptionClient' className='font-small bold' >Client:<input id="subscriptionClient" onChange={setSyncDatabaseCredentials} name="client" type="text" className="modal-form-input" required /></label>

            <button onClick={syncDatabaseOnSubmit} className="redBtn medBtn">SYNC</button>

          </div>
        </div>
        <div className="input-section-box" >
          <div>
            <label className="modal-form-label">Shop Details</label>
          </div>
          <div className='formRow'>
            <label htmlFor='clientName' className='font-small bold'>Client Name:<br />
              <input id="clientName" type="text" name="clientName" className="modal-form-input" required onChange={settingShopDetails} />
            </label>
          </div>
          <div className='formRow'>
            <label htmlFor='phone' className='font-small bold'>Phone:<br />
              <input id="phone" type="tel" name="phone" className="modal-form-input" required onChange={settingShopDetails} />
            </label>
          </div>
          <div className='formRow'>
            <label htmlFor='address' className='font-small bold'>Address:<br />
              <textarea id="address" type="text" name="address" className="modal-form-input" required onChange={settingShopDetails} />
            </label>
          </div>
          <div className='formRow'>
            <label htmlFor='openHours' className='font-small bold'>Open Hours:<br />
              <input id="openHours" type="text" placeholder='Ex: 10AM-12AM' name="openHours" className="modal-form-input" required onChange={settingShopDetails} />
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateRows: 'repeat(2,auto)', marginBottom: '1ch', padding: '1ch' }} >
        <input className="inputs btn-color sub-header-btn" style={{ width: '200px' }}
          onChange={setLogo}
          type="file"
          accept="image/jpeg,image/png" name="createMenuItemInput"
        />

        {
          settings.shopDetails.logo ?
            <img className="menuitem-modal" src={settings.shopDetails.logo} id="previewLogo" />
            : <></>
        }
      </div>

        </div>
      </div>
      <div style={{ display: 'grid', justifyContent: 'center' }}>
        <button onClick={submitSettings} className="redSubmitBtn bigBtn" >Submit</button>
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
