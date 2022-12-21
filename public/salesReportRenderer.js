
const { ipcRenderer } = require('electron')
let orderedItems = document.createElement('div')
let printItems = document.getElementById('print-items')
let printBody = document.getElementById('print-body')
orderedItems.id = 'ordered-items'
let orderedItemsArray = []
let client = document.getElementById('client-name')
let order = document.getElementById('order')
let bill = document.getElementById('invoice-number')
let cashier = document.getElementById('cashier')
let netTotal = document.getElementById('net-total')
let cash = document.getElementById('cash')
let balanceAmount = document.getElementById('balance')
let startDateAndTime = document.getElementById('start-date-and-time')
let endDateAndTime = document.getElementById('end-date-and-time')
let vatAmount = document.getElementById('vat')
let extrasAmount = document.getElementById('extras')
let discountAmount = document.getElementById('discount')
let serviceChargeAmount = document.getElementById('service-charge')
let subtotalAmount = document.getElementById('sub-total')
let shopAddress = document.getElementById('address')
let shopOpenHours = document.getElementById('openHours')
let shopPhone = document.getElementById('phone')
let shopLogo = document.getElementById('logo')


ipcRenderer.on('bill-window', async (event, arg) => {
  let { subTotal, serviceCharge, extras, 
    vat, discountedTotal, clientName, 
    balance, total, dateAndTime, user, 
    billCloseTime, paidAmount, table, _id,
  logo,address,phone,openHours } = arg

  let dateTimeString = dateAndTime[0]? new Date(dateAndTime[0]).toLocaleString() : new Date(dateAndTime).toLocaleString()
  console.log(dateTimeString,dateAndTime)
  let billCloseDateTimeString =  new Date(billCloseTime).toLocaleString()
  client.innerText = clientName
  shopAddress.innerText = address? address.toString():''
  shopOpenHours.innerText = openHours? `Open-${openHours}`:''
  shopPhone.innerText = phone? `Tel-${phone}`:''
  shopLogo.src = logo? logo:''
  order.innerText = `ORDER:${table==='takeout'?'Take-away':"Dine-in"}`
  bill.innerText = `Invoice #${_id}`
  cashier.innerText = `Cashier:${user}`
  netTotal.innerText = `${total.toString()}`
  
  cash.innerText = table==="takeout" ? `${paidAmount.toString()}` : ''
  balanceAmount.innerText = `${balance.toString()}`
  startDateAndTime.innerText = `Start time:${dateTimeString}|`
  endDateAndTime.innerText = `|End time:${billCloseDateTimeString}`
  if (vat) vatAmount.innerText = `+ Vat:${vat}`
  if (extras) extrasAmount.innerText = `+ Extras:${extras}`
  if (discountedTotal) discountAmount.innerText = `- Discount:${discountedTotal}`
  if (serviceCharge) serviceChargeAmount.innerText = `+ Service-Charge:${serviceCharge}`
  if (subTotal) subtotalAmount.innerText = `Sub-Total:${subTotal}`



  arg.data.map((item) => {
    let itemParent = document.createElement('div')
    let qty = document.createElement('p')
    let price = document.createElement('p')
    let div = document.createElement('div')
    let labelName = document.createElement('div')
    let extras = document.createElement('div')
    qty.className = "med-text bold"
    price.className = "med-text bold"
    qty.innerText = item.quantity
    price.innerText = (item.price * item.quantity)
    
    labelName.innerText = item.item
    div.style = "display: grid;grid-template-columns: 15% 60% 25%;"
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
      extraItem.innerText = '...'
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