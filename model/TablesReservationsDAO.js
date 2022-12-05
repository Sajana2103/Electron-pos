const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = require('./pouchdb')
const { getClient } = require('./RemoteDb')

class TablesReservations{
    static async addNewTable(data){
        console.log('add table',data)
       
        let newTable = {   
          title:'tables',
          number:data.number,
          seats:data.seats,
          location:data.location,
          status:'Vacant',
          customer:'',
          server:'',
          currentOrder:null
        }
        try{
    
          let res = await db.post(newTable)
          if(res.ok){
            newTable._id = res.id
            newTable._rev = res.rev
            console.log(newTable)
            return {success:newTable}
        
          }
        } catch(error){
          console.log('add table',error)
        }
      }
      static async updateTable(data){
          console.log('update table',data)
          try{
            
            let response = await db.put(data)
            console.log(response)
            if(response.ok) return {_rev:response.rev}
          } catch(error){
              console.log('table update',error)
              return {error:error}
          }
      }
      static async removeTable(data){
        try{
          let doc = await db.get(data)
          let res = await db.remove(doc)
          console.log('table removed',res)
            return res
        } catch(error){
          console.log('remove',error)
          return {error : error}
        }
    
      }
    static async getAllTables(){
      try{
        let res = await db.find({
          selector:{title:'tables'}
        })
        if(res) return res.docs
      } catch (error){
        console.log(error)
        return {error:error}
      }
    }

    static async loadReservations(){
      try{
        let docs= await db.find({
          selector:{status:'ongoing',title:'reservation'}
        })
        console.log('load reservations',docs.docs)
        if(docs.docs.length) return docs.docs
        else return []
      } catch(error){
        console.log('load reservation',error)
        return {error:error}
      }
    }

    static async addReservation(reservation){
      console.log('addReservation',reservation)
 
      try{
        let res = await db.put(reservation)
        if(res.ok){
          let reservationData = {
            ...reservation,
            _rev:res.rev,
          }
          return {success:reservationData}
        }
      }catch(error){
        console.log('add reservation',error)
        return {error:error}
      }
    }
    static async updateReservation(data){
      console.log('updateReservation',data)
      try{
        let doc = await db.get(data._id)
        let res = await db.put({
          ...doc,
          status:data.status
        })
        
        if(res.ok)  {
          let reservationData = {
            ...data,
            _rev:res.rev
          }
          console.log('updateReservation',reservationData)
          return {success:reservationData}}
       
      } catch(error){
        console.log('update Reservation',error)
        return {error:error}
      }
    }
}

module.exports = TablesReservations