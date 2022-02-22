const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const {useDispatch} = require('react-redux')

let db = new PouchDB('pos-database') 
let remoteDB ='http://localhost:4000/db/database-server'



class MenuItemsDAO{
  static async injectDB(database){
    if(database){
      return
    }
    try{
      database.allDocs({include_docs:true, descending:true})
  .then(result =>{ docs = result})
  console.log(useDispatch)
  
    } catch(error){
      console.log('Connection error', error)
    }

  }
  static async addItem(data){
  
  // let item = {
  //   // _id: new Date().toISOString(),
  //   title:data.title,
  //   completed:data.completed
  // }
    try{
 let res = await db.post(data)
  return {result:res,data:data}
    }catch(error){
      console.log('Add Item Error',error)
    }
}
static async getMenuItems(){
 
  try{
   let docs= await db.find({
      selector :{title: 'menuItem',clientId:'client123'},
      fields: ['_id','name','category','dishType','price','preparation',],
     
    })
    console.log('find menu Items',docs)
  return docs
  
  } catch(error){
    console.log('error getItems',error)
  }
}
static async updateItem(item){
  try{
    let response = await db.put({
      _id:"a35f9913-c300-4f91-8997-12b3467b69c1",
      title:'Beef Burger',
      _rev: "1-95c9e2436f624543c27faf29c66c0215"
    })
    console.log(response)
  } catch(error){
    console.log('error',error)
  }
}
static async removeItem(item){
  try{
    
    let doc = await db.get('2a1d9a57-f123-409b-8d8d-462b518f62a1')
    console.log(doc)
    let response = await db.remove(doc)
    console.log(response)
  } catch(error){

  }
}
static async findItems(items){
  try{
    let doc = await db.find({
      selector :{title: 'Beef Burger'},
      fields: ['_id','title'],
     
    })
    console.log('FIND',doc)
  } catch(error){
    console.log('Find error',error)
  }
}
static async replicateDB(){

let result = await PouchDB.replicate(db,remoteDB)
console.log(result)
}

static async createMenuItemCategory(category,clientId){
  try{
    let res = await db.find({
      selector : {title : 'itemCategory',clientId: clientId,category:category},
      fields: ['_id','title','itemCategories','category']
    })
    if(res.docs.length < 1 && category !== undefined && clientId !== undefined){
      res = await db.post({
        title : 'itemCategory',
        clientId: clientId,
        category: category
      })
      return {result : res, category: category }
    } else {
     return {response : res}
     
    }
  } catch(error){
    return {error: error}
  }
}
static async getMenuItemCategories(clientId){
  try{
    let res = await db.find({
      selector: {title : 'itemCategory', clientId: clientId},
      fields : ['_id','title','category']
    })
    return res
  } catch(error){
    return {error : error}
  }
}

}

module.exports = MenuItemsDAO