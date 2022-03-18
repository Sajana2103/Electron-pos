import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { setModalDisplay } from '../../redux/modalSlice'
import { setCurrentUser } from '../../redux/settingsSlice'

const initilCredentials = {user_id:'',password:''}

const Login = () => {
    let modal = document.getElementById("modal-main")
  let modalContent = document.getElementById("modal-content")
  window.onclick = function (e) {
    // console.log(e.target)
    
  }
    const dispatch = useDispatch()
    const [credentials,setCredentials] = React.useState(initilCredentials)
    
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
            if(token.token){
                // console.log('setting token with user',token)

                dispatch(setCurrentUser({...credentials,token:token.token}))
                
            }})
    }
    return( 
        <div>
            <form>
                <div>
                    LOGIN
                </div>
                <div>
                    <label>User-id:</label>
                    <input onChange={onChangeCredentials} name="user_id" type="text" required/>
                </div>
                <div>
                    <label>Password:</label>
                    <input onChange={onChangeCredentials} name="password" type="password" required/>
                </div>
                <button onClick={submitLogin} type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Login