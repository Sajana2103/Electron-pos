const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))

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

  
    } catch(error){
      console.log('Connection error', error)
    }

  }
  static async addItem(data){
  console.log('adding items')
  let item = {
    // _id: new Date().toISOString(),
    title:data.title,
    completed:data.completed
  }
  await db.post(item,(err, result) =>{
    try{
    if(result){
      console.log('done', result)
      return {item,result}
       }
    }catch(error){
      console.log('Add Item Error',error)
    }
   
  })
}
static async getItems(){
  let docs
  try{
   await db.allDocs({include_docs:true, descending:true})
  .then(result =>{ docs = result})
  console.log(docs)
  if(docs){
    return docs
  }
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
}

module.exports = MenuItemsDAO