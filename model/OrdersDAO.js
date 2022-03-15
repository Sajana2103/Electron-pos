const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))


let db = new PouchDB('pos-orders')
let remoteDB = 'http://localhost:4000/db/database-server'

const date = new Date();
const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
const [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];

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
// db.put({
//     _id:'111',
//     data:'hello'
//   })

async function createItem(_id) {
  console.log(doc)
  try {

    let doc = await db.put({
      _id: _id,
      data: '1111'
    })
    console.log(doc)
    // return
    // let removeItem = await db.remove(doc)
    // console.log('item removed',removeItem)
    // return removeItem
  } catch (error) {
    return error
  }
}

// createItem('111')
// removeItem('111')
class OrdersDAO {
  static async createOrder(data) {
    console.log(data)
    let _id = ''
    let doc
    try {
      if (!data._id) {
        _id = create_id(data.dateAndTime[0], data.orderNumber).toString()
        doc = await db.put({
          _id, ...data
        })
        let timeDoc_id = data.dateAndTime[0].split(',').shift()
        let lastOrderDoc = await db.get('timeAndOrderReset')
        console.log('lastOrderDoc', lastOrderDoc, timeDoc_id)
        await db.put({
          ...lastOrderDoc,
          orderNumber: lastOrderDoc.orderNumber + 1,
          _id: lastOrderDoc._id,
          _rev: lastOrderDoc._rev
        })
        console.log(lastOrderDoc)
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
        return { ok: updateStatus, _id: doc._id }
      } catch (error) {
        console.log('complete or cancel error', error)
        return { error: error }
      }
    }

  }
  static async removeOrder(_id) {
    let doc = await db.get(_id)
    let removeItem = await db.remove(doc)
    console.log('item removed', removeItem)
    return removeItem
  }

  static async getOngoingOrders() {

    let docs = await db.find({
      selector: { status: 'ongoing' }
    })
    console.log(docs)
    return docs.docs
  }
  static async getLastOrder() {
    let lastOrder = await db.get(timeAndOrderReset)
    return lastOrder.orderNumber
  }

  static async timeAndOrderReset(start, end) {
    let isToday
    let timeNow = new Date()
    console.log(timeNow, end, end >= timeNow)

    try {
      console.log('try timeAndOrderReset')
      isToday = await db.get("timeAndOrderReset")
      let endTime = new Date(isToday.endtime)
      console.log(isToday.endtime < timeNow,isToday,endTime<timeNow)
      if (!isToday) {
        console.log('no time doc found. creating new doc')
        let createDate = {
          
            _id: 'timeAndOrderReset',
            startTime: start,
            endTime: end,
            orderNumber: 1
          
        }
        let res = await db.put(createDate)
        console.log('created a new time doc', createDate)
        if (res.ok) return { ...createDate }
      }
      if (endTime <= timeNow) {
        console.log('time doc found. creating new doc', isToday.endTime, timeNow)
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