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
      database.allDocs({include_docs:true, descending:true,attachments:true})
  .then(result =>{ docs = result})
  console.log(useDispatch)
  
    } catch(error){
      console.log('Connection error', error)
    }

  }
  static async getAll(){
    let alldocs = await db.allDocs({include_docs:true, descending:true,attachments:true})
    if(alldocs) return alldocs
  }
  static async addItem(data){
  console.log(data)
  // if(!data.name){
  //   return {res:'Name is Required.'}
  // } else if(!data.price && data.portionSizes.length<1) return {res:'Price or Portion is required.'}
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
      
      attachments: true
    })
    console.log('find menu Items',docs)
  return docs
  
  } catch(error){
    console.log('error getItems',error)
  }
}
static async updateItem(item){
  console.log('update item',item)
  try{
    let doc = await db.get(item._id)
    let res = await db.put({
      title: 'menuItem',
      clientId:'client123',
      _rev:doc._rev,
      _id:doc._id,
      ...item
    })
    console.log(res)
    return {res:res,data:item}
  } catch(error){
    console.log('error',error)
  }
}
static async removeItem(_id){
  console.log('removeItem',_id)
  try{
    
    let doc = await db.get(_id)
    console.log(doc)
    let response = await db.remove(doc)
    console.log(response)
    return response
  } catch(error){
    console.log('Remove',error)
  }
}
static async dishType(){
  try{
    let result = await db.find({
      selector:{title:'dishType'},
      fields:['dish']
    })
    console.log(result)
    if(result.docs<0) return {error:'No dish types found. Please add.'}
    return result
  } catch(error){
console.log('dishType',error)
  }
}
static async createDishType(dish){
  if(!dish){
    return {res:'Dish Name is Required.'}
  }
    try{
 let res = await db.post({
   title:'dishType',
   dish:dish
 })
 if(res.ok){
  return {result:res,dish:dish}
 } else {
   return {error:'adding dish error'}
 }
    }catch(error){
      console.log('Add Item Error',error)
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