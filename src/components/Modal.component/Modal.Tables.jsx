import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { changeModalData, setModalDisplay } from '../../redux/modalSlice'
import { addTable, removeTable,updateTableState } from '../../redux/tablesSlice'

const initialDeleteWarning = { warning: '' }
const initialTableValues = { seats: null, number: null, location: '' }
const initialError = { input: '', error: '' }

const AddTableModal = () => {
    let value = {}
    const dispatch = useDispatch()

    let modal = document.getElementById("modal-main")
    let modalContent = document.getElementById("modal-content")
    window.onclick = function (e) {
        // console.log(e.target)
        if (e.target === modal && e.target !== modalContent) {
            console.log('close modal')
            //     console.log(modal.style.display)
            setUpdateTable(false)
            setDeleteWarning(initialDeleteWarning)
            dispatch(changeModalData({}))
            clearInputs()
            dispatch(setModalDisplay('none'))
            setError(initialError)
            setTableValues(initialTableValues)

        }
    }
    const submitSuccess = () => {
        setUpdateTable(false)
        setDeleteWarning(initialDeleteWarning)
        dispatch(changeModalData({}))
        clearInputs()
        dispatch(setModalDisplay('none'))
        setError(initialError)
        setTableValues(initialTableValues)
    }
    const { modalData } = useSelector(state => state.modal)
    const { addNewTables } = useSelector(state => state.tables)
    const { currentUser } = useSelector(state => state.settings)
    console.log(modalData)
    const [updateTable, setUpdateTable] = useState(false)
    const [deleteWarning, setDeleteWarning] = useState(initialDeleteWarning)
    const [error, setError] = useState(initialError)
    const [tableValues, setTableValues] = useState(initialTableValues)
    const regNumbers = /\D/

    useEffect(() => {
        if (updateTable) {

            document.querySelector("input[name='number']").value = modalData.number ? modalData.number : 'Table number'
            document.querySelector("input[name='seats']").value = modalData.seats ? modalData.seats : 'Table seats'
            document.querySelector("input[name='location']").value = modalData.location ? modalData.location : 'Table location'

        }
    }, [updateTable, modalData])

    const removeItemWithId = () => {

        window.tablesReservations.removeTable(modalData._id).then(res => {
            if (res.ok) {
                dispatch(removeTable(res.id))
                submitSuccess()
            }
        })
    }
    const clearInputs = () => {
        const getInputs = document.getElementsByClassName('tableInputs')
        console.log(getInputs)
        if (getInputs.length && (updateTable || addNewTables)) {

            for (let i = 0; i <= getInputs.length-1; i++) {    
               if(!getInputs[i].value) continue
               else getInputs[i].value  = ''
            }
        } else return
    }
    const submitTable = () => {
        setError(initialError)
        if (!error.error && tableValues.number && tableValues.seats && tableValues.location) {
            console.log('Submit!')
            window.tablesReservations.addNewTable(tableValues).then(data => {
                console.log(data)
                if (data.success) { dispatch(addTable(data.success)); submitSuccess(); }
                else console.log(data.error)

            })


        } else {
            setError({ input: 'submit', error: 'Fields are missing or invalid values.' })
            console.log('No Submit!', regNumbers.exec(tableValues.number))
        }

    }
    const submitUpdate = () => {
        let updateTable = {
            ...modalData,
            number:tableValues.number?tableValues.number:modalData.number,
            seats:tableValues.seats?tableValues.seats:modalData.seats,
            location:tableValues.location?tableValues.location:modalData.location,
            
        }
        console.log(updateTable)
        window.tablesReservations.updateTable(updateTable).then(data => {
            if(data._rev){
                updateTable._rev = data._rev
                dispatch(updateTableState(updateTable))
                submitSuccess()
            } else {
                console.log(data)
            }
        })
    }
    console.log(tableValues)
    const cancelUpdate = () => {
        setUpdateTable(false)
    }
    const onChangeInputs = (e) => {


        if (e.target.name === 'number' || e.target.name === 'seats') {
            let regexCheckInput = regNumbers.exec(e.target.value)

            if (!regexCheckInput) {
                setError(initialError)
                setTableValues(prevState => {
                    value[e.target.name] = e.target.value

                    return { ...prevState, ...value }
                })
            } else setError({ input: 'number', error: 'Only numbers are accepted for No: and Seats:' })
        } else {
            setTableValues(prevState => {

                value[e.target.name] = e.target.value
                return { ...prevState, ...value }
            })
        }

    }

    return (
        <div className='tableForm'>
            {
                addNewTables ?
                    <form>
                        <h3>Add Table</h3>
                        <div className="input-section-box">
                            <label>No :</label>
                            <br />
                            <input onChange={onChangeInputs} name='number' className="inputs btn-color sub-header-btn tableInputs" />
                        </div>
                        <div className="input-section-box">
                            <label >Seats :</label> <br />
                            <input onChange={onChangeInputs} name='seats' className="inputs btn-color sub-header-btn tableInputs" />
                        </div>
                        <div className="input-section-box">
                            <label>Location :</label> <br />
                            <input onChange={onChangeInputs} name='location' className="inputs btn-color sub-header-btn tableInputs" />
                        </div>
                    </form>

                    :
                    <div  >
                        {
                            updateTable ?
                                <div>
                                    <h3>Update Table</h3>
                                    <div className="input-section-box">
                                        <label>No :</label>
                                        <br />
                                        <input name='number' onChange={onChangeInputs} className="inputs btn-color sub-header-btn tableInputs" />
                                    </div>
                                </div>
                                : <h3>Table No : {modalData.number}</h3>

                        }


                        <div className="input-section-box" >
                            <label >Seats : </label>
                            {
                                updateTable ?
                                    <div><input name='seats' onChange={onChangeInputs}  className="inputs btn-color sub-header-btn tableInputs" /></div> :
                                    <span className='strong'>{modalData.seats}</span>
                            }

                        </div>
                        <div className="input-section-box">
                            <label>Location : </label>
                            {
                                updateTable ?
                                    <div><input name='location' onChange={onChangeInputs}  className="inputs btn-color sub-header-btn tableInputs" /></div> :
                                    <span className='strong'>{modalData.location}</span>
                            }
                        </div>
                        <div className="input-section-box">
                            <label>Status : </label>
                            <span className='strong'>{modalData.status}</span>
                        </div>

                        <div className="input-section-box">
                            <label>Customer : </label>
                            <span className='strong'>{modalData.customer}</span>
                        </div>
                        <div className="input-section-box">
                            <label>Order : </label>
                            <span className='strong'>{modalData.currentOrder}</span>
                        </div>
                    </div>
            }
            {
                error.input ?
                    <div className='error' onClick={() => setError(initialError)} style={{ width: 175 }}>{error.error}</div> : <></>
            }
            {
                updateTable && !addNewTables ?
                    <div style={{ justifyContent: "center", display: 'grid' }}>
                        <button onClick={submitUpdate} className='redBtn ' style={{ fontSize: '14px', width: 100, background: 'transparent' }} >UPDATE</button>

                        <button onClick={cancelUpdate} className='redBtn ' style={{ fontSize: '14px', width: 100, background: 'transparent' }} >CANCEL</button>
                    </div> : <></>
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

                        <button onClick={submitTable} className='redBtn ' style={{ fontSize: '14px', width: 100, background: 'transparent' }} >SUBMIT</button>
                    </div> : <></>
            }


            {
                currentUser && currentUser.role === 'admin' && !addNewTables ?

                    <div style={{
                        paddingTop: '10px', paddingBottom: '10px', display: 'grid', justifyContent: 'end',
                        gridTemplateColumns: 'repeat(2,auto)'
                    }}>
                        <img onClick={() => setUpdateTable(true)} className='small-icon' src='edit.png' alt='edit' title='edit-item' />
                        <img onClick={() => setDeleteWarning({ warning: 'This action will permanently delete this item. Are you sure?' })}
                            className='small-icon' src='delete.png' alt='delete' title='delete-item' />

                    </div> : <></>
            }
        </div>
    )
}

export default AddTableModal