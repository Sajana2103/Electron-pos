
const { ipcRenderer } = require('electron')
let orderedItems = document.createElement('div')
let printItems = document.getElementById('print-items')
orderedItems.id = 'ordered-items'
let tableNo = document.getElementById('table')
let order = document.getElementById('order')

let startDateAndTime = document.getElementById('start-date-and-time')


ipcRenderer.on('bill-window', async (event, arg) => {
    console.table(arg)
  let { extras, dateAndTime,  table, orderNumber,appendedOrder } = arg
  
  order.innerText = `ORDER:${orderNumber}/${appendedOrder}`

  cashier.innerText = `Server:${user}`
  startDateAndTime.innerText = `Start time:${dateAndTime[0].toString()}|`



  arg.data.map((item) => {
    let itemParent = document.createElement('div')
    let qty = document.createElement('p')
    let price = document.createElement('p')
    let div = document.createElement('div')
    let labelName = document.createElement('div')
    let extras = document.createElement('div')
    qty.className = "tiny-text"
    price.className = "tiny-text"
    qty.innerText = item.quantity
    price.innerText = (item.price * item.quantity)
    
    labelName.innerText = item.item
    div.style = "display: grid;grid-template-columns: 20px 120px 50px;"
    console.log(item, extras)
    if (item.extras && item.extras.length) {
      item.extras.map((extra, idx) => {
        let extraItem = document.createElement('p')
        extraItem.className = "tiny-text"
        extraItem.innerText = `[${extra.name} ${extra.price}]`
        extras.appendChild(extraItem)
        console.log(idx,extra)
      })
    }
    if (!item.extras || !item.extras.length) {
      let extraItem = document.createElement('p')
      extraItem.className = "tiny-text"
      extraItem.innerText = '- - -'
      extras.appendChild(extraItem)
    }
    console.log(extras.toString(),extras)
    // div.innerHTML = (`<p class="small-text" style="margin-top:2px;" >${item.quantity}</p>${extras.toString()}
    //  <p class="small-text" >${item.price * item.quantity}</p>`)
     console.log(div)
     div.appendChild(qty)
     div.appendChild(extras)
     div.appendChild(price)
    itemParent.appendChild(labelName)
    labelName.appendChild(div)
    printItems.appendChild(itemParent)

  })
  console.log(arg)
})


console.log('Bill window', printItems)