const PouchDB = require('pouchdb')

const db = new PouchDB('DB')



const api = 'http://52.66.211.153:4000/db/'
//const user = 'lotus-lotus'
// const user = 'someuser1-lotus%20food'

async function getClient() {

    let client = await db.get('clientInfo')
    console.log('getClient', client)
    if (client) {
        // console.log('client',client)
        let remoteDB = `${api}${client.remoteDB}`
        // console.log('remoteDB',remoteDB)
        // await db.replicate.to('http://52.66.211.153:4000/db/lotus-lotus').on('complete', (data) => {
        await db.replicate.to(`${api}${user}`).on('complete', (data) => {

        console.log('synced',data)
        }).on('error', (err) => {
            console.log('Error!', err)
            return
        })
    } else return
}
async function replicateDatabase() {
    try{
        let client = await db.get('clientInfo')
        console.log('getClient', client)
        let remoteDB = `${api}${client.remoteDB}`
        
        console.log('remoteDB', remoteDB)
        // await db.replicate.from('http://52.66.211.153:4000/db/lotus-lotus').on('complete', (data) => {
            await db.replicate.from(`${api}${user}`).on('complete', (data) => {

        console.log('synced', data)
        }).on('error', (err) => {
            console.log('Error!', err)
            return
        })
    } catch (err) {
        console.log('replicaton error',err)
    }

     
}
module.exports = {
    getClient: getClient,
    replicateDatabase: replicateDatabase
}