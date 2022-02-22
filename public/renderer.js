
const {ipcRenderer} = require('electron')
const { text } = require('express')
 let orderedItems = document.createElement('div')
 let printItems = document.getElementById('print-items')
 orderedItems.id = 'ordered-items'
  let orderedItemsArray= []
ipcRenderer.on('bill-window',async (event,arg) => {
 arg.data.map((item) => {
   
  let div = document.createElement('div')
  let br = document.createElement('br')
  div.style= "display: grid;grid-template-columns: 30px 100px 60px;"
 div.innerHTML = (`<p>${item.quantity}</p><p>${item.item}</p>
     <p>${item.price*item.quantity}</p>`)
 
  printItems.appendChild(div)
  
  })
  console.log(arg)
})


console.log('Bill window',printItems)