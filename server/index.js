const express = require('express')
const app = express()
const http = require('http')
const Pouchdb = require('pouchdb')
const cors = require('cors')
require('dotenv').config()
const server = http.createServer(app)

const PORT = 8080 || process.env.PORT

app.use(express.json());
app.use(express.urlencoded())
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}))
app.get('/',(req,res) =>{
  res.send('Server is running')
})

var remoteCouch = false
let db = new Pouchdb('database') 

const addItem = async (data) => {
  console.log('adding items')
  let item = {
    // _id: new Date().toISOString(),
    title:data.title,
    completed:data.completed
  }
  await db.post(item,(err, result) =>{
    if(result){
      console.log('done', result)
      return(item)
    }
  })
}
addItem({title:'hello',completed:true})
 function showItems(){
   let docs
  db.allDocs({include_docs:true, descending:true})
  .then(result => docs = result.rows)
  return docs
}

app.post('/add-items',(req,res) =>{
  console.log('additems')
  let resp
  try{
  resp = addItem({title:"helloo"})
  console.log(resp)
  if(resp){
    console.log(resp)
    res.status(200).json({success : 'data added'})
  }
  } catch (err){
    console.log('Error',err)
  }
  return res
})

app.get('/docs', (req,res) => {
  
  db.allDocs({include_docs:true, descending:true})
  .then(result =>{res.status(200).json({docs:result})})

  return
})
server.listen(PORT)


// E: The repository 'https://apache.jfrog.io/artifactory/couchdb-deb impish Release' does not have a Release file.
// N: Updating from such a repository can't be done securely, and is therefore disabled by default.
// N: See apt-secure(8) manpage for repository creation and user configuration details.