import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setModal } from '../store/slices/modalSlice';
import { useAddDeviceCompanyMutation, useDeleteDeviceCompanyMutation, useEditDeviceCompanyMutation, useAddDeviceMutation, useDeleteDeviceMutation, useEditDeviceMutation } from '../store/slices/apiSlice';
import { objectEquality } from '../utils/objectEquality';

export default function DevicesDataModal({ modalData }) {
  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)

  const [listPickerOpen, setListPickerOpen] = useState(false)

  const [addDeviceCompany, resultAddDeviceCompany] = useAddDeviceCompanyMutation()
  const [deleteDeviceCompany, resultDeleteDeviceCompany] = useDeleteDeviceCompanyMutation()
  const [editDeviceCompany, resultEditDeviceCompany] = useEditDeviceCompanyMutation()

  const [addDevice, resultAddDevice] = useAddDeviceMutation()
  const [deleteDevice, resultDeleteDevice] = useDeleteDeviceMutation()
  const [editDevice, resultEditDevice] = useEditDeviceMutation()

  const [newDeviceName, setNewDeviceName] = useState("")
  const [newDeviceArea, setNewDeviceArea] = useState("")
  const [newDeviceLocation, setNewDeviceLocation] = useState("")
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

  const addDeviceFn = async (e) => {
    e.preventDefault()
    const device = {
      name: newDeviceName.trim(),
      type: newDeviceType.trim(),
      model: newDeviceModel.trim(),
      sn: newDeviceSn.trim(),
      area: newDeviceArea.trim(),
      location: newDeviceLocation.trim(),
      comment: newDeviceComment.trim(),
      category: newDeviceCategory.trim(),
    }

    await addDevice({ ...device, userId: modalData.userId })

    dispatch(setModal({ active: false, data: {} }))
  }

  const deleteDeviceFn = async (device) => {
    await deleteDevice(device)

    dispatch(setModal({ active: false, data: {} }))
  }

  const editModeFN = () => {
    setNewDeviceName(modalData?.name)
    setNewDeviceType(modalData?.type)
    setNewDeviceModel(modalData?.model)
    setNewDeviceSn(modalData?.sn)
    setNewDeviceArea(modalData?.area)
    setNewDeviceLocation(modalData?.location)
    setNewDeviceComment(modalData?.comment)
    setNewDeviceCategory(modalData?.category)
    setEditMode(true)
  }

  const editDeviceFn = async (e, device) => {
    e.preventDefault()
    const newDevice = {
      name: newDeviceName.trim(),
      type: newDeviceType.trim(),
      model: newDeviceModel.trim(),
      sn: newDeviceSn.trim(),
      area: newDeviceArea.trim(),
      location: newDeviceLocation.trim(),
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
    }
  }

  useEffect(() => {
    if (!modalActive) {
      setNewDeviceName("")
      setNewDeviceType("")
      setNewDeviceModel("")
      setNewDeviceSn("")
      setNewDeviceArea("")
      setNewDeviceLocation("")
      setNewDeviceComment("")
      setNewDeviceCategory(modalData?.listSelected == "all" ? "personal" : modalData?.listSelected)
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
                <input readOnly disabled spellCheck={false} type="text" title="Name" value={modalData?.name || "-"} />
              </fieldset>
              <fieldset>
                <legend>Type</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Type" value={modalData?.type || "-"} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Model</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Model" value={modalData?.model || "-"} />
              </fieldset>
              <fieldset>
                <legend>Serial Number</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Serial Number" value={modalData?.sn || "-"} />
              </fieldset>
            </div>

            {/* <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Area" value={modalData?.area || "-"} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select readOnly disabled title="Location" >
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
                <textarea readOnly disabled spellCheck={false} rows="2" title="Comment" value={modalData?.comment || "-"} />
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
          <form className='mainModal__data__form editMode' onSubmit={(e) => editDeviceFn(e, modalData)} disabled={resultEditDevice.isLoading}>
            <div className="form-group">
              <fieldset>
                <legend>Name</legend>
                <input spellCheck={false} type="text" title="Name" value={newDeviceName} onChange={e => setNewDeviceName(e.target.value.trimStart())} maxLength={200} required />
              </fieldset>
              <fieldset>
                <legend>Type</legend>
                <input spellCheck={false} type="text" title="Type" value={newDeviceType} onChange={e => setNewDeviceType(e.target.value.trimStart())} maxLength={200} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Model</legend>
                <input spellCheck={false} type="text" title="Model" value={newDeviceModel} onChange={e => setNewDeviceModel(e.target.value.trimStart())} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend>Serial Number</legend>
                <input spellCheck={false} type="text" title="Serial Number" value={newDeviceSn} onChange={e => setNewDeviceSn(e.target.value.trimStart())} maxLength={200} />
              </fieldset>
            </div>

            {/* <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input spellCheck={false} type="text" title="Area" value={newDeviceArea} onChange={e => setNewDeviceArea(e.target.value.trimStart())} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select onChange={e => setNewDeviceLocation(e.target.value.trimStart())} title="Location" className={newDeviceLocation === "" && "empty-select"}>
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
                <textarea spellCheck={false} rows="2" title="Comment" value={newDeviceComment} onChange={e => setNewDeviceComment(e.target.value.trimStart())} maxLength={500} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setEditMode(false)}>Cancel</button>
              <button className='mainModal__send' >Confirm</button>
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
                <button disabled={resultDeleteDevice.isLoading} className={`listPicker disabled`}>{modalData?.category === "personal" ? "Personal" : "Company"}</button>
              }
            </div>
          </div>
          <form className='mainModal__data__form deleteMode disabled' disabled={resultDeleteDevice.isLoading}>
            <div className="form-group">
              <fieldset>
                <legend>Name</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Name" value={modalData?.name || "-"} />
              </fieldset>
              <fieldset>
                <legend>Type</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Type" value={modalData?.type || "-"} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Model</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Model" value={modalData?.model || "-"} />
              </fieldset>
              <fieldset>
                <legend>Serial Number</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Serial Number" value={modalData?.sn || "-"} />
              </fieldset>
            </div>

            {/* <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input readOnly disabled spellCheck={false} type="text" title="Area" value={modalData?.area || "-"} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select readOnly disabled title="Location" >
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
                <textarea readOnly disabled spellCheck={false} rows="2" title="Comment" value={modalData?.comment || "-"} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(false)}>Cancel</button>
              <button type='button' className='mainModal__send' onClick={() => deleteDeviceFn(modalData)}>Confirm</button>
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
          <form className='mainModal__data__form' onSubmit={(e) => addDeviceFn(e)} disabled={resultAddDevice.isLoading}>
            <div className="form-group">
              <fieldset>
                <legend>Name</legend>
                <input spellCheck={false} type="text" title="Name" value={newDeviceName} onChange={e => setNewDeviceName(e.target.value.trimStart())} maxLength={200} required />
              </fieldset>
              <fieldset>
                <legend>Type</legend>
                <input spellCheck={false} type="text" title="Type" value={newDeviceType} onChange={e => setNewDeviceType(e.target.value.trimStart())} maxLength={200} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Model</legend>
                <input spellCheck={false} type="text" title="Model" value={newDeviceModel} onChange={e => setNewDeviceModel(e.target.value.trimStart())} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend>Serial Number</legend>
                <input spellCheck={false} type="text" title="Serial Number" value={newDeviceSn} onChange={e => setNewDeviceSn(e.target.value.trimStart())} maxLength={200} />
              </fieldset>
            </div>

            {/* <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input spellCheck={false} type="text" title="Area" value={newDeviceArea} onChange={e => setNewDeviceArea(e.target.value.trimStart())} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select onChange={e => setNewDeviceLocation(e.target.value.trimStart())} title="Location" className={newDeviceLocation === "" && "empty-select"}>
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
                <textarea spellCheck={false} rows="2" title="Comment" value={newDeviceComment} onChange={e => setNewDeviceComment(e.target.value.trimStart())} maxLength={500} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button className='mainModal__send'>Send</button>
            </div>
          </form>
        </>
      }
    </>
  )
}
