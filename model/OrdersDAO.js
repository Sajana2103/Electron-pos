const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))


let db = new PouchDB('pos-orders')
let remoteDB = 'http://localhost:4000/db/database-server'

  const date = new Date();
const [month, day, year]       = [date.getMonth(), date.getDate(), date.getFullYear()];
const [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];

function create_id(orderDate,orderNumber) {
  let [date,time] = orderDate.split(',')
  let newDate = date.replace(/\D/g,'')
  let newTime = time.substring(0,time.length-3).replace(/\D/g,'')
  let _id = `${newDate}-${newTime}-${orderNumber}`

  return _id
}
async function removeItem(_id){
  try{

    let doc =await db.get(_id)
    let removeItem = await db.remove(doc)
    console.log('item removed',removeItem)
    return removeItem
  } catch(error){
    return error
  }
  }
  // async function removeItemWithFind(){
  //   let doc =await db.find({selector:{title:"time&orderReset"}})
  //   let removeItem = await db.remove(doc)
  //   console.log('item removed',removeItem)
  //   return removeItem
  // }
  // removeItemWithFind()
  // removeItem('11/03/2022')
class OrdersDAO {
  static async createOrder(data) {
    console.log(data)
   let _id = ''
   let doc
   try{
    if(!data._id){
      _id = create_id(data.dateAndTime[0],data.orderNumber).toString()
      doc = await db.put({
        _id,...data
      })
      let timeDoc_id = data.dateAndTime[0].split(',').shift()
      let lastOrderDoc  = await db.get(timeDoc_id)
      console.log('lastOrderDoc',lastOrderDoc,timeDoc_id)
      await db.put({
        ...lastOrderDoc,
        orderNumber:lastOrderDoc.orderNumber+1,
        _id:lastOrderDoc._id,
        _rev:lastOrderDoc._rev
      })
      console.log(lastOrderDoc)
      return {...data,_id:_id}
    } else if(data._id){
      console.log('Data._id')
      doc = await db.get(data._id)
       console.log('Data._id',doc)
      let {dateAndTime,orderNumber} = doc
       console.log('Data._id',dateAndTime,orderNumber)
      doc = await db.put({
        ...doc,
        _id:doc._id,
        appendedOrder:data.appendedOrder,
        _rev:doc._rev,
        dateAndTime:[...dateAndTime,data.dateAndTime],
        data:doc.data.concat(data.data),

      })
      console.log('Data._id doc',doc)
      console.log('data',data)
      return {...data,orderNumber:orderNumber}
    }
      }catch(error){
        console.log('CREATE ORDER ERROR:',error)
        return{error:error}
      }
  
  console.log(doc)
  // if(res.ok){
  //   return ({..._id,data})
  // }
  }
  static async completeOrCancelOrder(order){
    console.log('complete or cancel', order)
    if(order.status === 'completed' || order.status === 'canceled' || order.status === 'onhold'){
      try{

    let doc = await db.get(order._id)
     console.log('complete or cancel doc', doc)
    let updateStatus = db.put({
      _id:doc._id,
      _rev:doc._rev,
      ...order
      })
       console.log('complete or cancel updateStatus', updateStatus)
    return {ok:updateStatus,_id:doc._id}
      } catch(error){
        console.log('complete or cancel error', error)
        return {error:error}
      }
    }
    
  }
  static async removeOrder(_id){
    let doc = await db.get(_id)
    let removeItem = await db.remove(doc)
    console.log('item removed',removeItem)
    return removeItem
  }

  static async getOngoingOrders(){
  
    let docs = await db.find({
      selector:{status:'ongoing'}
    })
    console.log(docs)
    return docs.docs
  }
  static async getLastOrder(){
    let lastOrder = await db.find({
      selector:{title:'time&orderReset'}
    })
    return lastOrder.docs[0]
  }
  static async timeAndOrderReset(date,resetTime){
    let splitDate = date.split(',').shift()
    let newDate = `${splitDate},${resetTime}`
    // await removeItem(splitDate)
    
    console.log(newDate)
    let isToday = await db.find({
      selector:{title: "time&orderReset",_id:splitDate}
    })
    if(isToday.docs.length>1){
      for(let i=0;i<isToday.docs.length;i++){
        if(isToday.docs[i]._id !== newDate){
          removeItem(isToday.docs[i]._id)
          console.log(isToday.docs[i]._id,'removed')
        }
      }
    }
    console.log('isToday',isToday)
    let isEndDate = newDate>= isToday.endDateTime
    console.log('time doc:',isToday,isEndDate)
    console.log(isToday.docs.length)
    if(isEndDate || isToday.docs.length===0){
      let getDate = new Date(newDate).getDate()
      console.log('getDate',getDate)
      let endDateTime = new Date(newDate).setDate(getDate+1)
        console.log('endDateTime',endDateTime)
      let newDateDoc = await db.put({
        startDateTime : newDate,
        endDateTime : new Date(endDateTime).toLocaleString(),
        _id:splitDate,
        orderNumber:1,
        title:'time&orderReset'
      })
      console.log('new doc is created',newDateDoc)
      if(newDateDoc.ok){
          let oldDateDoc = db.find({
            startDateTime : {'$lt':newDate}
          })
          console.log('old doc')
         await db.remove(oldDateDoc.docs._id)
      }
      console.log('new date doc is',newDateDoc)
      return newDateDoc
    } else{
      return isToday.docs[0]
    }
    // let docs = await db.find({
    //   selector:{orderNumber:{'$gt':null}},
    
    // })
    // console.log(docs)
  }
}

module.exports = OrdersDAO