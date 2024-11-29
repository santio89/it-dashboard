import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setModal } from '../store/slices/modalSlice';
import { useAddContactMutation, useDeleteContactMutation, useEditContactMutation } from '../store/slices/apiSlice';
import { objectEquality } from '../utils/objectEquality';

export default function ContactsDataModal({ modalData }) {
  const dispatch = useDispatch()
  const modalActive = useSelector(state => state.modal.active)

  const [listPickerOpen, setListPickerOpen] = useState(false)

  const [addContact, resultAddContact] = useAddContactMutation()
  const [deleteContact, resultDeleteContact] = useDeleteContactMutation()
  const [editContact, resultEditContact] = useEditContactMutation()

  const [newUserName, setNewUserName] = useState("")
  const [newUserArea, setNewUserArea] = useState("")
  const [newUserLocation, setNewUserLocation] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserTel, setNewUserTel] = useState("")
  const [newUserRole, setNewUserRole] = useState("")
  const [newUserComment, setNewUserComment] = useState("")
  const [newUserCategory, setNewUserCategory] = useState("personal")

  const [editMode, setEditMode] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)

  const selectList = list => {
    setNewUserCategory(list)
    setListPickerOpen(false)
  }

  const addUserFn = async (e) => {
    e.preventDefault()

    if (resultAddContact.isLoading) {
      return
    }

    if (newUserName.trim() === "") {
      return
    }

    const user = {
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      tel: newUserTel.trim(),
      role: newUserRole.trim(),
      area: newUserArea.trim(),
      location: newUserLocation.trim(),
      comment: newUserComment.trim(),
      category: newUserCategory.trim(),
    }

    await addContact({ ...user, userId: modalData.userId })
    dispatch(setModal({ active: false, data: {} }))

    /* timeout-refetch */
    /*   setTimeout(() => {
        dispatch(setModal({ active: false, data: {} }))
      }, 400) */
  }

  const deleteUserFn = async (e, contact) => {
    e.preventDefault()

    if (resultDeleteContact.isLoading) {
      return
    }

    await deleteContact(contact)
    dispatch(setModal({ active: false, data: {} }))

    /* timeout-refetch */
    /*     setTimeout(() => {
          dispatch(setModal({ active: false, data: {} }))
        }, 400) */
  }

  const editModeFN = () => {
    setNewUserName(modalData?.name)
    setNewUserArea(modalData?.area)
    setNewUserLocation(modalData?.location)
    setNewUserEmail(modalData?.email)
    setNewUserTel(modalData?.tel)
    setNewUserRole(modalData?.role)
    setNewUserComment(modalData?.comment)
    setNewUserCategory(modalData?.category)
    setEditMode(true)
  }

  const editUserFn = async (e, contact) => {
    e.preventDefault()

    if (resultEditContact.isLoading) {
      return
    }

    if (newUserName.trim() === "") {
      return
    }

    const newUser = {
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      tel: newUserTel.trim(),
      role: newUserRole.trim(),
      area: newUserArea.trim(),
      location: newUserLocation.trim(),
      comment: newUserComment.trim(),
      category: newUserCategory.trim(),
      id: contact.id,
      userId: contact.userId
    }

    const { contactData, createdAt, updatedAt, ...oldUser } = contact
    const contactEquality = objectEquality(oldUser, newUser)

    if (contactEquality) {
      dispatch(setModal({ active: false, data: {} }))
      return
    } else {
      await editContact({ ...newUser, userId: modalData.userId })
      dispatch(setModal({ active: false, data: {} }))

      /* timeout-refetch */
      /*    setTimeout(() => {
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
      setNewUserName("")
      setNewUserArea("")
      setNewUserLocation("")
      setNewUserEmail("")
      setNewUserTel("")
      setNewUserRole("")
      setNewUserComment("")
      setNewUserCategory("personal")
      setListPickerOpen(false)
      setEditMode(false)
      setDeleteMode(false)
    }
  }, [modalActive])

  useEffect(() => {
    setListPickerOpen(false)
  }, [deleteMode, editMode])

  return (
    <>
      {modalData?.contactData && !editMode && !deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>CONTACT</h2>
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
                <legend>E-Mail</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.email || "-"} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Tel</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.tel || "-"} />
              </fieldset>
              <fieldset>
                <legend>Role</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.role || "-"} />
              </fieldset>
            </div>

            {/* <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.area || "-"} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select readOnly disabled>
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

      {modalData?.contactData && editMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>EDIT CONTACT</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer editMode">
              {
                <button disabled={resultEditContact.isLoading} className={`listPicker ${listPickerOpen && "selected"} ${resultEditContact.isLoading && "disabled"}`} onClick={() => listPickerOpen ? selectList(newUserCategory === "personal" ? "personal" : "company") : setListPickerOpen(true)}>{newUserCategory === "personal" ? "Personal" : "Company"}</button>
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
          <form className='mainModal__data__form editMode' disabled={resultEditContact.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => editUserFn(e, modalData)} >
            <div className="form-group">
              <fieldset>
                <legend>Name</legend>
                <input placeholder='Required' spellCheck={false} type="text" value={newUserName} onChange={e => setNewUserName(e.target.value.trimStart())} maxLength={200} required />
              </fieldset>
              <fieldset>
                <legend>E-Mail</legend>
                <input spellCheck={false} type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value.trimStart())} pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" maxLength={320} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Tel</legend>
                <input spellCheck={false} type="tel" value={newUserTel} onChange={e => {
                  const value = e.target.value.replace(/\D/g, '').trimStart();
                  setNewUserTel(value)
                }} maxLength={20} />
              </fieldset>
              <fieldset>
                <legend>Role</legend>
                <input spellCheck={false} type="text" value={newUserRole} onChange={e => setNewUserRole(e.target.value.trimStart())} maxLength={200} />
              </fieldset>
            </div>

            {/*     <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input spellCheck={false} type="text" value={newUserArea} onChange={e => setNewUserArea(e.target.value.trimStart())} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select onChange={e => setNewUserLocation(e.target.value.trimStart())} className={newUserLocation === "" && "empty-select"}>
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
                <textarea spellCheck={false} rows="2" value={newUserComment} onChange={e => setNewUserComment(e.target.value.trimStart())} maxLength={500} />
              </fieldset>
            </div>
            <div className='mainModal__btnContainer'>
              <button type='button' className='mainModal__send' onClick={() => setEditMode(false)}>Cancel</button>
              <button className='mainModal__send' >Confirm</button>
            </div>
          </form>
        </>
      }

      {modalData?.contactData && deleteMode &&
        <>
          <div className="mainModal__titleContainer">
            <h2>DELETE CONTACT</h2>
            <div>ID: <span>{modalData?.id}</span></div>
            <div className="listPickerWrapper__btnContainer deleteMode">
              {
                <button tabIndex={-1} disabled={resultDeleteContact.isLoading} className={`listPicker disabled`}>{modalData?.category === "personal" ? "Personal" : "Company"}</button>
              }
            </div>
          </div>
          <form className='mainModal__data__form deleteMode disabled' disabled={resultDeleteContact.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => deleteUserFn(e, modalData)} >
            <div className="form-group">
              <fieldset>
                <legend>Name</legend>
                <input placeholder='Required' readOnly disabled spellCheck={false} type="text" value={modalData?.name || "-"} />
              </fieldset>
              <fieldset>
                <legend>E-Mail</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.email || "-"} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Tel</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.tel || "-"} />
              </fieldset>
              <fieldset>
                <legend>Role</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.role || "-"} />
              </fieldset>
            </div>

            {/*  <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input readOnly disabled spellCheck={false} type="text" value={modalData?.area || "-"} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select readOnly disabled>
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
              <button className='mainModal__send' >Confirm</button>
            </div>
          </form>
        </>
      }

      {modalData?.newUser &&
        <>
          <div className="mainModal__titleContainer">
            <h2>ADD CONTACT</h2>
            <div className="listPickerWrapper__btnContainer">
              {
                <button disabled={resultAddContact.isLoading} className={`listPicker ${listPickerOpen && "selected"} ${resultAddContact.isLoading && "disabled"}`} onClick={() => listPickerOpen ? selectList(newUserCategory === "personal" ? "personal" : "company") : setListPickerOpen(true)}>{newUserCategory === "personal" ? "Personal" : "Company"}</button>
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
          <form className='mainModal__data__form' disabled={resultAddContact.isLoading} onKeyDown={(e) => { preventEnterSubmit(e) }} onSubmit={(e) => addUserFn(e)}  >
            <div className="form-group">
              <fieldset>
                <legend>Name</legend>
                <input placeholder='Required' spellCheck={false} type="text" value={newUserName} onChange={e => setNewUserName(e.target.value.trimStart())} maxLength={200} required />
              </fieldset>
              <fieldset>
                <legend>E-Mail</legend>
                <input spellCheck={false} type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value.trimStart())} pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" maxLength={320} />
              </fieldset>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Tel</legend>
                <input spellCheck={false} type="tel" value={newUserTel} onChange={e => {
                  const value = e.target.value.replace(/\D/g, '').trimStart();
                  setNewUserTel(value)
                }} maxLength={20} />
              </fieldset>
              <fieldset>
                <legend>Role</legend>
                <input spellCheck={false} type="text" value={newUserRole} onChange={e => setNewUserRole(e.target.value.trimStart())} maxLength={200} />
              </fieldset>
            </div>

            {/* <div className="form-group">
              <fieldset>
                <legend>Area</legend>
                <input spellCheck={false} type="text" value={newUserArea} onChange={e => setNewUserArea(e.target.value.trimStart())} maxLength={200} />
              </fieldset>
              <fieldset>
                <legend>Location</legend>
                <select onChange={e => setNewUserLocation(e.target.value.trimStart())} className={newUserLocation === "" && "empty-select"}>
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
                <textarea spellCheck={false} rows="2" value={newUserComment} onChange={e => setNewUserComment(e.target.value.trimStart())} maxLength={500} />
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
