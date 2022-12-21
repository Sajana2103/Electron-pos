import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { changeModalData, setModalDisplay } from '../../redux/modalSlice'
import { addReservations, updateReservationState, removeReservation } from '../../redux/tablesSlice'
import ReservationTime from '../Tables/ReservationTime.component'

const initialDeleteWarning = { warning: '' }
const initialReservationValues = {
    _id:null,
    table: null,
    time: null,
    customerName: '',
    contact: '',
    status:'ongoing',
    title:'reservation'
}
const initialError = { input: '', error: '' }

const AddReservationModal = () => {
    let value = {}

    const dispatch = useDispatch()

    let modal = document.getElementById("modal-main")
    let modalContent = document.getElementById("modal-content")
    window.onclick = function (e) {
        // console.log(e.target)
        if (e.target === modal && e.target !== modalContent) {
            // console.log('close modal')
            //     console.log(modal.style.display)
            submitSuccess()
        }
    }
    const submitSuccess = () => {
        setUpdateReservation(false)
        setDeleteWarning(initialDeleteWarning)
        dispatch(changeModalData({}))
        clearInputs()
        dispatch(setModalDisplay('none'))
        setError(initialError)
        setReservationValues(initialReservationValues)
    }
    const { modalData } = useSelector(state => state.modal)
    const { addNewTables, tables } = useSelector(state => state.tables)
    const { currentUser } = useSelector(state => state.settings)
    const { reservationTime } = useSelector(state => state.tables)
    const [updateReservation, setUpdateReservation] = useState(false)
    const [deleteWarning, setDeleteWarning] = useState(initialDeleteWarning)
    const [error, setError] = useState(initialError)
    const [reservationValues, setReservationValues] = useState({ ...initialReservationValues, time: reservationTime })
    const regNumbers = /\D/

    // console.log(reservationValues,reservationTime)
    useEffect(() => {
        if (updateReservation) {
            setReservationValues({
                ...modalData
            })
            // document.querySelector("input[name='time']").value = modalData.time ? modalData.time : ''
            // document.querySelector("input[name='table']").value = modalData.table ? modalData.table : ''
        } else if(reservationTime) setReservationValues(prevState => { return {...prevState,time:reservationTime}})
    }, [updateReservation, modalData,reservationTime])

    const removeItemWithId = () => {

        window.api.removeItem(modalData._id).then(res => {
            // console.log(res)
            if (res.ok) {
                clearInputs()
                dispatch(removeReservation(modalData._id))
                dispatch(setModalDisplay())
                setDeleteWarning({ warning: '' })

            }
        })
    }
    const clearInputs = () => {
        const getInputs = document.getElementsByTagName('input')
        if (getInputs.length) {

            for (let i = 0; i < getInputs.length; i++) {
                // console.log(getInputs[i])
                getInputs[i].value = ''
            }
        }
    }
    const updateCurrentReservation = () => {
        if(error.error) {
            // console.log(error.error);
            setError({ input: '', error: '' })
        }
        if (reservationValues.contact.length < 9) {
            setError({ input: 'contact', error: 'Contact number length is less than 9 digits.' })
            return
        }
        // console.log(reservationValues)
        if (!error.error && reservationValues.table && 
            reservationValues.customerName && reservationValues.contact 
            && reservationValues.time) {
            // console.log('Submit!', reservationValues)
            
           
            window.tablesReservations.updateReservation(reservationValues).then(data => {
                // console.log(data)
                if (data.success) { dispatch(updateReservationState(data.success)); submitSuccess(); }
                else console.log(data.error)

            })


        } else {
            setError({ input: 'submit', error: 'All fields are required.' })
            // console.log('No Submit!', regNumbers.exec(reservationValues.contact))
        }
        
    }
    
    const submit = () => {
        if(error.error) {
            // console.log(error.error);
            setError(initialError);
            // console.log(error.error)
        }
        if (reservationValues.contact.length < 9) {
            setError({ input: 'contact', error: 'Contact number length is less than 9 digits.' })
            return
        }
        // console.log(reservationValues,error.error )
        if (!error.error && reservationValues.table && 
            reservationValues.customerName && reservationValues.contact 
            && reservationValues.time) {
            // console.log('Submit!', reservationValues)
            
            let {time} = reservationValues
            
            let _id = `reservation-${reservationValues.table}-${time.getMonth()}/${time.getDate()}/${time.getFullYear()}-${time.getHours()}:${time.getMinutes()}`
            
           
            window.tablesReservations.addReservation({...reservationValues,_id:_id}).then(data => {
                // console.log(data)
                if (data.success) { dispatch(addReservations(data.success)); submitSuccess(); }
                else console.log(data.error)

            })


        } else {
            setError({ input: 'submit', error: 'All fields are required.' })
            // console.log('No Submit!', regNumbers.exec(reservationValues.number))
        }

    }
    const cancelUpdate = () => {
        setUpdateReservation(false)
    }


    return (
        <div className='tableForm'>
            {
                addNewTables ?
                    <form>
                        <h3>Add Reservation</h3>
                        <div className="input-section-box">

                            <span className="tablesDropdown " style={{ fontSize: 16 }}>{reservationValues.table ? `Table : ${reservationValues.table} ` : 'Select Table :'}
                                <div className="dropdownTable" style={{ padding: 10 }}>
                                    {
                                        tables.length ?
                                            tables.map((table) => {
                                                return (
                                                    <div onClick={() => {
                                                        setReservationValues(prevState => {
                                                            return { ...prevState, table: table.number }
                                                        })

                                                    }} title={`Seats:${table.seats}`} className="vacantTable font-size-small">
                                                        <span>{table.number}</span><span className="font-size-xsmall strong">{table.location}</span></div>
                                                )
                                            }) : <div>---</div>
                                    }
                                </div>
                            </span>
                        </div>

                        <ReservationTime />

                        <div className="input-section-box">
                            <label>Customer :</label> <br />
                            <input maxLength={20} onClick={()=>setError(initialError)} onChange={(e) => setReservationValues(prevState => { return { ...prevState, customerName: e.target.value } })} name='customerName' className="inputs btn-color sub-header-btn" />
                        </div>
                        <div className="input-section-box">
                            <label>Contact :</label> <br />
                            <input minLength={9} onChange={(e) => setReservationValues(prevState => {
                                let isInt = regNumbers.exec(e.target.value)
                                if (!isInt) {
                                    setError(initialError)
                                    return { ...prevState, contact: e.target.value }
                                } else {
                                    setError({ input: 'contact', error: 'Must include numbers only.' })
                                    return { ...prevState }
                                }
                            })} name='contact' className="inputs btn-color sub-header-btn" />
                            {
                                error.input === 'contact' ?
                                    <div className='error' style={{ width: 175, marginLeft: 0 }}>{error.error}</div> : <></>
                            }
                        </div>
                    </form>

                    :
                    <div  >
                        {
                            updateReservation ?
                                <div>
                                    <h3>Update Reservation</h3>
                                    <div className="input-section-box">

                                        <span className="tablesDropdown " style={{ fontSize: 16 }}>{reservationValues.table ? `Table : ${reservationValues.table} ` : `Table : ${modalData.table}`}

                                            <div className="dropdownTable" style={{ padding: 10 }}>
                                                {
                                                    tables.length ?
                                                        tables.map((table) => {
                                                            return (
                                                                <div onClick={() => {
                                                                    setReservationValues(prevState => {
                                                                        return { ...prevState, table: table.number }
                                                                    })

                                                                }} title={`Seats:${table.seats}`} className="vacantTable font-size-small">
                                                                    <span>{table.number}</span><span className="font-size-xsmall strong">{table.location}</span></div>
                                                            )
                                                        }) : <div>---</div>
                                                }
                                            </div>
                                        </span>
                                    </div>
                                </div>
                                : <h3>Table No : {modalData.table}</h3>

                        }


                        <div className="input-section-box" >
                            <label >Time : </label>
                            {
                                updateReservation ?
                                    <div >
                                        <div className='font-small input-section-box'>Reservation Time :
                                            <div className='font-small'> {new Date(modalData.time).toLocaleString()}</div>
                                        </div>

                                        <div className='font-small input-section-box'>Change Time:<ReservationTime /></div>
                                    </div> :
                                    <span className='strong'>{modalData.time ? new Date(modalData.time).toLocaleString() : ''}</span>
                            }

                        </div>

                        <div className="input-section-box">
                            <label>Customer : </label>
                            <span className='strong'>{modalData.customerName}</span>
                        </div>

                        <div className="input-section-box">
                            <label>Contact : </label>
                            <span className='strong'>{modalData.contact}</span>
                        </div>
                    </div>
            }

            {
                updateReservation && !addNewTables ?
                    <div style={{ justifyContent: "center", display: 'grid',}}>
                        <button onClick={updateCurrentReservation} className='redBtn ' style={{ fontSize: '14px', width: 100, background: 'transparent',margin:5 }} >UPDATE</button>

                        <button onClick={cancelUpdate} className='redBtn ' style={{ fontSize: '14px', width: 100, background: 'transparent',margin:5 }} >CANCEL</button>
                    </div> : <></>
            }
            {
                error.input === 'submit' ?
                    <div className='error' style={{ width: 175, }}>{error.error}</div> : <></>
            }
            {
                deleteWarning.warning ?
                    <div >
                        <span className="error" style={{ marginTop: '10px' }}>{deleteWarning.warning}</span>
                        <div style={{ display: 'grid', columnGap: '3px', justifyContent: 'center', gridTemplateColumns: 'repeat(2,auto)', marginTop: '5px' }}>
                            <button onClick={removeItemWithId} className='cancel-action bg-red'>Yes</button>
                            <button onClick={() => {
                                setDeleteWarning({ warning: '' })
                            }} className='do-action bg-grey'>Cancel</button>
                        </div>
                    </div>
                    : <></>
            }
            {
                addNewTables ?
                    <div style={{ justifyContent: "center", display: 'grid' }}>

                        <button onClick={submit} className='redBtn ' style={{ fontSize: '14px', width: 100, background: 'transparent' }} >SUBMIT</button>
                    </div> : <></>
            }


            {
                currentUser && currentUser.role === 'admin' && !addNewTables ?

                    <div style={{
                        paddingTop: '10px', paddingBottom: '10px', display: 'grid', justifyContent: 'end',
                        gridTemplateColumns: 'repeat(2,auto)'
                    }}>
                        {
                            !updateReservation ?
                                <span>

                                    <img onClick={() => setUpdateReservation(true)} className='small-icon' src='edit.png' alt='edit' title='edit-item' />
                                    <img onClick={() => setDeleteWarning({ warning: 'This action will permanently delete this item. Are you sure?' })}
                                        className='small-icon' src='delete.png' alt='delete' title='delete-item' />
                                </span>
                                : <></>
                        }

                    </div> : <></>
            }
        </div>
    )
}

export default AddReservationModal