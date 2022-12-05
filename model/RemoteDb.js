const PouchDB = require('pouchdb')

const db = new PouchDB('DB')




const api = 'http://localhost:4000/db/'
// console.log(api)

async function getClient(){

    let client = await db.get('clientInfo')
    console.log('getClient',client)
    if(client){
        // console.log('client',client)
        let remoteDB =`${api}${client.remoteDB}`
        // console.log('remoteDB',remoteDB)
        db.replicate.to(remoteDB).on('complete',(data) =>{
            // console.log('synced',data)
        }).on('error',(err) => {
            console.log('Error!',err)
            return
        })
    } else return
}
async function replicateDatabase(){
    let client = await db.get('clientInfo')
    console.log('getClient',client)
    if(client){
        console.log('client',client)
        let remoteDB =`${api}${client.remoteDB}`
    db.sync(remoteDB).on('complete',(data) =>{
        console.log('synced',data)
    }).on('error',(err) => {
        console.log('Error!',err)
        return
    })
} else return
}
module.exports = {
    getClient:getClient,
    replicateDatabase:replicateDatabase
}