import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setModal } from '../store/slices/modalSlice';
import { useAddDeviceMutation, useDeleteDeviceMutation, useEditDeviceMutation } from '../store/slices/apiSlice';
import { objectEquality } from '../utils/objectEquality';

export default function DevicesDataModal({ modalData }) {
  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)

  const [listPickerOpen, setListPickerOpen] = useState(false)

  const [addDevice, resultAddDevice] = useAddDeviceMutation()
  const [deleteDevice, resultDeleteDevice] = useDeleteDeviceMutation()
  const [editDevice, resultEditDevice] = useEditDeviceMutation()

  const [newDeviceName, setNewDeviceName] = useState("")
  const [newDeviceType, setNewDeviceType] = useState("")
  const [newDeviceModel, setNewDeviceModel] = useState("")
  const [newDeviceSn, setNewDeviceSn] = useState("")
  const [newDeviceComment, setNewDeviceComment] = useState("")
  const [newDeviceCategory, setNewDeviceCategory] = useState("personal")

  const [editMode, setEditMode] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)

  const selectList = list => {
    setNewDeviceCategory(list)
    setListPickerOpen(false)
  }

  const trimInputs = () => {
    setNewDeviceName(newDeviceName => newDeviceName.trim())
    setNewDeviceType(newDeviceType => newDeviceType.trim())
    setNewDeviceModel(newDeviceModel => newDeviceModel.trim())
    setNewDeviceSn(newDeviceSn => newDeviceSn.trim())
    setNewDeviceComment(newDeviceComment => newDeviceComment.trim())
    setNewDeviceCategory(newDeviceCategory => newDeviceCategory.trim())
  }

  const addDeviceFn = async (e) => {
    e.preventDefault()

    if (resultAddDevice.isLoading) {
      return
    }

    if (newDeviceName.trim() === "") {
      return
    }

    const device = {
      name: newDeviceName.trim(),
      type: newDeviceType.trim(),
      model: newDeviceModel.trim(),
      sn: newDeviceSn.trim(),
      comment: newDeviceComment.trim(),
      category: newDeviceCategory.trim(),
    }

    await addDevice({ ...device, userId: modalData.userId })
    dispatch(setModal({ active: false, data: {} }))

    /* timeout-refetch */
    /* setTimeout(() => {
      dispatch(setModal({ active: false, data: {} }))
    }, 400) */
  }

  const deleteDeviceFn = async (e, device) => {
    e.preventDefault()

    if (resultDeleteDevice.isLoading) {
      return
    }

    await deleteDevice(device)
    dispatch(setModal({ active: false, data: {} }))

    /* timeout-refetch */
    /*  setTimeout(() => {
       dispatch(setModal({ active: false, data: {} }))
     }, 400) */
  }

  const editModeFN = () => {
    setNewDeviceName(modalData?.name)
    setNewDeviceType(modalData?.type)
    setNewDeviceModel(modalData?.model)
    setNewDeviceSn(modalData?.sn)
    setNewDeviceComment(modalData?.comment)
    setNewDeviceCategory(modalData?.category)
    setEditMode(true)
  }

  const editDeviceFn = async (e, device) => {
    e.preventDefault()

    if (resultEditDevice.isLoading) {
      return
    }

    if (newDeviceName.trim() === "") {
      return
    }

    const newDevice = {
      name: newDeviceName.trim(),
      type: newDeviceType.trim(),
      model: newDeviceModel.trim(),
      sn: newDeviceSn.trim(),
      comment: newDeviceComment.trim(),
      category: newDeviceCategory.trim(),
      id: device.id,
      userId: device.userId
    }

    const { deviceData, createdAt, updatedAt, ...oldDevice } = device
    const deviceEquality = objectEquality(oldDevice, newDevice)

    if (deviceEquality) {
      dispatch(setModal({ active: false, data: {} }))
      return
    } else {
      await editDevice({ ...newDevice, userId: modalData.userId })
      dispatch(setModal({ active: false, data: {} }))

      /* timeout-refetch */
      /*  setTimeout(() => {
         dispatch(setModal({ active: false, data: {} }))
       }, 400) */
    }
  }

  const preventEnterSubmit = (e) => {
    if (e.key === "Enter" && e.target.className !== "mainModal__send" && e.target.tagName !== "TEXTAREA" && e.target.ariaLabel !== "textarea") {
      e.preventDefault()
    }
  }

  useEffect(() => {
    if (!modalActive) {
      setNewDeviceName("")
      setNewDeviceType("")
      setNewDeviceModel("")
      setNewDeviceSn("")
      setNewDeviceComment("")
      setNewDeviceCategory("personal")
      setListPickerOpen(false)
      setEditMode(false)
      setDeleteMode(false)
    }
  }, [modalActive])


  return (
    <>
      {modalData?.deviceData && !editMode && !deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>DEVICE</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer">
              {
                <button tabIndex={-1} className={`listPicker disabled`} >{modalData?.category === "company" ? "Company" : "Personal"}</button>
              }
            </div>
          </div>
          <form className='mainModal__data__form disabled'>
            <div className="form-group">
              <fieldset>
                <legend>Name</legend>
                <input placeholder='Required' readOnly disabled spellCheck={false} type="text" value={modalData?.name || "-"} />
              </fieldset>
              <fieldset>
                <legend>Type</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.type || "-"} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Model</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.model || "-"} />
              </fieldset>
              <fieldset>
                <legend>Serial Number</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.sn || "-"} />
              </fieldset>
            </div>

            {/* <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.area || "-"} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select readOnly disabled >
                  <option readOnly disabled value="" selected={modalData?.location === ""} >-</option>
                  <option readOnly disabled value="SS" selected={modalData?.location === "SS"}>SS</option>
                  <option readOnly disabled value="PB" selected={modalData?.location === "PB"}>PB</option>
                  <option readOnly disabled value="1P" selected={modalData?.location === "1P"}>1P</option>
                  <option readOnly disabled value="4P" selected={modalData?.location === "4P"}>4P</option>
                </select>
              </fieldset>
            </div> */}

            <div className="form-group">
              <fieldset>
                <legend>Comment</legend>
                <textarea readOnly disabled spellCheck={false} rows="2" value={modalData?.comment || "-"} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => editModeFN()}>Edit</button>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(true)}>Delete</button>
            </div>
          </form>
        </>
      }

      {modalData?.deviceData && editMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>EDIT DEVICE</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer editMode">
              {
                <button disabled={resultEditDevice.isLoading} className={`listPicker ${listPickerOpen && "selected"} ${resultEditDevice.isLoading && "disabled"}`} onClick={() => listPickerOpen ? selectList(newDeviceCategory === "personal" ? "personal" : "company") : setListPickerOpen(true)}>{newDeviceCategory === "personal" ? "Personal" : "Company"}</button>
              }
              {
                listPickerOpen &&
                <div className="listPickerOptions">
                  <button className={`listPicker`}
                    onClick={() => {
                      selectList("personal")
                    }}>
                    Personal
                  </button>
                  <button className={`listPicker`}
                    onClick={() => {
                      selectList("company")
                    }}>
                    Company
                  </button>
                </div>
              }
            </div>
          </div>
          <form className='mainModal__data__form editMode' disabled={resultEditDevice.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => editDeviceFn(e, modalData)} >
            <div className="form-group">
              <fieldset>
                <legend>Name</legend>
                <input placeholder='Required' spellCheck={false} type="text" value={newDeviceName} onChange={e => setNewDeviceName(e.target.value)} maxLength={200} required />
              </fieldset>
              <fieldset>
                <legend>Type</legend>
                <input spellCheck={false} type="text" value={newDeviceType} onChange={e => setNewDeviceType(e.target.value)} maxLength={200} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Model</legend>
                <input spellCheck={false} type="text" value={newDeviceModel} onChange={e => setNewDeviceModel(e.target.value)} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend>Serial Number</legend>
                <input spellCheck={false} type="text" value={newDeviceSn} onChange={e => setNewDeviceSn(e.target.value)} maxLength={200} />
              </fieldset>
            </div>

            {/* <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input spellCheck={false} type="text" value={newDeviceArea} onChange={e => setNewDeviceArea(e.target.value)} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select onChange={e => setNewDeviceLocation(e.target.value)} className={newDeviceLocation === "" && "empty-select"}>
                  <option value="" selected={modalData?.location === ""} className='empty-select'></option>
                  <option value="SS" selected={modalData?.location === "SS"}>SS</option>
                  <option value="PB" selected={modalData?.location === "PB"}>PB</option>
                  <option value="1P" selected={modalData?.location === "1P"}>1P</option>
                  <option value="4P" selected={modalData?.location === "4P"}>4P</option>
                </select>
              </fieldset>
            </div> */}

            <div className="form-group">
              <fieldset>
                <legend>Comment</legend>
                <textarea spellCheck={false} rows="2" value={newDeviceComment} onChange={e => setNewDeviceComment(e.target.value)} maxLength={500} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setEditMode(false)}>Cancel</button>
              <button className='mainModal__send' onClick={trimInputs}>Confirm</button>
            </div>
          </form>
        </>
      }

      {modalData?.deviceData && deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>DELETE DEVICE</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer deleteMode">
              {
                <button tabIndex={-1} disabled={resultDeleteDevice.isLoading} className={`listPicker disabled`}>{modalData?.category === "personal" ? "Personal" : "Company"}</button>
              }
            </div>
          </div>
          <form className='mainModal__data__form deleteMode disabled' disabled={resultDeleteDevice.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => deleteDeviceFn(e, modalData)}>
            <div className="form-group">
              <fieldset>
                <legend>Name</legend>
                <input placeholder='Required' readOnly disabled spellCheck={false} type="text" value={modalData?.name || "-"} />
              </fieldset>
              <fieldset>
                <legend>Type</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.type || "-"} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Model</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.model || "-"} />
              </fieldset>
              <fieldset>
                <legend>Serial Number</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.sn || "-"} />
              </fieldset>
            </div>

            {/* <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.area || "-"} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select readOnly disabled >
                  <option readOnly disabled value="" selected={modalData?.location === ""} >-</option>
                  <option readOnly disabled value="SS" selected={modalData?.location === "SS"}>SS</option>
                  <option readOnly disabled value="PB" selected={modalData?.location === "PB"}>PB</option>
                  <option readOnly disabled value="1P" selected={modalData?.location === "1P"}>1P</option>
                  <option readOnly disabled value="4P" selected={modalData?.location === "4P"}>4P</option>
                </select>
              </fieldset>
            </div> */}

            <div className="form-group">
              <fieldset>
                <legend>Comment</legend>
                <textarea readOnly disabled spellCheck={false} rows="2" value={modalData?.comment || "-"} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(false)}>Cancel</button>
              <button className='mainModal__send' onClick={trimInputs}>Confirm</button>
            </div>
          </form>
        </>
      }

      {modalData?.newDevice &&
        <>
          <div className="mainModal__titleContainer">
            <h2>ADD DEVICE</h2>
            <div className="listPickerWrapper__btnContainer">
              {
                <button disabled={resultAddDevice.isLoading} className={`listPicker ${listPickerOpen && "selected"} ${resultAddDevice.isLoading && "disabled"}`} onClick={() => listPickerOpen ? selectList(newDeviceCategory === "personal" ? "personal" : "company") : setListPickerOpen(true)}>{newDeviceCategory === "personal" ? "Personal" : "Company"}</button>
              }
              {
                listPickerOpen &&
                <div className="listPickerOptions">
                  <button className={`listPicker`}
                    onClick={() => {
                      selectList("personal")
                    }}>
                    Personal
                  </button>
                  <button className={`listPicker`}
                    onClick={() => {
                      selectList("company")
                    }}>
                    Company
                  </button>
                </div>
              }
            </div>
          </div>
          <form className='mainModal__data__form' disabled={resultAddDevice.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => addDeviceFn(e)}>
            <div className="form-group">
              <fieldset>
                <legend>Name</legend>
                <input placeholder='Required' spellCheck={false} type="text" value={newDeviceName} onChange={e => setNewDeviceName(e.target.value)} maxLength={200} required />
              </fieldset>
              <fieldset>
                <legend>Type</legend>
                <input spellCheck={false} type="text" value={newDeviceType} onChange={e => setNewDeviceType(e.target.value)} maxLength={200} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Model</legend>
                <input spellCheck={false} type="text" value={newDeviceModel} onChange={e => setNewDeviceModel(e.target.value)} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend>Serial Number</legend>
                <input spellCheck={false} type="text" value={newDeviceSn} onChange={e => setNewDeviceSn(e.target.value)} maxLength={200} />
              </fieldset>
            </div>

            {/* <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input spellCheck={false} type="text" value={newDeviceArea} onChange={e => setNewDeviceArea(e.target.value)} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select onChange={e => setNewDeviceLocation(e.target.value)} className={newDeviceLocation === "" && "empty-select"}>
                  <option value="Location" selected className='empty-select'></option>
                  <option value="SS">SS</option>
                  <option value="PB">PB</option>
                  <option value="1P">1P</option>
                  <option value="4P">4P</option>
                </select>
              </fieldset>
            </div> */}

            <div className="form-group">
              <fieldset>
                <legend>Comment</legend>
                <textarea spellCheck={false} rows="2" value={newDeviceComment} onChange={e => setNewDeviceComment(e.target.value)} maxLength={500} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button className='mainModal__send' onClick={trimInputs}>Send</button>
            </div>
          </form>
        </>
      }
    </>
  )
}
