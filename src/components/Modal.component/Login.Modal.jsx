import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { setModalDisplay } from '../../redux/modalSlice'
import { setCurrentUser } from '../../redux/settingsSlice'

const initilCredentials = {user_id:'',password:''}
const initialError = { error: '',input:'' }

const Login = () => {
    let modal = document.getElementById("modal-main")
  let modalContent = document.getElementById("modal-content")
  window.onclick = function (e) {
    // console.log(e.target)
    
  }
    const dispatch = useDispatch()
    const [error,setError] = React.useState(initialError)
    const [credentials,setCredentials] = React.useState(initilCredentials)
    // console.log(credentials)
    let onChangeLogin = {}
    // console.log(currentUser)
    const onChangeCredentials = (e) =>{
        
        let key = e.target.name
        let value = e.target.value
        onChangeLogin[key] = value
        setCredentials(prevState => {
            return {...prevState, ...onChangeLogin }
        })
    }

    const submitLogin = (e) => {
        e.preventDefault()
        let checkInAndOut = {}
        let loginTime = new Date()
        let getHours = loginTime.getHours()
        let addHours = new Date(loginTime).setHours(getHours+24)
        let expireTime = new Date(addHours)
        checkInAndOut.loginTime = loginTime
        checkInAndOut.expireTime = expireTime
        // console.log(checkInAndOut)

        // console.log(credentials)
        window.settings.login(credentials,checkInAndOut).then(token => {
            // console.log('setting token with user',token)
            if(token.token){
                setError({error:'',input:''})
                console.log('setting token with user',token)

                dispatch(setCurrentUser({...credentials,token:token.token}))
                
            } else {

                setError({error:'Username or Password is incorrect.'})
            }
        })
    }
    return( 
        <div className='MainDiv' >
            <form className='loginForm'>
                <h3 className='centerText'>
                    LOGIN
                </h3>
                <div>
                    <label className='font-small strong'>User-id:</label>
                    <input onClick={()=>setError(initialError)} className='loginInputs' onChange={onChangeCredentials} name="user_id" type="text" required/>
                </div>
                <div>
                    <label className='font-small strong'>Password:</label>
                    <input onClick={()=>setError(initialError)} className='loginInputs'  onChange={onChangeCredentials} name="password" type="password" required/>
                </div>
                <button className='redBtn' onClick={submitLogin} type="submit">Submit</button>
            </form>
            {
                error.error?
                <span className='error' style={{width:'auto'}}>{error.error}</span>
                :<></>
            }
        </div>
    )
}

export default Login