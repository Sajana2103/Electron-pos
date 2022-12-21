import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allOrders: [],
    filteredOrders: [],
    sortedOrders: [],
    sortedOrdersByDate:{},
    reversed:false,
    timeframe:'',
    sortedTimeFrame:[],
    posUser: null,
    orderHistory:[],
    todayOrders:[],
    dateToday: new Date().toDateString(),
    sortSales : {
       
        totalPerDay:0,
        totalOrders:0
    },
    sortedSales : [],
    cardExpand : false
}
export const sortedByDate = (state) =>{
    // console.log(' sortedByDate fired')
   
    state.sortedOrders.map((order, idx) => {
        let dateToString =  new Date(order.dateAndTime[0]).toDateString()
        let sortedDates = state.sortedOrders.filter((order,id) => {
            let orderdateToString =  new Date(order.dateAndTime[0]).toDateString()
            return dateToString === orderdateToString
        })
        state.sortedOrdersByDate[dateToString] = sortedDates
        // console.log(' sortedByDate done')
    })
}
const reversedSortedByDate = (state) =>{
    // console.log(' sortedByDate fired')
   
    state.sortedOrders.reverse().map((order, idx) => {
        let dateToString =  new Date(order.dateAndTime[0]).toDateString()
        let sortedDates = state.sortedOrders.filter((order,id) => {
            let orderdateToString =  new Date(order.dateAndTime[0]).toDateString()
            return dateToString === orderdateToString
        })
        state.sortedOrdersByDate[dateToString] = sortedDates
        // console.log(' sortedByDate done')
    })
}
const ordersHistorySlice = createSlice({
    name: 'ordersHistory',
    initialState,
    reducers: {
        expandCard(state){
            state.cardExpand = !state.cardExpand
        },
        currentPosUser(state,action){
            if(!action.payload.error){
                state.posUser = action.payload 
            }
            // console.log('currentPosUser',action.payload)
        },
        loadOrders(state, action) {
            state.sortedOrdersByDate ={}
            if(!state.allOrders.length){
                // console.log(action.payload)
                state.allOrders = action.payload
    
                
                state.allOrders.map(orders => state.sortedOrders.push(orders))
                state.sortedOrders.sort((a, b) => {
                    let aDate = Date.parse(a.dateAndTime[0])
                    let bDate = Date.parse(b.dateAndTime[0])
                    return aDate - bDate
                })
                state.sortedOrders.reverse()
            }  
            
            if (state.reversed) {reversedSortedByDate(state); state.reversed = false}
            else sortedByDate(state)
        },
        loadOrdersToday(state,action){
            
        },
        sortOrdersByNo(state, action) {

            if (action.payload === 'order') {
                sortedByDate(state)
                Object.keys(state.sortedOrdersByDate).map((date, id) => {
                    state.sortedOrdersByDate[date]= state.sortedOrdersByDate[date].sort((a,b) => {
                        // console.log('sortOrdersByNo',date)
                        return a.orderNumber - b.orderNumber
                    })
                
                })
            }
        },
        sortOrdersByStatus(state, action) {
            
            if (action.payload) {
                sortedByDate(state)
                // console.log('sort by', action.payload)
                Object.keys(state.sortedOrdersByDate).map((orders, id) => {
                  
                    state.sortedOrdersByDate[orders]= state.sortedOrdersByDate[orders].filter((order) => {
                        
                        return  order.status === action.payload
                        
                    })
                })
            }
        },
        sortOrdersByType(state, action) {
            if (action.payload === 'takeout') {
                // console.log('sort by', action.payload)
                sortedByDate(state)
                Object.keys(state.sortedOrdersByDate).map((orders, id) => {
                    state.sortedOrdersByDate[orders]= state.sortedOrdersByDate[orders].filter((order) => {
                    return order.table === action.payload
                })
            })
            } else {
                // console.log('sort by', action.payload)
                sortedByDate(state)
                Object.keys(state.sortedOrdersByDate).map((orders, id) => {
                    state.sortedOrdersByDate[orders]= state.sortedOrdersByDate[orders].filter((order) => {
                    return order.table !== 'takeout'
                })
            })
            }
        },
        sortOrdersByLatest(state, action) {
            // console.log('sort by ', action.payload)
            state.reversed = true
            state.sortedOrdersByDate ={}
                reversedSortedByDate(state)
            

        },
        sortByLastWeek(state,action){
            state.sortedTimeFrame = []
            if(action.payload.timeFrame==='daily'){
                Object.keys(state.sortedOrdersByDate).map((orders,id) => {
                    if(id>action.payload.timePeriod) {
                        return
                    }
                    state.sortedTimeFrame.push(orders)
                })
                
            }
           
        },
        addOrderToday(state,action){
            console.log('addOrderToday 1',action.payload)
            state.sortedOrdersByDate[0].data.push(action.payload)
            
        },
        sortItemsSales(state,action) {
            let {items} = action.payload
            state.sortSales.totalOrders = 0
            state.sortSales.totalPerDay = 0
            state.sortedSales = []
           
            let itemsSort = {}
            
            items.map((orders) => {
                if (orders.status === 'completed') {
                    state.sortSales.totalPerDay =  state.sortSales.totalPerDay + orders.total
                    state.sortSales.totalOrders++
                    orders.data.map((order) => {
                        if (!itemsSort[order.item]) {
    
                            itemsSort[order.item] = { quantity: order.quantity, price: order.price }
                        } else {
                            itemsSort[order.item].quantity = itemsSort[order.item].quantity + order.quantity
                        }
    
                    })
                }
            })
       
            Object.keys(itemsSort).map(item => {
                state.sortedSales.push({
                    item: item,
                    quantity: itemsSort[item].quantity,
                    price: itemsSort[item].price
                })
                
                
            })
            if(action.payload.sort === 'total'){
                state.sortedSales.sort((a,b) => {
                    return (b.price*b.quantity) - (a.price*a.quantity)
                })
                
            } else if(action.payload.sort==='quantity'){
                state.sortedSales.sort((a, b) => {
                    return b.quantity - a.quantity
                })
                
            }
            state.sortSales.sortBy = null
        }

    }
})

export const {
    expandCard,
    loadOrders,
    sortOrdersByStatus,
    sortOrdersByNo,
    sortOrdersByType,
    sortOrdersByLatest,
    sortByLastWeek,
    currentPosUser,
    addOrderToday,
    sortItemsSales
} = ordersHistorySlice.actions

export default ordersHistorySlice.reducer