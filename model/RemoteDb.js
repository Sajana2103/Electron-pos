const PouchDB = require('pouchdb')

const db = new PouchDB('DB')




const api = process.env.API_URL
// console.log(api)

async function getClient(){

    let client = await db.get('clientInfo')
    // console.log('getClient',client)
    if(client){
        console.log('client',client)
        let remoteDB =`${api}${client.remoteDB}`
        console.log('remoteDB',remoteDB)
        db.replicate.to(remoteDB).on('complete',(data) =>{
            console.log('synced',data)
        }).on('error',(err) => {
            console.log('Error!',err)
        })
    }
}

module.exports = {
    getClient:getClient
}