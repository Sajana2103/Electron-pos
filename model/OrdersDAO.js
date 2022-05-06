const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = require('./pouchdb')
const {getClient} = require('./RemoteDb')


async function changeOrderTime(){
  let {docs} = await db.find({
      selector:{title:'order'}
  })
  console.log('changeOrderTime',docs)
  let doc = await db.get('05042022-1409-5')
  let time = new Date(doc.billCloseTime).setMonth(0)
  
  let setTime = new Date(time)
  console.log('changeOrderTime doc',doc.billCloseTime,setTime)

}
changeOrderTime()

function create_id(orderDate, orderNumber) {
  let [date, time] = orderDate.split(',')
  let newDate = date.replace(/\D/g, '')
  let newTime = time.substring(0, time.length - 3).replace(/\D/g, '')
  let _id = `${newDate}-${newTime}-${orderNumber}`

  return _id
}
async function removeItem(_id) {
  try {

    let doc = await db.get(_id)
    let removeItem = await db.remove(doc)
    console.log('item removed', removeItem)
    return removeItem
  } catch (error) {
    return error
  }
}

async function createItem(_id) {
  console.log(doc)
  try {

    let doc = await db.put({
      _id: _id,
      data: '1111'
    })
    console.log(doc)

  } catch (error) {
    return error
  }
}





class OrdersDAO {
  static async createOrder(data) {
    console.log(data)
    let _id = ''
    let doc
    try {
      if (!data._id) {
        let dateTimeLocale = new Date(data.dateAndTime[0]).toLocaleString()
        _id = create_id(dateTimeLocale, data.orderNumber).toString()
        doc = await db.put({
          _id, ...data
        })
        let timeDoc_id = dateTimeLocale.split(',').shift()
        let lastOrderDoc = await db.get('timeAndOrderReset')
        console.log('lastOrderDoc', lastOrderDoc, timeDoc_id)
        await db.put({
          ...lastOrderDoc,
          orderNumber: lastOrderDoc.orderNumber + 1,
          _id: lastOrderDoc._id,
          _rev: lastOrderDoc._rev
        })
        console.log(lastOrderDoc)
        getClient()
        return { ...data, _id: _id }
      } else if (data._id) {
        console.log('Data._id')
        doc = await db.get(data._id)
        console.log('Data._id', doc)
        let { dateAndTime, orderNumber } = doc
        console.log('Data._id', dateAndTime, orderNumber)
        doc = await db.put({
          ...doc,
          _id: doc._id,
          appendedOrder: data.appendedOrder,
          _rev: doc._rev,
          dateAndTime: [...dateAndTime, data.dateAndTime],
          data: doc.data.concat(data.data),

        })
        console.log('Data._id doc', doc)
        console.log('data', data)
        getClient()
        return { ...data, orderNumber: orderNumber }
      }
    } catch (error) {
      console.log('CREATE ORDER ERROR:', error)
      return { error: error }
    }

    console.log(doc)
    // if(res.ok){
    //   return ({..._id,data})
    // }
  }
  static async completeOrCancelOrder(order) {
    console.log('complete or cancel', order)
    if (order.status === 'completed' || order.status === 'canceled' || order.status === 'onhold') {
      try {

        let doc = await db.get(order._id)
        console.log('complete or cancel doc', doc)
        let updateStatus = db.put({
          _id: doc._id,
          _rev: doc._rev,
          ...order
        })
        console.log('complete or cancel updateStatus', updateStatus)
        getClient()
        return { ok: updateStatus, _id: doc._id }
      } catch (error) {
        console.log('complete or cancel error', error)
        return { error: error }
      }
    }

  }
  static async removeOrder(_id) {
    let doc = await db.get(_id)

    let removeItem = await db.put({
      ...doc,
      _id:doc._id,
      _rev:doc._rev,
      status:'cancelled',
    })
    getClient()
    console.log('item removed', removeItem)
    return removeItem
  }

  static async getOngoingOrders() {

    let docs = await db.find({
      selector: { status: 'ongoing' }
    })
    // console.log(docs)
    return docs.docs
  }
  static async getLastOrder() {
    let lastOrder = await db.get(timeAndOrderReset)
    return lastOrder.orderNumber
  }

  static async timeAndOrderReset(start, end) {
    console.log('try timeAndOrderReset')
    let isToday
    isToday = await db.get("timeAndOrderReset")
    // console.log(isToday)
      if(isToday.error) {
        console.log('no time doc found. creating new doc')
        let createDate = {
          
          _id: 'timeAndOrderReset',
          startTime: start,
          endTime: end,
          orderNumber: 1
          
        }
         db.put(createDate,(err,doc) =>{

          //  console.log('created a new time doc', createDate)
           if (doc.ok) return createDate
        })
      }
    
    
    // console.log('doc exists',isToday)
    let endTime = new Date(isToday.endTime)
    let timeNow = new Date()
  
    // console.log(timeNow, end, end >= timeNow)

    try {
      if (endTime <= timeNow) {
        console.log('time doc found. creating new doc', endTime, timeNow)
        let newDate = await db.put({
          _id: isToday._id,
          _rev: isToday._rev,
          startTime: start,
          endTime: end,
          orderNumber: 1
        })
        if (newDate.ok) { return newDate }
      } else { return {...isToday}}
    } catch (error) {
      return { error: error }
    }

  }

}

module.exports = OrdersDAO