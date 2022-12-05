const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const {getClient,replicateDatabase} = require('./RemoteDb')
const db = require('./pouchdb')

replicateDatabase()

async function createAdmin(){
    // console.log('userDetails',userDetails)
 
    let admin = {
        title:'user',
        _id:'admin',
        userName:'admin',
        role:'admin',
        password:'admin',
       clockIn_id:`admin-clockIn`,
    }
  
        console.log('creating admin')
        try{
            let res = await db.put(admin)
            console.log('admin',res)
           let clockInDoc = await db.put({
                _id:`admin-clockIn`,
                title:'clockIn',
                user:'admin',
                clockInAndOut:[]
            })
            console.log('clockInDoc created',clockInDoc)
            
            return {_rev:res.rev,title:'user',...admin,clockInDoc}
        } catch(error) {
            return {error:error}
        }
    
}
async function createSettingsDoc(){
    
    console.log('create settings',)
    try{
        let res = db.get('settings').catch(error => {
                if(error.name==='not_found'){
                    console.log('settings not found. creating doc')
                    let settingsDoc = {
                        printers:{bill:'',kitchen:''},
                        currentUsers:[],
                        
                        _id:'settings',
                        vat:0,
                        serviceCharge:0,
                        
                        shopDetails:{ phone: '', openHours: '', address: '', logo: '' ,clientName:'My Client'}
                      }
                    db.put(settingsDoc,(err,doc) => {
                        if(doc.ok) return doc
                    })
                }
            })
            if(res.ok){
                console.log('res.ok',res)
                return res
            }
            console.log(res)
           
            
    } catch(error){
        return {error:error}
    }
}
createAdmin()
createSettingsDoc()
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
    
    console.log('create settings',data)
    try{
    
            let {printers,serviceCharge} = data
            let res = await db.put({
                _id:'settings',
                printers:printers,
                serviceCharge:serviceCharge,
                ...data
            })
            console.log(res,data)
           return {_rev:res._rev,...data} 
            
    } catch(error){
        return {error:error}
    }
}
static async getSettings(){

    try{
        let doc = await db.get('settings')
        console.log('getSettings',doc)
        return doc
    } catch(error){
        return error
    }
}

static async login(credentials,LoginAndExpire){
    console.log('login',credentials,LoginAndExpire)
    let checkPassword
    console.log(db)
    try{
        console.log('try')
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
        console.log('loginToken',res)
        let loginData = {
            login:LoginAndExpire.loginTime,
            logout:{}

        }
        let clockInDoc
        clockInDoc = await db.get(`${credentials.user_id}-clockIn`)
        // console.log('clockInDoc',clockInDoc)
        if(clockInDoc){
            let {clockInAndOut} = clockInDoc
           let clockInRes = await db.put({
                ...clockInDoc,
                clockInAndOut:[...clockInAndOut,loginData]
            })
            console.log(clockInRes)
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
        console.log('loginToken',loginToken)
        if(loginToken) {
            let clockInDoc = await db.get(`${loginToken.user_id}-clockIn`)
            console.log('clockIN doc',clockInDoc)
            let {clockInAndOut} = clockInDoc
            console.log('clockInAndOut',clockInAndOut)
            clockInAndOut[clockInAndOut.length-1].logout = date
            await db.put({
                _id:clockInDoc._id,
                ...clockInDoc,
                clockInAndOut:[...clockInAndOut,]
            }) 
            console.log('clocking updated',clockInDoc)
            let response = await db.remove(loginToken)
            console.log('clocking updated',response)
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
static setClientInfo(syncData){
    console.log('setClientInfo',syncData)
    let remoteDB
        if(syncData && syncData.client && syncData.email){
            remoteDB = `${syncData.email.split('@')[0]}-${syncData.client}`
            console.log('remoteDB',remoteDB)
        } else { console.log('remote database not set.')}

      
        let doc = db.get('clientInfo')
        .then(data => {
            console.log('clientINfo Promise',data)
            if(data._id){
                let response =  db.put({_id:syncData._id,_rev:syncData._rev,...syncData,remoteDB:remoteDB},function(err,res){
                       
                    if(err) {
                           console.log(err)
                           return {error:err}
                       } else{ 
                           console.log('sssss',res)
                           
                           return {success:res}}
                       
                   })
                return response
               } else { console.log(data);return {error:data}}
        })
        .catch(error => {
            if(error.name==='not_found'){
                let clientInfoDoc = {_id:'clientInfo',...data}
                db.put(clientInfoDoc,(err,doc) => {
                    if(doc.ok){return doc}
                    else{ 
                        console.log(error)
                       
                        return {error:'Incorrect credentials'}}
                })
            }
        })
        return doc
    
        
        
}
static async getClientInfo(){
    try{
        let doc = await db.get('clientInfo')
        console.log('clientInfo',doc)
        
        return doc
    } catch(error){
        console.log("get client info Error",error)
        return {error:'Client info not found.'}
    }
}


}

module.exports = SettingsDAO