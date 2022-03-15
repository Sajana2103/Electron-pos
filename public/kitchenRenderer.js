
const { ipcRenderer } = require('electron')

let printItems = document.getElementById('print-items')
let tableNo = document.getElementById('table')
let order = document.getElementById('order')
let isDine = document.getElementById('isDine')
let serverEle = document.getElementById('server')
let startDateAndTime = document.getElementById('order-time')


ipcRenderer.on('bill-window', async (event, arg) => {
  console.table(arg)
  let {  dateAndTime, table, orderNumber,appendedOrder,server, } = arg
  isDine.innerText = table==='takeout'?'TAKE-AWAY' : 'DINE IN'
  order.innerText = `ORDER:${orderNumber}/${appendedOrder}`
  tableNo = table!=='takeout'? `TABLE:${table}` : ''
  serverEle.innerText = server? `Server:${server}` : ''
  startDateAndTime.innerText =dateAndTime[0]? `${dateAndTime[0].split(',').pop()}` : dateAndTime.split(',').pop()
  
  console.log(dateAndTime.split(',').pop())
  arg.data.map((item) => {
    let breakingLine = document.createElement('div')
    let itemParent = document.createElement('div')
    let qty = document.createElement('p')
    let modify  = document.createElement('p')
    let div = document.createElement('div')
    let labelName = document.createElement('div')
    let extras = document.createElement('div')
    let nameAndQty = document.createElement('div')
    breakingLine.innerText = '- - - - - - - - - - - -'
    breakingLine.style.fontWeight = '500'
    
    nameAndQty.style = 'display:grid; grid-template-columns:auto 15%; align-items:center; font-weight:bold;'
 
    qty.className = "big-text bold"
    
    qty.innerText = item.quantity
    qty.style.textAlign = 'center'
    modify.innerText = item.modifications?item.modifications:'-'
    modify.className = "med-text"
    modify.style.fontWeight = "500"
    labelName.className = "big-text"
    labelName.style.fontWeight = 'bold'
    labelName.innerText = `${item.item} - ${item.portion}`
    labelName.style.marginTop = '2px'
    extras.style = "display: grid;grid-template-columns: repeat(2,auto);"
    console.log(item, extras)
    if (item.extras && item.extras.length) {
      item.extras.map((extra, idx) => {
        let extraItem = document.createElement('p')
        extraItem.className = "med-text bold"
        extraItem.innerText = `[${extra.name}]`
        extras.appendChild(extraItem)
        console.log(idx,extra)
      })
    }
    if (!item.extras || !item.extras.length) {
      let extraItem = document.createElement('p')
      extraItem.className = "med-text"
      extraItem.innerText = '[]'
      extras.appendChild(extraItem)
    }
    console.log(extras.toString(),extras)
    // div.innerHTML = (`<p class="small-text" style="margin-top:2px;" >${item.quantity}</p>${extras.toString()}
    //  <p class="small-text" >${item.price * item.quantity}</p>`)
     console.log(div)
     div.appendChild(modify)
     nameAndQty.appendChild(labelName)
     nameAndQty.appendChild(qty)
     itemParent.appendChild(breakingLine)
     itemParent.appendChild(nameAndQty)
     nameAndQty.appendChild(div)
    printItems.appendChild(itemParent)
    printItems.appendChild(extras)

  })
  console.log(arg)
})


console.log('Bill window', printItems)