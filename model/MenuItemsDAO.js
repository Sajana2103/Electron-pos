const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const { getClient } = require('./RemoteDb')
const db = require('./pouchdb')

async function destroyDB(){

  try {
    await db.destroy();
  } catch (err) {
    console.log(err);
  }
}
// destroyDB()
async function getAllMenuItems() {
  let docs = await db.find({
    selector: {
      title: 'menuItem'
    }
  })
  console.log('getAllMenuItems', docs)
}
getAllMenuItems()

class MenuItemsDAO {

  // static async getAll(){
  //   let alldocs = await db.allDocs({include_docs:true, descending:true,attachments:true})
  //   if(alldocs) return alldocs
  // }
  static async addItem(data) {
    console.log(data)
    // if(!data.name){
    //   return {res:'Name is Required.'}
    // } else if(!data.price && data.portionSizes.length<1) return {res:'Price or Portion is required.'}
    try {
      let res = await db.post(data)
      getClient()
      return { result: res, data: data }
    } catch (error) {
      console.log('Add Item Error', error)
    }
  }
  static async getMenuItems() {

    try {
      let docs = await db.find({
        selector: { title: 'menuItem' },

      })
      // console.log('find menu Items',docs)
      console.log(docs)
      return docs

    } catch (error) {
      console.log('error getItems', error)
    }
  }
  static async updateItem(item) {
    console.log('update item', item)
    try {
      let doc = await db.get(item._id)
      let res = await db.put({
        title: 'menuItem',
        _rev: doc._rev,
        _id: doc._id,
        ...item
      })
      console.log(res)
      getClient()
      return { res: res, data: item }
    } catch (error) {
      console.log('error', error)
    }
  }
  static async removeItem(_id) {
    console.log('removeItem', _id)
    try {

      let doc = await db.get(_id)
      console.log(doc)
      let response = await db.remove(doc)
      console.log(response)
      getClient()
      return response
    } catch (error) {
      console.log('Remove', error)
    }
  }
  static async dishType() {
    try {
      let result = await db.find({
        selector: { title: 'dishType' },
        fields: ['dish']
      })
      console.log(result)
      if (result.docs < 0) return { error: 'No dish types found. Please add.' }
      return result
    } catch (error) {
      console.log('dishType', error)
    }
  }
  static async createDishType(dish) {
    if (!dish) {
      return { res: 'Dish Name is Required.' }
    }
    try {
      let res = await db.post({
        title: 'dishType',
        dish: dish
      })
      if (res.ok) {
        return { result: res, dish: dish }
      } else {
        return { error: 'adding dish error' }
      }
    } catch (error) {
      console.log('Add Item Error', error)
    }
  }
 
  static async replicateDB() {

    let result = await PouchDB.replicate(db, remoteDB)
    console.log(result)
  }

  static async createMenuItemCategory(category, clientId) {
    try {
      let res = await db.find({
        selector: { title: 'itemCategory', clientId: clientId, category: category },
        fields: ['_id', 'title', 'itemCategories', 'category']
      })
      console.log('createMenuItemCategory', res)
      if (res.docs.length < 1 && category !== undefined && clientId !== undefined) {
        res = await db.post({
          title: 'itemCategory',
          clientId: clientId,
          category: category
        })
        return { result: res, category: category }
      } else {
        return { response: res }

      }
    } catch (error) {
      return { error: error }
    }
  }
  static async getMenuItemCategories(clientId) {
    try {
      let res = await db.find({
        selector: { title: 'itemCategory', clientId: clientId },
        fields: ['_id', 'title', 'category']
      })
      return res
    } catch (error) {
      return { error: error }
    }
  }

}

module.exports = MenuItemsDAO