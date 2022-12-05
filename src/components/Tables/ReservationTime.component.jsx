import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getReservationTime } from '../../redux/tablesSlice'

const ReservationTime = () => {
    const dispatch = useDispatch()
 
    let dateNow = new Date
    dateNow.setSeconds(0)
    let currentYear = dateNow.getFullYear()
    let currentMonth = dateNow.getMonth()
    let currentDate = dateNow.getDate()
    let currentHour = dateNow.getHours()
    let currentMinute = dateNow.getMinutes()

  

    let week = ['Sun','Mon','Tue','Wed','Thr','Fri','Sat']
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let years = [currentYear,currentYear+1,currentYear+2,currentYear+3]
  
    let hours = Array.from(Array(24).keys())
    let minutes = Array.from(Array(60).keys())

    
    const [dateValues, setDateValues] = useState({
        date:currentDate,month:months[currentMonth],year:currentYear,hour:currentHour,minute:currentMinute})
    const [dates, setDates] = useState([])
    const [error,setError] = useState({error:''})
    let reservationDate = new Date(`${dateValues.month} ${dateValues.date} ${dateValues.year}, ${dateValues.hour}:${dateValues.minute}`)
    
    useEffect(() => {
        calculateDates()
        if(dateNow>reservationDate){
            setError({error:`Invaild Date and Time: Time now is greater than selected time(${dateNow.toLocaleString()}).`})
            dispatch(getReservationTime(null))
        } 
        else {
            setError({error:''})
            dispatch(getReservationTime(reservationDate))
    }
    },[dateValues])

    const calculateDates = () => {
        let days = []
       
        for (let i = 1; i < 34; i++) {
            let date = new Date(`${dateValues.month} ${i} ${dateValues.year}`)

            if ((date.toLocaleString() === 'Invalid Date' || dateValues.month!==months[date.getMonth()])) { break }
            else {
                days.push(date.getDate()) 
            }
        }
        setDates(days)
    }
   
  
 
    return (
        <div>
        <div style={{display:'flex',gap:5}} >
         <div  style={{display:'grid',gridTemplateColumns:'repeat(3,40px)',alignItems:'center'}}>
            <div className="input-section-box" >
                <span className="tablesDropdown font-size-xsmall" style={{ fontSize: 16 }}>
                   <span className='font-small'> {dateValues.month}</span>
                    <div className="dropdownTable" style={{ padding: 5,maxWidth:40  }}>
                        {
                            months.length ?

                                months.map((month, idx) => {
                                  
                                    return (
                                        <div name='date' onClick={() =>{ 
                                            setDateValues(prevState=>{return {...prevState,month:month}})
                                            
                                            }} className="vacantTable font-size-small">
                                            <div name='date' >{month}</div></div>
                                    )
                                }) : <div>---</div>
                        }
                    </div>
                </span>
            </div>
            
            <div className="input-section-box">
                 
                 <span className="tablesDropdown " style={{ fontSize: 16 }}>
                 <span className='font-small'> {dateValues.date}</span>
                     <div className="dropdownTable" style={{ padding: 5,maxWidth:40 }}>
                         {
                             dates.length ?
                                 dates.map((date, idx) => {

                                     return (
                                         <div  onClick={() => setDateValues(prevState=> {return {...prevState,date:date}})} className="vacantTable font-size-small">
                                             <div name='date' >{date}</div></div>
                                     )
                                 }) : <div>---</div>
                         }
                     </div>
                 </span>
             </div>
             <div className="input-section-box">
                 
                 <span className="tablesDropdown " style={{ fontSize: 16 }}>
                 <span className='font-small'> {dateValues.year}</span>
                     <div className="dropdownTable" style={{ padding: 5,maxWidth:40 }}>
                         {
                             years.length ?
                             years.map((year, idx) => {

                                     return (
                                         <div name='date' onClick={() => setDateValues(prevState=> {return {...prevState,year:year}})} className="vacantTable font-size-small">
                                             <div name='date' >{year}</div></div>
                                     )
                                 }) : <div>---</div>
                         }
                     </div>
                 </span>
             </div>
             </div>
             <div  style={{display:'grid',gridTemplateColumns:'repeat(2,40px)',alignItems:'center'}}>
            <div className="input-section-box" >
                <span className="tablesDropdown font-size-xsmall" style={{ fontSize: 16 }}>
                   <span className='font-small'> {dateValues.hour<10?'0':''}{dateValues.hour}</span>
                    <div className="dropdownTable" style={{ padding: 5,maxWidth:40  }}>
                        {
                            hours.length ?

                            hours.map((hour, idx) => {
                                  
                                    return (
                                        <div name='date' onClick={() => setDateValues(prevState=> {return {...prevState,hour:hour}})} className="vacantTable font-size-small">
                                            <div name='date' >{hour<10?'0':''}{hour}</div></div>
                                    )
                                }) : <div>---</div>
                        }
                    </div>
                </span>
            </div>
            
            <div className="input-section-box">
                 
                 <span className="tablesDropdown " style={{ fontSize: 16 }}>
                 <span className='font-small'> {dateValues.minute<10?'0':''}{dateValues.minute}</span>
                     <div className="dropdownTable" style={{ padding: 5,maxWidth:40 }}>
                         {
                             minutes.length ?
                             minutes.map((minute, idx) => {

                                     return (
                                         <div name='date' onClick={() => setDateValues(prevState=> {return {...prevState,minute:minute}})} className="vacantTable font-size-small">
                                             <div name='date' >{minute<10?'0':''}{minute}</div></div>
                                     )
                                 }) : <div>---</div>
                         }
                     </div>
                 </span>
             </div>
        </div>
        <br/>
        </div>
        {
            error.error?
        <div onClick={() => setError({error:''})} className='error' style={{maxWidth:190}}>{error.error}</div>
            : <></>
    }
        </div>
    )
}

export default ReservationTime