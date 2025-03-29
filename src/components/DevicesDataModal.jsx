import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setModal } from '../store/slices/modalSlice';
import { useAddDeviceMutation, useDeleteDeviceMutation, useEditDeviceMutation } from '../store/slices/apiSlice';
import { objectEquality } from '../utils/objectEquality';
import { useTranslation } from '../hooks/useTranslation'
import { toast } from 'sonner';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firebaseDb as db } from '../config/firebase';

export default function DevicesDataModal({ modalData }) {
  const lang = useTranslation()

  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)

  const [addDevice, resultAddDevice] = useAddDeviceMutation()
  const [deleteDevice, resultDeleteDevice] = useDeleteDeviceMutation()
  const [editDevice, resultEditDevice] = useEditDeviceMutation()

  const [errorMsg, setErrorMsg] = useState(null)

  const [newDeviceName, setNewDeviceName] = useState("")
  const [newDeviceType, setNewDeviceType] = useState("")
  const [newDeviceModel, setNewDeviceModel] = useState("")
  const [newDeviceSn, setNewDeviceSn] = useState("")
  const [newDeviceComments, setNewDeviceComments] = useState("")
  const [newDeviceCategory, setNewDeviceCategory] = useState("personal")

  const [editMode, setEditMode] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const selectList = list => {
    setNewDeviceCategory(list)
  }

  const trimInputs = () => {
    setNewDeviceName(newDeviceName => newDeviceName.trim())
    setNewDeviceType(newDeviceType => newDeviceType.trim())
    setNewDeviceModel(newDeviceModel => newDeviceModel.trim())
    setNewDeviceSn(newDeviceSn => newDeviceSn.trim())
    setNewDeviceComments(newDeviceComments => newDeviceComments.trim())
    setNewDeviceCategory(newDeviceCategory => newDeviceCategory.trim())
  }

  const checkDuplicates = async (device) => {
    const colRef = collection(db, "authUsersData", device.userId, "devices");
    const q = query(colRef, where("name", "==", device.name));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty
  }

  const addDeviceFn = async (e) => {
    e.preventDefault()

    if (resultAddDevice.isLoading) {
      return
    }

    if (newDeviceName === "") {
      return
    }

    /* if (modalData?.dataList?.find(contact => contact.name.toLowerCase() === newDeviceName.toLowerCase())) {
      setErrorMsg(lang.deviceExists)
      return
    } */

    const newDevice = {
      name: newDeviceName,
      type: newDeviceType,
      model: newDeviceModel,
      sn: newDeviceSn,
      comments: newDeviceComments,
      category: newDeviceCategory,
      localId: crypto.randomUUID().replace(/-/g, ''),
      localTime: Date.now(),
      userId: modalData.userId
    }


    try {
      setIsLoading(true)
      /* check for duplicates first */
      setErrorMsg(`${lang.checkingDuplicates}...`)
      const dups = await checkDuplicates(newDevice)
      if (dups) {
        setErrorMsg(lang.contactExists)
        return
      }


      dispatch(setModal({ active: false, data: {} }))
      toast(`${lang.addingDevice}...`)

      const res = await addDevice({ ...newDevice, userId: modalData.userId })

      toast.message(lang.deviceAdded, {
        description: `ID: ${res.data.id}`,
      });
    } catch {
      toast(lang.errorPerformingRequest)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteDeviceFn = async (e, device) => {
    e.preventDefault()

    if (resultDeleteDevice.isLoading) {
      return
    }

    dispatch(setModal({ active: false, data: {} }))

    try {
      setIsLoading(true)
      toast(`${lang.deletingDevice}...`)
      const res = await deleteDevice(device)
      toast.message(lang.deviceDeleted, {
        description: `ID: ${res.data.id}`,
      });
    } catch {
      toast(lang.errorPerformingRequest)
    } finally {
      setIsLoading(false)
    }
  }

  const editModeFN = () => {
    setNewDeviceName(modalData?.name)
    setNewDeviceType(modalData?.type)
    setNewDeviceModel(modalData?.model)
    setNewDeviceSn(modalData?.sn)
    setNewDeviceComments(modalData?.comments)
    setNewDeviceCategory(modalData?.category)
    setEditMode(true)
  }

  const editDeviceFn = async (e, device) => {
    e.preventDefault()

    if (resultEditDevice.isLoading) {
      return
    }

    if (newDeviceName === "") {
      return
    }

    if (device.name !== newDeviceName && modalData?.dataList?.find(contact => contact.name.toLowerCase() === newDeviceName.toLowerCase())) {
      setErrorMsg(lang.deviceExists)
      return
    }

    const newDevice = {
      name: newDeviceName,
      type: newDeviceType,
      model: newDeviceModel,
      sn: newDeviceSn,
      comments: newDeviceComments,
      category: newDeviceCategory,
      id: device.id,
      userId: device.userId,
      localId: device.localId,
      localTime: device.localTime
    }

    const { deviceData, modalType, createdAt, updatedAt, dataList, ...oldDevice } = device
    const deviceEquality = objectEquality(oldDevice, newDevice)

    if (deviceEquality) {
      /* return if equal */
      dispatch(setModal({ active: false, data: {} }))
      return
    } else {
      try {
        setIsLoading(true)
        if (newDevice.name !== oldDevice.name) {
          /* check for duplicates */
          setErrorMsg(`${lang.checkingDuplicates}...`)
          const dups = await checkDuplicates(newDevice)
          if (dups) {
            setErrorMsg(lang.contactExists)
            return
          }
        }

        dispatch(setModal({ active: false, data: {} }))
        toast(`${lang.editingDevice}...`)

        const res = await editDevice({ ...newDevice, userId: modalData.userId })

        toast.message(lang.deviceEdited, {
          description: `ID: ${res.data.id}`,
        });
      } catch {
        toast(lang.errorPerformingRequest)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const preventEnterSubmit = (e) => {
    if (e.key === "Enter" && e.target.className !== "mainModal__send" && e.target.tagName !== "TEXTAREA" && e.target.ariaLabel !== "textarea") {
      e.preventDefault()
    }
  }

  useEffect(() => {
    let timeout;

    if (errorMsg) {
      timeout = setTimeout(() => {
        setErrorMsg(null)
      }, 4000)
    }

    return () => {
      clearTimeout(timeout)
    }

  }, [errorMsg])

  useEffect(() => {
    if (!modalActive) {
      setNewDeviceName("")
      setNewDeviceType("")
      setNewDeviceModel("")
      setNewDeviceSn("")
      setNewDeviceComments("")
      setNewDeviceCategory("personal")
      setEditMode(false)
      setDeleteMode(false)
      setErrorMsg(null)
    }
  }, [modalActive])


  return (
    <>
      {modalData?.deviceData && !editMode && !deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.device}</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer">
              <button title={`${lang.category}: ${lang[modalData?.category]}`} tabIndex={-1} className={`listPicker disabled selected`} >{lang[modalData?.category]}</button>
            </div>
          </div>
          <form autoComplete='off' className='mainModal__data__form disabled'>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="name">{lang.name}</label></legend>
                <input id='name' placeholder={lang.required} readOnly disabled spellCheck={false} type="text" value={modalData?.name || "-"} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="type">{lang.type}</label></legend>
                <input id="type" readOnly disabled spellCheck={false} type="text" value={modalData?.type || "-"} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="Model">{lang.model}</label></legend>
                <input id="model" readOnly disabled spellCheck={false} type="text" value={modalData?.model || "-"} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="sn">{lang.serialNumber}</label></legend>
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
                <legend><label htmlFor="comment">{lang.comments}</label> </legend>
                <textarea id="comment" readOnly disabled spellCheck={false} rows="2" value={modalData?.comments || "-"} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => editModeFN()}>{lang.edit}</button>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(true)}>{lang.delete}</button>
            </div>
          </form>
        </>
      }

      {modalData?.deviceData && editMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.editDevice}</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer editMode">
              <div className="listPickerOptions">
                <button title={`${lang.category}: ${lang.personal}`} disabled={isLoading} className={`listPicker ${newDeviceCategory === "personal" && "selected"} ${isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("personal")
                  }}>
                  {lang.personal}
                </button>
                <button title={`${lang.category}: ${lang.company}`} disabled={isLoading} className={`listPicker ${newDeviceCategory === "company" && "selected"} ${isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("company")
                  }}>
                  {lang.company}
                </button>
              </div>
            </div>
          </div>
          <form autoComplete='off' className='mainModal__data__form editMode' disabled={isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => editDeviceFn(e, modalData)} >
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="editName">{lang.name}</label></legend>
                <input id="editName" placeholder={lang.required} spellCheck={false} type="text" value={newDeviceName} onChange={e => setNewDeviceName(e.target.value)} maxLength={200} required />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="editType">{lang.type}</label></legend>
                <input id="editType" spellCheck={false} type="text" value={newDeviceType} onChange={e => setNewDeviceType(e.target.value)} maxLength={200} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="editModel">{lang.model}</label></legend>
                <input id="editModel" spellCheck={false} type="text" value={newDeviceModel} onChange={e => setNewDeviceModel(e.target.value)} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="editSn">{lang.serialNumber}</label></legend>
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
                <legend><label htmlFor="editComment">{lang.comments}</label></legend>
                <textarea id="editComment" spellCheck={false} rows="2" value={newDeviceComments} onChange={e => setNewDeviceComments(e.target.value)} maxLength={500} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setEditMode(false)}>{lang.cancel}</button>
              <button className='mainModal__send' onClick={trimInputs}>{lang.confirm}</button>
            </div>
            {
              errorMsg &&
              <div className="mainModal__error">{errorMsg}</div>
            }
          </form>
        </>
      }

      {modalData?.deviceData && deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.deleteDevice}</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer deleteMode">
              <button title={`${lang.category}: ${lang[modalData?.category]}`} tabIndex={-1} className={`listPicker disabled selected`} disabled={isLoading}>{lang[modalData?.category]}</button>
            </div>
          </div>
          <form autoComplete='off' className='mainModal__data__form deleteMode disabled' disabled={isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => deleteDeviceFn(e, modalData)}>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="deleteName">{lang.name}</label></legend>
                <input id="deleteName" placeholder={lang.required} readOnly disabled spellCheck={false} type="text" value={modalData?.name || "-"} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="deleteType">{lang.type}</label></legend>
                <input id="deleteType" readOnly disabled spellCheck={false} type="text" value={modalData?.type || "-"} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="deleteModel">{lang.model}</label></legend>
                <input id="deleteModel" readOnly disabled spellCheck={false} type="text" value={modalData?.model || "-"} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="deleteSn">{lang.serialNumber}</label></legend>
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
                <legend><label htmlFor="deleteComment">{lang.comments}</label></legend>
                <textarea id="deleteComment" readOnly disabled spellCheck={false} rows="2" value={modalData?.comments || "-"} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setDeleteMode(false)}>{lang.cancel}</button>
              <button className='mainModal__send' onClick={trimInputs}>{lang.confirm}</button>
            </div>
          </form>
        </>
      }

      {modalData?.newDevice &&
        <>
          <div className="mainModal__titleContainer">
            <h2>{lang.addDevice}</h2>
            <div className="listPickerWrapper__btnContainer">
              <div className="listPickerOptions">
                <button title={`${lang.category}: ${lang.personal}`} disabled={isLoading} className={`listPicker ${newDeviceCategory === "personal" && "selected"} ${isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("personal")
                  }}>
                  {lang.personal}
                </button>
                <button title={`${lang.category}: ${lang.company}`} disabled={isLoading} className={`listPicker ${newDeviceCategory === "company" && "selected"} ${isLoading && "disabled"}`}
                  onClick={() => {
                    selectList("company")
                  }}>
                  {lang.company}
                </button>
              </div>
            </div>
          </div>
          <form autoComplete='off' className='mainModal__data__form' disabled={isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => addDeviceFn(e)}>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="addName">{lang.name}</label></legend>
                <input id="addName" placeholder={lang.required} spellCheck={false} type="text" value={newDeviceName} onChange={e => setNewDeviceName(e.target.value)} maxLength={200} required />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="addType">{lang.type}</label></legend>
                <input id="addType" spellCheck={false} type="text" value={newDeviceType} onChange={e => setNewDeviceType(e.target.value)} maxLength={200} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend><label htmlFor="addModel">{lang.model}</label></legend>
                <input id="addModel" spellCheck={false} type="text" value={newDeviceModel} onChange={e => setNewDeviceModel(e.target.value)} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend><label htmlFor="addSn">{lang.serialNumber}</label></legend>
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
                <legend><label htmlFor="addComment">{lang.comments}</label></legend>
                <textarea id="addComment" spellCheck={false} rows="2" value={newDeviceComments} onChange={e => setNewDeviceComments(e.target.value)} maxLength={500} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button className='mainModal__send' onClick={trimInputs}>{lang.send}</button>
            </div>
            {
              errorMsg &&
              <div className="mainModal__error">{errorMsg}</div>
            }
          </form>
        </>
      }
    </>
  )
}
