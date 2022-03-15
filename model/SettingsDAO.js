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
//   removeItem('settings')
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
    console.log('userDetails',userDetails)
    try{
        let res = await db.put({
            title:'user',
            ...userDetails
        })
        console.log(res)
        return {...res,title:'user',...userDetails}

    } catch(error) {
        return {error:error}
    }
}
static async removeDoc(_id) {
    try {
  
      let doc = await db.get(_id)
      let removeItem = await db.remove(doc)
      console.log('item removed', removeItem)
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
           return {...res,...data} 
        
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
static async login(){

}
static async serviceCharge(){

}

}

module.exports = SettingsDAO