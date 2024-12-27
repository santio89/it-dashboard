import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setModal } from '../store/slices/modalSlice';
import { useAddDeviceMutation, useDeleteDeviceMutation, useEditDeviceMutation } from '../store/slices/apiSlice';
import { objectEquality } from '../utils/objectEquality';

export default function DevicesDataModal({ modalData }) {
  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)

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

    const { deviceData, modalType, createdAt, updatedAt, ...oldDevice } = device
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
              <button tabIndex={-1} className={`listPicker disabled selected`} >{modalData?.category === "company" ? "Company" : "Personal"}</button>
            </div>
          </div>
          <form autoComplete='off' className='mainModal__data__form disabled'>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="name">Name</label></legend>
                <input id='name' placeholder='Required' readOnly disabled spellCheck={false} type="text" value={modalData?.name || "-"} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="type">Type</label></legend>
                <input id="type" readOnly disabled spellCheck={false} type="text" value={modalData?.type || "-"} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="Model">Model</label></legend>
                <input id="model" readOnly disabled spellCheck={false} type="text" value={modalData?.model || "-"} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="sn">Serial Number</label></legend>
                <input id="sn" readOnly disabled spellCheck={false} type="text" value={modalData?.sn || "-"} />
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
                <legend><label htmlFor="comment">Comment</label> </legend>
                <textarea id="comment" readOnly disabled spellCheck={false} rows="2" value={modalData?.comment || "-"} />
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
              <div className="listPickerOptions">
                <button disabled={resultEditDevice.isLoading} className={`listPicker ${newDeviceCategory === "personal" && "selected"} ${resultEditDevice.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("personal")
                  }}>
                  Personal
                </button>
                <button disabled={resultEditDevice.isLoading} className={`listPicker ${newDeviceCategory === "company" && "selected"} ${resultEditDevice.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("company")
                  }}>
                  Company
                </button>
              </div>
            </div>
          </div>
          <form autoComplete='off' className='mainModal__data__form editMode' disabled={resultEditDevice.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => editDeviceFn(e, modalData)} >
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="editName">Name</label></legend>
                <input id="editName" placeholder='Required' spellCheck={false} type="text" value={newDeviceName} onChange={e => setNewDeviceName(e.target.value)} maxLength={200} required />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="editType">Type</label></legend>
                <input id="editType" spellCheck={false} type="text" value={newDeviceType} onChange={e => setNewDeviceType(e.target.value)} maxLength={200} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="editModel">Model</label></legend>
                <input id="editModel" spellCheck={false} type="text" value={newDeviceModel} onChange={e => setNewDeviceModel(e.target.value)} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="editSn">Serial Number</label></legend>
                <input id="editSn" spellCheck={false} type="text" value={newDeviceSn} onChange={e => setNewDeviceSn(e.target.value)} maxLength={200} />
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
                <legend><label htmlFor="editComment">Comment</label></legend>
                <textarea id="editComment" spellCheck={false} rows="2" value={newDeviceComment} onChange={e => setNewDeviceComment(e.target.value)} maxLength={500} />
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
              <button tabIndex={-1} disabled={resultDeleteDevice.isLoading} className={`listPicker disabled selected`}>{modalData?.category === "personal" ? "Personal" : "Company"}</button>
            </div>
          </div>
          <form autoComplete='off' className='mainModal__data__form deleteMode disabled' disabled={resultDeleteDevice.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => deleteDeviceFn(e, modalData)}>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="deleteName">Name</label></legend>
                <input id="deleteName" placeholder='Required' readOnly disabled spellCheck={false} type="text" value={modalData?.name || "-"} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="deleteType">Type</label></legend>
                <input id="deleteType" readOnly disabled spellCheck={false} type="text" value={modalData?.type || "-"} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="deleteModel">Model</label></legend>
                <input id="deleteModel" readOnly disabled spellCheck={false} type="text" value={modalData?.model || "-"} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="deleteSn">Serial Number</label></legend>
                <input id="deleteSn" readOnly disabled spellCheck={false} type="text" value={modalData?.sn || "-"} />
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
                <legend><label htmlFor="deleteComment">Comment</label></legend>
                <textarea id="deleteComment" readOnly disabled spellCheck={false} rows="2" value={modalData?.comment || "-"} />
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
              <div className="listPickerOptions">
                <button disabled={resultAddDevice.isLoading} className={`listPicker ${newDeviceCategory === "personal" && "selected"} ${resultAddDevice.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("personal")
                  }}>
                  Personal
                </button>
                <button disabled={resultAddDevice.isLoading} className={`listPicker ${newDeviceCategory === "company" && "selected"} ${resultAddDevice.isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("company")
                  }}>
                  Company
                </button>
              </div>
            </div>
          </div>
          <form autoComplete='off' className='mainModal__data__form' disabled={resultAddDevice.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => addDeviceFn(e)}>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="addName">Name</label></legend>
                <input id="addName" placeholder='Required' spellCheck={false} type="text" value={newDeviceName} onChange={e => setNewDeviceName(e.target.value)} maxLength={200} required />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="addType">Type</label></legend>
                <input id="addType" spellCheck={false} type="text" value={newDeviceType} onChange={e => setNewDeviceType(e.target.value)} maxLength={200} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="addModel">Model</label></legend>
                <input id="addModel" spellCheck={false} type="text" value={newDeviceModel} onChange={e => setNewDeviceModel(e.target.value)} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="addSn">Serial Number</label></legend>
                <input id="addSn" spellCheck={false} type="text" value={newDeviceSn} onChange={e => setNewDeviceSn(e.target.value)} maxLength={200} />
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
                <legend><label htmlFor="addComment">Comment</label></legend>
                <textarea id="addComment" spellCheck={false} rows="2" value={newDeviceComment} onChange={e => setNewDeviceComment(e.target.value)} maxLength={500} />
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
