import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setModal } from '../store/slices/modalSlice';
import { useAddDeviceMutation, useDeleteDeviceMutation, useEditDeviceMutation } from '../store/slices/apiSlice';

export default function DevicesDataModal() {
  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)
  const modalData = useSelector(state => state.modal.data)

  const [addDevice, resultAddDevice] = useAddDeviceMutation()
  const [deleteDevice, resultDeleteDevice] = useDeleteDeviceMutation()
  const [editDevice, resultEditDevice] = useEditDeviceMutation()


  const [newDeviceName, setNewDeviceName] = useState("")
  const [newDeviceType, setNewDeviceType] = useState("")
  const [newDeviceModel, setNewDeviceModel] = useState("")
  const [newDeviceSn, setNewDeviceSn] = useState("")
  const [newDeviceArea, setNewDeviceArea] = useState("")
  const [newDeviceLocation, setNewDeviceLocation] = useState("")
  const [newDeviceComment, setNewDeviceComment] = useState("")

  const [editMode, setEditMode] = useState(false)

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
    }
    const newRes = await addDevice(device)
    console.log(newRes)
    dispatch(setModal({ active: false, data: {} }))
  }

  const deleteDeviceFn = async (id) => {
    const delRes = await deleteDevice(id)
    console.log(delRes)
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
    setEditMode(true)
  }

  const editDeviceFn = async (e, id) => {
    e.preventDefault()
    const device = {
      name: newDeviceName.trim(),
      type: newDeviceType.trim(),
      model: newDeviceModel.trim(),
      sn: newDeviceSn.trim(),
      area: newDeviceArea.trim(),
      location: newDeviceLocation.trim(),
      comment: newDeviceComment.trim(),
      id
    }

    const editRes = await editDevice(device)
    console.log(editRes)
    dispatch(setModal({ active: false, data: {} }))
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
      setEditMode(false)
    }
  }, [modalActive])


  return (
    <>
      {modalData?.deviceData && !editMode &&
        <form className='mainModal__data__form'>
          <h2>DEVICE</h2>
          <div className="form-group">
            <fieldset>
              <legend>Name</legend>
              <input readOnly disabled spellCheck={false} type="text" title="Name" placeholder='Name' value={modalData?.name || "-"} />
            </fieldset>
            <fieldset>
              <legend>Type</legend>
              <input readOnly disabled spellCheck={false} type="text" title="Type" placeholder='Type' value={modalData?.type || "-"} />
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Model</legend>
              <input readOnly disabled spellCheck={false} type="text" title="Model" placeholder='Model' value={modalData?.model || "-"} />
            </fieldset>
            <fieldset>
              <legend>Serial Number</legend>
              <input readOnly disabled spellCheck={false} type="text" title="Serial Number" placeholder='Serial Number' value={modalData?.sn || "-"} />
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Area</legend>
              <input readOnly disabled spellCheck={false} type="text" title="Area" placeholder='Area' value={modalData?.area || "-"} />
            </fieldset>
            <fieldset>
              <legend>Location</legend>
              <select readOnly disabled title="Location" >
                <option readOnly disabled value="Location" selected={modalData?.location === ""} >-</option>
                <option readOnly disabled value="SS" selected={modalData?.location === "SS"}>SS</option>
                <option readOnly disabled value="PB" selected={modalData?.location === "PB"}>PB</option>
                <option readOnly disabled value="1P" selected={modalData?.location === "1P"}>1P</option>
                <option readOnly disabled value="4P" selected={modalData?.location === "4P"}>4P</option>
              </select>
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Comment</legend>
              <textarea readOnly disabled spellCheck={false} rows="2" title="Comment" placeholder='Comment' value={modalData?.comment || "-"} />
            </fieldset>
          </div>
          <div className='mainModal__btnContainer--edit'>
            <button type='button' className='mainModal__send' onClick={() => deleteDeviceFn(modalData?.id)}>Delete</button>
            <button type='button' className='mainModal__send' onClick={() => editModeFN()}>Edit</button>
          </div>

        </form>
      }

      {modalData?.deviceData && editMode &&
        <form className='mainModal__data__form editMode' onSubmit={(e) => editDeviceFn(e, modalData.id)}>
          <h2>EDIT DEVICE</h2>
          <div className="form-group">
            <fieldset>
              <legend>Name</legend>
              <input spellCheck={false} type="text" title="Name" placeholder='Name' value={newDeviceName} onChange={e => setNewDeviceName(e.target.value.trimStart())} maxLength={200} pattern="^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$" required />
            </fieldset>
            <fieldset>
              <legend>Type</legend>
              <input spellCheck={false} type="text" title="Type" placeholder='Type' value={newDeviceType} onChange={e => setNewDeviceType(e.target.value.trimStart())} maxLength={200} />
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Model</legend>
              <input spellCheck={false} type="text" title="Model" placeholder='Model' value={newDeviceModel} onChange={e => setNewDeviceModel(e.target.value.trimStart())} maxLength={200} />
            </fieldset>
            <fieldset>
              <legend>Serial Number</legend>
              <input spellCheck={false} type="text" title="Serial Number" placeholder='Serial Number' value={newDeviceSn} onChange={e => setNewDeviceSn(e.target.value.trimStart())} maxLength={200} />
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Area</legend>
              <input spellCheck={false} type="text" title="Area" placeholder='Area' value={newDeviceArea} onChange={e => setNewDeviceArea(e.target.value.trimStart())} maxLength={200} />
            </fieldset>
            <fieldset>
              <legend>Location</legend>
              <select onChange={e => setNewDeviceLocation(e.target.value.trimStart())} title="Location" className={newDeviceLocation === "" && "empty-select"}>
                <option value="Location" disabled selected={modalData?.location === ""} className='empty-select'>Location</option>
                <option value="">-</option>
                <option value="SS" selected={modalData?.location === "SS"}>SS</option>
                <option value="PB" selected={modalData?.location === "PB"}>PB</option>
                <option value="1P" selected={modalData?.location === "1P"}>1P</option>
                <option value="4P" selected={modalData?.location === "4P"}>4P</option>
              </select>
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Comment</legend>
              <textarea spellCheck={false} rows="2" title="Comment" placeholder='Comment' value={newDeviceComment} onChange={e => setNewDeviceComment(e.target.value.trimStart())} maxLength={500} />
            </fieldset>
          </div>
          <div className='mainModal__btnContainer--edit'>
            <button className='mainModal__send' >Send</button>
            <button type='button' className='mainModal__send' onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </form>
      }

      {modalData?.newDevice &&
        <form className='mainModal__data__form' onSubmit={(e) => addDeviceFn(e)}>
          <h2>ADD DEVICE</h2>
          <div className="form-group">
            <fieldset>
              <legend>Name</legend>
              <input spellCheck={false} type="text" title="Name" placeholder='Name' value={newDeviceName} onChange={e => setNewDeviceName(e.target.value.trimStart())} maxLength={200} pattern="^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$" required />
            </fieldset>
            <fieldset>
              <legend>Type</legend>
              <input spellCheck={false} type="text" title="Type" placeholder='Type' value={newDeviceType} onChange={e => setNewDeviceType(e.target.value.trimStart())} maxLength={200} />
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Model</legend>
              <input spellCheck={false} type="text" title="Model" placeholder='Model' value={newDeviceModel} onChange={e => setNewDeviceModel(e.target.value.trimStart())} maxLength={200} />
            </fieldset>
            <fieldset>
              <legend>Serial Number</legend>
              <input spellCheck={false} type="text" title="Serial Number" placeholder='Serial Number' value={newDeviceSn} onChange={e => setNewDeviceSn(e.target.value.trimStart())} maxLength={200} />
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Area</legend>
              <input spellCheck={false} type="text" title="Area" placeholder='Area' value={newDeviceArea} onChange={e => setNewDeviceArea(e.target.value.trimStart())} maxLength={200} />
            </fieldset>
            <fieldset>
              <legend>Location</legend>
              <select onChange={e => setNewDeviceLocation(e.target.value.trimStart())} title="Location" className={newDeviceLocation === "" && "empty-select"}>
                <option value="Location" disabled selected className='empty-select'>Location</option>
                <option value="">-</option>
                <option value="SS">SS</option>
                <option value="PB">PB</option>
                <option value="1P">1P</option>
                <option value="4P">4P</option>
              </select>
            </fieldset>
          </div>
          <div className="form-group">
            <fieldset>
              <legend>Comment</legend>
              <textarea spellCheck={false} rows="2" title="Comment" placeholder='Comment' value={newDeviceComment} onChange={e => setNewDeviceComment(e.target.value.trimStart())} maxLength={500} />
            </fieldset>
          </div>
          <div className='mainModal__btnContainer'>
            <button className='mainModal__send'>Send</button>
          </div>
        </form>
      }
    </>
  )
}
