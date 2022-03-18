const PouchDB = require('pouchdb')
const { ipcRenderer } = require('electron')

PouchDB.plugin(require('pouchdb-find'))

let db = new PouchDB('Settings') 
// async function removeItem(_id) {
//     try {
  
//       let doc = await db.get(_id)
//       let removeItem = await db.remove(doc)
//       console.log('item removed', removeItem)
//       return removeItem
//     } catch (error) {
//       return error
//     }
//   }
//   removeItem('loginToken')
// const getDoc = async () =>{
//     let doc = await db.get('loginToken')
//     console.log('getDoc',doc)
// }
// getDoc()
// async function clockInData(){
//     const docs  = await db.find({
//         selector:{title:'clockIn'}
//     })
//     console.log(docs.docs)
// }
// clockInData()
class SettingsDAO{

static async getUsers(){
    try{
        let users = await db.find({
            selector:{title:'user'}
            
        })
        console.log(users)
        return users.docs
    } catch(error){
        return {error:error}
    }
}
static async createUser(userDetails){
    // console.log('userDetails',userDetails)
    try{
        let res = await db.put({
            title:'user',
            ...userDetails,
           clockIn_id:`${userDetails._id}-clockIn`,
        })
        // console.log(res)
       let clockInDoc = await db.put({
            _id:`${userDetails._id}-clockIn`,
            title:'clockIn',
            user:userDetails._id,
            clockInAndOut:[]
        })
        // console.log('clockInDoc created',clockInDoc)
        
        return {_rev:res.rev,title:'user',...userDetails,clockInDoc}
    } catch(error) {
        return {error:error}
    }
}
static async removeDoc(_id) {
    try {
  
      let doc = await db.get(_id)
      let removeItem = await db.remove(doc)
    //   console.log('item removed', removeItem)
      return removeItem
    } catch (error) {
      return error
    }
  }

static async createSettings(data){
    
    // console.log('create settings',data)
    try{
    
            let {printers,serviceCharge} = data
            let res = await db.put({
                _id:'settings',
                printers:printers,
                serviceCharge:serviceCharge,
                ...data
            })
            // console.log(res,data)
           return {_rev:res._rev,...data} 
        
    } catch(error){
        return {error:error}
    }
}
static async getSettings(){

    try{
        let doc = await db.get('settings')
        // console.log('getSettings',doc)
        return doc
    } catch(error){
        return error
    }
}

static async login(credentials,LoginAndExpire){
    // console.log('login',credentials,LoginAndExpire)
    let checkPassword
    try{
        let doc = await db.get(credentials.user_id)
        console.log(doc)
        if(doc) checkPassword  = doc.password === credentials.password
        else return {error : 'User id does not exsits.'}
        if(checkPassword) {
            // console.log('check pw',checkPassword)
        let loginToken ={
            _id:'loginToken',
            role:doc.role,
            title:'loginToken',
            userName:doc.userName,
            expired:false,
            expireTime:LoginAndExpire.expireTime,
            user_id:credentials.user_id,
            clockIn_id:doc.clockIn_id

        }
        let res = await db.put({...loginToken})
        // console.log('loginToken',res)
        let loginData = {
            login:LoginAndExpire.loginTime,
            logout:{}

        }
        let clockInDoc
        clockInDoc = await db.get(`${credentials.user_id}-clockIn`)
        // console.log('clockInDoc',clockInDoc)
        if(clockInDoc){
            let {clockInAndOut} = clockInDoc
            db.put({
                ...clockInDoc,
                clockInAndOut:[...clockInAndOut,loginData]
            })
        } 
   
            return {ok:'Login success',token:loginToken}
        }
        else return {error:'Password is incorrect'}
    } catch(error) {
        return {error : error}
    }
}
static async logout(date){
    // console.log('logOut')
    try {
        let loginToken = await db.get('loginToken')
        // console.log('loginToken',loginToken)
        if(loginToken) {
            let clockInDoc = await db.get(`${loginToken.user_id}-clockIn`)
            // console.log('clockIN doc',clockInDoc)
            let {clockInAndOut} = clockInDoc
            clockInAndOut[clockInAndOut.length-1].logout = date
            await db.put({
                ...clockInDoc,
                clockInAndOut:[...clockInAndOut,]
            }) 
            // console.log('clocking updated')
            let response = await db.remove(loginToken)
            return {res:response,clockInDoc:clockInDoc}
        }
    }catch (error){
        return {error:error}
    }
}
static async getCurrentUser(){
    // console.log('getCurrentUser')
    let timeNow = new Date()
    try{
    let doc = await db.get('loginToken')
    // console.log('get current user token',doc)
    let userDoc = await db.get(doc.user_id)
    // console.log('get current user userDoc',userDoc)
    // console.log(timeNow > doc.expireTime)
    if(!doc) return {error: 'Login token expired. Please login again.'}
    if(timeNow>doc.expireTime || !userDoc){
        await db.put({...doc,expired:true})
        await db.remove(doc)
        return {error : 'Login token expired. Please login again.'}
    }
        return {token:doc}
    } catch(error) {
        return {error:error}
    }
}
static async createAdmin(){
    
}


}

module.exports = SettingsDAO